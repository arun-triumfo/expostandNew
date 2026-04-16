import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

function LeadTable({ title, rows }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-4 py-2 text-sm font-semibold text-slate-800">
                {title} ({rows?.length ?? 0})
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-3 py-2">Id</th>
                            <th className="px-3 py-2">Company Name</th>
                            <th className="px-3 py-2">Member</th>
                            <th className="px-3 py-2">Supplier Email</th>
                            <th className="px-3 py-2">Country</th>
                            <th className="px-3 py-2">City</th>
                            <th className="px-3 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {(rows ?? []).map((row, idx) => (
                            <tr key={`${row.supplier_id}-${idx}`}>
                                <td className="px-3 py-2">{row.quote_token_no || '—'}</td>
                                <td className="px-3 py-2">{row.companyname || '—'}</td>
                                <td className="px-3 py-2">
                                    <span className="inline-flex rounded bg-slate-100 px-2 py-0.5 text-xs">{row.package_name || '—'}</span>
                                </td>
                                <td className="px-3 py-2">{row.email || '—'}</td>
                                <td className="px-3 py-2">{row.countryname || '—'}</td>
                                <td className="px-3 py-2">{row.cityname || '—'}</td>
                                <td className="px-3 py-2">{title.includes('Accepted') ? 'Accepted' : title.includes('Rejected') ? 'Rejected' : title.includes('No Response') ? 'No Response' : 'Sent'}</td>
                            </tr>
                        ))}
                        {(rows ?? []).length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-3 py-6 text-center text-slate-500">
                                    No records.
                                </td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function View({
    quotation,
    sentlead = [],
    acceptlead = [],
    rjctdlead = [],
    noresponselead = [],
    countsent = 0,
    countaccpt = 0,
    countrjct = 0,
    countnorsponse = 0,
}) {
    const [tab, setTab] = useState('sent');

    return (
        <AdminLayout title="View quotation lead">
            <Head title={`View quotation ${quotation?.quote_token_no ?? ''}`} />

            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-lg font-semibold text-slate-900">Lead details #{quotation?.quote_token_no}</h1>
                <Link href={route('quotation-distributed')} className="rounded border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
                    Back
                </Link>
            </div>

            <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="grid gap-2 text-sm md:grid-cols-3">
                    <div>Event: <span className="font-semibold">{quotation?.quote_event_name}</span></div>
                    <div>Location: <span className="font-semibold">{quotation?.countryname}, {quotation?.cityname}</span></div>
                    <div>Dates: <span className="font-semibold">{quotation?.quote_event_date} to {quotation?.quote_event_end_date}</span></div>
                    <div>Stand size: <span className="font-semibold">{quotation?.quote_stand_area} {quotation?.quote_area_type}</span></div>
                    <div>Budget: <span className="font-semibold">{quotation?.quote_estimate_from} - {quotation?.quote_estimate_to} {quotation?.quote_currency_type}</span></div>
                </div>
            </div>

            <div className="mb-3 flex flex-wrap gap-1 border-b border-slate-200 pb-2">
                <button type="button" onClick={() => setTab('sent')} className={`rounded px-3 py-1.5 text-sm ${tab === 'sent' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>
                    Sent Leads - {countsent}
                </button>
                <button
                    type="button"
                    onClick={() => setTab('accepted')}
                    className={`rounded px-3 py-1.5 text-sm ${tab === 'accepted' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
                >
                    Accepted Leads - {countaccpt}
                </button>
                <button
                    type="button"
                    onClick={() => setTab('rejected')}
                    className={`rounded px-3 py-1.5 text-sm ${tab === 'rejected' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
                >
                    Rejected Leads - {countrjct}
                </button>
                <button
                    type="button"
                    onClick={() => setTab('noresponse')}
                    className={`rounded px-3 py-1.5 text-sm ${tab === 'noresponse' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
                >
                    No Response - {countnorsponse}
                </button>
            </div>
            {tab === 'sent' ? <LeadTable title="Sent Leads" rows={sentlead} /> : null}
            {tab === 'accepted' ? <LeadTable title="Accepted Leads" rows={acceptlead} /> : null}
            {tab === 'rejected' ? <LeadTable title="Rejected Leads" rows={rjctdlead} /> : null}
            {tab === 'noresponse' ? <LeadTable title="No Response Leads" rows={noresponselead} /> : null}
        </AdminLayout>
    );
}
