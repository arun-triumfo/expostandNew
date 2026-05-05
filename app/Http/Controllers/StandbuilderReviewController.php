<?php

namespace App\Http\Controllers;

use App\Models\StandbuilderMaster;
use App\Models\StandbuilderReview;
use App\Models\StandbuilderReviewVerification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class StandbuilderReviewController extends Controller
{
    /**
     * @return array<int, int>
     */
    private function standbuilderIdScope(?StandbuilderMaster $master, int $fallbackId): array
    {
        if (! $master) {
            return [$fallbackId];
        }

        return array_values(array_unique(array_filter([
            (int) $master->id,
            (int) ($master->userid ?? 0),
        ])));
    }

    public function checkReview(int $standbuilderId, string $reviewerEmail)
    {
        try {
            $master = StandbuilderMaster::query()->find($standbuilderId);
            $scope = $this->standbuilderIdScope($master, $standbuilderId);
            $email = rawurldecode($reviewerEmail);

            $review = StandbuilderReview::query()
                ->whereIn('standbuilder_id', $scope)
                ->where('reviewer_email', $email)
                ->first();

            return response()->json([
                'exists' => $review !== null,
                'review' => $review,
            ]);
        } catch (\Throwable $e) {
            Log::error('checkReview failed', ['error' => $e->getMessage()]);

            return response()->json([
                'exists' => false,
                'error' => 'An error occurred while checking the review.',
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'standbuilder_id' => 'required|integer|exists:standbuildermasters,id',
            'reviewer_name' => 'required|string|max:255',
            'reviewer_email' => 'required|email|max:255',
            'review_text' => 'required|string|max:20000',
            'review_title' => 'required|string|max:255',
            'design_rating' => 'required|integer|min:1|max:5',
            'quality_rating' => 'required|integer|min:1|max:5',
            'project_rating' => 'required|integer|min:1|max:5',
            'cost_rating' => 'required|integer|min:1|max:5',
        ]);

        $emailLower = strtolower($validated['reviewer_email']);
        if (preg_match('/@(gmail|googlemail|yahoo|ymail|rocketmail|hotmail|live|msn|outlook|icloud|me|mac|rediffmail)\./i', $emailLower)) {
            return response()->json([
                'success' => false,
                'message' => 'Please use a business email address. Free email providers are not accepted for reviews.',
            ], 422);
        }

        $master = StandbuilderMaster::query()->findOrFail($validated['standbuilder_id']);
        $scope = $this->standbuilderIdScope($master, (int) $master->id);

        $existingReview = StandbuilderReview::query()
            ->whereIn('standbuilder_id', $scope)
            ->where('reviewer_email', $validated['reviewer_email'])
            ->first();

        if ($existingReview) {
            return response()->json([
                'success' => false,
                'message' => 'You have already submitted a review for this standbuilder.',
            ], 422);
        }

        $review = StandbuilderReview::query()->create([
            'standbuilder_id' => (int) $master->id,
            'reviewer_name' => $validated['reviewer_name'],
            'reviewer_email' => $validated['reviewer_email'],
            'review_text' => $validated['review_text'],
            'review_title' => $validated['review_title'],
            'design_rating' => $validated['design_rating'],
            'quality_rating' => $validated['quality_rating'],
            'project_rating' => $validated['project_rating'],
            'cost_rating' => $validated['cost_rating'],
            'is_verified' => false,
            'is_approved' => false,
        ]);

        $verification = StandbuilderReviewVerification::query()->create([
            'review_id' => $review->id,
            'token' => Str::random(64),
            'expires_at' => Carbon::now()->addDays(7),
        ]);

        try {
            Mail::send('emails.review-verification', [
                'review' => $review,
                'verification' => $verification,
                'standbuilder' => $master,
            ], function ($message) use ($review) {
                $message->to($review->reviewer_email)
                    ->subject('Verify Your Review - Expostandzone');
            });
        } catch (\Throwable $e) {
            Log::error('Review verification email failed', [
                'review_id' => $review->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'We could not send the verification email. Please try again later or contact support.',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Review submitted successfully. Please check your email to verify your review.',
        ]);
    }

    public function verify(string $token)
    {
        try {
            $verification = StandbuilderReviewVerification::query()
                ->where('token', $token)
                ->where('expires_at', '>', Carbon::now())
                ->first();

            if (! $verification) {
                return redirect()->route('review.verification.failed');
            }

            $review = StandbuilderReview::query()->findOrFail($verification->review_id);
            $standbuilder = StandbuilderMaster::query()->findOrFail($review->standbuilder_id);

            $standbuilderEmail = DB::table('usermasters')
                ->where('id', $standbuilder->userid)
                ->value('email');

            $adminEmail = (string) config('mail.admin_email', 'enquiry@expostandzone.com');

            $review->is_verified = true;
            $review->is_approved = true;
            $review->save();
            $verification->delete();

            if ($standbuilderEmail) {
                try {
                    Mail::send('emails.review-notification-standbuilder', [
                        'review' => $review,
                        'standbuilder' => $standbuilder,
                    ], function ($message) use ($standbuilderEmail) {
                        $message->to($standbuilderEmail)
                            ->subject('New Review Received - Expostandzone');
                    });
                } catch (\Throwable $e) {
                    Log::warning('Standbuilder review notification email failed', ['error' => $e->getMessage()]);
                }
            }

            if ($adminEmail !== '') {
                try {
                    Mail::send('emails.review-notification-admin', [
                        'review' => $review,
                        'standbuilder' => $standbuilder,
                    ], function ($message) use ($adminEmail) {
                        $message->to($adminEmail)
                            ->subject('New Review Pending Approval - Expostandzone');
                    });
                } catch (\Throwable $e) {
                    Log::warning('Admin review notification email failed', ['error' => $e->getMessage()]);
                }
            }

            try {
                Mail::send('emails.review-published', [
                    'reviewerName' => $review->reviewer_name,
                    'standbuilderName' => $standbuilder->companyname,
                    'standbuilder' => $standbuilder,
                ], function ($message) use ($review) {
                    $message->to($review->reviewer_email)
                        ->subject('Your Review is Live on Expostandzone!');
                });
            } catch (\Throwable $e) {
                Log::warning('Review published email failed', ['error' => $e->getMessage()]);
            }

            return redirect()->route('review.verification.success');
        } catch (\Throwable $e) {
            Log::error('review verify failed', ['token' => $token, 'error' => $e->getMessage()]);

            return redirect()->route('review.verification.failed');
        }
    }

    public function verificationSuccess()
    {
        return view('review-verification-success');
    }

    public function verificationFailed()
    {
        return view('review-verification-failed');
    }
}
