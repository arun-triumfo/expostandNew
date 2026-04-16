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

class CityController extends Controller
{
    use AuthorizesAdminDeletes;

    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));

        $cities = CityTable::query()
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($q2) use ($search) {
                    $q2->where('name', 'like', '%'.$search.'%')
                        ->orWhere('countryname', 'like', '%'.$search.'%');
                });
            })
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString()
            ->through(function (CityTable $row) {
                $selectedIds = array_filter(array_map('intval', explode(',', (string) ($row->show_standbuilder_ids ?? ''))));
                return [
                    'id' => $row->id,
                    'name' => $row->name,
                    'countryname' => $row->countryname,
                    'bannertitle' => $row->bannertitle,
                    'standbuilder_count' => count($selectedIds),
                    'status' => $row->status,
                    'status_label' => $row->status == '1' ? 'Active' : 'Inactive',
                ];
            });

        return Inertia::render('Admin/Cities/Index', [
            'cities' => $cities,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        $countries = CountryTable::query()
            ->where('status', '1')
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn ($c) => ['id' => $c->id, 'name' => $c->name])
            ->values()
            ->all();

        return Inertia::render('Admin/Cities/Create', [
            'countries' => $countries,
            'standbuilders' => $this->standbuilderOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->ensureShowStandbuilderColumn();
        $validated = $this->validatedCity($request, null);

        $payload = [
            'countryid' => $validated['countryid'],
            'countryname' => $validated['countryname'],
            'name' => $validated['name'],
            'value' => $validated['value'],
            'bannertitle' => $validated['bannertitle'] ?? '',
            'bannershrtext' => $validated['bannerdesc'] ?? '',
            'topdesc' => $validated['topdesc'] ?? '',
            'botdesc' => $validated['botdesc'] ?? '',
            'metatitle' => $validated['metatitle'] ?? '',
            'metadesc' => $validated['metadesc'] ?? '',
            'displypage' => $validated['displyhome'] === 'city' ? 'city' : '',
            'status' => $validated['status'],
        ];
        if (Schema::hasColumn('citytables', 'show_standbuilder_ids')) {
            $payload['show_standbuilder_ids'] = $this->toCsv($validated['show_standbuilder_ids'] ?? []);
        }
        CityTable::query()->create($payload);

        return redirect()->route('admin.cities.index');
    }

    public function edit(int $id): Response
    {
        $city = CityTable::query()->findOrFail($id);

        $countries = CountryTable::query()
            ->where('status', '1')
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn ($c) => ['id' => $c->id, 'name' => $c->name])
            ->values()
            ->all();

        return Inertia::render('Admin/Cities/Edit', [
            'city' => [
                'id' => $city->id,
                'name' => $city->name ?? '',
                'value' => $city->value ?? '',
                'countryid' => (string) ($city->countryid ?? ''),
                'countryname' => $city->countryname ?? '',
                'bannertitle' => $city->bannertitle ?? '',
                'bannerdesc' => $city->bannershrtext ?? '',
                'topdesc' => $city->topdesc ?? '',
                'botdesc' => $city->botdesc ?? '',
                'metatitle' => $city->metatitle ?? '',
                'metadesc' => $city->metadesc ?? '',
                'displyhome' => ($city->displypage === 'city') ? 'city' : '',
                'show_standbuilder_ids' => array_values(
                    array_filter(array_map('intval', explode(',', (string) ($city->show_standbuilder_ids ?? ''))))
                ),
                'status' => (string) ($city->status ?? '1'),
            ],
            'countries' => $countries,
            'standbuilders' => $this->standbuilderOptions(),
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $this->ensureShowStandbuilderColumn();
        $city = CityTable::query()->findOrFail($id);

        $validated = $this->validatedCity($request, $city);

        $payload = [
            'countryid' => $validated['countryid'],
            'countryname' => $validated['countryname'],
            'name' => $validated['name'],
            'value' => $validated['value'],
            'bannertitle' => $validated['bannertitle'] ?? '',
            'bannershrtext' => $validated['bannerdesc'] ?? '',
            'topdesc' => $validated['topdesc'] ?? '',
            'botdesc' => $validated['botdesc'] ?? '',
            'metatitle' => $validated['metatitle'] ?? '',
            'metadesc' => $validated['metadesc'] ?? '',
            'displypage' => $validated['displyhome'] === 'city' ? 'city' : '',
            'status' => $validated['status'],
        ];
        if (Schema::hasColumn('citytables', 'show_standbuilder_ids')) {
            $payload['show_standbuilder_ids'] = $this->toCsv($validated['show_standbuilder_ids'] ?? []);
        }
        $city->update($payload);

        return redirect()->route('admin.cities.index');
    }

    public function destroy(Request $request, int $id): RedirectResponse
    {
        $this->authorizeAdminDelete($request);

        $city = CityTable::query()->findOrFail($id);

        if (TradeshowData::query()->where('fair_city', $city->id)->exists()) {
            return redirect()
                ->route('admin.cities.index')
                ->with('error', 'Cannot delete: trade shows reference this city.');
        }

        $city->delete();

        return redirect()->route('admin.cities.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function validatedCity(Request $request, ?CityTable $existing): array
    {
        $valueRule = Rule::unique('citytables', 'value');
        if ($existing) {
            $valueRule = $valueRule->ignore($existing->id);
        }

        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'value' => ['required', 'string', 'max:255', $valueRule],
            'countryid' => ['required', 'exists:countrytables,id'],
            'countryname' => ['required', 'string', 'max:255'],
            'bannertitle' => ['nullable', 'string', 'max:500'],
            'bannerdesc' => ['nullable', 'string'],
            'topdesc' => ['nullable', 'string'],
            'botdesc' => ['nullable', 'string'],
            'metatitle' => ['nullable', 'string'],
            'metadesc' => ['nullable', 'string'],
            'displyhome' => ['nullable', 'string', Rule::in(['', 'city'])],
            'show_standbuilder_ids' => ['nullable', 'array'],
            'show_standbuilder_ids.*' => ['integer', 'exists:standbuildermasters,id'],
            'status' => ['required', 'in:0,1'],
        ]);
    }

    private function ensureShowStandbuilderColumn(): void
    {
        if (Schema::hasColumn('citytables', 'show_standbuilder_ids')) {
            return;
        }

        Schema::table('citytables', function ($table) {
            $table->text('show_standbuilder_ids')->nullable()->after('displypage');
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
