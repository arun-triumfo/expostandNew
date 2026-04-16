<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CountryTable extends Model
{
    protected $table = 'countrytables';

    protected $guarded = [];

    public function cities()
    {
        return $this->hasMany(CityTable::class, 'countryid');
    }

    public function scopeActive($query)
    {
        return $query->where('status', '1');
    }

    public function scopeDisplayedOnHome($query)
    {
        return $query->where('disply_home', '1');
    }
}
