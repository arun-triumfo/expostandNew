<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CityTable;
use App\Models\CountryTable;
use App\Models\StandbuilderMaster;
use App\Models\StandbuilderRemark;
use App\Models\UserMaster;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class StandBuilderController extends Controller
{
    /** @var list<int> */
    private const INHOUSE_CREATED_BY = [6, 2, 7, 8, 10, 19, 22, 24, 27];

    public function index(Request $request, ?int $page = null): Response
    {
        $currentPage = $page ?? max(1, (int) $request->query('page', 1));

        $perPageRaw = (string) $request->query('per_page', '50');
        $perPage = match ($perPageRaw) {
            '25' => 25,
            '50' => 50,
            '100' => 100,
            '200' => 200,
            'All' => max(1, min(5000, StandbuilderMaster::count())),
            default => 50,
        };

        $membrtype = (string) $request->query('membrtype', '');
        $continent = (string) $request->query('continent', '');
        $cntryname = (string) $request->query('cntryname', '');
        $cityname = (string) $request->query('cityname', '');
        $search = trim((string) $request->query('search', ''));

        $query = $this->baseStandbuilderQuery();
        $this->applyMemberTypeFilter($query, $membrtype);

        if ($continent !== '') {
            $query->where('standbuildermasters.continent', $continent);
        }
        if ($cntryname !== '') {
            $query->where('standbuildermasters.countryname', $cntryname);
        }
        if ($cityname !== '') {
            $query->where('standbuildermasters.cityname', $cityname);
        }

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('standbuildermasters.companyname', 'like', '%'.$search.'%')
                    ->orWhere('usermasters.name', 'like', '%'.$search.'%')
                    ->orWhere('usermasters.email', 'like', '%'.$search.'%')
                    ->orWhere('usermasters.phone', 'like', '%'.$search.'%');
            });
        }

        $paginator = $query
            ->orderByDesc('usermasters.id')
            ->paginate($perPage, ['*'], 'page', $currentPage)
            ->withQueryString();

        $userIds = $paginator->getCollection()->pluck('userid')->filter()->unique()->values()->all();
        $commentCounts = [];
        if ($userIds !== []) {
            $commentCounts = StandbuilderRemark::query()
                ->whereIn('standbuilder_id', $userIds)
                ->selectRaw('standbuilder_id, COUNT(*) as c')
                ->groupBy('standbuilder_id')
                ->pluck('c', 'standbuilder_id')
                ->all();
        }

        $rows = $paginator->getCollection()->map(function ($row) use ($commentCounts) {
            $createdby = in_array((int) ($row->createdby ?? 0), self::INHOUSE_CREATED_BY, true)
                ? 'Inhouse'
                : 'Self';

            return [
                'id' => (int) $row->id,
                'userid' => (int) $row->userid,
                'companyname' => (string) $row->companyname,
                'countryname' => (string) $row->countryname,
                'cityname' => (string) $row->cityname,
                'name' => (string) $row->name,
                'email' => (string) $row->email,
                'phone' => (string) $row->phone,
                'packgaename' => (string) $row->packgaename,
                'pack_color' => (string) ($row->pack_color ?? ''),
                'current_package_name' => $row->current_package_name ?? null,
                'current_package_color' => $row->current_package_color ?? null,
                'featured_standbuilder' => (string) ($row->featured_standbuilder ?? '0'),
                'preferred_vendor' => (string) ($row->preferred_vendor ?? '0'),
                'verifystatus' => (string) ($row->verifystatus ?? ''),
                'status' => (string) ($row->status ?? ''),
                'created_at' => $row->created_at,
                'createdby_label' => $createdby,
                'comment_count' => (int) ($commentCounts[$row->userid] ?? 0),
            ];
        });

        $paginator->setCollection($rows);

        $countries = CountryTable::query()
            ->where('status', '1')
            ->orderBy('name')
            ->get(['id', 'continent', 'name', 'value']);

        return Inertia::render('Admin/Standbuilders/Index', [
            'standbuilders' => $paginator,
            'stats' => [
                'total' => StandbuilderMaster::count(),
                'active' => UserMaster::where('status', '1')->count(),
                'starter' => StandbuilderMaster::where('packgaename', 'STARTER')->count(),
                'silver' => StandbuilderMaster::where('packgaename', 'SILVER')->count(),
                'gold' => StandbuilderMaster::where('packgaename', 'GOLD')->count(),
                'platinum' => StandbuilderMaster::where('packgaename', 'PLATINUM')->count(),
            ],
            'countries' => $countries,
            'filters' => [
                'membrtype' => $membrtype,
                'continent' => $continent,
                'cntryname' => $cntryname,
                'cityname' => $cityname,
                'search' => $search,
                'per_page' => $perPageRaw,
            ],
        ]);
    }

    public function updateFeaturedStandbuilders(Request $request): RedirectResponse
    {
        $selectedIds = $request->input('selected_standbuilders', []);
        $action = $request->input('action');

        if (! is_array($selectedIds) || $selectedIds === []) {
            return back()->with('error', 'No standbuilders were selected.');
        }

        $selectedIds = array_map('intval', $selectedIds);

        try {
            if ($action === 'annual') {
                DB::table('standbuildermasters')
                    ->whereIn('id', $selectedIds)
                    ->update(['featured_standbuilder' => '1']);

                return back()->with('success', 'Selected standbuilders have been successfully updated to annual subscription option.');
            }
            if ($action === 'preferred') {
                DB::table('standbuildermasters')
                    ->whereIn('id', $selectedIds)
                    ->update(['preferred_vendor' => '1']);

                return back()->with('success', 'Selected standbuilders have been successfully marked as preferred vendors.');
            }
        } catch (\Throwable) {
            return back()->with('error', 'Failed to update standbuilders. Please try again.');
        }

        return back()->with('error', 'Invalid action.');
    }

    public function viewCommentstandbuilder(Request $request): JsonResponse
    {
        $stndbuldrid = $request->input('stndbuilderid');

        return response()->json(['comments' => $this->commentsPayloadForStandbuilder($stndbuldrid)]);
    }

    public function insertComntStndbldr(Request $request): JsonResponse
    {
        $stndbuilderid = $request->input('stndbldr_id');
        $comment = $request->input('comment');
        $userid = $request->input('userid');

        StandbuilderRemark::query()->insert([
            'standbuilder_id' => $stndbuilderid,
            'camment' => $comment,
            'user_id' => $userid,
        ]);

        return response()->json(['comments' => $this->commentsPayloadForStandbuilder($stndbuilderid)]);
    }

    /**
     * @return list<array{sn: int, comment: string, user: string, date: string}>
     */
    private function commentsPayloadForStandbuilder(mixed $stndbuldrid): array
    {
        $comments = StandbuilderRemark::query()
            ->where('standbuilder_id', $stndbuldrid)
            ->orderBy('id')
            ->get();

        return $comments->values()->map(function ($row, $i) {
            $userLabel = match (true) {
                in_array((string) $row->user_id, ['2', '40'], true) => 'Divyanshi',
                (string) $row->user_id === '6' => 'Meenakshi',
                default => 'old user',
            };

            return [
                'sn' => $i + 1,
                'comment' => (string) $row->camment,
                'user' => $userLabel,
                'date' => (string) ($row->created_date ?? ''),
            ];
        })->all();
    }

    public function getCountriesByContinent(Request $request): JsonResponse
    {
        $continent = (string) $request->input('continent', '');

        if ($continent === '') {
            return response()->json(['error' => 'Continent name is required'], 400);
        }

        try {
            $countries = DB::table('countrytables')
                ->select('id', 'name', 'continent')
                ->where('continent', $continent)
                ->where('status', '1')
                ->orderBy('name')
                ->get();

            if ($countries->isEmpty()) {
                $continentCountries = [
                    'Africa' => ['Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cameroon', 'Comoros', 'Congo (Brazzaville)', 'Congo (Kinshasa)', 'Djibouti', 'Egypt', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Ivory Coast', 'Kenya', 'Libya', 'Madagascar', 'Mali', 'Mauritius', 'Morocco', 'Mozambique', 'Niger', 'Nigeria', 'Rwanda', 'Senegal', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'],
                    'Asia' => ['Afghanistan', 'Bahrain', 'Bangladesh', 'Cambodia', 'China', 'Hong Kong', 'India', 'Indonesia', 'Iran', 'Iraq', 'Israel', 'Japan', 'Jordan', 'Kazakhstan', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Lebanon', 'Malaysia', 'Maldives', 'Mongolia', 'Myanmar', 'Nepal', 'North Korea', 'Oman', 'Pakistan', 'Philippines', 'Qatar', 'Saudi Arabia', 'Singapore', 'South Korea', 'Sri Lanka', 'Syria', 'Taiwan', 'Thailand', 'Turkey', 'Turkmenistan', 'UAE', 'Uzbekistan', 'Vietnam'],
                    'Europe' => ['Aland Islands', 'Andorra', 'Austria', 'Belarus', 'Belgium', 'Bosnia', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Georgia', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Isle of Man', 'Italy', 'Kosovo', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Moldova', 'Monaco', 'Netherlands', 'Norway', 'Poland', 'Portugal', 'Romania', 'Russia', 'San Marino', 'Scotland', 'Serbia', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Ukraine', 'United Kingdom'],
                    'North America' => ['Bahamas', 'Belize', 'Canada', 'Costa Rica', 'Cuba', 'Dominican Republic', 'El Salvador', 'Greenland', 'Guadeloupe', 'Guatemala', 'Honduras', 'Jamaica', 'Mexico', 'Panama', 'Puerto Rico', 'Trinidad and Tobago', 'United States'],
                    'South America' => ['Argentina', 'Bolivia', 'Brazil', 'Chile', 'Colombia', 'Ecuador', 'Guyana', 'Paraguay', 'Peru', 'Suriname', 'Uruguay', 'Venezuela'],
                    'Oceania' => ['Australia', 'Christmas Island', 'Fiji', 'New Zealand'],
                ];

                $countryNames = $continentCountries[$continent] ?? [];
                if ($countryNames !== []) {
                    $countries = DB::table('countrytables')
                        ->select('id', 'name', 'continent')
                        ->whereIn('name', $countryNames)
                        ->where('status', '1')
                        ->orderBy('name')
                        ->get();
                }
            }

            return response()->json([
                'success' => true,
                'continent' => $continent,
                'countries' => $countries,
            ]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getCityByCountry(Request $request): JsonResponse
    {
        $countryName = (string) $request->input('countryyid', '');

        $cities = CityTable::query()
            ->where('countryname', $countryName)
            ->where('status', '1')
            ->orderBy('name')
            ->get(['name']);

        return response()->json(['cities' => $cities]);
    }

    /**
     * Legacy POST filter — returns JSON rows for compatibility.
     */
    public function filterStandbuilder(Request $request): JsonResponse
    {
        $membertype = (string) $request->input('membrtype', '');
        $cntryname = (string) $request->input('cntryname', '');
        $cityname = (string) $request->input('cityname', '');
        $continent = (string) $request->input('continent', '');

        $query = $this->baseStandbuilderQuery();
        $this->applyMemberTypeFilter($query, $membertype);

        if ($cntryname !== '') {
            $query->where('standbuildermasters.countryname', $cntryname);
        }
        if ($cityname !== '') {
            $query->where('standbuildermasters.cityname', $cityname);
        }
        if ($continent !== '') {
            $query->where('standbuildermasters.continent', $continent);
        }

        $count = (clone $query)->count();
        $results = $query->orderByDesc('usermasters.id')->get();

        $rows = $results->map(fn ($row) => $this->mapRowForJson($row));

        return response()->json(['count' => $count, 'data' => $rows]);
    }

    /**
     * Legacy search POST — returns JSON rows.
     */
    public function searchStandbuilder(Request $request): JsonResponse
    {
        $srchdata = trim((string) $request->input('srchval', ''));

        $query = $this->baseStandbuilderQuery();

        if ($srchdata !== '') {
            $query->where(function ($q) use ($srchdata) {
                $q->where('standbuildermasters.companyname', 'like', '%'.$srchdata.'%')
                    ->orWhere('usermasters.name', 'like', '%'.$srchdata.'%')
                    ->orWhere('usermasters.email', 'like', '%'.$srchdata.'%')
                    ->orWhere('usermasters.phone', 'like', '%'.$srchdata.'%');
            });
        }

        $results = $query->orderByDesc('usermasters.id')->get();
        $rows = $results->map(fn ($row) => $this->mapRowForJson($row));

        return response()->json(['data' => $rows]);
    }

    private function baseStandbuilderQuery()
    {
        return StandbuilderMaster::query()
            ->leftJoin('usermasters', 'standbuildermasters.userid', '=', 'usermasters.id')
            ->leftJoin('package_tracking_master', function ($join) {
                $join->on('package_tracking_master.stand_bulider_master_id', '=', 'standbuildermasters.userid')
                    ->where('package_tracking_master.status', '=', 'active');
            })
            ->leftJoin('packagemastersold', function ($join) {
                $join->on('package_tracking_master.package_master_id', '=', 'packagemastersold.id')
                    ->whereRaw('package_tracking_master.created_date < ?', ['2025-05-25']);
            })
            ->leftJoin('packagemasters', function ($join) {
                $join->on('package_tracking_master.package_master_id', '=', 'packagemasters.id')
                    ->whereRaw('package_tracking_master.created_date >= ?', ['2025-05-25']);
            })
            ->select(
                'standbuildermasters.id',
                'standbuildermasters.userid',
                'standbuildermasters.companyname',
                'standbuildermasters.ownername',
                'standbuildermasters.compweb',
                'standbuildermasters.countryname',
                'standbuildermasters.cityname',
                'standbuildermasters.featured_standbuilder',
                'standbuildermasters.packgaename',
                'standbuildermasters.pack_color',
                'standbuildermasters.continent',
                'standbuildermasters.createdby',
                'standbuildermasters.preferred_vendor',
                'usermasters.name',
                'usermasters.email',
                'usermasters.phone',
                'usermasters.usertype',
                'usermasters.status',
                'usermasters.verifystatus',
                'usermasters.created_at',
                'usermasters.updated_at',
            )
            ->addSelect([
                DB::raw('CASE
                WHEN package_tracking_master.created_date < "2025-05-25" THEN packagemastersold.package_name
                ELSE packagemasters.package_name
            END as current_package_name'),
                DB::raw('CASE
                WHEN package_tracking_master.created_date < "2025-05-25" THEN packagemastersold.package_color
                ELSE packagemasters.package_color
            END as current_package_color'),
            ]);
    }

    private function applyMemberTypeFilter($query, string $membertype): void
    {
        if ($membertype === '') {
            return;
        }

        if ($membertype === 'paid') {
            $query->whereIn('standbuildermasters.packgaename', ['GOLD', 'SILVER', 'STARTER', 'PLATINUM']);
        } elseif ($membertype === 'GOLD') {
            $query->where('standbuildermasters.packgaename', 'GOLD');
        } elseif ($membertype === 'PLATINUM') {
            $query->where('standbuildermasters.packgaename', 'PLATINUM');
        } elseif ($membertype === 'SILVER') {
            $query->where('standbuildermasters.packgaename', 'SILVER');
        } elseif ($membertype === 'STARTER') {
            $query->where('standbuildermasters.packgaename', 'STARTER');
        } elseif ($membertype === 'FREE') {
            $query->where('standbuildermasters.packgaename', 'FREE');
        } elseif ($membertype === 'featured') {
            $query->where('standbuildermasters.featured_standbuilder', '1');
        } elseif ($membertype === 'preferred') {
            $query->where('standbuildermasters.preferred_vendor', '1');
        } elseif ($membertype === 'active') {
            $query->where('usermasters.status', '1');
        }
    }

    private function mapRowForJson(object $row): array
    {
        $createdby = in_array((int) ($row->createdby ?? 0), self::INHOUSE_CREATED_BY, true)
            ? 'Inhouse'
            : 'Self';

        $commentCount = StandbuilderRemark::where('standbuilder_id', $row->userid)->count();

        return [
            'id' => (int) $row->id,
            'userid' => (int) $row->userid,
            'companyname' => (string) $row->companyname,
            'countryname' => (string) $row->countryname,
            'cityname' => (string) $row->cityname,
            'name' => (string) $row->name,
            'email' => (string) $row->email,
            'phone' => (string) $row->phone,
            'packgaename' => (string) $row->packgaename,
            'pack_color' => (string) ($row->pack_color ?? ''),
            'current_package_name' => $row->current_package_name ?? null,
            'current_package_color' => $row->current_package_color ?? null,
            'featured_standbuilder' => (string) ($row->featured_standbuilder ?? '0'),
            'preferred_vendor' => (string) ($row->preferred_vendor ?? '0'),
            'verifystatus' => (string) ($row->verifystatus ?? ''),
            'status' => (string) ($row->status ?? ''),
            'created_at' => $row->created_at,
            'createdby_label' => $createdby,
            'comment_count' => $commentCount,
        ];
    }

    public function show(Request $request): Response|RedirectResponse
    {
        $id = (int) $request->query('id', 0);
        if ($id < 1) {
            return redirect()->route('standbuilders')->with('error', 'Invalid stand builder.');
        }

        $row = $this->standbuilderProfileRow($id);
        if (! $row) {
            return redirect()->route('standbuilders')->with('error', 'Stand builder not found.');
        }

        $latest = DB::table('package_tracking_master')
            ->where('stand_bulider_master_id', $id)
            ->orderByDesc('created_date')
            ->first();

        $packagePurchaseDate = $latest->created_date ?? '2025-05-25';
        $isOldPackage = $packagePurchaseDate < '2025-05-25';

        $packghstry = $this->packageHistoryRows($id, $isOldPackage);
        $packname = $this->activePackageRows($id, $isOldPackage);

        $totallead = $this->leadRowsForSupplier($id);
        $acceptedleaddetail = $this->leadRowsAccepted($id);
        $rjctdleaddetail = $this->leadRowsRejected($id);

        $leadpenidngstatus = DB::table('supplier_lead_track_master')
            ->where('supplier_id', $id)
            ->where('status', 'active')
            ->first();

        if ($leadpenidngstatus) {
            $leadpending = (int) ($leadpenidngstatus->lead_pending ?? 0);
            $totalleads = (int) ($leadpenidngstatus->total_lead ?? 0);
        } else {
            $leadpending = 0;
            $totalleads = 0;
        }

        $leadTaken = DB::table('lead_track_master')
            ->where('supplier_id', $id)
            ->where('status', 'respond')
            ->where('terms_accept', 'accept')
            ->count();

        $leadrejected = DB::table('lead_track_master')
            ->where('supplier_id', $id)
            ->where('status', 'respond')
            ->where('terms_accept', 'reject')
            ->count();

        $leadlifetitme = DB::table('lead_track_master')->where('supplier_id', $id)->count();

        $noresponslead = DB::table('lead_track_master')
            ->where('supplier_id', $id)
            ->where('status', '!=', 'respond')
            ->count();

        $servicedata = DB::table('servicemasters')
            ->where('status', '1')
            ->orderBy('name')
            ->get(['id', 'name']);

        $country = CountryTable::query()
            ->where('status', '1')
            ->orderBy('name')
            ->get(['id', 'continent', 'name', 'value']);

        $continentGroups = DB::table('countrytables')
            ->select('continent')
            ->groupBy('continent')
            ->orderBy('continent')
            ->get();

        $profile = $this->mapStandbuilderProfile($row);
        $profile['logo_url'] = $this->standbuilderLogoUrl($row->complogo ?? null);

        return Inertia::render('Admin/Standbuilders/Show', [
            'profile' => $profile,
            'servicedata' => $servicedata,
            'country' => $country,
            'continentGroups' => $continentGroups,
            'packghstry' => $packghstry,
            'packname' => $packname,
            'totallead' => $totallead,
            'acceptedleaddetail' => $acceptedleaddetail,
            'rjctdleaddetail' => $rjctdleaddetail,
            'totalleads' => $totalleads,
            'leadpending' => $leadpending,
            'leadTaken' => $leadTaken,
            'leadrejected' => $leadrejected,
            'leadlifetitme' => $leadlifetitme,
            'noresponslead' => $noresponslead,
        ]);
    }

    public function edit(Request $request): Response|RedirectResponse
    {
        $id = (int) $request->query('id', 0);
        if ($id < 1) {
            return redirect()->route('standbuilders')->with('error', 'Invalid stand builder.');
        }

        $row = $this->standbuilderProfileRow($id);
        if (! $row) {
            return redirect()->route('standbuilders')->with('error', 'Stand builder not found.');
        }

        $country = CountryTable::query()
            ->where('status', '1')
            ->orderBy('name')
            ->get(['id', 'continent', 'name', 'value']);

        $servicedata = DB::table('servicemasters')
            ->where('status', '1')
            ->orderBy('name')
            ->get(['id', 'name']);

        $continentGroups = DB::table('countrytables')
            ->select('continent')
            ->groupBy('continent')
            ->orderBy('continent')
            ->get();

        $standbuilder = $this->mapStandbuilderForForm($row);

        return Inertia::render('Admin/Standbuilders/Edit', [
            'standbuilder' => $standbuilder,
            'countries' => $country,
            'services' => $servicedata,
            'continentGroups' => $continentGroups,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $id = (int) $request->input('userid');
        if ($id < 1) {
            return back()->with('error', 'Invalid user.');
        }

        $exists = StandbuilderMaster::query()->where('userid', $id)->exists();
        if (! $exists) {
            return back()->with('error', 'Stand builder not found.');
        }

        $slugData = (string) $request->input('slug', '');
        $slug = str_replace(' ', '-', strtolower(htmlentities($slugData, ENT_QUOTES | ENT_HTML5, 'UTF-8')));

        if ($request->hasFile('uploadfile')) {
            $thumbimg = time().'.'.$request->file('uploadfile')->getClientOriginalExtension();
            $dir = public_path('uploads/standbuilder');
            if (! File::isDirectory($dir)) {
                File::makeDirectory($dir, 0755, true);
            }
            $request->file('uploadfile')->move($dir, $thumbimg);
        } else {
            $thumbimg = $request->input('oldcomplogo');
        }

        $serviceIds = $request->input('serviceid', []);
        $servcMstrId = is_array($serviceIds) && $serviceIds !== [] ? implode(',', array_map('intval', $serviceIds)) : '';

        $businessScope = $request->input('businesscope', []);
        $busnessScopeId = is_array($businessScope) && $businessScope !== [] ? implode(',', array_map('intval', $businessScope)) : '';

        DB::transaction(function () use ($request, $id, $slug, $thumbimg, $servcMstrId, $busnessScopeId) {
            $userUpdate = [
                'status' => $request->input('status'),
                'verifystatus' => $request->input('verifystatus'),
            ];
            if ($request->filled('password')) {
                $userUpdate['password'] = Hash::make((string) $request->input('password'));
            }
            UserMaster::query()->where('id', $id)->update($userUpdate);

            StandbuilderMaster::query()->where('userid', $id)->update([
                'companyname' => $request->input('companyname'),
                'slug' => $slug,
                'ownername' => $request->input('ownername'),
                'compweb' => $request->input('companyweb'),
                'companyphone' => $request->input('compphone'),
                'countryname' => $request->input('countryname'),
                'cityname' => $request->input('cityname'),
                'complogo' => $thumbimg,
                'compaddress' => $request->input('compaddres'),
                'found_year' => $request->input('foundationyr'),
                'tax_vat' => $request->input('texvat'),
                'reg_num' => $request->input('regnumber'),
                'about_comp' => $request->input('aboutcomp'),
                'prod_size' => $request->input('prdsize'),
                'num_employee' => $request->input('numofemployee'),
                'prd_capcty' => $request->input('prdcapicity'),
                'servic_id' => $servcMstrId,
                'busn_scop_country' => $busnessScopeId,
                'metatitle' => $request->input('metatitle'),
                'metadesc' => $request->input('metadesc'),
            ]);
        });

        return back()->with('success', 'Data updated Successfully.');
    }

    private function standbuilderProfileRow(int $id): ?object
    {
        return StandbuilderMaster::query()
            ->leftJoin('usermasters', 'standbuildermasters.userid', '=', 'usermasters.id')
            ->where('usermasters.id', $id)
            ->select(
                'standbuildermasters.id',
                'standbuildermasters.userid',
                'standbuildermasters.companyname',
                'standbuildermasters.ownername',
                'standbuildermasters.compweb',
                'standbuildermasters.compaddress',
                'standbuildermasters.slug',
                'standbuildermasters.companyphone',
                'standbuildermasters.complogo',
                'standbuildermasters.countryname',
                'standbuildermasters.cityname',
                'standbuildermasters.tax_vat',
                'standbuildermasters.reg_num',
                'standbuildermasters.about_comp',
                'standbuildermasters.found_year',
                'standbuildermasters.prod_size',
                'standbuildermasters.num_employee',
                'standbuildermasters.prd_capcty',
                'standbuildermasters.servic_id',
                'standbuildermasters.busn_scop_country',
                'standbuildermasters.featured_standbuilder',
                'standbuildermasters.packgaename',
                'standbuildermasters.pack_color',
                'standbuildermasters.continent',
                'standbuildermasters.metatitle',
                'standbuildermasters.metadesc',
                'usermasters.name',
                'usermasters.email',
                'usermasters.phone',
                'usermasters.password',
                'usermasters.status',
                'usermasters.verifystatus',
                'usermasters.created_at',
                'usermasters.updated_at'
            )
            ->first();
    }

    /**
     * @return array<string, mixed>
     */
    private function mapStandbuilderProfile(object $row): array
    {
        $pwd = (string) ($row->password ?? '');
        $passwordDisplay = (str_starts_with($pwd, '$2y$') || str_starts_with($pwd, '$2a$')) ? '••••••••' : ($pwd !== '' ? $pwd : '—');

        return [
            'userid' => (int) $row->userid,
            'companyname' => (string) ($row->companyname ?? ''),
            'ownername' => (string) ($row->ownername ?? ''),
            'compweb' => (string) ($row->compweb ?? ''),
            'compaddress' => (string) ($row->compaddress ?? ''),
            'slug' => (string) ($row->slug ?? ''),
            'companyphone' => (string) ($row->companyphone ?? ''),
            'countryname' => (string) ($row->countryname ?? ''),
            'cityname' => (string) ($row->cityname ?? ''),
            'tax_vat' => (string) ($row->tax_vat ?? ''),
            'reg_num' => (string) ($row->reg_num ?? ''),
            'about_comp' => (string) ($row->about_comp ?? ''),
            'found_year' => (string) ($row->found_year ?? ''),
            'prod_size' => (string) ($row->prod_size ?? ''),
            'num_employee' => (string) ($row->num_employee ?? ''),
            'prd_capcty' => (string) ($row->prd_capcty ?? ''),
            'servic_id' => (string) ($row->servic_id ?? ''),
            'busn_scop_country' => (string) ($row->busn_scop_country ?? ''),
            'name' => (string) ($row->name ?? ''),
            'email' => (string) ($row->email ?? ''),
            'phone' => (string) ($row->phone ?? ''),
            'password_display' => $passwordDisplay,
            'status' => (string) ($row->status ?? ''),
            'verifystatus' => (string) ($row->verifystatus ?? ''),
            'created_at' => $row->created_at,
            'metatitle' => (string) ($row->metatitle ?? ''),
            'metadesc' => (string) ($row->metadesc ?? ''),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function mapStandbuilderForForm(object $row): array
    {
        $serviceIds = array_filter(array_map('intval', explode(',', (string) ($row->servic_id ?? ''))));
        $businessIds = array_filter(array_map('intval', explode(',', (string) ($row->busn_scop_country ?? ''))));

        return [
            'userid' => (int) $row->userid,
            'name' => (string) ($row->name ?? ''),
            'email' => (string) ($row->email ?? ''),
            'phone' => (string) ($row->phone ?? ''),
            'countryname' => (string) ($row->countryname ?? ''),
            'cityname' => (string) ($row->cityname ?? ''),
            'status' => (string) ($row->status ?? '1'),
            'verifystatus' => (string) ($row->verifystatus ?? '0'),
            'compaddres' => (string) ($row->compaddress ?? ''),
            'metatitle' => (string) ($row->metatitle ?? ''),
            'metadesc' => (string) ($row->metadesc ?? ''),
            'companyname' => (string) ($row->companyname ?? ''),
            'slug' => (string) ($row->slug ?? ''),
            'companyweb' => (string) ($row->compweb ?? ''),
            'compphone' => (string) ($row->companyphone ?? ''),
            'texvat' => (string) ($row->tax_vat ?? ''),
            'regnumber' => (string) ($row->reg_num ?? ''),
            'foundationyr' => (string) ($row->found_year ?? ''),
            'ownername' => (string) ($row->ownername ?? ''),
            'numofemployee' => (string) ($row->num_employee ?? ''),
            'oldcomplogo' => (string) ($row->complogo ?? ''),
            'logo_url' => $this->standbuilderLogoUrl($row->complogo ?? null),
            'prdsize' => (string) ($row->prod_size ?? ''),
            'prdcapicity' => (string) ($row->prd_capcty ?? ''),
            'aboutcomp' => (string) ($row->about_comp ?? ''),
            'service_ids' => $serviceIds,
            'business_scope_ids' => $businessIds,
        ];
    }

    private function standbuilderLogoUrl(?string $logo): ?string
    {
        if ($logo) {
            return asset('uploads/standbuilder/'.$logo);
        }

        return null;
    }

    /**
     * @return list<object>
     */
    private function packageHistoryRows(int $id, bool $isOldPackage): array
    {
        if ($isOldPackage) {
            return DB::table('package_tracking_master')
                ->join('packagemastersold', 'packagemastersold.id', '=', 'package_tracking_master.package_master_id')
                ->where('package_tracking_master.stand_bulider_master_id', $id)
                ->select(
                    'package_tracking_master.package_master_id',
                    'package_tracking_master.stand_bulider_master_id',
                    'package_tracking_master.stand_builder_email',
                    'package_tracking_master.created_date',
                    'package_tracking_master.updated_date',
                    'package_tracking_master.status',
                    'packagemastersold.package_name',
                    'packagemastersold.package_price',
                    'packagemastersold.package_color'
                )
                ->get()
                ->all();
        }

        return DB::table('package_tracking_master')
            ->join('packagemasters', 'packagemasters.id', '=', 'package_tracking_master.package_master_id')
            ->where('package_tracking_master.stand_bulider_master_id', $id)
            ->select(
                'package_tracking_master.package_master_id',
                'package_tracking_master.stand_bulider_master_id',
                'package_tracking_master.stand_builder_email',
                'package_tracking_master.created_date',
                'package_tracking_master.updated_date',
                'package_tracking_master.status',
                'packagemasters.package_name',
                'packagemasters.package_price',
                'packagemasters.package_color'
            )
            ->get()
            ->all();
    }

    /**
     * @return list<object>
     */
    private function activePackageRows(int $id, bool $isOldPackage): array
    {
        if ($isOldPackage) {
            return DB::table('package_tracking_master')
                ->join('packagemastersold', 'packagemastersold.id', '=', 'package_tracking_master.package_master_id')
                ->where('package_tracking_master.status', 'active')
                ->where('package_tracking_master.stand_bulider_master_id', $id)
                ->select(
                    'package_tracking_master.package_master_id',
                    'package_tracking_master.status',
                    'packagemastersold.package_name',
                    'packagemastersold.package_color'
                )
                ->get()
                ->all();
        }

        return DB::table('package_tracking_master')
            ->join('packagemasters', 'packagemasters.id', '=', 'package_tracking_master.package_master_id')
            ->where('package_tracking_master.status', 'active')
            ->where('package_tracking_master.stand_bulider_master_id', $id)
            ->select(
                'package_tracking_master.package_master_id',
                'package_tracking_master.status',
                'packagemasters.package_name',
                'packagemasters.package_color'
            )
            ->get()
            ->all();
    }

    /**
     * @return list<object>
     */
    private function leadRowsForSupplier(int $id): array
    {
        return DB::table('lead_track_master')
            ->join('getfivequotes', 'lead_track_master.quote_token_no', '=', 'getfivequotes.quote_token_no')
            ->leftJoin('citytables', 'getfivequotes.quote_event_city', '=', 'citytables.id')
            ->where('lead_track_master.supplier_id', $id)
            ->select(
                'getfivequotes.quote_event_name',
                'getfivequotes.quote_token_no',
                'getfivequotes.quote_estimate_from',
                'getfivequotes.quote_estimate_to',
                'getfivequotes.quote_currency_type',
                'getfivequotes.quote_stand_area',
                'getfivequotes.quote_area_type',
                'getfivequotes.quote_event_date',
                'lead_track_master.supplier_id',
                'lead_track_master.status',
                'lead_track_master.terms_accept',
                'lead_track_master.created_date',
                'citytables.name as cityname'
            )
            ->get()
            ->all();
    }

    /**
     * @return list<object>
     */
    private function leadRowsAccepted(int $id): array
    {
        return DB::table('lead_track_master')
            ->join('getfivequotes', 'lead_track_master.quote_token_no', '=', 'getfivequotes.quote_token_no')
            ->leftJoin('citytables', 'getfivequotes.quote_event_city', '=', 'citytables.id')
            ->where('lead_track_master.status', 'respond')
            ->where('lead_track_master.terms_accept', 'accept')
            ->where('lead_track_master.supplier_id', $id)
            ->select(
                'getfivequotes.quote_event_name',
                'getfivequotes.quote_token_no',
                'getfivequotes.quote_estimate_from',
                'getfivequotes.quote_estimate_to',
                'getfivequotes.quote_currency_type',
                'getfivequotes.quote_stand_area',
                'getfivequotes.quote_area_type',
                'getfivequotes.quote_event_date',
                'lead_track_master.supplier_id',
                'lead_track_master.status',
                'lead_track_master.terms_accept',
                'lead_track_master.created_date',
                'citytables.name as cityname'
            )
            ->get()
            ->all();
    }

    /**
     * @return list<object>
     */
    private function leadRowsRejected(int $id): array
    {
        return DB::table('lead_track_master')
            ->join('getfivequotes', 'lead_track_master.quote_token_no', '=', 'getfivequotes.quote_token_no')
            ->leftJoin('citytables', 'getfivequotes.quote_event_city', '=', 'citytables.id')
            ->where('lead_track_master.status', 'respond')
            ->where('lead_track_master.terms_accept', 'reject')
            ->where('lead_track_master.supplier_id', $id)
            ->select(
                'getfivequotes.quote_event_name',
                'getfivequotes.quote_token_no',
                'getfivequotes.quote_estimate_from',
                'getfivequotes.quote_estimate_to',
                'getfivequotes.quote_currency_type',
                'getfivequotes.quote_stand_area',
                'getfivequotes.quote_area_type',
                'getfivequotes.quote_event_date',
                'lead_track_master.supplier_id',
                'lead_track_master.status',
                'lead_track_master.terms_accept',
                'lead_track_master.created_date',
                'citytables.name as cityname'
            )
            ->get()
            ->all();
    }
}
