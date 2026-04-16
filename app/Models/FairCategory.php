<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FairCategory extends Model
{
    protected $table = 'fair_category';

    protected $guarded = [];

    public function scopeActive($query)
    {
        return $query->where(function ($q) {
            $q->where('status', 'active')->orWhere('status', '1');
        });
    }
}
