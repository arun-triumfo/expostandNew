<?php

namespace App\Services\Home;

use App\Models\CityTable;
use App\Models\CountryTable;

class HomePageService
{
    /**
     * Same query intent as legacy PageController@viewpages for the homepage.
     *
     * @return array{countries: \Illuminate\Support\Collection, cities: \Illuminate\Support\Collection}
     */
    public function getHomePageData(): array
    {
        $countrydata = CountryTable::query()
            ->select(['name', 'value'])
            ->where('disply_home', '1')
            ->where('status', '1')
            ->orderBy('priority', 'ASC')
            ->get();

        // Legacy-safe fallback: if disply_home flags are not maintained, still show active countries.
        if ($countrydata->isEmpty()) {
            $countrydata = CountryTable::query()
                ->select(['name', 'value'])
                ->where('status', '1')
                ->orderBy('priority', 'ASC')
                ->orderBy('name')
                ->get();
        }

        $citydata = CityTable::query()
            ->select(['id', 'countryid', 'name', 'value'])
            ->where('status', '1')
            ->get();

        return [
            'countries' => $countrydata,
            'cities' => $citydata,
        ];
    }
}
