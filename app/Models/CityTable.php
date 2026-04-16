<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CityTable extends Model
{
    protected $table = 'citytables';

    protected $guarded = [];

    public function country()
    {
        return $this->belongsTo(CountryTable::class, 'countryid');
    }

    public function scopeActive($query)
    {
        return $query->where('status', '1');
    }
}
