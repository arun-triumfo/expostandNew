import AdminLayout from '@/Layouts/AdminLayout';
import AdminSearchableSelect from '@/Components/Admin/AdminSearchableSelect';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const PACKAGE_OPTIONS = ['GOLD', 'PLATINUM', 'SILVER', 'STARTER', 'FREE', 'ANNUAL'];
const CONTINENTS = ['Africa', 'Asia', 'Australia', 'Europe', 'North America', 'South America'];

export default function Send({ quotation, standbuilders = [], filters = {}, countries = [], cities = [] }) {
    const normalizedPackages = Array.isArray(filters?.packages) ? filters.packages : filters?.packages ? [filters.packages] : [];
    const hasSearched = Boolean(
        normalizedPackages.length ||
            filters?.continent ||
            filters?.country ||
            filters?.city ||
            filters?.search ||
            filters?.inhouse === 'yes' ||
            filters?.standbuilder_type,
    );
    const [selected, setSelected] = useState([]);
    const [query, setQuery] = useState({
        packages: normalizedPackages,
        continent: filters?.continent ?? '',
        country: filters?.country ?? '',
        city: filters?.city ?? '',
        inhouse: filters?.inhouse ?? '',
        standbuilder_type: filters?.standbuilder_type ?? '',
        search: filters?.search ?? '',
    });

    const { data, setData, post, processing } = useForm({
        id: quotation?.id ?? '',
        supplier_ids: [],
    });

    const allSelected = useMemo(
        () => standbuilders.length > 0 && selected.length === standbuilders.length,
        [selected, standbuilders.length],
    );

    const toggleAll = () => {
        if (allSelected) {
            setSelected([]);
            return;
        }
        setSelected(standbuilders.map((sb) => sb.userid));
    };

    const toggleOne = (id) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const applyFilters = (e) => {
        e.preventDefault();
        router.get(
            route('send-quotation'),
            {
                id: quotation?.id,
                packages: query.packages.length ? query.packages : undefined,
                continent: query.continent || undefined,
                country: query.country || undefined,
                city: query.city || undefined,
                inhouse: query.inhouse || undefined,
                standbuilder_type: query.standbuilder_type || undefined,
                search: query.search || undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const onSend = (e) => {
        e.preventDefault();
        setData('supplier_ids', selected);
        post(route('send-quotation.process'));
    };

    const packageSelectOptions = PACKAGE_OPTIONS.map((p) => ({ value: p, label: p }));
    const continentOptions = CONTINENTS.map((c) => ({ value: c, label: c }));
    const countryOptions = countries.map((c) => ({ value: c, label: c }));
    const cityOptions = cities.map((c) => ({ value: c, label: c }));
    const inhouseOptions = [
        { value: '', label: 'Send Inhouse ?' },
        { value: 'yes', label: 'YES' },
    ];
    const standbuilderTypeOptions = [
        { value: '', label: 'Stand Builder Type' },
        { value: 'local', label: 'Local' },
        { value: 'serviceprovider', label: 'Service Provider' },
    ];

    return (
        <AdminLayout title="Send quotation">
            <Head title={`Send quotation ${quotation?.quote_token_no ?? ''}`} />

            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-lg font-semibold text-slate-900">Send lead #{quotation?.quote_token_no}</h1>
                <Link href={route('quotation-qualified')} className="rounded border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
                    Back to qualified leads
                </Link>
            </div>

            <div className="mb-5 rounded-2xl border border-teal-700/50 bg-slate-50 shadow-sm">
                <div className="inline-block rounded-br border-b border-r border-teal-700/60 bg-teal-800 px-4 py-1 text-sm font-semibold text-white">Lead Details</div>
                <div className="p-4">
                    <div className="rounded-2xl border border-teal-700/50 bg-white p-3">
                        <table className="w-full border-collapse text-sm">
                            <tbody>
                                <tr>
                                    <td className="border border-slate-200 px-2 py-1.5">Lead Token : {quotation?.quote_token_no}</td>
                                    <td className="border border-slate-200 px-2 py-1.5">Lead Source : {quotation?.source}</td>
                                    <td className="border border-slate-200 px-2 py-1.5">Event Name : {quotation?.quote_event_name}</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-200 px-2 py-1.5">Event Country : {quotation?.countryname}</td>
                                    <td className="border border-slate-200 px-2 py-1.5">Event City : {quotation?.cityname}</td>
                                    <td className="border border-slate-200 px-2 py-1.5">
                                        Stand Size : {quotation?.quote_stand_area} {quotation?.quote_area_type}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-200 px-2 py-1.5">Event Start Date : {quotation?.quote_event_date}</td>
                                    <td className="border border-slate-200 px-2 py-1.5">Event End Date : {quotation?.quote_event_end_date}</td>
                                    <td className="border border-slate-200 px-2 py-1.5">
                                        Budget : {quotation?.quote_estimate_from} - {quotation?.quote_estimate_to} {quotation?.quote_currency_type}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-200 px-2 py-1.5">Contact Name : {quotation?.quote_name}</td>
                                    <td className="border border-slate-200 px-2 py-1.5">Phone : {quotation?.quote_mobile}</td>
                                    <td className="border border-slate-200 px-2 py-1.5">Email : {quotation?.quote_email}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="mb-4 rounded-2xl border border-teal-700/50 bg-slate-50 shadow-sm">
                <div className="inline-block rounded-br border-b border-r border-teal-700/60 bg-teal-800 px-4 py-1 text-sm font-semibold text-white">
                    Search and Select Stand Builders
                </div>
                <form onSubmit={applyFilters} className="p-4">
                    <div className="rounded-2xl border border-teal-700/50 bg-white p-4">
                        <div className="grid gap-3 md:grid-cols-3">
                            <AdminSearchableSelect
                                options={inhouseOptions}
                                value={query.inhouse}
                                onChange={(v) => setQuery((s) => ({ ...s, inhouse: v }))}
                                placeholder="Send Inhouse ?"
                            />
                            <AdminSearchableSelect
                                options={packageSelectOptions}
                                value={query.packages}
                                onChange={(v) => setQuery((s) => ({ ...s, packages: v }))}
                                isMulti
                                placeholder="Select Package"
                            />
                            <AdminSearchableSelect
                                options={continentOptions}
                                value={query.continent}
                                onChange={(v) => setQuery((s) => ({ ...s, continent: v }))}
                                placeholder="Select Continent"
                            />
                            <AdminSearchableSelect
                                options={countryOptions}
                                value={query.country}
                                onChange={(v) => setQuery((s) => ({ ...s, country: v }))}
                                placeholder="Select Country"
                            />
                            <AdminSearchableSelect
                                options={cityOptions}
                                value={query.city}
                                onChange={(v) => setQuery((s) => ({ ...s, city: v }))}
                                placeholder="Select City"
                            />
                            <AdminSearchableSelect
                                options={standbuilderTypeOptions}
                                value={query.standbuilder_type}
                                onChange={(v) => setQuery((s) => ({ ...s, standbuilder_type: v }))}
                                placeholder="Stand Builder Type"
                            />
                        </div>
                        <div className="mt-3">
                            <input
                                type="text"
                                value={query.search}
                                onChange={(e) => setQuery((s) => ({ ...s, search: e.target.value }))}
                                placeholder="Search company, email, phone"
                                className="w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-700"
                            />
                        </div>
                        <div className="mt-4 text-center">
                            <button type="submit" className="rounded bg-teal-700 px-6 py-2 text-sm font-semibold text-white hover:bg-teal-800">
                                Search Your Selection
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <form onSubmit={onSend} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm text-slate-600">
                        {standbuilders.length} results | {selected.length} selected
                    </p>
                    <button type="submit" disabled={processing || selected.length === 0} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                        {processing ? 'Sending...' : 'Send Lead'}
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                        <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                            <tr>
                                <th className="px-3 py-2">
                                    <input type="checkbox" checked={allSelected} onChange={toggleAll} />
                                </th>
                                <th className="px-3 py-2">Company</th>
                                <th className="px-3 py-2">Email</th>
                                <th className="px-3 py-2">Phone</th>
                                <th className="px-3 py-2">Country</th>
                                <th className="px-3 py-2">City</th>
                                <th className="px-3 py-2">Package</th>
                                <th className="px-3 py-2">Status</th>
                                <th className="px-3 py-2">Pending</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {standbuilders.map((sb) => (
                                <tr key={sb.userid}>
                                    <td className="px-3 py-2">
                                        <input type="checkbox" checked={selected.includes(sb.userid)} onChange={() => toggleOne(sb.userid)} />
                                    </td>
                                    <td className="px-3 py-2">{sb.companyname}</td>
                                    <td className="px-3 py-2">{sb.email}</td>
                                    <td className="px-3 py-2">{sb.phone}</td>
                                    <td className="px-3 py-2">{sb.countryname}</td>
                                    <td className="px-3 py-2">{sb.cityname}</td>
                                    <td className="px-3 py-2">{sb.packgaename}</td>
                                    <td className="px-3 py-2">{sb.verifystatus || sb.status}</td>
                                    <td className="px-3 py-2">{sb.lead_pending}</td>
                                </tr>
                            ))}
                            {standbuilders.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-3 py-6 text-center text-slate-500">
                                        {hasSearched ? 'No data found for the selected filters.' : 'Search your selection to load stand builders.'}
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </form>
        </AdminLayout>
    );
}
