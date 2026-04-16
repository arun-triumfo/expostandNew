<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\QuotationImg;
use App\Models\QuoteComment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class QuotationController extends Controller
{
    /** @var list<string> */
    private const INHOUSE_EMAILS = [
        'enquiry@triumfo.de',
        'enquiry@triumfo.us',
        'enquiry@triumfo.ae',
        'enquiry@triumfo.in',
        'enquiry@radonexhibitions.pl',
        'contact@icatchersltd.com',
        'info@radonexhibition.com',
    ];

    /** @var array<string, string> path suffix => stage */
    private const PATH_TO_STAGE = [
        'quotation' => '1',
        'quotation-qualified' => '2',
        'quotation-distributed' => '3',
        'quotation-accepted' => '4',
        'quotation-contacted' => '5',
        'quotation-final' => '6',
        'quotation-commision' => '7',
        'quotation-dead' => '8',
    ];

    public function index(Request $request, ?int $page = null): Response|RedirectResponse
    {
        $path = $request->path();
        $stage = self::PATH_TO_STAGE[$path] ?? '1';

        $currentPage = $page ?? max(1, (int) $request->query('page', 1));

        $perPageRaw = (string) $request->query('per_page', '25');
        $perPage = match ($perPageRaw) {
            '50' => 50,
            '100' => 100,
            '200' => 200,
            'All' => max(1, min(2000, (int) DB::table('getfivequotes')->count())),
            default => 25,
        };

        $search = trim((string) $request->query('search', ''));
        $source = trim((string) $request->query('source', ''));

        $adminEmail = $request->user('admin')?->email;
        $adminRole = strtolower(trim((string) ($request->user('admin')?->role ?? '')));

        $query = $this->baseQuotationsQuery($stage);
        $this->applyEmailScope($query, $stage, $adminEmail);

        if ($source !== '') {
            $query->where('getfivequotes.source', $source);
        }

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('getfivequotes.quote_token_no', 'like', '%'.$search.'%')
                    ->orWhere('getfivequotes.quote_event_name', 'like', '%'.$search.'%')
                    ->orWhere('getfivequotes.quote_name', 'like', '%'.$search.'%')
                    ->orWhere('getfivequotes.quote_email', 'like', '%'.$search.'%')
                    ->orWhere('getfivequotes.quote_mobile', 'like', '%'.$search.'%')
                    ->orWhere('getfivequotes.quote_company_name', 'like', '%'.$search.'%');
            });
        }

        $totalForTab = (clone $query)->count();

        $paginator = $query
            ->orderByDesc('getfivequotes.id')
            ->paginate($perPage, ['*'], 'page', $currentPage)
            ->withQueryString();

        $rows = $paginator->getCollection();
        $quoteIds = $rows->pluck('id')->filter()->unique()->values()->all();

        $commentCounts = [];
        $extraImages = [];
        $suppliersByQuoteToken = [];
        if ($quoteIds !== []) {
            $commentCounts = QuoteComment::query()
                ->whereIn('quote_id', $quoteIds)
                ->selectRaw('quote_id, COUNT(*) as c')
                ->groupBy('quote_id')
                ->pluck('c', 'quote_id')
                ->all();

            $extraImages = QuotationImg::query()
                ->whereIn('getfivequote_id', $quoteIds)
                ->get(['getfivequote_id', 'quote_image'])
                ->groupBy('getfivequote_id')
                ->map(fn ($g) => $g->pluck('quote_image')->values()->all())
                ->all();
        }

        if (in_array($stage, ['4', '5', '6', '7', '8'], true)) {
            $quoteTokens = $rows->pluck('quote_token_no')->filter()->map(fn ($t) => (string) $t)->unique()->values()->all();
            $suppliersByQuoteToken = $this->suppliersByQuoteTokens($quoteTokens);
        }

        $mapped = $rows->map(function ($row) use ($commentCounts, $extraImages, $suppliersByQuoteToken) {
            return $this->mapQuotationRow($row, $commentCounts, $extraImages, $suppliersByQuoteToken);
        });
        $paginator->setCollection($mapped);

        return Inertia::render('Admin/Quotations/Index', [
            'quotations' => $paginator,
            'stats' => $this->globalStats(),
            'tabCount' => $totalForTab,
            'currentStage' => $stage,
            'currentPath' => '/'.$path,
            'currentRouteName' => $request->route()?->getName() ?? 'quotation',
            'filters' => [
                'search' => $search,
                'source' => $source,
                'per_page' => $perPageRaw,
            ],
            'canDelete' => in_array($adminRole, ['admin', 'developers'], true),
        ]);
    }

    public function viewQuoteComment(Request $request): JsonResponse
    {
        $quotid = $request->input('quoteid');

        $comments = QuoteComment::query()
            ->where('quote_id', $quotid)
            ->orderBy('id')
            ->get();

        $rows = $comments->values()->map(function ($row, $i) {
            return [
                'sn' => $i + 1,
                'comment' => (string) $row->comment,
                'user' => (string) $row->commented_by,
                'date' => (string) $row->comment_date,
            ];
        });

        return response()->json(['comments' => $rows]);
    }

    public function insertQuoteComment(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'quote_id' => 'required|integer',
            'comment' => 'required|string|max:2000',
        ]);

        $quotid = (int) $validated['quote_id'];
        $comment = trim($validated['comment']);

        $nextId = ((int) (QuoteComment::query()->max('id') ?? 0)) + 1;

        QuoteComment::query()->insert([
            'id' => $nextId,
            'quote_id' => $quotid,
            'comment' => $comment,
            'commented_by' => $request->user('admin')?->name ?? 'System',
            'comment_date' => now()->format('Y-m-d H:i:s'),
        ]);

        return $this->viewQuoteComment(new Request(['quoteid' => $quotid]));
    }

    public function assignUpdate(Request $request): RedirectResponse
    {
        $request->validate([
            'quoteno' => 'required|string',
            'userid' => 'required|string',
        ]);

        DB::table('getfivequotes')
            ->where('quote_token_no', $request->input('quoteno'))
            ->update(['user_id' => $request->input('userid')]);

        return redirect()->back()->with('success', 'Lead assigned.');
    }

    public function deleteQuote(Request $request): RedirectResponse
    {
        $adminRole = strtolower(trim((string) ($request->user('admin')?->role ?? '')));
        if (! in_array($adminRole, ['admin', 'developers'], true)) {
            return redirect()->back()->with('error', 'Not allowed.');
        }

        $id = (int) $request->query('id', 0);
        if ($id < 1) {
            return redirect()->route('quotation')->with('error', 'Invalid quotation.');
        }

        DB::table('getfivequotes')->where('id', $id)->delete();

        return redirect()->back()->with('success', 'Quotation deleted.');
    }

    public function edit(Request $request): Response|RedirectResponse
    {
        $id = (int) $request->query('id', 0);
        if ($id < 1) {
            return redirect()->route('quotation')->with('error', 'Invalid quotation.');
        }

        $quote = DB::table('getfivequotes')
            ->where('id', $id)
            ->first();

        if (! $quote) {
            return redirect()->route('quotation')->with('error', 'Quotation not found.');
        }

        $countries = DB::table('countrytables')
            ->where('status', '1')
            ->orderBy('name')
            ->get(['id', 'name']);

        $cities = DB::table('citytables')
            ->where('status', '1')
            ->orderBy('name')
            ->get(['id', 'name']);

        $comments = QuoteComment::query()
            ->where('quote_id', (int) $quote->id)
            ->orderByDesc('id')
            ->get(['comment', 'commented_by', 'comment_date'])
            ->map(fn ($c) => [
                'comment' => (string) ($c->comment ?? ''),
                'commented_by' => (string) ($c->commented_by ?? ''),
                'comment_date' => (string) ($c->comment_date ?? ''),
            ])
            ->values()
            ->all();

        return Inertia::render('Admin/Quotations/Edit', [
            'quotation' => [
                'id' => (int) $quote->id,
                'quote_token_no' => (string) ($quote->quote_token_no ?? ''),
                'quote_name' => (string) ($quote->quote_name ?? ''),
                'quote_email' => (string) ($quote->quote_email ?? ''),
                'quote_mobile' => (string) ($quote->quote_mobile ?? ''),
                'quote_company_name' => (string) ($quote->quote_company_name ?? ''),
                'quote_event_name' => (string) ($quote->quote_event_name ?? ''),
                'quote_event_desc' => (string) ($quote->quote_event_desc ?? ''),
                'quote_event_date' => (string) ($quote->quote_event_date ?? ''),
                'quote_event_end_date' => (string) ($quote->quote_event_end_date ?? ''),
                'quote_stand_area' => (string) ($quote->quote_stand_area ?? ''),
                'quote_area_type' => (string) ($quote->quote_area_type ?? ''),
                'quote_estimate_from' => (string) ($quote->quote_estimate_from ?? ''),
                'quote_estimate_to' => (string) ($quote->quote_estimate_to ?? ''),
                'quote_currency_type' => (string) ($quote->quote_currency_type ?? ''),
                'status' => (string) ($quote->status ?? ''),
                'source' => (string) ($quote->source ?? ''),
                'quote_event_country' => (string) ($quote->quote_event_country ?? ''),
                'quote_event_city' => (string) ($quote->quote_event_city ?? ''),
                'company_website' => (string) ($quote->company_website ?? ''),
                'contact_country' => (string) ($quote->contact_country ?? ''),
                'stage' => (string) ($quote->stage ?? ''),
                'valid_lead_status' => (string) ($quote->valid_lead_status ?? '0'),
            ],
            'countries' => $countries,
            'cities' => $cities,
            'comments' => $comments,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id' => 'required|integer|min:1',
            'quote_name' => 'nullable|string|max:255',
            'quote_email' => 'nullable|email|max:255',
            'quote_mobile' => 'nullable|string|max:50',
            'quote_company_name' => 'nullable|string|max:255',
            'quote_event_name' => 'nullable|string|max:255',
            'quote_event_desc' => 'nullable|string|max:5000',
            'quote_event_date' => 'nullable|string|max:50',
            'quote_event_end_date' => 'nullable|string|max:50',
            'quote_stand_area' => 'nullable|string|max:50',
            'quote_area_type' => 'nullable|string|max:50',
            'quote_estimate_from' => 'nullable|string|max:50',
            'quote_estimate_to' => 'nullable|string|max:50',
            'quote_currency_type' => 'nullable|string|max:20',
            'status' => 'nullable|string|max:100',
            'source' => 'nullable|string|max:100',
            'quote_event_country' => 'nullable|string|max:50',
            'quote_event_city' => 'nullable|string|max:50',
            'company_website' => 'nullable|string|max:255',
            'contact_country' => 'nullable|string|max:50',
            'stage' => 'nullable|string|max:20',
            'valid_lead_status' => 'nullable|string|max:20',
            'varified_by' => 'nullable|string|max:255',
        ]);

        $id = (int) $validated['id'];
        $exists = DB::table('getfivequotes')->where('id', $id)->exists();
        if (! $exists) {
            return redirect()->route('quotation')->with('error', 'Quotation not found.');
        }

        DB::table('getfivequotes')
            ->where('id', $id)
            ->update([
                'quote_name' => trim((string) ($validated['quote_name'] ?? '')),
                'quote_email' => trim((string) ($validated['quote_email'] ?? '')),
                'quote_mobile' => trim((string) ($validated['quote_mobile'] ?? '')),
                'quote_company_name' => trim((string) ($validated['quote_company_name'] ?? '')),
                'quote_event_name' => trim((string) ($validated['quote_event_name'] ?? '')),
                'quote_event_desc' => trim((string) ($validated['quote_event_desc'] ?? '')),
                'quote_event_date' => trim((string) ($validated['quote_event_date'] ?? '')),
                'quote_event_end_date' => trim((string) ($validated['quote_event_end_date'] ?? '')),
                'quote_stand_area' => trim((string) ($validated['quote_stand_area'] ?? '')),
                'quote_area_type' => trim((string) ($validated['quote_area_type'] ?? '')),
                'quote_estimate_from' => trim((string) ($validated['quote_estimate_from'] ?? '')),
                'quote_estimate_to' => trim((string) ($validated['quote_estimate_to'] ?? '')),
                'quote_currency_type' => trim((string) ($validated['quote_currency_type'] ?? '')),
                'status' => trim((string) ($validated['status'] ?? '')),
                'source' => trim((string) ($validated['source'] ?? '')),
                'quote_event_country' => trim((string) ($validated['quote_event_country'] ?? '')),
                'quote_event_city' => trim((string) ($validated['quote_event_city'] ?? '')),
                'company_website' => trim((string) ($validated['company_website'] ?? '')),
                'contact_country' => trim((string) ($validated['contact_country'] ?? '')),
                'stage' => trim((string) ($validated['stage'] ?? '')),
                'valid_lead_status' => trim((string) ($validated['valid_lead_status'] ?? '')),
                'varified_by' => trim((string) ($validated['varified_by'] ?? ($request->user('admin')?->name ?? ''))),
                'updated_at' => now(),
            ]);

        return redirect()->back()->with('success', 'Quotation updated successfully.');
    }

    public function sendQuotation(Request $request): Response|RedirectResponse
    {
        $id = (int) $request->query('id', 0);
        if ($id < 1) {
            return redirect()->route('quotation-qualified')->with('error', 'Invalid quotation.');
        }

        $quote = DB::table('getfivequotes')
            ->leftJoin('countrytables', 'getfivequotes.quote_event_country', '=', 'countrytables.id')
            ->leftJoin('citytables', 'getfivequotes.quote_event_city', '=', 'citytables.id')
            ->select(
                'getfivequotes.id',
                'getfivequotes.quote_token_no',
                'getfivequotes.quote_name',
                'getfivequotes.quote_email',
                'getfivequotes.quote_mobile',
                'getfivequotes.quote_event_name',
                'getfivequotes.quote_event_date',
                'getfivequotes.quote_event_end_date',
                'getfivequotes.quote_stand_area',
                'getfivequotes.quote_area_type',
                'getfivequotes.quote_estimate_from',
                'getfivequotes.quote_estimate_to',
                'getfivequotes.quote_currency_type',
                'getfivequotes.quote_company_name',
                'getfivequotes.source',
                'getfivequotes.stage',
                'countrytables.name as countryname',
                'citytables.name as cityname'
            )
            ->where('getfivequotes.id', $id)
            ->first();

        if (! $quote) {
            return redirect()->route('quotation-qualified')->with('error', 'Quotation not found.');
        }

        $packagesRaw = $request->query('packages', []);
        if (is_array($packagesRaw)) {
            $packages = collect($packagesRaw)
                ->map(fn ($p) => strtoupper(trim((string) $p)))
                ->filter()
                ->unique()
                ->values()
                ->all();
        } else {
            $single = strtoupper(trim((string) $packagesRaw));
            $packages = $single !== '' ? [$single] : [];
        }
        $continent = trim((string) $request->query('continent', ''));
        $country = trim((string) $request->query('country', ''));
        $city = trim((string) $request->query('city', ''));
        $inhouse = trim((string) $request->query('inhouse', ''));
        $standbuilderType = trim((string) $request->query('standbuilder_type', ''));
        $search = trim((string) $request->query('search', ''));

        $standbuildersQuery = DB::table('standbuildermasters')
            ->leftJoin('usermasters', 'standbuildermasters.userid', '=', 'usermasters.id')
            ->leftJoin('supplier_lead_track_master', function ($join) {
                $join->on('usermasters.id', '=', 'supplier_lead_track_master.supplier_id')
                    ->where('supplier_lead_track_master.status', '=', 'active');
            })
            ->select(
                'standbuildermasters.userid',
                'standbuildermasters.companyname',
                'standbuildermasters.countryname',
                'standbuildermasters.cityname',
                'standbuildermasters.packgaename',
                'standbuildermasters.continent',
                'usermasters.email',
                'usermasters.phone',
                'usermasters.status as user_status',
                'usermasters.verifystatus',
                DB::raw('COALESCE(supplier_lead_track_master.lead_pending, 0) as lead_pending')
            )
            ->whereNotNull('usermasters.email')
            ->where('usermasters.email', '!=', '')
            ->where('usermasters.status', '1');

        if ($packages !== []) {
            if (in_array('ANNUAL', $packages, true)) {
                $standbuildersQuery
                    ->where('standbuildermasters.packgaename', 'ANNUAL')
                    ->where('supplier_lead_track_master.lead_pending', '>', 0);
            } else {
                $standbuildersQuery->whereIn('standbuildermasters.packgaename', $packages);
            }
        }
        if ($continent !== '') {
            $standbuildersQuery->where('standbuildermasters.continent', $continent);
        }
        if ($country !== '') {
            $standbuildersQuery->where('standbuildermasters.countryname', $country);
        }
        if ($city !== '') {
            $standbuildersQuery->where('standbuildermasters.cityname', $city);
        }
        if ($search !== '') {
            $standbuildersQuery->where(function ($q) use ($search) {
                $q->where('standbuildermasters.companyname', 'like', '%'.$search.'%')
                    ->orWhere('usermasters.email', 'like', '%'.$search.'%')
                    ->orWhere('usermasters.phone', 'like', '%'.$search.'%');
            });
        }
        if ($standbuilderType === 'local') {
            $standbuildersQuery
                ->where('standbuildermasters.countryname', (string) ($quote->countryname ?? ''))
                ->where('standbuildermasters.cityname', (string) ($quote->cityname ?? ''));
        }
        if ($standbuilderType === 'serviceprovider') {
            $standbuildersQuery->where('standbuildermasters.packgaename', '!=', 'FREE');
        }

        if ($inhouse === 'yes') {
            $standbuildersQuery->whereIn('usermasters.email', self::INHOUSE_EMAILS);
        } else {
            $standbuildersQuery->whereNotIn('usermasters.email', self::INHOUSE_EMAILS);
        }

        $standbuilders = $standbuildersQuery
            ->orderBy('standbuildermasters.packgaename')
            ->orderBy('standbuildermasters.companyname')
            ->limit(300)
            ->get()
            ->map(fn ($row) => [
                'userid' => (int) ($row->userid ?? 0),
                'companyname' => (string) ($row->companyname ?? ''),
                'email' => (string) ($row->email ?? ''),
                'phone' => (string) ($row->phone ?? ''),
                'countryname' => (string) ($row->countryname ?? ''),
                'cityname' => (string) ($row->cityname ?? ''),
                'packgaename' => (string) ($row->packgaename ?? ''),
                'lead_pending' => (int) ($row->lead_pending ?? 0),
                'status' => (string) ($row->user_status ?? ''),
                'verifystatus' => (string) ($row->verifystatus ?? ''),
            ])
            ->values()
            ->all();

        $countries = DB::table('countrytables')
            ->where('status', '1')
            ->orderBy('name')
            ->pluck('name')
            ->values()
            ->all();

        $cities = DB::table('citytables')
            ->where('status', '1')
            ->orderBy('name')
            ->pluck('name')
            ->values()
            ->all();

        return Inertia::render('Admin/Quotations/Send', [
            'quotation' => [
                'id' => (int) $quote->id,
                'quote_token_no' => (string) ($quote->quote_token_no ?? ''),
                'quote_name' => (string) ($quote->quote_name ?? ''),
                'quote_email' => (string) ($quote->quote_email ?? ''),
                'quote_mobile' => (string) ($quote->quote_mobile ?? ''),
                'quote_event_name' => (string) ($quote->quote_event_name ?? ''),
                'quote_event_date' => (string) ($quote->quote_event_date ?? ''),
                'quote_event_end_date' => (string) ($quote->quote_event_end_date ?? ''),
                'quote_stand_area' => (string) ($quote->quote_stand_area ?? ''),
                'quote_area_type' => (string) ($quote->quote_area_type ?? ''),
                'quote_estimate_from' => (string) ($quote->quote_estimate_from ?? ''),
                'quote_estimate_to' => (string) ($quote->quote_estimate_to ?? ''),
                'quote_currency_type' => (string) ($quote->quote_currency_type ?? ''),
                'quote_company_name' => (string) ($quote->quote_company_name ?? ''),
                'source' => (string) ($quote->source ?? ''),
                'countryname' => (string) ($quote->countryname ?? ''),
                'cityname' => (string) ($quote->cityname ?? ''),
            ],
            'standbuilders' => $standbuilders,
            'filters' => [
                'packages' => $packages,
                'continent' => $continent,
                'country' => $country,
                'city' => $city,
                'inhouse' => $inhouse,
                'standbuilder_type' => $standbuilderType,
                'search' => $search,
            ],
            'countries' => $countries,
            'cities' => $cities,
        ]);
    }

    public function processSendQuotation(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id' => 'required|integer|min:1',
            'supplier_ids' => 'required|array|min:1',
            'supplier_ids.*' => 'integer|min:1',
        ]);

        $id = (int) $validated['id'];
        $quote = DB::table('getfivequotes')->where('id', $id)->first(['quote_token_no']);
        if (! $quote) {
            return redirect()->route('quotation-qualified')->with('error', 'Quotation not found.');
        }

        $supplierIds = collect($validated['supplier_ids'])->map(fn ($v) => (int) $v)->filter(fn ($v) => $v > 0)->unique()->values();
        if ($supplierIds->isEmpty()) {
            return back()->with('error', 'Please select at least one stand builder.');
        }

        $suppliers = DB::table('usermasters')
            ->whereIn('id', $supplierIds->all())
            ->whereNotNull('email')
            ->where('email', '!=', '')
            ->pluck('email', 'id');

        $createdBy = $request->user('admin')?->id;
        foreach ($supplierIds as $supplierId) {
            $email = (string) ($suppliers[$supplierId] ?? '');
            if ($email === '') {
                continue;
            }

            $exists = DB::table('lead_track_master')
                ->where('quote_token_no', (string) $quote->quote_token_no)
                ->where('supplier_id', $supplierId)
                ->where('supplier_email', $email)
                ->exists();

            if (! $exists) {
                DB::table('lead_track_master')->insert([
                    'quote_token_no' => (string) $quote->quote_token_no,
                    'status' => 'sent',
                    'supplier_id' => $supplierId,
                    'supplier_email' => $email,
                    'created_by' => $createdBy,
                ]);
            }
        }

        DB::table('getfivequotes')
            ->where('id', $id)
            ->update([
                'stage' => '3',
                'status' => 'Distributed',
                'assigneddate' => now()->format('Y-m-d'),
                'updated_at' => now(),
            ]);

        return redirect()->route('quotation-distributed')->with('success', 'Lead sent successfully to selected stand builders.');
    }

    public function viewQuotation(Request $request): Response|RedirectResponse
    {
        $rawToken = trim((string) $request->query('id', ''));
        if ($rawToken === '') {
            return redirect()->route('quotation')->with('error', 'Invalid quotation token.');
        }

        $trimmedToken = ltrim($rawToken, '#');
        $tokenCandidates = array_values(array_unique(array_filter([
            $rawToken,
            $trimmedToken,
            '#'.$trimmedToken,
        ])));

        $quoteToken = DB::table('getfivequotes')
            ->whereIn('quote_token_no', $tokenCandidates)
            ->value('quote_token_no');

        if (! $quoteToken) {
            return redirect()->route('quotation')->with('error', 'Quotation not found.');
        }

        $quote = DB::table('getfivequotes')
            ->leftJoin('countrytables', 'getfivequotes.quote_event_country', '=', 'countrytables.id')
            ->leftJoin('citytables', 'getfivequotes.quote_event_city', '=', 'citytables.id')
            ->select(
                'getfivequotes.id',
                'getfivequotes.quote_token_no',
                'getfivequotes.quote_event_name',
                'getfivequotes.quote_event_date',
                'getfivequotes.quote_event_end_date',
                'getfivequotes.quote_stand_area',
                'getfivequotes.quote_area_type',
                'getfivequotes.quote_estimate_from',
                'getfivequotes.quote_estimate_to',
                'getfivequotes.quote_currency_type',
                'countrytables.name as countryname',
                'citytables.name as cityname'
            )
            ->where('getfivequotes.quote_token_no', $quoteToken)
            ->first();

        if (! $quote) {
            return redirect()->route('quotation')->with('error', 'Quotation not found.');
        }

        $leadRows = DB::table('lead_track_master')
            ->leftJoin('usermasters', 'usermasters.id', '=', 'lead_track_master.supplier_id')
            ->leftJoin('standbuildermasters', 'standbuildermasters.userid', '=', 'lead_track_master.supplier_id')
            ->leftJoin('package_tracking_master', function ($join) {
                $join->on('package_tracking_master.stand_bulider_master_id', '=', 'usermasters.id')
                    ->where('package_tracking_master.status', 'active');
            })
            ->leftJoin('packagemasters', 'packagemasters.id', '=', 'package_tracking_master.package_master_id')
            ->where('lead_track_master.quote_token_no', $quoteToken)
            ->select(
                'lead_track_master.quote_token_no',
                'lead_track_master.supplier_id',
                'lead_track_master.supplier_email',
                'lead_track_master.status',
                'lead_track_master.terms_accept',
                'lead_track_master.created_date',
                'usermasters.phone',
                'standbuildermasters.companyname',
                'standbuildermasters.countryname',
                'standbuildermasters.cityname',
                DB::raw('COALESCE(packagemasters.package_name, standbuildermasters.packgaename) as package_name'),
                DB::raw('COALESCE(packagemasters.package_color, standbuildermasters.pack_color) as package_color')
            )
            ->orderByDesc('lead_track_master.id')
            ->get();

        $mapped = $leadRows->map(fn ($row) => [
            'quote_token_no' => (string) ($row->quote_token_no ?? ''),
            'supplier_id' => (int) ($row->supplier_id ?? 0),
            'companyname' => (string) ($row->companyname ?? ''),
            'email' => (string) ($row->supplier_email ?? ''),
            'phone' => (string) ($row->phone ?? ''),
            'countryname' => (string) ($row->countryname ?? ''),
            'cityname' => (string) ($row->cityname ?? ''),
            'package_name' => (string) ($row->package_name ?? ''),
            'package_color' => (string) ($row->package_color ?? ''),
            'status' => (string) ($row->status ?? ''),
            'terms_accept' => (string) ($row->terms_accept ?? ''),
            'created_date' => (string) ($row->created_date ?? ''),
        ])->values();

        return Inertia::render('Admin/Quotations/View', [
            'quotation' => [
                'quote_token_no' => (string) ($quote->quote_token_no ?? ''),
                'quote_event_name' => (string) ($quote->quote_event_name ?? ''),
                'quote_event_date' => (string) ($quote->quote_event_date ?? ''),
                'quote_event_end_date' => (string) ($quote->quote_event_end_date ?? ''),
                'countryname' => (string) ($quote->countryname ?? ''),
                'cityname' => (string) ($quote->cityname ?? ''),
                'quote_stand_area' => (string) ($quote->quote_stand_area ?? ''),
                'quote_area_type' => (string) ($quote->quote_area_type ?? ''),
                'quote_estimate_from' => (string) ($quote->quote_estimate_from ?? ''),
                'quote_estimate_to' => (string) ($quote->quote_estimate_to ?? ''),
                'quote_currency_type' => (string) ($quote->quote_currency_type ?? ''),
            ],
            'sentlead' => $mapped->where('status', 'sent')->values(),
            'acceptlead' => $mapped->where('status', 'respond')->where('terms_accept', 'accept')->values(),
            'rjctdlead' => $mapped->where('status', 'respond')->where('terms_accept', 'reject')->values(),
            'noresponselead' => $mapped->where('status', 'sent')->where('terms_accept', 'accept')->values(),
            'countsent' => $mapped->where('status', 'sent')->count(),
            'countaccpt' => $mapped->where('status', 'respond')->where('terms_accept', 'accept')->count(),
            'countrjct' => $mapped->where('status', 'respond')->where('terms_accept', 'reject')->count(),
            'countnorsponse' => $mapped->where('status', 'sent')->where('terms_accept', 'accept')->count(),
        ]);
    }

    /**
     * @return array<string, int>
     */
    private function globalStats(): array
    {
        return [
            'gettotal' => (int) DB::table('getfivequotes')->count(),
            'getpending' => (int) DB::table('getfivequotes')->where('stage', '1')->count(),
            'getdirect' => (int) DB::table('getfivequotes')->where('source', 'Direct')->count(),
            'getinhouse' => (int) DB::table('getfivequotes')->where('source', 'inhouse')->count(),
            'getagency' => (int) DB::table('getfivequotes')->where('source', 'Agency')->count(),
            'getorganiser' => (int) DB::table('getfivequotes')->where('source', 'Organizer')->count(),
            'getaccepted' => (int) DB::table('getfivequotes')->where('stage', '4')->count(),
            'getdsitributed' => (int) DB::table('getfivequotes')->where('stage', '3')->count(),
            'getdead' => (int) DB::table('getfivequotes')->where('stage', '8')->count(),
        ];
    }

    private function baseQuotationsQuery(string $stage)
    {
        $q = DB::table('getfivequotes');

        if ($stage === '1') {
            $q->leftJoin('countrytables', 'getfivequotes.quote_event_country', '=', 'countrytables.id')
                ->leftJoin('citytables', 'getfivequotes.quote_event_city', '=', 'citytables.id');
        } else {
            $q->join('countrytables', 'getfivequotes.quote_event_country', '=', 'countrytables.id')
                ->join('citytables', 'getfivequotes.quote_event_city', '=', 'citytables.id');
        }

        return $q->where('getfivequotes.stage', $stage)
            ->select(
                'getfivequotes.id',
                'getfivequotes.quote_token_no',
                'getfivequotes.quote_name',
                'getfivequotes.quote_email',
                'getfivequotes.quote_mobile',
                'getfivequotes.quote_event_name',
                'getfivequotes.quote_event_desc',
                'getfivequotes.quote_estimate_from',
                'getfivequotes.quote_estimate_to',
                'getfivequotes.quote_currency_type',
                'getfivequotes.quote_stand_area',
                'getfivequotes.quote_area_type',
                'getfivequotes.quote_company_name',
                'getfivequotes.quote_attached_file',
                'getfivequotes.quote_event_country',
                'getfivequotes.quote_event_city',
                'getfivequotes.status',
                'getfivequotes.stage',
                'getfivequotes.source',
                'getfivequotes.quote_event_date',
                'getfivequotes.quote_event_end_date',
                'getfivequotes.user_id',
                'getfivequotes.is_featured',
                'getfivequotes.company_website',
                'getfivequotes.contact_country',
                'getfivequotes.lead_type',
                'getfivequotes.varified_by',
                'getfivequotes.updated_by',
                'getfivequotes.assigneddate',
                'countrytables.name as countryname',
                'citytables.name as cityname',
                'getfivequotes.created_at',
                'getfivequotes.updated_at'
            );
    }

    private function applyEmailScope($query, string $stage, ?string $email): void
    {
        if ($email === null || $email === '') {
            return;
        }

        if ($email === 'marketing@expostandzone.com') {
            if ($stage === '1') {
                $query->where(function ($q) {
                    $q->whereNull('getfivequotes.user_id')
                        ->orWhere('getfivequotes.user_id', '')
                        ->orWhere('getfivequotes.user_id', 'Divyanshi')
                        ->orWhere('getfivequotes.user_id', '40')
                        ->orWhere('getfivequotes.user_id', '2');
                });
            } else {
                $query->where(function ($q) {
                    $q->where('getfivequotes.user_id', 'Divyanshi')
                        ->orWhere('getfivequotes.user_id', '40')
                        ->orWhere('getfivequotes.user_id', '2');
                });
            }
        } elseif ($email === 'bd@expostandzone.com') {
            $query->where(function ($q) {
                $q->where('getfivequotes.user_id', 'Meenakshi')
                    ->orWhere('getfivequotes.user_id', '6');
            });
        }
    }

    /**
     * @param  array<int|string, int>  $commentCounts
     * @param  array<int, list<string>>  $extraImages
     */
    private function mapQuotationRow(object $row, array $commentCounts, array $extraImages, array $suppliersByQuoteToken = []): array
    {
        $id = (int) $row->id;
        $quoteToken = (string) ($row->quote_token_no ?? '');

        return [
            'id' => $id,
            'quote_token_no' => $quoteToken,
            'source' => (string) ($row->source ?? ''),
            'created_at' => $row->created_at,
            'updated_at' => $row->updated_at,
            'quote_event_name' => (string) ($row->quote_event_name ?? ''),
            'quote_event_city' => $row->quote_event_city,
            'cityname' => (string) ($row->cityname ?? ''),
            'quote_event_date' => (string) ($row->quote_event_date ?? ''),
            'quote_event_end_date' => (string) ($row->quote_event_end_date ?? ''),
            'quote_stand_area' => (string) ($row->quote_stand_area ?? ''),
            'quote_area_type' => (string) ($row->quote_area_type ?? ''),
            'quote_estimate_from' => (string) ($row->quote_estimate_from ?? ''),
            'quote_estimate_to' => (string) ($row->quote_estimate_to ?? ''),
            'quote_currency_type' => (string) ($row->quote_currency_type ?? ''),
            'quote_attached_file' => (string) ($row->quote_attached_file ?? ''),
            'quote_company_name' => (string) ($row->quote_company_name ?? ''),
            'quote_name' => (string) ($row->quote_name ?? ''),
            'quote_mobile' => (string) ($row->quote_mobile ?? ''),
            'quote_email' => (string) ($row->quote_email ?? ''),
            'user_id' => $row->user_id,
            'varified_by' => (string) ($row->varified_by ?? ''),
            'status' => (string) ($row->status ?? ''),
            'comment_count' => (int) ($commentCounts[$id] ?? 0),
            'extra_image_files' => $extraImages[$id] ?? $extraImages[(string) $id] ?? [],
            'suppliers' => $suppliersByQuoteToken[$quoteToken] ?? [],
        ];
    }

    /**
     * @param  list<string>  $quoteTokens
     * @return array<string, list<array{companyname:string,supplier_id:int,email:string,phone:string,packgaename:string,pack_color:string}>>
     */
    private function suppliersByQuoteTokens(array $quoteTokens): array
    {
        if ($quoteTokens === []) {
            return [];
        }

        $rows = DB::table('lead_track_master')
            ->leftJoin('standbuildermasters', 'standbuildermasters.userid', '=', 'lead_track_master.supplier_id')
            ->leftJoin('usermasters', 'usermasters.id', '=', 'lead_track_master.supplier_id')
            ->whereIn('lead_track_master.quote_token_no', $quoteTokens)
            ->where('lead_track_master.terms_accept', 'accept')
            ->where('lead_track_master.status', 'respond')
            ->select(
                'lead_track_master.quote_token_no',
                'standbuildermasters.companyname',
                'standbuildermasters.packgaename',
                'standbuildermasters.pack_color',
                'usermasters.id as supplier_id',
                'usermasters.email',
                'usermasters.phone'
            )
            ->get();

        $grouped = [];
        foreach ($rows as $row) {
            $token = (string) ($row->quote_token_no ?? '');
            if ($token === '') {
                continue;
            }
            if (! isset($grouped[$token])) {
                $grouped[$token] = [];
            }
            if (count($grouped[$token]) >= 5) {
                continue;
            }
            $grouped[$token][] = [
                'companyname' => (string) ($row->companyname ?? ''),
                'supplier_id' => (int) ($row->supplier_id ?? 0),
                'email' => (string) ($row->email ?? ''),
                'phone' => (string) ($row->phone ?? ''),
                'packgaename' => (string) ($row->packgaename ?? ''),
                'pack_color' => (string) ($row->pack_color ?? ''),
            ];
        }

        return $grouped;
    }
}
