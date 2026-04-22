<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\CityTable;
use App\Models\CountryTable;
use App\Models\StandbuilderMaster;
use App\Models\TradeshowData;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class PublicPageController extends Controller
{
    public function submitCountryQuote(Request $request)
    {
        // Public country-page lead form validation (legacy-compatible fields).
        $validated = $request->validate([
            'country_value' => ['required', 'string', 'max:255'],
            'eventname' => ['required', 'string', 'max:255'],
            'eventcity' => ['required', 'string', 'max:255'],
            'boothsize' => ['required', 'string', 'max:50'],
            'boothtype' => ['required', 'in:SQMT,SQFT'],
            'information' => ['nullable', 'string', 'max:5000'],
            'fullname' => ['required', 'string', 'min:2', 'max:255'],
            'emailid' => ['required', 'email', 'max:255'],
            'phonenumber' => ['required', 'string', 'min:7', 'max:30'],
            'compwebsite' => ['required', 'string', 'max:255'],
            'privacy_accepted' => ['accepted'],
            'uploadfile' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,pdf,doc,docx', 'max:10240'],
            'honeypot' => ['nullable', 'string', 'max:0'],
            'pageurl' => ['nullable', 'string', 'max:1000'],
            'ipaddress' => ['nullable', 'string', 'max:100'],
        ]);

        $country = CountryTable::query()->where('value', $validated['country_value'])->first();
        if (! $country) {
            return back()->withErrors(['eventcity' => 'Invalid country selected.'])->withInput();
        }

        $blockedDomains = ['protonmail.com'];
        if (Str::endsWith(strtolower($validated['emailid']), $blockedDomains)) {
            return back()->withErrors(['emailid' => 'Please use a business email address.'])->withInput();
        }

        $blockedIPs = ['193.118.55.81', '41.77.117.3', '91.90.126.56'];
        $requestIp = (string) ($validated['ipaddress'] ?? $request->ip() ?? '');
        if (in_array($requestIp, $blockedIPs, true)) {
            return back()->withErrors(['eventname' => 'Could not process request.'])->withInput();
        }

        $uploadName = '';
        if ($request->hasFile('uploadfile')) {
            $file = $request->file('uploadfile');
            $uploadName = time().'_'.preg_replace('/[^a-zA-Z0-9._-]/', '', (string) $file->getClientOriginalName());
            $file->move(base_path().'/public/uploads/getfivequote', $uploadName);
        }

        $cityId = $this->resolveCityId($country->id, $validated['eventcity']);
        $quoteMobile = trim((string) ($request->input('phone_full') ?: $validated['phonenumber']));

        // Store lead in legacy quotations table used by admin workflows.
        $inserted = DB::table('getfivequotes')->insertGetId([
            'quote_name' => trim((string) $validated['fullname']),
            'quote_email' => trim((string) $validated['emailid']),
            'quote_mobile' => $quoteMobile,
            'quote_event_name' => trim((string) $validated['eventname']),
            'quote_event_country' => (string) $country->id,
            'quote_event_city' => $cityId ? (string) $cityId : '',
            'quote_event_desc' => trim((string) ($validated['information'] ?? '')),
            'quote_stand_area' => trim((string) $validated['boothsize']),
            'quote_area_type' => trim((string) $validated['boothtype']),
            'quote_attached_file' => $uploadName,
            'status' => 'Pending',
            'stage' => '1',
            'quote_user_ip' => $requestIp,
            'is_featured' => '0',
            'company_website' => trim((string) $validated['compwebsite']),
            'source' => 'Direct',
            'page_url' => (string) ($validated['pageurl'] ?? $request->getRequestUri()),
            'ipaddress' => $requestIp,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        if (! $inserted) {
            return back()->withErrors(['eventname' => 'Could not submit your request. Please try again.'])->withInput();
        }

        DB::table('getfivequotes')->where('id', $inserted)->update([
            'quote_token_no' => '#'.$inserted,
            'updated_at' => now(),
        ]);

        try {
            $cityName = '';
            if ($cityId) {
                $cityName = (string) (CityTable::query()->where('id', $cityId)->value('name') ?? '');
            } elseif (!empty($validated['eventcity'])) {
                $cityName = (string) $validated['eventcity'];
            }

            $resleaddetail = [[
                'quote_token_no' => '#'.$inserted,
                'quote_event_name' => (string) $validated['eventname'],
                'quote_event_city' => $cityName,
                'quote_stand_area' => (string) $validated['boothsize'],
                'quote_area_type' => (string) $validated['boothtype'],
                'quote_name' => (string) $validated['fullname'],
                'quote_email' => (string) $validated['emailid'],
                'quote_mobile' => $quoteMobile,
                'company_website' => (string) $validated['compwebsite'],
                'quote_event_desc' => (string) ($validated['information'] ?? ''),
                'page_url' => (string) ($validated['pageurl'] ?? $request->getRequestUri()),
                'ipaddress' => $requestIp,
            ]];

            Mail::send('emails.getfivequotemail', ['resleaddetail' => $resleaddetail], function ($message) {
                $message->to('enquiry@expostandzone.com')
                    ->bcc('marketing@expostandzone.com')
                    ->bcc('php@triumfo.de')
                    ->subject('Expostandzone.com | New Quotation Request');
            });
        } catch (\Throwable $e) {
            Log::warning('Public quote email failed', [
                'quote_id' => $inserted,
                'error' => $e->getMessage(),
            ]);
        }

        Log::info('Public country quote submitted', ['id' => $inserted, 'country' => $country->value]);

        return back()->with('success', 'Thank you! Your requirement has been submitted successfully.');
    }

    public function blogIndex(): Response
    {
        $blogs = Article::query()
            ->where('status', '1')
            ->orderByDesc('id')
            ->paginate(12)
            ->through(fn ($row) => [
                'id' => (int) $row->id,
                'title' => (string) ($row->blog_tilte ?? ''),
                'slug' => (string) ($row->url ?? ''),
                'description' => (string) ($row->description ?? ''),
                'image' => (string) ($row->blog_img ?? ''),
                'created_date' => (string) ($row->created_date ?? ''),
            ]);

        return Inertia::render('Public/Blog/Index', [
            'blogs' => $blogs,
        ]);
    }

    public function blogShow(string $slug): Response
    {
        $blog = Article::query()->where('url', $slug)->where('status', '1')->firstOrFail();

        $relatedLimit = max(3, (int) ($blog->bloglimit ?? 6));
        $related = Article::query()
            ->where('status', '1')
            ->where('id', '!=', $blog->id)
            ->orderByDesc('id')
            ->limit($relatedLimit)
            ->get()
            ->map(fn ($row) => [
                'title' => (string) ($row->blog_tilte ?? ''),
                'slug' => (string) ($row->url ?? ''),
                'image' => (string) ($row->blog_img ?? ''),
            ])
            ->values();

        return Inertia::render('Public/Blog/Show', [
            'blog' => [
                'id' => (int) $blog->id,
                'title' => (string) ($blog->blog_tilte ?? ''),
                'slug' => (string) ($blog->url ?? ''),
                'description' => (string) ($blog->description ?? ''),
                'image' => (string) ($blog->blog_img ?? ''),
                'meta_title' => (string) ($blog->meta_title ?? ''),
                'meta_desc' => (string) ($blog->meta_description ?? ''),
                'created_date' => (string) ($blog->created_date ?? ''),
            ],
            'related' => $related,
        ]);
    }

    public function tradeShows(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $today = now()->toDateString();

        $query = TradeshowData::query()
            ->leftJoin('countrytables', 'tradeshow_data.fair_country', '=', 'countrytables.id')
            ->leftJoin('citytables', 'tradeshow_data.fair_city', '=', 'citytables.id')
            ->where('tradeshow_data.status', 'active')
            ->where('tradeshow_data.fair_start_date', '>=', $today)
            ->select(
                'tradeshow_data.id',
                'tradeshow_data.fair_name',
                'tradeshow_data.fair_logo',
                'tradeshow_data.logo_alt',
                'tradeshow_data.fair_start_date',
                'tradeshow_data.fair_end_date',
                'tradeshow_data.slug',
                'countrytables.name as countryname',
                'citytables.name as cityname'
            )
            ->orderBy('tradeshow_data.fair_start_date');

        if ($search !== '') {
            $query->where('tradeshow_data.fair_name', 'like', '%'.$search.'%');
        }

        $tradeshows = $query->paginate(15)->withQueryString();

        return Inertia::render('Public/TradeShows/Index', [
            'tradeshows' => $tradeshows,
            'filters' => ['search' => $search],
        ]);
    }

    public function tradeShowDetail(string $slug): Response
    {
        $row = TradeshowData::query()
            ->leftJoin('countrytables', 'tradeshow_data.fair_country', '=', 'countrytables.id')
            ->leftJoin('citytables', 'tradeshow_data.fair_city', '=', 'citytables.id')
            ->select(
                'tradeshow_data.id',
                'tradeshow_data.fair_name',
                'tradeshow_data.fair_logo',
                'tradeshow_data.logo_alt',
                'tradeshow_data.fair_start_date',
                'tradeshow_data.fair_end_date',
                'tradeshow_data.slug',
                'tradeshow_data.meta_title',
                'tradeshow_data.meta_desc',
                'tradeshow_data.fair_details',
                'tradeshow_data.fair_website',
                'tradeshow_data.contact_email',
                'countrytables.name as countryname',
                'citytables.name as cityname'
            )
            ->where('tradeshow_data.slug', $slug)
            ->firstOrFail();

        return Inertia::render('Public/TradeShows/Show', [
            'tradeshow' => [
                'id' => (int) $row->id,
                'name' => (string) ($row->fair_name ?? ''),
                'slug' => (string) ($row->slug ?? ''),
                'logo' => (string) ($row->fair_logo ?? ''),
                'logo_alt' => (string) ($row->logo_alt ?? ''),
                'start_date' => (string) ($row->fair_start_date ?? ''),
                'end_date' => (string) ($row->fair_end_date ?? ''),
                'meta_title' => (string) ($row->meta_title ?? ''),
                'meta_desc' => (string) ($row->meta_desc ?? ''),
                'details' => (string) ($row->fair_details ?? ''),
                'website' => (string) ($row->fair_website ?? ''),
                'contact_email' => (string) ($row->contact_email ?? ''),
                'countryname' => (string) ($row->countryname ?? ''),
                'cityname' => (string) ($row->cityname ?? ''),
            ],
        ]);
    }

    public function cityPage(string $country, string $city): Response
    {
        $countryRow = CountryTable::query()->where('value', $country)->firstOrFail();
        $cityRow = CityTable::query()->where('value', $city)->where('countryid', $countryRow->id)->firstOrFail();

        $nearbyCities = CityTable::query()
            ->where('countryid', $countryRow->id)
            ->where('id', '!=', $cityRow->id)
            ->where('status', '1')
            ->limit(10)
            ->get(['name', 'value'])
            ->map(fn ($r) => ['name' => (string) $r->name, 'value' => (string) $r->value])
            ->values();

        $citySelectedIds = array_values(array_filter(array_map('intval', explode(',', (string) ($cityRow->show_standbuilder_ids ?? '')))));
        $standbuilders = $this->selectedStandbuilders($citySelectedIds);

        return Inertia::render('Public/City/Show', [
            'country' => [
                'name' => (string) ($countryRow->name ?? ''),
                'value' => (string) ($countryRow->value ?? ''),
            ],
            'city' => [
                'name' => (string) ($cityRow->name ?? ''),
                'value' => (string) ($cityRow->value ?? ''),
                'metatitle' => (string) ($cityRow->metatitle ?? ''),
                'metadesc' => (string) ($cityRow->metadesc ?? ''),
                'bannertitle' => (string) ($cityRow->bannertitle ?? ''),
                'bannershrtext' => (string) ($cityRow->bannershrtext ?? ''),
                'topdesc' => (string) ($cityRow->topdesc ?? ''),
                'botdesc' => (string) ($cityRow->botdesc ?? ''),
            ],
            'nearbyCities' => $nearbyCities,
            'standbuilders' => $standbuilders,
        ]);
    }

    public function countryOrProvider(string $slug): Response
    {
        $country = CountryTable::query()->where('value', $slug)->first();
        if ($country) {
            $cities = CityTable::query()
                ->where('countryid', $country->id)
                ->where('displypage', 'city')
                ->get(['name', 'value'])
                ->map(fn ($r) => ['name' => (string) $r->name, 'value' => (string) $r->value])
                ->values();

            $countrySelectedIds = array_values(array_filter(array_map('intval', explode(',', (string) ($country->show_standbuilder_ids ?? '')))));
            $standbuilders = $this->selectedStandbuilders($countrySelectedIds);

            return Inertia::render('Public/Country/Show', [
                'country' => [
                    'name' => (string) ($country->name ?? ''),
                    'value' => (string) ($country->value ?? ''),
                    'metatitle' => (string) ($country->metatitle ?? ''),
                    'metadesc' => (string) ($country->metadesc ?? ''),
                    'bannertitle' => (string) ($country->bannertitle ?? ''),
                    'bannershrtext' => (string) ($country->bannershrtext ?? ''),
                    'topdesc' => (string) ($country->topdesc ?? ''),
                    'botdesc' => (string) ($country->botdesc ?? ''),
                ],
                'cities' => $cities,
                'standbuilders' => $standbuilders,
            ]);
        }

        $provider = StandbuilderMaster::query()
            ->leftJoin('usermasters', 'standbuildermasters.userid', '=', 'usermasters.id')
            ->where('standbuildermasters.slug', $slug)
            ->where('usermasters.status', '1')
            ->select(
                'standbuildermasters.*',
                'usermasters.name as username',
                'usermasters.email',
                'usermasters.phone'
            )
            ->firstOrFail();

        $servicesMap = DB::table('servicemasters')->where('status', '1')->pluck('name', 'id');
        $countryMap = CountryTable::query()->where('status', '1')->pluck('name', 'id');
        $countryValueByName = CountryTable::query()->pluck('value', 'name');

        $serviceIds = array_filter(array_map('intval', explode(',', (string) ($provider->servic_id ?? ''))));
        $scopeIds = array_filter(array_map('intval', explode(',', (string) ($provider->busn_scop_country ?? ''))));

        return Inertia::render('Public/StandBuilders/Show', [
            'standbuilder' => [
                'companyname' => (string) ($provider->companyname ?? ''),
                'slug' => (string) ($provider->slug ?? ''),
                'complogo' => (string) ($provider->complogo ?? ''),
                'ownername' => (string) ($provider->ownername ?? ''),
                'compweb' => (string) ($provider->compweb ?? ''),
                'countryname' => (string) ($provider->countryname ?? ''),
                'cityname' => (string) ($provider->cityname ?? ''),
                'about_comp' => (string) ($provider->about_comp ?? ''),
                'packgaename' => (string) ($provider->packgaename ?? ''),
                'pack_color' => (string) ($provider->pack_color ?? ''),
                'found_year' => (string) ($provider->found_year ?? ''),
                'metatitle' => (string) ($provider->metatitle ?? ''),
                'metadesc' => (string) ($provider->metadesc ?? ''),
                'email' => (string) ($provider->email ?? ''),
                'phone' => (string) ($provider->phone ?? ''),
                'country_value' => (string) ($countryValueByName[$provider->countryname] ?? ''),
                'services' => collect($serviceIds)->map(fn ($id) => $servicesMap[$id] ?? null)->filter()->values(),
                'business_scope_countries' => collect($scopeIds)->map(fn ($id) => $countryMap[$id] ?? null)->filter()->values(),
            ],
        ]);
    }

    private function standbuildersBaseQuery()
    {
        return StandbuilderMaster::query()
            ->leftJoin('usermasters', 'standbuildermasters.userid', '=', 'usermasters.id')
            ->where('usermasters.status', '1')
            ->where('standbuildermasters.about_comp', '!=', '')
            ->whereIn('standbuildermasters.packgaename', ['PLATINUM', 'GOLD', 'SILVER', 'STARTER', 'FREE'])
            ->select(
                'standbuildermasters.id',
                'standbuildermasters.companyname',
                'standbuildermasters.complogo',
                'standbuildermasters.packgaename',
                'standbuildermasters.pack_color',
                'standbuildermasters.countryname',
                'standbuildermasters.cityname',
                'standbuildermasters.about_comp',
                'standbuildermasters.slug'
            )
            ->orderByRaw("CASE
                WHEN standbuildermasters.packgaename = 'PLATINUM' THEN 1
                WHEN standbuildermasters.packgaename = 'GOLD' THEN 2
                WHEN standbuildermasters.packgaename = 'SILVER' THEN 3
                WHEN standbuildermasters.packgaename = 'STARTER' THEN 4
                ELSE 5
            END")
            ->orderByDesc('standbuildermasters.id');
    }

    private function mapStandbuilderCard(object $row): array
    {
        return [
            'id' => (int) ($row->id ?? 0),
            'companyname' => (string) ($row->companyname ?? ''),
            'complogo' => (string) ($row->complogo ?? ''),
            'packgaename' => (string) ($row->packgaename ?? ''),
            'pack_color' => (string) ($row->pack_color ?? ''),
            'countryname' => (string) ($row->countryname ?? ''),
            'cityname' => (string) ($row->cityname ?? ''),
            'about_comp' => (string) ($row->about_comp ?? ''),
            'slug' => (string) ($row->slug ?? ''),
        ];
    }

    private function selectedStandbuilders(array $ids)
    {
        if (empty($ids)) {
            return collect();
        }

        $order = implode(',', $ids);

        return $this->standbuildersBaseQuery()
            ->whereIn('standbuildermasters.id', $ids)
            ->orderByRaw("FIELD(standbuildermasters.id, {$order})")
            ->get()
            ->map(fn ($r) => $this->mapStandbuilderCard($r))
            ->values();
    }

    private function resolveCityId(int $countryId, string $eventCity): ?int
    {
        $eventCity = trim($eventCity);
        if ($eventCity === '') {
            return null;
        }

        $bySlug = CityTable::query()
            ->where('countryid', $countryId)
            ->where('value', $eventCity)
            ->value('id');
        if ($bySlug) {
            return (int) $bySlug;
        }

        $byName = CityTable::query()
            ->where('countryid', $countryId)
            ->whereRaw('LOWER(name) = ?', [strtolower($eventCity)])
            ->value('id');

        return $byName ? (int) $byName : null;
    }
}

