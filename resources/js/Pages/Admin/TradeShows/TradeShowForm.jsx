import AdminCKEditor4 from '@/Components/Admin/AdminCKEditor4';
import AdminImageUploadField from '@/Components/Admin/AdminImageUploadField';
import AdminSearchableSelect from '@/Components/Admin/AdminSearchableSelect';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useMemo, useEffect, useState } from 'react';

function fieldClass(err) {
    return `mt-1 w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
        err ? 'border-red-300 bg-red-50/50' : 'border-slate-200'
    }`;
}

export default function TradeShowForm({ tradeshow, categories, countries, cities: initialCities, continents }) {
    const isEdit = Boolean(tradeshow);
    const [cities, setCities] = useState(initialCities ?? []);

    const { data, setData, post, processing, errors } = useForm({
        fairname: tradeshow?.fairname ?? '',
        slug: tradeshow?.slug ?? '',
        faircat: tradeshow?.faircat ?? [],
        alttag: tradeshow?.alttag ?? '',
        continent: tradeshow?.continent ?? '',
        startdate: tradeshow?.startdate ?? '',
        enddate: tradeshow?.enddate ?? '',
        countryname: tradeshow?.countryname ?? '',
        cityname: tradeshow?.cityname ?? '',
        fairwebsite: tradeshow?.fairwebsite ?? '',
        contactemail: tradeshow?.contactemail ?? '',
        fairdesc: tradeshow?.fairdesc ?? '',
        metatitle: tradeshow?.metatitle ?? '',
        metadesc: tradeshow?.metadesc ?? '',
        uploadfile: null,
        oldcomplogo: tradeshow?.fair_logo ?? '',
        clear_existing_logo: false,
    });

    const categoryOptions = useMemo(
        () => (categories ?? []).map((c) => ({ value: c.id, label: c.name })),
        [categories],
    );
    const countryOptions = useMemo(
        () => (countries ?? []).map((c) => ({ value: c.id, label: c.name })),
        [countries],
    );
    const cityOptions = useMemo(
        () => (cities ?? []).map((c) => ({ value: c.id, label: c.name })),
        [cities],
    );
    const continentOptions = useMemo(
        () => (continents ?? []).map((c) => ({ value: c, label: c })),
        [continents],
    );

    useEffect(() => {
        if (!data.countryname) {
            setCities([]);
            return;
        }
        let cancelled = false;
        axios
            .get(route('admin.tradeshows.cities'), { params: { country_id: data.countryname } })
            .then((res) => {
                if (!cancelled) {
                    setCities(res.data);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setCities([]);
                }
            });
        return () => {
            cancelled = true;
        };
    }, [data.countryname]);

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            post(route('admin.tradeshows.update', tradeshow.id), { forceFormData: true, _method: 'put' });
        } else {
            post(route('admin.tradeshows.store'), { forceFormData: true });
        }
    };

    const title = isEdit ? 'Edit trade show' : 'Add trade show';

    return (
        <AdminLayout title={title}>
            <Head title={title} />

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Search country, city, and categories. Logo preview updates when you choose a file; use the trash
                        icon to remove the current logo on edit.
                    </p>
                </div>
                <Link
                    href={route('admin.tradeshows.index')}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                    ← Back to list
                </Link>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-800">
                        {isEdit ? 'Update trade show data' : 'Add trade show data'}
                    </div>
                    <div className="grid gap-5 p-6 sm:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium text-slate-700">Fair name</label>
                            <input
                                type="text"
                                value={data.fairname}
                                onChange={(e) => setData('fairname', e.target.value)}
                                className={fieldClass(errors.fairname)}
                            />
                            {errors.fairname && <p className="mt-1 text-xs text-red-600">{errors.fairname}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">URL / slug</label>
                            <input
                                type="text"
                                value={data.slug}
                                onChange={(e) => setData('slug', e.target.value)}
                                className={fieldClass(errors.slug)}
                            />
                            {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug}</p>}
                        </div>
                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Fair category (multi) — search to filter
                            </label>
                            <AdminSearchableSelect
                                options={categoryOptions}
                                value={data.faircat}
                                onChange={(v) => setData('faircat', v)}
                                isMulti
                                placeholder="Search categories…"
                                error={errors.faircat}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <AdminImageUploadField
                                label="Upload logo"
                                uploadfile={data.uploadfile}
                                onFileChange={(file) => setData('uploadfile', file)}
                                existingFilename={data.oldcomplogo}
                                publicBasePath="/uploads/tradeshow"
                                isEdit={isEdit}
                                clearExisting={data.clear_existing_logo}
                                onClearExisting={(v) => {
                                    setData('clear_existing_logo', v);
                                    if (v) {
                                        setData('oldcomplogo', '');
                                    }
                                }}
                                error={errors.uploadfile}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">Alt tag</label>
                            <input
                                type="text"
                                value={data.alttag}
                                onChange={(e) => setData('alttag', e.target.value)}
                                className={fieldClass(errors.alttag)}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Continent</label>
                            <AdminSearchableSelect
                                options={continentOptions}
                                value={data.continent}
                                onChange={(v) => setData('continent', v)}
                                placeholder="Search continent…"
                                error={errors.continent}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">Event start date</label>
                            <input
                                type="date"
                                value={data.startdate ?? ''}
                                onChange={(e) => setData('startdate', e.target.value)}
                                className={fieldClass(errors.startdate)}
                            />
                            {errors.startdate && <p className="mt-1 text-xs text-red-600">{errors.startdate}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">Event end date</label>
                            <input
                                type="date"
                                value={data.enddate ?? ''}
                                onChange={(e) => setData('enddate', e.target.value)}
                                className={fieldClass(errors.enddate)}
                            />
                            {errors.enddate && <p className="mt-1 text-xs text-red-600">{errors.enddate}</p>}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Event country — search to filter
                            </label>
                            <AdminSearchableSelect
                                options={countryOptions}
                                value={data.countryname}
                                onChange={(v) => {
                                    setData('countryname', v);
                                    setData('cityname', '');
                                }}
                                placeholder="Search country…"
                                error={errors.countryname}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Event city — search to filter
                            </label>
                            <AdminSearchableSelect
                                options={cityOptions}
                                value={data.cityname}
                                onChange={(v) => setData('cityname', v)}
                                isDisabled={!data.countryname}
                                placeholder={data.countryname ? 'Search city…' : 'Select a country first'}
                                isClearable
                                error={errors.cityname}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">Fair website</label>
                            <input
                                type="text"
                                value={data.fairwebsite}
                                onChange={(e) => setData('fairwebsite', e.target.value)}
                                className={fieldClass(errors.fairwebsite)}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">Contact email</label>
                            <input
                                type="email"
                                value={data.contactemail}
                                onChange={(e) => setData('contactemail', e.target.value)}
                                className={fieldClass(errors.contactemail)}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="text-sm font-medium text-slate-700">Trade show description</label>
                            <div className="mt-1">
                                <AdminCKEditor4
                                    key={isEdit ? tradeshow.id : 'new'}
                                    value={data.fairdesc}
                                    onChange={(html) => setData('fairdesc', html)}
                                />
                            </div>
                            {errors.fairdesc && <p className="mt-1 text-xs text-red-600">{errors.fairdesc}</p>}
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-800">SEO</div>
                    <div className="space-y-4 p-6">
                        <div>
                            <label className="text-sm font-medium text-slate-700">Meta title</label>
                            <textarea
                                rows={2}
                                value={data.metatitle}
                                onChange={(e) => setData('metatitle', e.target.value)}
                                className={fieldClass(errors.metatitle)}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">Meta description</label>
                            <textarea
                                rows={3}
                                value={data.metadesc}
                                onChange={(e) => setData('metadesc', e.target.value)}
                                className={fieldClass(errors.metadesc)}
                            />
                        </div>
                        <div className="text-center">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center rounded-lg bg-emerald-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
                            >
                                {processing ? 'Saving…' : isEdit ? 'Update trade show' : 'Add trade show'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
