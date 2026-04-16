<?php

namespace App\Http\Controllers;

use App\Models\CityTable;
use App\Models\CountryTable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class CitySearchController extends Controller
{
    /**
     * Mirrors legacy StandbuilderData@filtercity (searchcity route).
     */
    public function __invoke(Request $request): RedirectResponse
    {
        try {
            $raw = $request->input('cityvalue');
            if (! $raw) {
                return redirect()->to('/getquote');
            }

            // Legacy options used "id|countryid"; DB may coerce id match — normalize to numeric city id.
            $cityId = is_string($raw) && str_contains($raw, '|')
                ? (int) explode('|', $raw, 2)[0]
                : (int) $raw;

            if ($cityId < 1) {
                return redirect()->to('/getquote');
            }

            $cityQueryKey = "city_query_{$cityId}";
            $querycity = Cache::remember($cityQueryKey, 1800, function () use ($cityId) {
                return CityTable::query()
                    ->select(['id', 'countryid', 'name', 'value'])
                    ->where('id', $cityId)
                    ->get();
            });

            $rescity = $querycity->toArray();
            $slug = '';

            if (! empty($rescity) && isset($rescity[0]['value'])) {
                $slug .= $rescity[0]['value'];
            } else {
                return redirect()->to('/getquote');
            }

            if (count($rescity) > 0 && $slug && isset($rescity[0]['countryid'])) {
                $basecountry = $rescity[0]['countryid'];

                $countryQueryKey = "country_query_{$basecountry}";
                $querycountry = Cache::remember($countryQueryKey, 1800, function () use ($basecountry) {
                    return CountryTable::query()
                        ->select(['name', 'value'])
                        ->where('id', $basecountry)
                        ->get();
                });

                $rescountry = $querycountry->toArray();

                if (! empty($rescountry) && isset($rescountry[0]['value'])) {
                    $countryvalue = $rescountry[0]['value'];

                    return redirect()->to("/{$countryvalue}/{$slug}");
                }

                return redirect()->to('/getquote');
            }

            return redirect()->to('/getquote');
        } catch (\Throwable $e) {
            Log::error('Error in city search: '.$e->getMessage());

            return redirect()->to('/getquote');
        }
    }
}
