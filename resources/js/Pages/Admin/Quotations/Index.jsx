import TablePagination from '@/Components/Admin/TablePagination';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, MessageCircle, Pencil, Plus, Search, Send, Trash2, UserPlus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const PER_PAGE = ['25', '50', '100', '200', 'All'];

const TABS = [
    { name: 'quotation', label: 'Incomplete', showCount: true },
    { name: 'quotation-qualified', label: 'Qualified', showCount: false },
    { name: 'quotation-distributed', label: 'Distributed', showCount: false },
    { name: 'quotation-accepted', label: 'Accepted', showCount: false },
    { name: 'quotation-contacted', label: 'Contacted', showCount: false },
    { name: 'quotation-final', label: 'Final Projects', showCount: false },
    { name: 'quotation-commision', label: 'Commission', showCount: false },
    { name: 'quotation-dead', label: 'Dead', showCount: false },
];

function formatYmd(v) {
    if (!v || v === '0000-00-00 00:00:00') {
        return '';
    }
    try {
        return String(v).slice(0, 10);
    } catch {
        return '';
    }
}

function cityDisplay(row) {
    const c = row.quote_event_city;
    if (c !== null && c !== undefined && c !== '' && !Number.isNaN(Number(c)) && String(c).trim() !== '') {
        return row.cityname || String(c);
    }
    return row.cityname || String(c ?? '');
}

