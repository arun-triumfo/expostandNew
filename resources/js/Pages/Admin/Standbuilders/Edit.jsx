import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';

const NUM_EMPLOYEE = ['', '0-10', '10-100', '100-200', '200-300', '300-400'];
const PRD_CAP = [
    '',
    '0-100',
    '100-500',
    '500-1000',
    '1000-2000',
    '2000-3000',
    '3000-4000',
    '4000-5000',
    '5000-6000',
    '6000-7000',
    '7000-8000',
    '8000-9000',
    '9000-10000',
];

function fieldClass(err) {
    return `mt-1 w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
        err ? 'border-red-300 bg-red-50/50' : 'border-slate-200'
    }`;
}

function toggleId(arr, id, checked) {
    const n = Number(id);
    if (checked) {
        return [...new Set([...(arr ?? []), n])];
    }
    return (arr ?? []).filter((x) => Number(x) !== n);
}

export default function Edit({ standbuilder, countries, services, continentGroups }) {
    const { flash } = usePage().props;
    const [cities, setCities] = useState([]);

    const { data, setData, post, processing, errors } = useForm({
        userid: standbuilder.userid,
        password: '',
        countryname: standbuilder.countryname ?? '',
        cityname: standbuilder.cityname ?? '',
        status: standbuilder.status ?? '1',
        verifystatus: standbuilder.verifystatus ?? '0',
        compaddres: standbuilder.compaddres ?? '',
        metatitle: standbuilder.metatitle ?? '',
        metadesc: standbuilder.metadesc ?? '',
        companyname: standbuilder.companyname ?? '',
        slug: standbuilder.slug ?? '',
        companyweb: standbuilder.companyweb ?? '',
        compphone: standbuilder.compphone ?? '',
        texvat: standbuilder.texvat ?? '',
        regnumber: standbuilder.regnumber ?? '',
        foundationyr: standbuilder.foundationyr ?? '',
        ownername: standbuilder.ownername ?? '',
        numofemployee: standbuilder.numofemployee ?? '',
        oldcomplogo: standbuilder.oldcomplogo ?? '',
        prdsize: standbuilder.prdsize ?? '',
        prdcapicity: standbuilder.prdcapicity ?? '',
        aboutcomp: standbuilder.aboutcomp ?? '',
        serviceid: standbuilder.service_ids ?? [],
        businesscope: standbuilder.business_scope_ids ?? [],
        uploadfile: null,
    });

    const countryOptions = useMemo(() => countries ?? [], [countries]);

    useEffect(() => {
        if (!data.countryname) {
            setCities([]);
            return;
        }
        let cancelled = false;
        axios
            .get(route('cityvalustandbuilder'), { params: { countryyid: data.countryname } })
            .then((res) => {
                if (!cancelled) {
                    const list = res.data?.cities ?? [];
                    setCities(list.map((c) => ({ name: c.name })));
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
        post(route('update-standbuilders'), { forceFormData: true, preserveScroll: true });
    };

    return (
        <AdminLayout title="Update stand builder">
            <Head title="Update stand builder" />

            {flash?.success ? (
                <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{flash.success}</div>
            ) : null}
            {flash?.error ? (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{flash.error}</div>
            ) : null}

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900">Update stand builder</h2>
                <div className="flex flex-wrap gap-2">
                    <Link
                        href={`/view-standbuilders?id=${standbuilder.userid}`}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                    >
                        View stand builder
                    </Link>
                    <Link href={route('standbuilders')} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                        Back to list
                    </Link>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900">Account</h3>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <label className="text-xs font-medium text-slate-500">Name</label>
                            <input type="text" value={standbuilder.name} readOnly className={fieldClass()} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500">Email</label>
                            <input type="text" value={standbuilder.email} readOnly className={fieldClass()} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500">Phone</label>
                            <input type="text" value={standbuilder.phone} readOnly className={fieldClass()} />
                        </div>
                        <div className="sm:col-span-2 lg:col-span-3">
                            <label className="text-xs font-medium text-slate-500">New password (leave blank to keep current)</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                autoComplete="new-password"
                                className={fieldClass(errors.password)}
                            />
                            {errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password}</p> : null}
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900">Location &amp; verification</h3>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <label className="text-xs font-medium text-slate-500">Country</label>
                            <select
                                value={data.countryname}
                                onChange={(e) => {
                                    setData('countryname', e.target.value);
                                    setData('cityname', '');
                                }}
                                className={fieldClass(errors.countryname)}
                            >
                                <option value="">Select country</option>
                                {countryOptions.map((c) => (
                                    <option key={c.id} value={c.name}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500">City</label>
                            <select
                                value={data.cityname}
                                onChange={(e) => setData('cityname', e.target.value)}
                                className={fieldClass(errors.cityname)}
                            >
                                <option value="">Select city</option>
                                {cities.map((c) => (
                                    <option key={c.name} value={c.name}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500">Status</label>
                            <select value={data.status} onChange={(e) => setData('status', e.target.value)} className={fieldClass()}>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500">Verify status</label>
                            <select value={data.verifystatus} onChange={(e) => setData('verifystatus', e.target.value)} className={fieldClass()}>
                                <option value="1">Verified</option>
                                <option value="0">Unverified</option>
                            </select>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="text-xs font-medium text-slate-500">Address</label>
                            <input
                                type="text"
                                value={data.compaddres}
                                onChange={(e) => setData('compaddres', e.target.value)}
                                className={fieldClass(errors.compaddres)}
                            />
                        </div>
                        <div className="sm:col-span-2 lg:col-span-3">
                            <label className="text-xs font-medium text-slate-500">Meta title</label>
                            <input
                                type="text"
                                value={data.metatitle}
                                onChange={(e) => setData('metatitle', e.target.value)}
                                className={fieldClass()}
                            />
                        </div>
                        <div className="sm:col-span-2 lg:col-span-3">
                            <label className="text-xs font-medium text-slate-500">Meta description</label>
                            <textarea
                                value={data.metadesc}
                                onChange={(e) => setData('metadesc', e.target.value)}
                                rows={3}
                                className={fieldClass()}
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900">Company details</h3>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <label className="text-xs font-medium text-slate-500">Company name</label>
                            <input
                                type="text"
                                value={data.companyname}
                                onChange={(e) => setData('companyname', e.target.value)}
                                className={fieldClass(errors.companyname)}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500">Company URL (slug)</label>
                            <input type="text" value={data.slug} onChange={(e) => setData('slug', e.target.value)} className={fieldClass(errors.slug)} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500">Company website</label>
                            <input
                                type="text"
                                value={data.companyweb}
                                onChange={(e) => setData('companyweb', e.target.value)}
                                className={fieldClass()}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500">Company phone</label>
                            <input
                                type="text"
                                value={data.compphone}
                                onChange={(e) => setData('compphone', e.target.value)}
                                className={fieldClass()}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500">TAX/VAT</label>
                            <input type="text" value={data.texvat} onChange={(e) => setData('texvat', e.target.value)} className={fieldClass()} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500">Registration number</label>
                            <input
                                type="text"
                                value={data.regnumber}
                                onChange={(e) => setData('regnumber', e.target.value)}
                                className={fieldClass()}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500">Foundation year</label>
                            <input
                                type="text"
                                value={data.foundationyr}
                                onChange={(e) => setData('foundationyr', e.target.value)}
                                className={fieldClass()}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500">Owner name</label>
                            <input
                                type="text"
                                value={data.ownername}
                                onChange={(e) => setData('ownername', e.target.value)}
                                className={fieldClass()}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500">Number of employees</label>
                            <select
                                value={data.numofemployee}
                                onChange={(e) => setData('numofemployee', e.target.value)}
                                className={fieldClass()}
                            >
                                {NUM_EMPLOYEE.map((o) => (
                                    <option key={o || 'empty'} value={o}>
                                        {o || 'Select employee'}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-3">
                            <label className="text-xs font-medium text-slate-500">Company logo</label>
                            <div className="mt-1 flex flex-wrap items-end gap-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('uploadfile', e.target.files?.[0] ?? null)}
                                    className="text-sm"
                                />
                                <div className="h-16 w-16 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200">
                                    {standbuilder.logo_url ? (
                                        <img src={standbuilder.logo_url} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">No logo</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900">Production house</h3>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="text-xs font-medium text-slate-500">Size of production house</label>
                            <input type="text" value={data.prdsize} onChange={(e) => setData('prdsize', e.target.value)} className={fieldClass()} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500">Production capacity</label>
                            <select
                                value={data.prdcapicity}
                                onChange={(e) => setData('prdcapicity', e.target.value)}
                                className={fieldClass()}
                            >
                                {PRD_CAP.map((o) => (
                                    <option key={o || 'pc'} value={o}>
                                        {o || 'Select production capacity'}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900">Services you offer</h3>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {(services ?? []).map((s) => (
                            <label key={s.id} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={data.serviceid?.map(Number).includes(Number(s.id))}
                                    onChange={(e) => setData('serviceid', toggleId(data.serviceid, s.id, e.target.checked))}
                                    className="rounded border-slate-300"
                                />
                                {s.name}
                            </label>
                        ))}
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900">Business scope</h3>
                    <div className="mt-4 space-y-6">
                        {(continentGroups ?? []).map((g) => {
                            const list = (countries ?? []).filter((c) => c.continent === g.continent);
                            if (!list.length) {
                                return null;
                            }
                            return (
                                <div key={g.continent} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-600">{g.continent}</h4>
                                    <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                                        {list.map((c) => (
                                            <label key={c.id} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                                                <input
                                                    type="checkbox"
                                                    checked={data.businesscope?.map(Number).includes(Number(c.id))}
                                                    onChange={(e) => setData('businesscope', toggleId(data.businesscope, c.id, e.target.checked))}
                                                    className="rounded border-slate-300"
                                                />
                                                {c.name}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900">About company</h3>
                    <textarea
                        value={data.aboutcomp}
                        onChange={(e) => setData('aboutcomp', e.target.value)}
                        rows={5}
                        className={`${fieldClass()} mt-2`}
                        placeholder="Something about your company"
                    />
                </section>

                <div className="flex justify-center pb-8">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-emerald-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
                    >
                        {processing ? 'Saving…' : 'Submit'}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
