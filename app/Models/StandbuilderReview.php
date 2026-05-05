<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class StandbuilderReview extends Model
{
    use SoftDeletes;

    protected $table = 'standbuilder_reviews';

    protected $fillable = [
        'standbuilder_id',
        'reviewer_name',
        'reviewer_email',
        'review_title',
        'review_text',
        'design_rating',
        'quality_rating',
        'project_rating',
        'cost_rating',
        'is_verified',
        'is_approved',
        'is_read',
        'is_reported',
        'report_reason',
        'standbuilder_reply',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'is_approved' => 'boolean',
        'is_read' => 'boolean',
        'is_reported' => 'boolean',
    ];

    public function standbuildermaster(): BelongsTo
    {
        return $this->belongsTo(StandbuilderMaster::class, 'standbuilder_id', 'id');
    }

    public function verification()
    {
        return $this->hasOne(StandbuilderReviewVerification::class, 'review_id');
    }
}
