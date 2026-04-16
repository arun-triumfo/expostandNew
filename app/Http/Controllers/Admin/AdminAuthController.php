<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminLoginRequest;
use App\Models\InhouseUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AdminAuthController extends Controller
{
    /**
     * @return Response|RedirectResponse
     */
    public function create()
    {
        if (Auth::guard('admin')->check()) {
            return redirect()->route('admin.dashboard');
        }

        return Inertia::render('Admin/Auth/Login', [
            'status' => session('status'),
        ]);
    }

    public function store(AdminLoginRequest $request): RedirectResponse
    {
        $email = Str::lower(trim($request->validated('email')));
        $plain = $request->validated('password');
        // Preserve # and other characters; only trim wrapping whitespace
        $plain = preg_replace('/^\s+|\s+$/u', '', $plain) ?? $plain;

        /** @var InhouseUser|null $user */
        $user = InhouseUser::query()
            ->whereRaw('LOWER(TRIM(email)) = ?', [$email])
            ->first();

        if (! $user || ! $user->isActive()) {
            throw ValidationException::withMessages([
                'email' => __('These credentials do not match our records.'),
            ]);
        }

        $stored = (string) $user->password;

        $ok = false;
        if ($this->looksLikeBcryptHash($stored)) {
            $ok = Hash::check($plain, $stored);
        } else {
            $ok = hash_equals($stored, $plain);
        }

        if (! $ok) {
            throw ValidationException::withMessages([
                'email' => __('These credentials do not match our records.'),
            ]);
        }

        if (! $this->looksLikeBcryptHash($stored)) {
            $user->forceFill(['password' => Hash::make($plain)])->save();
        }

        Auth::guard('admin')->login($user, false);
        $request->session()->regenerate();

        return redirect()->intended(route('admin.dashboard'));
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('admin')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }

    private function looksLikeBcryptHash(string $value): bool
    {
        return str_starts_with($value, '$2y$')
            || str_starts_with($value, '$2a$')
            || str_starts_with($value, '$2b$');
    }
}
