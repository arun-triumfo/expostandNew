import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Building2, Mail, MapPin, Pencil, Phone } from 'lucide-react';
import { useMemo, useState } from 'react';

function leadStatusLabel(row) {
    if (row.status === 'respond' && row.terms_accept === 'accept') {
        return { label: 'Accepted', className: 'bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200' };
    }
    if (row.status === 'respond' && row.terms_accept === 'reject') {
        return { label: 'Rejected', className: 'bg-rose-100 text-rose-900 ring-1 ring-rose-200' };
    }
    return { label: 'No Response', className: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200' };
}

function formatDate(d) {
    if (!d) {
        return '—';
    }
    try {
        return String(d).slice(0, 10);
    } catch {
        return String(d);
    }
}

function LeadTable({ rows }) {
    if (!rows?.length) {
        return <p className="py-6 text-center text-sm text-slate-500">No records.</p>;
    }
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                    <tr>
                        <th className="px-3 py-2">REF. NO.</th>
                        <th className="px-3 py-2">Event Name</th>
                        <th className="px-3 py-2">Event Date</th>
                        <th className="px-3 py-2">Stand Size</th>
                        <th className="px-3 py-2">Budget</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Sent Date</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {rows.map((row, i) => {
                        const st = leadStatusLabel(row);
                        return (
                            <tr key={`${row.quote_token_no}-${i}`} className="hover:bg-slate-50/80">
                                <td className="px-3 py-2 font-mono text-xs">{row.quote_token_no}</td>
                                <td className="px-3 py-2">{row.quote_event_name}</td>
                                <td className="px-3 py-2">{row.quote_event_date}</td>
                                <td className="px-3 py-2">
                                    {row.quote_stand_area} {row.quote_area_type}
                                </td>
                                <td className="px-3 py-2">
                                    {row.quote_estimate_from} {row.quote_currency_type}
                                </td>
                                <td className="px-3 py-2">
                                    <span className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold ${st.className}`}>{st.label}</span>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">{formatDate(row.created_date)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default function Show({
    profile,
    servicedata,
    country,
    continentGroups,
    packghstry,
    packname,
    totallead,
    acceptedleaddetail,
    rjctdleaddetail,
    totalleads,
    leadpending,
    leadTaken,
    leadrejected,
    leadlifetitme,
    noresponslead,
}) {
    const [mainTab, setMainTab] = useState('company');
    const [leadSub, setLeadSub] = useState('sent');

    const serviceIds = useMemo(() => {
        const raw = profile?.servic_id ?? '';
        return raw ? raw.split(',').filter(Boolean) : [];
    }, [profile?.servic_id]);

    const businessIds = useMemo(() => {
        const raw = profile?.busn_scop_country ?? '';
        return raw ? raw.split(',').filter(Boolean) : [];
    }, [profile?.busn_scop_country]);

    const activePack = packname?.[0];
    const memberLabel = activePack ? `${activePack.package_name} — ${totalleads} Leads` : 'FREE MEMBER — 0';

    const tabs = [
        { id: 'company', label: 'Company Profile' },
        { id: 'history', label: 'History' },
        { id: 'leads', label: 'Lead Status' },
        { id: 'remarks', label: 'Remarks' },
    ];

    return (
        <AdminLayout title="View stand builder">
            <Head title={`${profile?.companyname ?? 'Stand builder'} — View`} />

            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-1 gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                        {profile?.logo_url ? (
                            <img src={profile.logo_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                                <Building2 className="h-10 w-10" />
                            </div>
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 className="text-xl font-semibold text-slate-900">{profile?.companyname}</h2>
                        <div className="mt-2 text-sm text-slate-600">
                            <span className="inline-flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {profile?.countryname}, {profile?.cityname}
                            </span>
                        </div>
                        <div className="mt-1 text-sm text-slate-600">
                            <span className="inline-flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                {profile?.email}
                            </span>
                        </div>
                        <div className="mt-1 text-sm text-slate-600">
                            <span className="inline-flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                {profile?.phone}
                            </span>
                        </div>
                        <div className="mt-1 text-xs text-slate-500">Password: {profile?.password_display}</div>
                    </div>
                    <div className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm">
                        <div className="font-semibold text-teal-900">Preferred member</div>
                        <div className="mt-1 text-teal-800">{memberLabel}</div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Link
                        href={`/edit-standbuilders?id=${profile?.userid}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                    >
                        <Pencil className="h-4 w-4" />
                        Edit
                    </Link>
                    <Link
                        href={route('standbuilders')}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                    >
                        Back to list
                    </Link>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-wrap gap-1 border-b border-slate-100 p-2">
                    {tabs.map((t) => (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => setMainTab(t.id)}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                mainTab === t.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="p-4">
                    {mainTab === 'company' && (
                        <div className="space-y-4">
                            <section className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                                <h3 className="text-sm font-semibold text-slate-900">About company</h3>
                                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{profile?.about_comp || '—'}</p>
                            </section>

                            <section className="rounded-xl border border-slate-100 p-4">
                                <h3 className="text-sm font-semibold text-slate-900">Company details — {profile?.companyname}</h3>
                                <table className="mt-3 w-full text-sm">
                                    <tbody>
                                        <tr className="border-b border-slate-100">
                                            <td className="py-2 pr-4 text-slate-500">Owner</td>
                                            <td className="py-2">{profile?.ownername}</td>
                                            <td className="py-2 pr-4 text-slate-500">Tax/VAT</td>
                                            <td className="py-2">{profile?.tax_vat}</td>
                                        </tr>
                                        <tr className="border-b border-slate-100">
                                            <td className="py-2 pr-4 text-slate-500">Foundation year</td>
                                            <td className="py-2">{profile?.found_year}</td>
                                            <td className="py-2 pr-4 text-slate-500">Registration no.</td>
                                            <td className="py-2">{profile?.reg_num}</td>
                                        </tr>
                                        <tr className="border-b border-slate-100">
                                            <td className="py-2 pr-4 text-slate-500">Country</td>
                                            <td className="py-2">{profile?.countryname}</td>
                                            <td className="py-2 pr-4 text-slate-500">City</td>
                                            <td className="py-2">{profile?.cityname}</td>
                                        </tr>
                                        <tr className="border-b border-slate-100">
                                            <td className="py-2 pr-4 text-slate-500">Website</td>
                                            <td className="py-2" colSpan={3}>
                                                {profile?.compweb}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 pr-4 text-slate-500">Employees</td>
                                            <td className="py-2">{profile?.num_employee}</td>
                                            <td className="py-2 pr-4 text-slate-500">Address</td>
                                            <td className="py-2" colSpan={1}>
                                                {profile?.compaddress}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </section>

                            <section className="rounded-xl border border-slate-100 p-4">
                                <h3 className="text-sm font-semibold text-slate-900">Production house</h3>
                                <table className="mt-3 w-full text-sm">
                                    <tbody>
                                        <tr>
                                            <td className="py-2 pr-4 text-slate-500">Size</td>
                                            <td className="py-2">{profile?.prod_size}</td>
                                            <td className="py-2 pr-4 text-slate-500">Capacity</td>
                                            <td className="py-2">{profile?.prd_capcty}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </section>

                            <section className="rounded-xl border border-slate-100 p-4">
                                <h3 className="text-sm font-semibold text-slate-900">Services</h3>
                                <div className="mt-3 flex flex-wrap gap-3">
                                    {servicedata
                                        ?.filter((s) => serviceIds.includes(String(s.id)))
                                        .map((s) => (
                                            <span
                                                key={s.id}
                                                className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-900 ring-1 ring-indigo-100"
                                            >
                                                {s.name}
                                            </span>
                                        ))}
                                </div>
                            </section>

                            <section className="rounded-xl border border-slate-100 p-4">
                                <h3 className="text-sm font-semibold text-slate-900">Business scope</h3>
                                <div className="mt-3 space-y-4">
                                    {continentGroups?.map((g) => {
                                        const countriesInContinent = (country ?? []).filter((c) => c.continent === g.continent);
                                        const selected = countriesInContinent.filter((c) => businessIds.includes(String(c.id)));
                                        if (!selected.length) {
                                            return null;
                                        }
                                        return (
                                            <div key={g.continent}>
                                                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{g.continent}</h4>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {selected.map((c) => (
                                                        <span
                                                            key={c.id}
                                                            className="inline-flex rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-800 ring-1 ring-slate-200"
                                                        >
                                                            {c.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            <section className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                                Stand photo upload — legacy section placeholder (no data in old template).
                            </section>
                        </div>
                    )}

                    {mainTab === 'history' && (
                        <div>
                            <h3 className="mb-3 text-sm font-semibold text-slate-900">Packages history</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                                    <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                                        <tr>
                                            <th className="px-3 py-2">SB ID</th>
                                            <th className="px-3 py-2">Package</th>
                                            <th className="px-3 py-2">Created</th>
                                            <th className="px-3 py-2">Updated</th>
                                            <th className="px-3 py-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {(packghstry ?? []).map((row, i) => (
                                            <tr key={i}>
                                                <td className="px-3 py-2">{row.stand_bulider_master_id}</td>
                                                <td className="px-3 py-2">
                                                    <span className="inline-flex rounded px-2 py-0.5 text-xs font-semibold bg-slate-100">
                                                        {row.package_name} — ${row.package_price}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2">{row.created_date}</td>
                                                <td className="px-3 py-2">{row.updated_date}</td>
                                                <td className="px-3 py-2">{row.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {!packghstry?.length ? <p className="py-6 text-center text-sm text-slate-500">No package history.</p> : null}
                        </div>
                    )}

                    {mainTab === 'leads' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                                {[
                                    { label: 'Member', value: memberLabel, border: 'border-emerald-400' },
                                    { label: 'Remaining leads', value: leadpending, border: 'border-violet-400' },
                                    { label: 'Total sent leads', value: leadlifetitme, border: 'border-rose-400' },
                                    { label: 'Accepted', value: leadTaken, border: 'border-sky-400' },
                                    { label: 'Rejected', value: leadrejected, border: 'border-amber-400' },
                                    { label: 'No response', value: noresponslead, border: 'border-slate-400' },
                                ].map((t) => (
                                    <div key={t.label} className={`rounded-xl border-l-4 ${t.border} bg-white p-3 shadow-sm ring-1 ring-slate-100`}>
                                        <div className="text-xs font-medium uppercase text-slate-500">{t.label}</div>
                                        <div className="mt-1 text-lg font-semibold text-slate-900">{t.value}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-1 border-b border-slate-100 pb-2">
                                {[
                                    { id: 'sent', label: 'Sent leads' },
                                    { id: 'accepted', label: 'Accepted leads' },
                                    { id: 'rejected', label: 'Rejected leads' },
                                ].map((t) => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => setLeadSub(t.id)}
                                        className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                                            leadSub === t.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>

                            {leadSub === 'sent' && <LeadTable rows={totallead} />}
                            {leadSub === 'accepted' && <LeadTable rows={acceptedleaddetail} />}
                            {leadSub === 'rejected' && <LeadTable rows={rjctdleaddetail} />}
                        </div>
                    )}

                    {mainTab === 'remarks' && (
                        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-6 text-center text-sm text-slate-600">
                            Coming soon
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
