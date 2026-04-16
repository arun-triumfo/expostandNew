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

const emptyCity = {
    name: '',
    value: '',
    countryid: '',
    countryname: '',
    bannertitle: '',
    bannerdesc: '',
    topdesc: '',
    botdesc: '',
    metatitle: '',
    metadesc: '',
    displyhome: '',
    show_standbuilder_ids: [],
    status: '1',
};

export default function CityForm({ city, countries, standbuilders = [] }) {
    const isEdit = Boolean(city?.id);
    const ckKey = isEdit ? city.id : 'new';

    const countryOptions = useMemo(
        () => (countries ?? []).map((c) => ({ value: c.id, label: c.name })),
        [countries],
    );
    const standbuilderOptions = useMemo(
        () => (standbuilders ?? []).map((s) => ({ value: String(s.id), label: s.label })),
        [standbuilders],
    );

    const { data, setData, post, processing, errors } = useForm(
        isEdit
            ? {
                  name: city.name,
                  value: city.value,
                  countryid: city.countryid,
                  countryname: city.countryname,
                  bannertitle: city.bannertitle,
                  bannerdesc: city.bannerdesc,
                  topdesc: city.topdesc,
                  botdesc: city.botdesc,
                  metatitle: city.metatitle,
                  metadesc: city.metadesc,
                  displyhome: city.displyhome,
                  show_standbuilder_ids: (city.show_standbuilder_ids ?? []).map(String),
                  status: city.status,
              }
            : emptyCity,
    );

    const syncCountryName = (countryId) => {
        const idStr = String(countryId ?? '');
        const opt = (countries ?? []).find((c) => String(c.id) === idStr);
        setData('countryname', opt?.name ?? '');
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            post(route('admin.cities.update', city.id), { _method: 'put' });
        } else {
            post(route('admin.cities.store'));
        }
    };

    const title = isEdit ? 'Edit city' : 'Add city';
    const heading = isEdit ? 'Update city' : 'Add city';
    const btn = isEdit ? 'Update city' : 'Add city';

    return (
        <AdminLayout title={title}>
            <Head title={title} />

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">{heading}</h2>
                    <p className="mt-1 text-sm text-slate-500">Same fields as legacy city master.</p>
                </div>
                <Link href={route('admin.cities.index')} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                    ← Back to listing
                </Link>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-800">
                        City details
                    </div>
                    <div className="grid gap-5 p-6 sm:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium text-slate-700">City name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={fieldClass(errors.name)}
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">City value (URL slug)</label>
                            <input
                                type="text"
                                value={data.value}
                                onChange={(e) => setData('value', e.target.value)}
                                className={fieldClass(errors.value)}
                            />
                            {errors.value && <p className="mt-1 text-xs text-red-600">{errors.value}</p>}
                        </div>
                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-slate-700">Country — search to select</label>
                            <AdminSearchableSelect
                                options={countryOptions}
                                value={data.countryid}
                                onChange={(v) => {
                                    setData('countryid', v);
                                    syncCountryName(v);
                                }}
                                placeholder="Search country…"
                                error={errors.countryid}
                            />
                            {errors.countryname && <p className="mt-1 text-xs text-red-600">{errors.countryname}</p>}
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
                            <label className="text-sm font-medium text-slate-700">Description (top)</label>
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
                            <label className="text-sm font-medium text-slate-700">Display on country page</label>
                            <select
                                value={data.displyhome}
                                onChange={(e) => setData('displyhome', e.target.value)}
                                className={fieldClass(errors.displyhome)}
                            >
                                <option value="city">Yes</option>
                                <option value="">No</option>
                            </select>
                            {errors.displyhome && <p className="mt-1 text-xs text-red-600">{errors.displyhome}</p>}
                        </div>
                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Stand builders to show on city page
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
