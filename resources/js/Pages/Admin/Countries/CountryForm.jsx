import AdminCKEditor4 from '@/Components/Admin/AdminCKEditor4';
import AdminSearchableSelect from '@/Components/Admin/AdminSearchableSelect';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo } from 'react';

function fieldClass(err) {
    return `mt-1 w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
        err ? 'border-red-300 bg-red-50/50' : 'border-slate-200'
    }`;
}

const emptyCountry = {
    name: '',
    value: '',
    continent: '',
    bannertitle: '',
    bannerdesc: '',
    topdesc: '',
    botdesc: '',
    metatitle: '',
    metadesc: '',
    displyhome: '0',
    show_standbuilder_ids: [],
    status: '1',
};

export default function CountryForm({ country, standbuilders = [] }) {
    const isEdit = Boolean(country?.id);
    const ckKey = isEdit ? country.id : 'new';
    const standbuilderOptions = useMemo(
        () => (standbuilders ?? []).map((s) => ({ value: String(s.id), label: s.label })),
        [standbuilders],
    );

    const { data, setData, post, processing, errors } = useForm(
        isEdit
            ? {
                  name: country.name,
                  value: country.value,
                  continent: country.continent,
                  bannertitle: country.bannertitle,
                  bannerdesc: country.bannerdesc,
                  topdesc: country.topdesc,
                  botdesc: country.botdesc,
                  metatitle: country.metatitle,
                  metadesc: country.metadesc,
                  displyhome: country.displyhome,
                  show_standbuilder_ids: (country.show_standbuilder_ids ?? []).map(String),
                  status: country.status,
              }
            : emptyCountry,
    );

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            post(route('admin.countries.update', country.id), { _method: 'put' });
        } else {
            post(route('admin.countries.store'));
        }
    };

    const title = isEdit ? 'Edit country' : 'Add country';
    const heading = isEdit ? 'Update country' : 'Add country';
    const btn = isEdit ? 'Update country' : 'Add country';

    return (
        <AdminLayout title={title}>
            <Head title={title} />

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">{heading}</h2>
                    <p className="mt-1 text-sm text-slate-500">Same fields as legacy country master (CKEditor for HTML blocks).</p>
                </div>
                <Link href={route('admin.countries.index')} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                    ← Back to listing
                </Link>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-800">
                        Country details
                    </div>
                    <div className="grid gap-5 p-6 sm:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium text-slate-700">Country name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={fieldClass(errors.name)}
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">Country value (URL slug)</label>
                            <input
                                type="text"
                                value={data.value}
                                onChange={(e) => setData('value', e.target.value)}
                                className={fieldClass(errors.value)}
                            />
                            {errors.value && <p className="mt-1 text-xs text-red-600">{errors.value}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">Continent</label>
                            <input
                                type="text"
                                value={data.continent}
                                onChange={(e) => setData('continent', e.target.value)}
                                className={fieldClass(errors.continent)}
                            />
                            {errors.continent && <p className="mt-1 text-xs text-red-600">{errors.continent}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">Banner title</label>
                            <input
                                type="text"
                                value={data.bannertitle}
                                onChange={(e) => setData('bannertitle', e.target.value)}
                                className={fieldClass(errors.bannertitle)}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="text-sm font-medium text-slate-700">Banner short description</label>
                            <div className="mt-1">
                                <AdminCKEditor4
                                    key={`${ckKey}-banner`}
                                    value={data.bannerdesc}
                                    onChange={(html) => setData('bannerdesc', html)}
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="text-sm font-medium text-slate-700">Country description (top)</label>
                            <div className="mt-1">
                                <AdminCKEditor4
                                    key={`${ckKey}-top`}
                                    value={data.topdesc}
                                    onChange={(html) => setData('topdesc', html)}
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="text-sm font-medium text-slate-700">Bottom description</label>
                            <div className="mt-1">
                                <AdminCKEditor4
                                    key={`${ckKey}-bot`}
                                    value={data.botdesc}
                                    onChange={(html) => setData('botdesc', html)}
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="text-sm font-medium text-slate-700">Meta title</label>
                            <textarea
                                rows={2}
                                value={data.metatitle}
                                onChange={(e) => setData('metatitle', e.target.value)}
                                className={fieldClass(errors.metatitle)}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="text-sm font-medium text-slate-700">Meta description</label>
                            <textarea
                                rows={3}
                                value={data.metadesc}
                                onChange={(e) => setData('metadesc', e.target.value)}
                                className={fieldClass(errors.metadesc)}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">Status</label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className={fieldClass(errors.status)}
                            >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                            {errors.status && <p className="mt-1 text-xs text-red-600">{errors.status}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">Display on homepage</label>
                            <select
                                value={data.displyhome}
                                onChange={(e) => setData('displyhome', e.target.value)}
                                className={fieldClass(errors.displyhome)}
                            >
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </select>
                            {errors.displyhome && <p className="mt-1 text-xs text-red-600">{errors.displyhome}</p>}
                        </div>
                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Stand builders to show on country page
                            </label>
                            <AdminSearchableSelect
                                options={standbuilderOptions}
                                value={data.show_standbuilder_ids}
                                onChange={(vals) => setData('show_standbuilder_ids', vals)}
                                isMulti
                                placeholder="Select stand builders (optional)"
                                error={errors.show_standbuilder_ids}
                            />
                        </div>
                        <div className="sm:col-span-2 text-center">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center rounded-lg bg-emerald-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
                            >
                                {processing ? 'Saving…' : btn}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
