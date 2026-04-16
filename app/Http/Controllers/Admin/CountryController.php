<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\AuthorizesAdminDeletes;
use App\Http\Controllers\Controller;
use App\Models\CityTable;
use App\Models\CountryTable;
use App\Models\StandbuilderMaster;
use App\Models\TradeshowData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CountryController extends Controller
{
    use AuthorizesAdminDeletes;

    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));

        $countries = CountryTable::query()
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($q2) use ($search) {
                    $q2->where('name', 'like', '%'.$search.'%')
                        ->orWhere('continent', 'like', '%'.$search.'%');
                });
            })
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString()
            ->through(function (CountryTable $row) {
                $selectedIds = array_filter(array_map('intval', explode(',', (string) ($row->show_standbuilder_ids ?? ''))));
                return [
                    'id' => $row->id,
                    'continent' => $row->continent,
                    'name' => $row->name,
                    'bannertitle' => $row->bannertitle,
                    'standbuilder_count' => count($selectedIds),
                    'status' => $row->status,
                    'status_label' => $row->status == '1' ? 'Active' : 'Inactive',
                ];
            });

        return Inertia::render('Admin/Countries/Index', [
            'countries' => $countries,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Countries/Create', [
            'standbuilders' => $this->standbuilderOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->ensureShowStandbuilderColumn();
        $validated = $this->validatedCountry($request, null);

        $payload = [
            'continent' => $validated['continent'],
            'name' => $validated['name'],
            'value' => $validated['value'],
            'bannertitle' => $validated['bannertitle'] ?? '',
            'bannershrtext' => $validated['bannerdesc'] ?? '',
            'topdesc' => $validated['topdesc'] ?? '',
            'botdesc' => $validated['botdesc'] ?? '',
            'metatitle' => $validated['metatitle'] ?? '',
            'metadesc' => $validated['metadesc'] ?? '',
            'disply_home' => $validated['displyhome'],
            'status' => $validated['status'],
        ];
        if (Schema::hasColumn('countrytables', 'show_standbuilder_ids')) {
            $payload['show_standbuilder_ids'] = $this->toCsv($validated['show_standbuilder_ids'] ?? []);
        }
        CountryTable::query()->create($payload);

        return redirect()->route('admin.countries.index');
    }

    public function edit(int $id): Response
    {
        $country = CountryTable::query()->findOrFail($id);

        return Inertia::render('Admin/Countries/Edit', [
            'country' => [
                'id' => $country->id,
                'name' => $country->name ?? '',
                'value' => $country->value ?? '',
                'continent' => $country->continent ?? '',
                'bannertitle' => $country->bannertitle ?? '',
                'bannerdesc' => $country->bannershrtext ?? '',
                'topdesc' => $country->topdesc ?? '',
                'botdesc' => $country->botdesc ?? '',
                'metatitle' => $country->metatitle ?? '',
                'metadesc' => $country->metadesc ?? '',
                'displyhome' => (string) ($country->disply_home ?? '0'),
                'show_standbuilder_ids' => array_values(
                    array_filter(array_map('intval', explode(',', (string) ($country->show_standbuilder_ids ?? ''))))
                ),
                'status' => (string) ($country->status ?? '1'),
            ],
            'standbuilders' => $this->standbuilderOptions(),
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $this->ensureShowStandbuilderColumn();
        $country = CountryTable::query()->findOrFail($id);

        $validated = $this->validatedCountry($request, $country);

        $payload = [
            'continent' => $validated['continent'],
            'name' => $validated['name'],
            'value' => $validated['value'],
            'bannertitle' => $validated['bannertitle'] ?? '',
            'bannershrtext' => $validated['bannerdesc'] ?? '',
            'topdesc' => $validated['topdesc'] ?? '',
            'botdesc' => $validated['botdesc'] ?? '',
            'metatitle' => $validated['metatitle'] ?? '',
            'metadesc' => $validated['metadesc'] ?? '',
            'disply_home' => $validated['displyhome'],
            'status' => $validated['status'],
        ];
        if (Schema::hasColumn('countrytables', 'show_standbuilder_ids')) {
            $payload['show_standbuilder_ids'] = $this->toCsv($validated['show_standbuilder_ids'] ?? []);
        }
        $country->update($payload);

        return redirect()->route('admin.countries.index');
    }

    public function destroy(Request $request, int $id): RedirectResponse
    {
        $this->authorizeAdminDelete($request);

        $country = CountryTable::query()->findOrFail($id);

        if (CityTable::query()->where('countryid', $country->id)->exists()) {
            return redirect()
                ->route('admin.countries.index')
                ->with('error', 'Cannot delete: cities are linked to this country.');
        }

        if (TradeshowData::query()->where('fair_country', $country->id)->exists()) {
            return redirect()
                ->route('admin.countries.index')
                ->with('error', 'Cannot delete: trade shows reference this country.');
        }

        $country->delete();

        return redirect()->route('admin.countries.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function validatedCountry(Request $request, ?CountryTable $existing): array
    {
        $valueRule = Rule::unique('countrytables', 'value');
        if ($existing) {
            $valueRule = $valueRule->ignore($existing->id);
        }

        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'value' => ['required', 'string', 'max:255', $valueRule],
            'continent' => ['required', 'string', 'max:100'],
            'bannertitle' => ['nullable', 'string', 'max:500'],
            'bannerdesc' => ['nullable', 'string'],
            'topdesc' => ['nullable', 'string'],
            'botdesc' => ['nullable', 'string'],
            'metatitle' => ['nullable', 'string'],
            'metadesc' => ['nullable', 'string'],
            'displyhome' => ['required', 'in:0,1'],
            'show_standbuilder_ids' => ['nullable', 'array'],
            'show_standbuilder_ids.*' => ['integer', 'exists:standbuildermasters,id'],
            'status' => ['required', 'in:0,1'],
        ]);
    }

    private function ensureShowStandbuilderColumn(): void
    {
        if (Schema::hasColumn('countrytables', 'show_standbuilder_ids')) {
            return;
        }

        Schema::table('countrytables', function ($table) {
            $table->text('show_standbuilder_ids')->nullable()->after('disply_home');
        });
    }

    private function toCsv(array $ids): string
    {
        $filtered = array_values(array_unique(array_filter(array_map('intval', $ids))));

        return implode(',', $filtered);
    }

    /**
     * @return array<int, array{id:int,label:string}>
     */
    private function standbuilderOptions(): array
    {
        return StandbuilderMaster::query()
            ->leftJoin('usermasters', 'standbuildermasters.userid', '=', 'usermasters.id')
            ->where('usermasters.status', '1')
            ->where('standbuildermasters.companyname', '!=', '')
            ->orderBy('standbuildermasters.companyname')
            ->get([
                'standbuildermasters.id',
                'standbuildermasters.companyname',
                'standbuildermasters.cityname',
                'standbuildermasters.countryname',
            ])
            ->map(fn ($row) => [
                'id' => (int) $row->id,
                'label' => trim(
                    (string) $row->companyname.
                    ' - '.
                    (string) ($row->cityname ?: 'N/A').
                    ', '.
                    (string) ($row->countryname ?: 'N/A')
                ),
            ])
            ->values()
            ->all();
    }
}
