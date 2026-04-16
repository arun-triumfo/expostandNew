import TablePagination from '@/Components/Admin/TablePagination';
import AdminLayout from '@/Layouts/AdminLayout';
import { serialNumber } from '@/utils/adminTableSerial';
import axios from 'axios';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, MessageCircle, Pencil, Plus, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

const CONTINENTS = ['Africa', 'Asia', 'Australia', 'Europe', 'South America', 'North America'];

const MEMBER_TYPES = [
    { value: '', label: 'Member Type' },
    { value: 'paid', label: 'PAID' },
    { value: 'GOLD', label: 'GOLD' },
    { value: 'PLATINUM', label: 'PLATINUM' },
    { value: 'SILVER', label: 'SILVER' },
    { value: 'STARTER', label: 'STARTER' },
    { value: 'FREE', label: 'FREE' },
    { value: 'featured', label: 'Featured Standbuilder' },
    { value: 'preferred', label: 'Preferred Vendor' },
];

const PER_PAGE = ['25', '50', '100', '200', 'All'];

function packageBadgeClasses(packColor) {
    const c = String(packColor || '').toLowerCase();
    if (c.includes('success') || c.includes('green')) {
        return 'bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200';
    }
    if (c.includes('warning') || c.includes('yellow')) {
        return 'bg-amber-100 text-amber-950 ring-1 ring-amber-200';
    }
    if (c.includes('danger') || c.includes('red')) {
        return 'bg-rose-100 text-rose-900 ring-1 ring-rose-200';
    }
    if (c.includes('info') || c.includes('blue')) {
        return 'bg-sky-100 text-sky-900 ring-1 ring-sky-200';
    }
    if (c.includes('primary') || c.includes('dark')) {
        return 'bg-slate-800 text-white ring-1 ring-slate-700';
    }
    if (c.includes('secondary')) {
        return 'bg-slate-100 text-slate-800 ring-1 ring-slate-200';
    }
    return 'bg-slate-100 text-slate-800 ring-1 ring-slate-200';
}