export default function Index({ quotations, stats, tabCount, currentStage, currentPath, currentRouteName, filters, canDelete }) {
    const { flash, csrf_token: csrfToken } = usePage().props;
    const rows = quotations?.data ?? [];

    const [search, setSearch] = useState(filters?.search ?? '');
    const [perPage, setPerPage] = useState(filters?.per_page ?? '25');

    const [commentOpen, setCommentOpen] = useState(false);
    const [commentQuoteId, setCommentQuoteId] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);

    const [assignOpen, setAssignOpen] = useState(false);
    const [assignRow, setAssignRow] = useState(null);
    const isQualifiedRoute =
        (currentRouteName ?? '') === 'quotation-qualified' ||
        (currentRouteName ?? '') === 'quotation-qualified.page' ||
        String(currentPath ?? '').includes('quotation-qualified');
    const stage = String(currentStage ?? '');
    const showSupplierColumns = ['4', '5', '6', '7', '8'].includes(stage);
    const showSendLeadInAction = ['2', '3', '4', '7'].includes(stage);
    const showViewLeadInAction = ['3', '4', '7'].includes(stage);

    useEffect(() => {
        setSearch(filters?.search ?? '');
        setPerPage(filters?.per_page ?? '25');
    }, [filters]);

    const navigate = (params) => {
        router.get(
            currentPath || '/quotation',
            {
                search: params.search !== undefined ? params.search || undefined : search || undefined,
                source: params.source !== undefined ? params.source || undefined : filters?.source || undefined,
                per_page: params.per_page !== undefined ? params.per_page : perPage,
                page: params.page ?? 1,
            },
            { preserveState: true, replace: true },
        );
    };

    const onSearch = (e) => {
        e.preventDefault();
        navigate({ search, page: 1 });
    };

    const onPerPage = (v) => {
        setPerPage(v);
        navigate({ per_page: v, page: 1 });
    };

    const onSourceTile = (source) => {
        navigate({ source, page: 1 });
    };

    const statTiles = useMemo(
        () => [
            { label: 'Total leads', value: stats?.gettotal ?? 0, source: null, clickable: false },
            { label: 'Pending leads', value: stats?.getpending ?? 0, source: null, clickable: false },
            { label: 'Direct leads', value: stats?.getdirect ?? 0, source: 'Direct', clickable: true },
            { label: 'Accepted leads', value: stats?.getaccepted ?? 0, source: null, clickable: false },
            { label: 'Agency leads', value: stats?.getagency ?? 0, source: 'Agency', clickable: true },
            { label: 'Organizer leads', value: stats?.getorganiser ?? 0, source: 'Organizer', clickable: true },
            { label: 'Distributed leads', value: stats?.getdsitributed ?? 0, source: null, clickable: false },
            { label: 'Dead leads', value: stats?.getdead ?? 0, source: null, clickable: false },
        ],
        [stats],
    );

    const openComments = async (id) => {
        setCommentQuoteId(id);
        setCommentText('');
        setCommentOpen(true);
        setCommentLoading(true);
        try {
            const { data } = await axios.post(route('viewquotecomment'), {
                _token: csrfToken,
                quoteid: id,
            });
            setComments(data?.comments ?? []);
        } catch {
            setComments([]);
        } finally {
            setCommentLoading(false);
        }
    };

    const saveComment = async () => {
        if (!commentQuoteId || !csrfToken) {
            return;
        }
        setCommentLoading(true);
        try {
            const { data } = await axios.post(route('insertquotecomment'), {
                _token: csrfToken,
                quote_id: commentQuoteId,
                comment: commentText,
            });
            setComments(data?.comments ?? []);
            setCommentText('');
        } finally {
            setCommentLoading(false);
        }
    };

    const openAssign = (row) => {
        setAssignRow(row);
        setAssignOpen(true);
    };

    const submitAssign = (userid) => {
        if (!assignRow?.quote_token_no || !csrfToken) {
            return;
        }
        router.post(
            route('assignupdate'),
            {
                _token: csrfToken,
                quoteno: assignRow.quote_token_no,
                userid,
            },
            {
                preserveScroll: true,
                onSuccess: () => setAssignOpen(false),
            },
        );
    };

    const showAssignButton = (row) => {
        const s = row.user_id === null || row.user_id === undefined ? '' : String(row.user_id);
        if (['2', '40', 'Divyanshi'].includes(s)) {
            return false;
        }
        if (['6', 'Meenakshi'].includes(s)) {
            return false;
        }
        return true;
    };

    const assigneeUi = (row) => {
        const s = row.user_id === null || row.user_id === undefined ? '' : String(row.user_id);
        if (s === '' || s === '0') {
            return '—NONE—';
        }
        if (['2', '40', 'Divyanshi'].includes(s)) {
            return 'Divyanshi';
        }
        if (['6', 'Meenakshi'].includes(s)) {
            return 'Meenakshi';
        }
        return s;
    };

    return (
        <AdminLayout title="Lead management">
            <Head title="Quotations" />

            {flash?.success ? (
                <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{flash.success}</div>
            ) : null}
            {flash?.error ? (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{flash.error}</div>
            ) : null}

            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
                {statTiles.map((t) => (
                    <button
                        key={t.label}
                        type="button"
                        disabled={!t.clickable}
                        onClick={() => (t.clickable ? onSourceTile(t.source) : null)}
                        className={`rounded-xl border-l-4 border-slate-300 bg-white p-3 text-left shadow-sm ring-1 ring-slate-200 transition ${
                            t.clickable ? 'cursor-pointer hover:bg-slate-50' : 'cursor-default opacity-95'
                        }`}
                    >
                        <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{t.label}</div>
                        <div className="mt-1 text-xl font-semibold text-slate-900">{t.value}</div>
                    </button>
                ))}
            </div>

            <div className="mb-4 flex flex-wrap gap-2 border-b border-slate-200 pb-2">
                {TABS.map((t) => {
                    const href = route(t.name);
                    const active = (currentRouteName ?? '') === t.name;
                    const label =
                        t.showCount && t.name === 'quotation' && currentStage === '1' && currentRouteName === 'quotation'
                            ? `${t.label} (${tabCount ?? 0})`
                            : t.label;
                    return (
                        <Link
                            key={t.name}
                            href={href}
                            className={`rounded-lg px-3 py-2 text-sm font-medium ${
                                active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            {label}
                        </Link>
                    );
                })}
            </div>

            <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
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
                <Link
                    href={route('add-quotation')}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
                >
                    <Plus className="h-4 w-4" />
                    Add quotation
                </Link>
            </div>

            <form onSubmit={onSearch} className="mb-6 flex w-full max-w-full gap-0 overflow-hidden rounded-lg border border-slate-200 shadow-sm">
                <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search quote no, event, name, email, phone, company…"
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

            <div className="w-full max-w-none overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-800">Stand Builder Management</div>
                <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-[900px] divide-y divide-slate-200 text-left text-sm">
                        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-3 py-3">Quote no.</th>
                                <th className="px-3 py-3">Created / updated</th>
                                <th className="px-3 py-3">Event detail</th>
                                <th className="px-3 py-3">Stand detail</th>
                                <th className="px-3 py-3">Contact</th>
                                <th className="px-3 py-3">Action</th>
                                <th className="px-3 py-3">Created by</th>
                                <th className="px-3 py-3">Status</th>
                                {showSupplierColumns ? (
                                    <>
                                        <th className="px-3 py-3">Supplier1</th>
                                        <th className="px-3 py-3">Supplier2</th>
                                        <th className="px-3 py-3">Supplier3</th>
                                        <th className="px-3 py-3">Supplier4</th>
                                        <th className="px-3 py-3">Supplier5</th>
                                    </>
                                ) : null}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan={showSupplierColumns ? 13 : 8} className="px-4 py-8 text-center text-slate-500">
                                        No quotations found.
                                    </td>
                                </tr>
                            ) : (
                                rows.map((row, i) => (
                                    <tr key={row.id} className="align-top hover:bg-slate-50/80">
                                        <td className="px-3 py-2">
                                            <div className="font-medium text-slate-900">{row.quote_token_no}</div>
                                            <div className="text-xs font-medium text-sky-700">{row.source}</div>
                                            <div className="mt-1 text-xs text-slate-600">
                                                {showAssignButton(row) ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => openAssign(row)}
                                                        className="inline-flex items-center gap-1 rounded bg-emerald-600 px-2 py-0.5 text-xs font-medium text-white hover:bg-emerald-700"
                                                    >
                                                        <UserPlus className="h-3 w-3" />
                                                        Assign
                                                    </button>
                                                ) : (
                                                    <span>
                                                        Assign. to: <span className="font-medium text-rose-600">{assigneeUi(row)}</span>
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-600">
                                            {formatYmd(row.created_at)}
                                            <br />
                                            {row.updated_at && row.updated_at !== '0000-00-00 00:00:00' ? formatYmd(row.updated_at) : ''}
                                        </td>
                                        <td className="max-w-[140px] px-3 py-2 text-xs">
                                            <div className="font-semibold text-slate-900">{row.quote_event_name}</div>
                                            <div className="mt-1 text-slate-600">City: {cityDisplay(row)}</div>
                                            <div className="text-slate-600">From: {row.quote_event_date}</div>
                                            <div className="text-slate-600">To: {row.quote_event_end_date}</div>
                                        </td>
                                        <td className="max-w-[160px] px-3 py-2 text-xs">
                                            <p>
                                                <strong>Area</strong>: {row.quote_stand_area}
                                                {row.quote_area_type}
                                            </p>
                                            <p>
                                                <strong>Budget</strong>: {row.quote_estimate_from}-{row.quote_estimate_to} {row.quote_currency_type}
                                            </p>
                                            {row.quote_attached_file ? (
                                                <p className="mt-1">
                                                    <a
                                                        href={`/uploads/getfivequote/${row.quote_attached_file}`}
                                                        className="text-indigo-600 underline"
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        View file
                                                    </a>
                                                </p>
                                            ) : null}
                                            {row.extra_image_files?.length
                                                ? row.extra_image_files.map((f) => (
                                                      <a
                                                          key={f}
                                                          href={`/uploads/getfivequote/${f}`}
                                                          className="mr-2 text-xs text-indigo-600 underline"
                                                          target="_blank"
                                                          rel="noreferrer"
                                                      >
                                                        Extra
                                                      </a>
                                                  ))
                                                : null}
                                        </td>
                                        <td className="max-w-[200px] px-3 py-2 text-xs">
                                            <div className="font-semibold text-slate-900">{row.quote_company_name}</div>
                                            <div>{row.quote_name}</div>
                                            <div>{row.quote_mobile}</div>
                                            <div className="break-all text-slate-600">{row.quote_email}</div>
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className="flex flex-col gap-1">
                                                <Link
                                                    href={`/edit-quotation?id=${row.id}`}
                                                    className="inline-flex w-fit items-center gap-1 rounded border border-slate-200 p-1.5 text-indigo-600 hover:bg-indigo-50"
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    type="button"
                                                    className="relative inline-flex w-fit items-center gap-1 rounded border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100"
                                                    onClick={() => openComments(row.id)}
                                                >
                                                    <MessageCircle className="h-4 w-4" />
                                                    {row.comment_count > 0 ? (
                                                        <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-rose-500 px-0.5 text-[10px] font-bold text-white">
                                                            {row.comment_count}
                                                        </span>
                                                    ) : null}
                                                </button>
                                                {showSendLeadInAction ? (
                                                    <Link
                                                        href={`/send-quotation?id=${row.id}`}
                                                        className="inline-flex w-fit items-center gap-1 rounded border border-slate-200 px-2 py-1.5 text-emerald-700 hover:bg-emerald-50"
                                                        onClick={(e) => {
                                                            if (!confirm('Send this lead to distributed?')) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                    >
                                                        <Send className="h-4 w-4" />
                                                        Send Lead
                                                    </Link>
                                                ) : null}
                                                {showViewLeadInAction ? (
                                                    <Link
                                                        href={`/view-quotation?id=${encodeURIComponent(row.quote_token_no)}`}
                                                        className="inline-flex w-fit items-center gap-1 rounded border border-slate-200 px-2 py-1.5 text-sky-700 hover:bg-sky-50"
                                                        title="View lead"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        View
                                                    </Link>
                                                ) : null}
                                                {!showSendLeadInAction && !isQualifiedRoute && canDelete ? (
                                                    <Link
                                                        href={`/delete-quotation?id=${row.id}`}
                                                        className="inline-flex w-fit items-center gap-1 rounded border border-slate-200 p-1.5 text-red-600 hover:bg-red-50"
                                                        onClick={(e) => {
                                                            if (!confirm('Are you sure? Delete this quotation?')) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Link>
                                                ) : null}
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 text-xs">
                                            <div>{assigneeUi(row)}</div>
                                            <div className="mt-1 text-[11px] text-sky-700">
                                                Verified By: <span className="text-slate-700">{row.varified_by || '—'}</span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 text-xs">{row.status}</td>
                                        {showSupplierColumns
                                            ? Array.from({ length: 5 }).map((_, supplierIdx) => {
                                                  const supplier = row.suppliers?.[supplierIdx];
                                                  return (
                                                      <td key={`${row.id}-supplier-${supplierIdx}`} className="px-3 py-2 text-xs">
                                                          {supplier ? (
                                                              <div className="space-y-0.5">
                                                                  <div className="font-semibold text-sky-700">{supplier.companyname}</div>
                                                                  <div>{supplier.phone}</div>
                                                                  <div className="break-all">{supplier.email}</div>
                                                                  <span className="inline-flex rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-800">
                                                                      {supplier.packgaename || '—'}
                                                                  </span>
                                                              </div>
                                                          ) : (
                                                              'none'
                                                          )}
                                                      </td>
                                                  );
                                              })
                                            : null}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <TablePagination pagination={quotations} />

            {commentOpen ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" role="dialog" aria-modal="true">
                    <div className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-200 bg-teal-900 px-4 py-3 text-white">
                            <h2 className="text-sm font-semibold">Comments — quote #{commentQuoteId}</h2>
                            <button type="button" className="rounded-lg p-1 text-white/90 hover:bg-white/10" onClick={() => setCommentOpen(false)}>
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
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}

            {assignOpen && assignRow ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" role="dialog" aria-modal="true">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <h3 className="text-sm font-semibold text-slate-900">Assign lead {assignRow.quote_token_no}</h3>
                        <p className="mt-2 text-xs text-slate-500">Choose a user to assign (legacy behaviour).</p>
                        <div className="mt-4 flex flex-col gap-2">
                            <button
                                type="button"
                                className="rounded-lg bg-teal-800 px-4 py-2 text-sm font-medium text-white hover:bg-teal-900"
                                onClick={() => submitAssign('Divyanshi')}
                            >
                                Assign to Divyanshi
                            </button>
                            <button
                                type="button"
                                className="rounded-lg bg-teal-800 px-4 py-2 text-sm font-medium text-white hover:bg-teal-900"
                                onClick={() => submitAssign('Meenakshi')}
                            >
                                Assign to Meenakshi
                            </button>
                            <button type="button" className="mt-2 text-sm text-slate-600 underline" onClick={() => setAssignOpen(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </AdminLayout>
    );
}
