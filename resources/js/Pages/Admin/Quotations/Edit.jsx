import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const STAGES = [
    { value: '1', label: 'Incomplete' },
    { value: '2', label: 'Qualified' },
    { value: '3', label: 'Distributed' },
    { value: '4', label: 'Accepted' },
    { value: '5', label: 'Contacted' },
    { value: '6', label: 'Final Project' },
    { value: '7', label: 'Commission' },
    { value: '8', label: 'Dead' },
];

export default function Edit({ quotation, countries = [], cities = [], comments = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        id: quotation?.id ?? '',
        quote_name: quotation?.quote_name ?? '',
        quote_email: quotation?.quote_email ?? '',
        quote_mobile: quotation?.quote_mobile ?? '',
        quote_company_name: quotation?.quote_company_name ?? '',
        quote_event_name: quotation?.quote_event_name ?? '',
        quote_event_desc: quotation?.quote_event_desc ?? '',
        quote_event_date: quotation?.quote_event_date ?? '',
        quote_event_end_date: quotation?.quote_event_end_date ?? '',
        quote_stand_area: quotation?.quote_stand_area ?? '',
        quote_area_type: quotation?.quote_area_type ?? '',
        quote_estimate_from: quotation?.quote_estimate_from ?? '',
        quote_estimate_to: quotation?.quote_estimate_to ?? '',
        quote_currency_type: quotation?.quote_currency_type ?? '',
        status: quotation?.status ?? '',
        source: quotation?.source ?? 'Direct',
        quote_event_country: quotation?.quote_event_country ?? '',
        quote_event_city: quotation?.quote_event_city ?? '',
        company_website: quotation?.company_website ?? '',
        contact_country: quotation?.contact_country ?? '',
        stage: quotation?.stage ?? '1',
        valid_lead_status: quotation?.valid_lead_status ?? '0',
        varified_by: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('update-quotation'));
    };

    const inputClass =
        'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none';

    return (
        <AdminLayout title="Edit quotation">
            <Head title={`Edit quotation ${quotation?.quote_token_no ?? ''}`} />

            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-lg font-semibold text-slate-900">Edit quotation {quotation?.quote_token_no ? `#${quotation.quote_token_no}` : ''}</h1>
                <Link href={route('quotation')} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    Back to list
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <form onSubmit={submit} className="space-y-5 lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-slate-900">Event Details</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <label className="block text-sm md:col-span-2">
                                <span className="font-medium text-slate-700">Lead Source Show to the Client</span>
                                <div className="mt-2 flex flex-wrap gap-4">
                                    {['Direct', 'Agency', 'Organizer', 'Inhouse'].map((s) => (
                                        <label key={s} className="inline-flex items-center gap-2 text-sm">
                                            <input type="radio" name="source" value={s} checked={data.source === s} onChange={(e) => setData('source', e.target.value)} />
                                            {s}
                                        </label>
                                    ))}
                                </div>
                            </label>
                            <label className="block text-sm">
                                <span className="font-medium text-slate-700">Event Name</span>
                                <input type="text" value={data.quote_event_name} onChange={(e) => setData('quote_event_name', e.target.value)} className={inputClass} />
                            </label>
                            <label className="block text-sm">
                                <span className="font-medium text-slate-700">Select Event Country</span>
                                <select value={data.quote_event_country} onChange={(e) => setData('quote_event_country', e.target.value)} className={inputClass}>
                                    <option value="">-Select Country-</option>
                                    {countries.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="block text-sm">
                                <span className="font-medium text-slate-700">Select Event City</span>
                                <select value={data.quote_event_city} onChange={(e) => setData('quote_event_city', e.target.value)} className={inputClass}>
                                    <option value="">-Select City-</option>
                                    {cities.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="block text-sm">
                                <span className="font-medium text-slate-700">Event Start Date</span>
                                <input type="text" value={data.quote_event_date} onChange={(e) => setData('quote_event_date', e.target.value)} className={inputClass} />
                            </label>
                            <label className="block text-sm">
                                <span className="font-medium text-slate-700">Event End Date</span>
                                <input type="text" value={data.quote_event_end_date} onChange={(e) => setData('quote_event_end_date', e.target.value)} className={inputClass} />
                            </label>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-slate-900">Stand Details</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <label className="block text-sm">
                                <span className="font-medium text-slate-700">Stand Size</span>
                                <input type="text" value={data.quote_stand_area} onChange={(e) => setData('quote_stand_area', e.target.value)} className={inputClass} />
                            </label>
                            <label className="block text-sm">
                                <span className="font-medium text-slate-700">Area Type</span>
                                <select value={data.quote_area_type} onChange={(e) => setData('quote_area_type', e.target.value)} className={inputClass}>
                                    {['SQFT', 'SQMT', 'M2'].map((v) => (
                                        <option key={v} value={v}>
                                            {v}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="block text-sm">
                                <span className="font-medium text-slate-700">Min. Stand Budget</span>
                                <input type="text" value={data.quote_estimate_from} onChange={(e) => setData('quote_estimate_from', e.target.value)} className={inputClass} />
                            </label>
                            <label className="block text-sm">
                                <span className="font-medium text-slate-700">Max. Stand Budget</span>
                                <input type="text" value={data.quote_estimate_to} onChange={(e) => setData('quote_estimate_to', e.target.value)} className={inputClass} />
                            </label>
                            <label className="block text-sm">
                                <span className="font-medium text-slate-700">Currency</span>
                                <select value={data.quote_currency_type} onChange={(e) => setData('quote_currency_type', e.target.value)} className={inputClass}>
                                    {['EURO', 'DOLLAR', 'AED', 'INR'].map((v) => (
                                        <option key={v} value={v}>
                                            {v}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="block text-sm md:col-span-2">
                                <span className="font-medium text-slate-700">Message</span>
                                <textarea rows={4} value={data.quote_event_desc} onChange={(e) => setData('quote_event_desc', e.target.value)} className={inputClass} />
                            </label>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-slate-900">Contact Details</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                    <label className="block text-sm">
                        <span className="font-medium text-slate-700">Contact Person</span>
                        <input type="text" value={data.quote_name} onChange={(e) => setData('quote_name', e.target.value)} className={inputClass} />
                        {errors.quote_name ? <div className="mt-1 text-xs text-rose-600">{errors.quote_name}</div> : null}
                    </label>
                    <label className="block text-sm">
                        <span className="font-medium text-slate-700">Email</span>
                        <input type="email" value={data.quote_email} onChange={(e) => setData('quote_email', e.target.value)} className={inputClass} />
                        {errors.quote_email ? <div className="mt-1 text-xs text-rose-600">{errors.quote_email}</div> : null}
                    </label>
                    <label className="block text-sm">
                        <span className="font-medium text-slate-700">Mobile</span>
                        <input type="text" value={data.quote_mobile} onChange={(e) => setData('quote_mobile', e.target.value)} className={inputClass} />
                        {errors.quote_mobile ? <div className="mt-1 text-xs text-rose-600">{errors.quote_mobile}</div> : null}
                    </label>
                    <label className="block text-sm">
                        <span className="font-medium text-slate-700">Company</span>
                        <input
                            type="text"
                            value={data.quote_company_name}
                            onChange={(e) => setData('quote_company_name', e.target.value)}
                            className={inputClass}
                        />
                    </label>
                    <label className="block text-sm">
                        <span className="font-medium text-slate-700">Website</span>
                        <input type="text" value={data.company_website} onChange={(e) => setData('company_website', e.target.value)} className={inputClass} />
                    </label>
                    <label className="block text-sm">
                        <span className="font-medium text-slate-700">Contact Country</span>
                        <select value={data.contact_country} onChange={(e) => setData('contact_country', e.target.value)} className={inputClass}>
                            <option value="">Select Country</option>
                            {countries.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="block text-sm">
                        <span className="font-medium text-slate-700">Lead Stage</span>
                        <select value={data.stage} onChange={(e) => setData('stage', e.target.value)} className={inputClass}>
                            {STAGES.map((s) => (
                                <option key={s.value} value={s.value}>
                                    {s.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="block text-sm">
                        <span className="font-medium text-slate-700">Verified Status</span>
                        <select value={data.valid_lead_status} onChange={(e) => setData('valid_lead_status', e.target.value)} className={inputClass}>
                            <option value="1">Verified</option>
                            <option value="0">Unverified</option>
                        </select>
                    </label>
                    <label className="block text-sm">
                        <span className="font-medium text-slate-700">Current Status</span>
                        <input type="text" value={data.status} onChange={(e) => setData('status', e.target.value)} className={inputClass} />
                    </label>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                        >
                            {processing ? 'Saving...' : 'Update quotation'}
                        </button>
                    </div>
                </form>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h3 className="mb-3 text-sm font-semibold text-slate-900">Comments</h3>
                    <div className="space-y-3">
                        {comments.map((c, i) => (
                            <div key={i} className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs">
                                <div className="font-semibold text-slate-800">
                                    {c.commented_by} <span className="font-normal text-slate-500">({c.comment_date})</span>
                                </div>
                                <p className="mt-1 text-slate-700">{c.comment}</p>
                            </div>
                        ))}
                        {!comments.length ? <p className="text-xs text-slate-500">No comments found.</p> : null}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