export default function Index({ standbuilders, stats, countries, filters }) {
    const { flash, auth, csrf_token: csrfToken } = usePage().props;
    const admin = auth?.admin;
    const isSeo = String(admin?.role ?? '').toLowerCase() === 'seo';
    const canBulk = !isSeo;
    const showAdvancedFilters = !isSeo;
    const tableColSpan = canBulk ? 16 : 15;

    const rows = standbuilders?.data ?? [];

    const [membrtype, setMembrtype] = useState(filters?.membrtype ?? '');
    const [continent, setContinent] = useState(filters?.continent ?? '');
    const [cntryname, setCntryname] = useState(filters?.cntryname ?? '');
    const [cityname, setCityname] = useState(filters?.cityname ?? '');
    const [search, setSearch] = useState(filters?.search ?? '');
    const [perPage, setPerPage] = useState(filters?.per_page ?? '50');

    const [countryOptions, setCountryOptions] = useState(() => (countries ?? []).map((c) => ({ name: c.name })));
    const [cityOptions, setCityOptions] = useState([]);

    const [commentOpen, setCommentOpen] = useState(false);
    const [commentUserId, setCommentUserId] = useState(null);
    const [commentCompany, setCommentCompany] = useState('');
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);

    const [selected, setSelected] = useState([]);

    useEffect(() => {
        setMembrtype(filters?.membrtype ?? '');
        setContinent(filters?.continent ?? '');
        setCntryname(filters?.cntryname ?? '');
        setCityname(filters?.cityname ?? '');
        setSearch(filters?.search ?? '');
        setPerPage(filters?.per_page ?? '50');
    }, [filters]);

    useEffect(() => {
        setSelected([]);
    }, [rows]);

    const allCountryOptions = useMemo(() => (countries ?? []).map((c) => ({ id: c.id, name: c.name })), [countries]);

    const loadCountriesForContinent = useCallback(
        async (cont) => {
            if (!cont) {
                setCountryOptions(allCountryOptions.map((c) => ({ name: c.name })));
                return;
            }
            try {
                const { data } = await axios.get(route('getCountriesByContinent'), {
                    params: { continent: cont },
                });
                const list = data?.countries ?? [];
                setCountryOptions(list.map((c) => ({ name: c.name })));
            } catch {
                setCountryOptions([]);
            }
        },
        [allCountryOptions],
    );

    useEffect(() => {
        loadCountriesForContinent(continent);
    }, [continent, loadCountriesForContinent]);

    const loadCities = useCallback(async (countryName) => {
        if (!countryName) {
            setCityOptions([]);
            return;
        }
        try {
            const { data } = await axios.get(route('cityvalustandbuilder'), {
                params: { countryyid: countryName },
            });
            const list = data?.cities ?? [];
            setCityOptions(list.map((c) => ({ name: c.name })));
        } catch {
            setCityOptions([]);
        }
    }, []);

    useEffect(() => {
        loadCities(cntryname);
    }, [cntryname, loadCities]);

    const navigateList = (params) => {
        router.get(
            route('standbuilders'),
            {
                membrtype: params.membrtype !== undefined ? params.membrtype || undefined : membrtype || undefined,
                continent: params.continent !== undefined ? params.continent || undefined : continent || undefined,
                cntryname: params.cntryname !== undefined ? params.cntryname || undefined : cntryname || undefined,
                cityname: params.cityname !== undefined ? params.cityname || undefined : cityname || undefined,
                search: params.search !== undefined ? params.search || undefined : search || undefined,
                per_page: params.per_page !== undefined ? params.per_page : perPage,
                page: params.page ?? 1,
            },
            { preserveState: true, replace: true },
        );
    };

    const onStatTile = (tileFilter) => {
        navigateList({
            membrtype: tileFilter,
            continent: '',
            cntryname: '',
            cityname: '',
            page: 1,
        });
        setContinent('');
        setCntryname('');
        setCityname('');
    };

    const onFilterSearch = (e) => {
        e?.preventDefault();
        navigateList({ page: 1 });
    };

    const onSearchField = (e) => {
        e?.preventDefault();
        navigateList({ search, page: 1 });
    };

    const onPerPage = (v) => {
        setPerPage(v);
        navigateList({ per_page: v, page: 1 });
    };

    const openComments = async (userid, company) => {
        setCommentUserId(userid);
        setCommentCompany(company || '');
        setCommentText('');
        setCommentOpen(true);
        setCommentLoading(true);
        try {
            const { data } = await axios.post(route('viewstandbuildercomment'), {
                _token: csrfToken,
                stndbuilderid: userid,
            });
            setComments(data?.comments ?? []);
        } catch {
            setComments([]);
        } finally {
            setCommentLoading(false);
        }
    };

    const saveComment = async () => {
        if (!commentUserId || !csrfToken) {
            return;
        }
        setCommentLoading(true);
        try {
            const { data } = await axios.post(route('insertstanddbuildercomment'), {
                _token: csrfToken,
                stndbldr_id: commentUserId,
                comment: commentText,
                userid: admin?.id,
            });
            setComments(data?.comments ?? []);
            setCommentText('');
        } finally {
            setCommentLoading(false);
        }
    };

    const toggleSelect = (id, checked) => {
        setSelected((prev) => {
            if (checked) {
                return prev.includes(id) ? prev : [...prev, id];
            }
            return prev.filter((x) => x !== id);
        });
    };

    const toggleSelectAll = (checked) => {
        if (!checked) {
            setSelected([]);
            return;
        }
        setSelected(rows.map((r) => r.id));
    };

    const bulk = (action) => {
        if (!selected.length) {
            return;
        }
        router.post(
            route('update.featured.standbuilders'),
            {
                selected_standbuilders: selected,
                action,
            },
            { preserveScroll: true },
        );
    };

    const statTiles = [
        { label: 'Total', value: stats?.total ?? 0, filter: '', border: 'border-emerald-500' },
        { label: 'Active', value: stats?.active ?? 0, filter: 'active', border: 'border-sky-400' },
        { label: 'Starter', value: stats?.starter ?? 0, filter: 'STARTER', border: 'border-violet-400' },
        { label: 'Silver', value: stats?.silver ?? 0, filter: 'SILVER', border: 'border-rose-400' },
        { label: 'Gold', value: stats?.gold ?? 0, filter: 'GOLD', border: 'border-amber-400' },
        { label: 'Platinum', value: stats?.platinum ?? 0, filter: 'PLATINUM', border: 'border-teal-500' },
    ];

    return (
        <AdminLayout title="Stand Builder Management">
            <Head title="Stand Builder Management" />

            {flash?.success ? (
                <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{flash.success}</div>
            ) : null}
            {flash?.error ? (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{flash.error}</div>
            ) : null}

            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {statTiles.map((t) => (
                    <button
                        key={t.label}
                        type="button"
                        onClick={() => onStatTile(t.filter)}
                        className={`rounded-xl border-l-4 ${t.border} bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50`}
                    >
                        <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{t.label}</div>
                        <div className="mt-1 text-2xl font-semibold text-slate-900">{t.value}</div>
                    </button>
                ))}
            </div>

            <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-slate-600">Show</span>
                    <select
                        value={perPage}
                        onChange={(e) => onPerPage(e.target.value)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
                    >
                        {PER_PAGE.map((p) => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </select>
                </div>

                {canBulk ? (
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => bulk('annual')}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                        >
                            Update Selected to Annual
                        </button>
                        <button
                            type="button"
                            onClick={() => bulk('preferred')}
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                        >
                            Mark as Preferred Vendor
                        </button>
                    </div>
                ) : null}

                <Link
                    href={route('add-standbuilders')}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
                >
                    <Plus className="h-4 w-4" />
                    Add Stand Builders
                </Link>
            </div>

            {showAdvancedFilters ? (
                <form onSubmit={onFilterSearch} className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-500">Member Type</label>
                            <select
                                value={membrtype}
                                onChange={(e) => setMembrtype(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                            >
                                {MEMBER_TYPES.map((m) => (
                                    <option key={m.label} value={m.value}>
                                        {m.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-500">Continent</label>
                            <select
                                value={continent}
                                onChange={(e) => {
                                    setContinent(e.target.value);
                                    setCntryname('');
                                    setCityname('');
                                }}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                            >
                                <option value="">Continent</option>
                                {CONTINENTS.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-500">Country</label>
                            <select
                                value={cntryname}
                                onChange={(e) => {
                                    setCntryname(e.target.value);
                                    setCityname('');
                                }}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                            >
                                <option value="">Country</option>
                                {countryOptions.map((c) => (
                                    <option key={c.name} value={c.name}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-500">City</label>
                            <select
                                value={cityname}
                                onChange={(e) => setCityname(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                            >
                                <option value="">City</option>
                                {cityOptions.map((c) => (
                                    <option key={c.name} value={c.name}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </form>
            ) : null}

            <form onSubmit={onSearchField} className="mb-6 flex max-w-xl gap-0 overflow-hidden rounded-lg border border-slate-200 shadow-sm">
                <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search company, contact, email, phone…"
                    className="min-w-0 flex-1 border-0 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500/30"
                />
                <button
                    type="submit"
                    className="inline-flex items-center gap-1 border-l border-slate-200 bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900"
                >
                    <Search className="h-4 w-4" />
                    Search
                </button>
            </form>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-800">Stand Builder Management</div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <tr>
                                {canBulk ? (
                                    <th className="px-3 py-3">
                                        <input
                                            type="checkbox"
                                            checked={rows.length > 0 && selected.length === rows.length}
                                            onChange={(e) => toggleSelectAll(e.target.checked)}
                                            className="rounded border-slate-300"
                                        />
                                    </th>
                                ) : null}
                                <th className="px-3 py-3">Action</th>
                                <th className="px-3 py-3">S.N.</th>
                                <th className="px-3 py-3">Company</th>
                                <th className="px-3 py-3">Country</th>
                                <th className="px-3 py-3">City</th>
                                <th className="px-3 py-3">Contact</th>
                                <th className="px-3 py-3">Email</th>
                                <th className="px-3 py-3">Phone</th>
                                <th className="px-3 py-3">Package</th>
                                <th className="px-3 py-3">Featured</th>
                                <th className="px-3 py-3">Preferred</th>
                                <th className="px-3 py-3">Register date</th>
                                <th className="px-3 py-3">V. status</th>
                                <th className="px-3 py-3">Status</th>
                                <th className="px-3 py-3">Created by</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan={tableColSpan} className="px-4 py-8 text-center text-slate-500">
                                        No data found
                                    </td>
                                </tr>
                            ) : (
                                rows.map((row, i) => {
                                    const pkgName = row.current_package_name || row.packgaename;
                                    const pkgColor = row.current_package_color || row.pack_color;
                                    return (
                                        <tr key={row.id} className="hover:bg-slate-50/80">
                                            {canBulk ? (
                                                <td className="px-3 py-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selected.includes(row.id)}
                                                        onChange={(e) => toggleSelect(row.id, e.target.checked)}
                                                        className="rounded border-slate-300"
                                                    />
                                                </td>
                                            ) : null}
                                            <td className="px-3 py-2">
                                                <div className="flex flex-wrap gap-1">
                                                    <Link
                                                        href={`/edit-standbuilders?id=${row.userid}`}
                                                        className="inline-flex rounded border border-slate-200 p-1.5 text-indigo-600 hover:bg-indigo-50"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                    {!isSeo ? (
                                                        <Link
                                                            href={`/view-standbuilders?id=${row.userid}`}
                                                            className="inline-flex rounded border border-slate-200 p-1.5 text-emerald-600 hover:bg-emerald-50"
                                                            title="View"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    ) : null}
                                                    {!isSeo ? (
                                                        <button
                                                            type="button"
                                                            className="relative inline-flex rounded border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100"
                                                            title="Comments"
                                                            onClick={() => openComments(row.userid, row.companyname)}
                                                        >
                                                            <MessageCircle className="h-4 w-4" />
                                                            {row.comment_count > 0 ? (
                                                                <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-rose-500 px-0.5 text-[10px] font-bold text-white">
                                                                    {row.comment_count}
                                                                </span>
                                                            ) : null}
                                                        </button>
                                                    ) : null}
                                                </div>
                                            </td>
                                            <td className="px-3 py-2 text-slate-700">{serialNumber(standbuilders, i)}</td>
                                            <td className="px-3 py-2 font-medium text-slate-900">{row.companyname}</td>
                                            <td className="px-3 py-2">{row.countryname}</td>
                                            <td className="px-3 py-2">{row.cityname}</td>
                                            <td className="px-3 py-2">{row.name}</td>
                                            <td className="px-3 py-2">{row.email}</td>
                                            <td className="px-3 py-2">{row.phone}</td>
                                            <td className="px-3 py-2">
                                                <span className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold ${packageBadgeClasses(pkgColor)}`}>
                                                    {pkgName}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2">
                                                <span
                                                    className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold ${
                                                        row.featured_standbuilder === '1'
                                                            ? 'bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200'
                                                            : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'
                                                    }`}
                                                >
                                                    {row.featured_standbuilder === '1' ? 'Yes' : 'No'}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2">
                                                <span
                                                    className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold ${
                                                        row.preferred_vendor === '1'
                                                            ? 'bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200'
                                                            : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'
                                                    }`}
                                                >
                                                    {row.preferred_vendor === '1' ? 'Yes' : 'No'}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-2 text-slate-600">
                                                {row.created_at ? String(row.created_at).slice(0, 10) : '—'}
                                            </td>
                                            <td className="px-3 py-2">{row.verifystatus === '1' ? 'Verified' : 'Unverified'}</td>
                                            <td className="px-3 py-2">{row.status === '1' ? 'Active' : 'Inactive'}</td>
                                            <td className="px-3 py-2">{row.createdby_label}</td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <TablePagination pagination={standbuilders} />

            {commentOpen ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" role="dialog" aria-modal="true">
                    <div className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-200 bg-teal-900 px-4 py-3 text-white">
                            <h2 className="text-sm font-semibold">Comments — {commentCompany}</h2>
                            <button
                                type="button"
                                className="rounded-lg p-1 text-white/90 hover:bg-white/10"
                                onClick={() => setCommentOpen(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="max-h-48 overflow-auto border-b border-slate-100 p-3">
                            {commentLoading ? (
                                <p className="text-sm text-slate-500">Loading…</p>
                            ) : (
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="text-slate-500">
                                            <th className="py-1 pr-2">SN.</th>
                                            <th className="py-1 pr-2">Comment</th>
                                            <th className="py-1 pr-2">User</th>
                                            <th className="py-1">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {comments.map((c) => (
                                            <tr key={c.sn} className="border-t border-slate-100">
                                                <td className="py-1 pr-2">{c.sn}</td>
                                                <td className="py-1 pr-2">{c.comment}</td>
                                                <td className="py-1 pr-2">{c.user}</td>
                                                <td className="py-1">{c.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                        <div className="p-3">
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                rows={3}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                placeholder="Add a comment…"
                            />
                            <div className="mt-3 flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                    onClick={() => setCommentOpen(false)}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    disabled={commentLoading}
                                    className="rounded-lg bg-teal-900 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
                                    onClick={saveComment}
                                >
                                    Submit comment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </AdminLayout>
    );
}
