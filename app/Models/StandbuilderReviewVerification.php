<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StandbuilderReviewVerification extends Model
{
    protected $table = 'standbuilder_review_verifications';

    protected $fillable = [
        'review_id',
        'token',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public function review(): BelongsTo
    {
        return $this->belongsTo(StandbuilderReview::class, 'review_id');
    }
}
