<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\AuthorizesAdminDeletes;
use App\Http\Controllers\Controller;
use App\Models\CityTable;
use App\Models\CountryTable;
use App\Models\FairCategory;
use App\Models\TradeshowData;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TradeShowController extends Controller
{
    use AuthorizesAdminDeletes;

    private const CONTINENTS = ['Africa', 'Asia', 'Australia', 'Europe', 'South America', 'North America'];

    public function index(Request $request): Response
    {
        $today = date('Y-m-d');

        $tradeshows = TradeshowData::query()
            ->leftJoin('countrytables', 'tradeshow_data.fair_country', '=', 'countrytables.id')
            ->leftJoin('citytables', 'tradeshow_data.fair_city', '=', 'citytables.id')
            ->select([
                'tradeshow_data.id',
                'tradeshow_data.fair_name',
                'tradeshow_data.fair_start_date',
                'tradeshow_data.fair_end_date',
                'tradeshow_data.status as tradeshowstatus',
                'citytables.name as cityname',
                'countrytables.name as countryname',
            ])
            ->orderByDesc('tradeshow_data.id')
            ->paginate(15)
            ->withQueryString()
            ->through(function ($row) use ($today) {
                $fairStatus = 'Upcoming';
                if ($row->fair_start_date && $row->fair_start_date < $today) {
                    $fairStatus = 'Expired';
                } elseif (
                    $row->fair_start_date
                    && $row->fair_end_date
                    && $row->fair_start_date <= $today
                    && $row->fair_end_date >= $today
                ) {
                    $fairStatus = 'Live';
                }

                return [
                    'id' => $row->id,
                    'fair_name' => $row->fair_name,
                    'fair_start_date' => $row->fair_start_date,
                    'fair_end_date' => $row->fair_end_date,
                    'countryname' => $row->countryname,
                    'cityname' => $row->cityname,
                    'tradeshowstatus' => $row->tradeshowstatus,
                    'fair_status_label' => $fairStatus,
                ];
            });

        return Inertia::render('Admin/TradeShows/Index', [
            'tradeshows' => $tradeshows,
        ]);
    }

    public function citiesByCountry(Request $request): JsonResponse
    {
        $countryId = $request->query('country_id');
        if ($countryId === null || $countryId === '') {
            return response()->json([]);
        }

        $cities = CityTable::query()
            ->where('countryid', $countryId)
            ->where('status', '1')
            ->orderBy('name')
            ->get(['id', 'name']);

        return response()->json($cities);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/TradeShows/Create', [
            'categories' => $this->categoriesPayload(),
            'countries' => $this->countriesPayload(),
            'cities' => [],
            'continents' => self::CONTINENTS,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatedTradeshow($request, null);
        $admin = Auth::guard('admin')->user();

        $mainimg = '';
        if ($request->hasFile('uploadfile')) {
            $mainimg = time().'.'.$request->file('uploadfile')->getClientOriginalExtension();
            $request->file('uploadfile')->move(public_path('uploads/tradeshow'), $mainimg);
        }

        $catarr = ! empty($validated['faircat']) ? implode(',', $validated['faircat']) : '';

        TradeshowData::query()->create([
            'category_id' => $catarr,
            'fair_logo' => $mainimg,
            'logo_alt' => $validated['alttag'] ?? '',
            'fair_name' => $validated['fairname'],
            'fair_start_date' => $validated['startdate'],
            'fair_end_date' => $validated['enddate'],
            'continent' => $validated['continent'],
            'fair_country' => $validated['countryname'],
            'fair_city' => $validated['cityname'],
            'fair_details' => $validated['fairdesc'] ?? '',
            'fair_website' => $validated['fairwebsite'] ?? '',
            'contact_email' => $validated['contactemail'] ?? '',
            'slug' => $this->legacySlug($validated['slug']),
            'meta_title' => $validated['metatitle'] ?? '',
            'meta_desc' => $validated['metadesc'] ?? '',
            'status' => 'active',
            'created_by' => $admin?->name ?? '',
            'updated_by' => '',
        ]);

        return redirect()->route('admin.tradeshows.index');
    }

    public function edit(TradeshowData $tradeshow): Response
    {
        $faircat = [];
        if (! empty($tradeshow->category_id)) {
            $faircat = array_filter(array_map('trim', explode(',', (string) $tradeshow->category_id)));
        }

        $cities = CityTable::query()
            ->where('countryid', $tradeshow->fair_country)
            ->where('status', '1')
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Admin/TradeShows/Edit', [
            'tradeshow' => [
                'id' => $tradeshow->id,
                'fairname' => $tradeshow->fair_name,
                'slug' => $tradeshow->slug,
                'faircat' => $faircat,
                'alttag' => $tradeshow->logo_alt ?? '',
                'continent' => $tradeshow->continent ?? '',
                'startdate' => $tradeshow->fair_start_date ? substr((string) $tradeshow->fair_start_date, 0, 10) : '',
                'enddate' => $tradeshow->fair_end_date ? substr((string) $tradeshow->fair_end_date, 0, 10) : '',
                'countryname' => (string) $tradeshow->fair_country,
                'cityname' => (string) $tradeshow->fair_city,
                'fairwebsite' => $tradeshow->fair_website ?? '',
                'contactemail' => $tradeshow->contact_email ?? '',
                'fairdesc' => $tradeshow->fair_details ?? '',
                'metatitle' => $tradeshow->meta_title ?? '',
                'metadesc' => $tradeshow->meta_desc ?? '',
                'fair_logo' => $tradeshow->fair_logo ?? '',
            ],
            'categories' => $this->categoriesPayload(),
            'countries' => $this->countriesPayload(),
            'cities' => $cities->map(fn ($c) => ['id' => $c->id, 'name' => $c->name])->values()->all(),
            'continents' => self::CONTINENTS,
        ]);
    }

    public function update(Request $request, TradeshowData $tradeshow): RedirectResponse
    {
        $validated = $this->validatedTradeshow($request, $tradeshow);
        $admin = Auth::guard('admin')->user();

        if ($request->hasFile('uploadfile')) {
            $mainimg = time().'.'.$request->file('uploadfile')->getClientOriginalExtension();
            $request->file('uploadfile')->move(public_path('uploads/tradeshow'), $mainimg);
            if (! empty($tradeshow->fair_logo) && $tradeshow->fair_logo !== $mainimg) {
                @unlink(public_path('uploads/tradeshow/'.$tradeshow->fair_logo));
            }
        } elseif ($request->boolean('clear_existing_logo')) {
            if (! empty($tradeshow->fair_logo)) {
                @unlink(public_path('uploads/tradeshow/'.$tradeshow->fair_logo));
            }
            $mainimg = '';
        } else {
            $mainimg = $validated['oldcomplogo'] ?? $tradeshow->fair_logo ?? '';
        }

        $catarr = ! empty($validated['faircat']) ? implode(',', $validated['faircat']) : '';

        $tradeshow->update([
            'category_id' => $catarr,
            'fair_logo' => $mainimg,
            'logo_alt' => $validated['alttag'] ?? '',
            'fair_name' => $validated['fairname'],
            'fair_start_date' => $validated['startdate'],
            'fair_end_date' => $validated['enddate'],
            'continent' => $validated['continent'],
            'fair_country' => $validated['countryname'],
            'fair_city' => $validated['cityname'],
            'fair_details' => $validated['fairdesc'] ?? '',
            'fair_website' => $validated['fairwebsite'] ?? '',
            'contact_email' => $validated['contactemail'] ?? '',
            'slug' => $this->legacySlug($validated['slug']),
            'meta_title' => $validated['metatitle'] ?? '',
            'meta_desc' => $validated['metadesc'] ?? '',
            'status' => 'active',
            'updated_by' => $admin?->name ?? '',
        ]);

        return redirect()->route('admin.tradeshows.index');
    }

    public function destroy(Request $request, TradeshowData $tradeshow): RedirectResponse
    {
        $this->authorizeAdminDelete($request);

        if (! empty($tradeshow->fair_logo)) {
            @unlink(public_path('uploads/tradeshow/'.$tradeshow->fair_logo));
        }
        $tradeshow->delete();

        return redirect()->route('admin.tradeshows.index');
    }

    /**
     * @return array<int, array{id: int, name: string}>
     */
    private function categoriesPayload(): array
    {
        return FairCategory::query()
            ->active()
            ->orderBy('category_name')
            ->get(['id', 'category_name'])
            ->map(fn ($c) => ['id' => $c->id, 'name' => $c->category_name])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{id: int, name: string}>
     */
    private function countriesPayload(): array
    {
        return CountryTable::query()
            ->where('status', '1')
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn ($c) => ['id' => $c->id, 'name' => $c->name])
            ->values()
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    private function validatedTradeshow(Request $request, ?TradeshowData $existing): array
    {
        $slugRule = Rule::unique('tradeshow_data', 'slug');
        if ($existing) {
            $slugRule = $slugRule->ignore($existing->id);
        }

        return $request->validate([
            'fairname' => ['required', 'string', 'max:500'],
            'slug' => ['required', 'string', 'max:500', $slugRule],
            'faircat' => ['nullable', 'array'],
            'faircat.*' => ['numeric', 'exists:fair_category,id'],
            'alttag' => ['nullable', 'string', 'max:500'],
            'continent' => ['required', 'string', 'max:100', Rule::in(self::CONTINENTS)],
            'startdate' => ['required', 'date_format:Y-m-d'],
            'enddate' => ['required', 'date_format:Y-m-d', 'after_or_equal:startdate'],
            'countryname' => ['required', 'exists:countrytables,id'],
            'cityname' => ['required', 'exists:citytables,id'],
            'fairwebsite' => ['nullable', 'string', 'max:500'],
            'contactemail' => ['nullable', 'email', 'max:255'],
            'fairdesc' => ['nullable', 'string'],
            'metatitle' => ['nullable', 'string'],
            'metadesc' => ['nullable', 'string'],
            'uploadfile' => ['nullable', 'image', 'max:10240'],
            'oldcomplogo' => ['nullable', 'string', 'max:255'],
            'clear_existing_logo' => ['sometimes', 'boolean'],
        ]);
    }

    private function legacySlug(string $input): string
    {
        return str_replace(' ', '-', strtolower(htmlentities($input, ENT_QUOTES, 'UTF-8')));
    }
}
