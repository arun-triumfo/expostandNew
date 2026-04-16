import AdminCKEditor4 from '@/Components/Admin/AdminCKEditor4';
import AdminImageUploadField from '@/Components/Admin/AdminImageUploadField';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

function fieldClass(err) {
    return `mt-1 w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
        err ? 'border-red-300 bg-red-50/50' : 'border-slate-200'
    }`;
}

export default function BlogForm({ blog }) {
    const isEdit = Boolean(blog);
    const { data, setData, post, processing, errors } = useForm({
        title: blog?.title ?? '',
        slug: blog?.slug ?? '',
        blogdesc: blog?.blogdesc ?? '',
        alttag: blog?.alttag ?? '',
        sidebarlmt: blog?.sidebarlmt ?? '',
        status: blog?.status ?? '1',
        metatitle: blog?.metatitle ?? '',
        metadesc: blog?.metadesc ?? '',
        uploadfile: null,
        oldcomplogo: blog?.blog_img ?? '',
        clear_existing_logo: false,
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            post(route('admin.blog.update', blog.id), { forceFormData: true, _method: 'put' });
        } else {
            post(route('admin.blog.store'), { forceFormData: true });
        }
    };

    const title = isEdit ? 'Edit blog' : 'Add blog';

    return (
        <AdminLayout title={title}>
            <Head title={title} />

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Banner preview appears after you choose a file. On edit, use the trash icon to remove the current
                        banner.
                    </p>
                </div>
                <Link
                    href={route('admin.blog.index')}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                    ← Back to list
                </Link>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-800">
                        {isEdit ? 'Update blog data' : 'Add blog data'}
                    </div>
                    <div className="grid gap-5 p-6 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <label className="text-sm font-medium text-slate-700">Blog title</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className={fieldClass(errors.title)}
                            />
                            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
                        </div>
                        <div className="sm:col-span-1">
                            <label className="text-sm font-medium text-slate-700">URL (slug)</label>
                            <input
                                type="text"
                                value={data.slug}
                                onChange={(e) => setData('slug', e.target.value)}
                                className={fieldClass(errors.slug)}
                            />
                            {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug}</p>}
                        </div>
                        <div className="sm:col-span-2">
                            <AdminImageUploadField
                                label="Upload banner"
                                uploadfile={data.uploadfile}
                                onFileChange={(file) => setData('uploadfile', file)}
                                existingFilename={data.oldcomplogo}
                                publicBasePath="/uploads/blog"
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
                        <div className="sm:col-span-1">
                            <label className="text-sm font-medium text-slate-700">Alt tag</label>
                            <input
                                type="text"
                                value={data.alttag}
                                onChange={(e) => setData('alttag', e.target.value)}
                                className={fieldClass(errors.alttag)}
                            />
                        </div>
                        <div className="sm:col-span-1">
                            <label className="text-sm font-medium text-slate-700">Sidebar limit</label>
                            <input
                                type="text"
                                value={data.sidebarlmt}
                                onChange={(e) => setData('sidebarlmt', e.target.value)}
                                className={fieldClass(errors.sidebarlmt)}
                            />
                        </div>
                        <div className="sm:col-span-1">
                            <label className="text-sm font-medium text-slate-700">Status</label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className={fieldClass(errors.status)}
                            >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="text-sm font-medium text-slate-700">Blog description</label>
                            <div className="mt-1">
                                <AdminCKEditor4
                                    key={isEdit ? blog.id : 'new'}
                                    value={data.blogdesc}
                                    onChange={(html) => setData('blogdesc', html)}
                                />
                            </div>
                            {errors.blogdesc && <p className="mt-1 text-xs text-red-600">{errors.blogdesc}</p>}
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-800">
                        SEO
                    </div>
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
                                {processing ? 'Saving…' : isEdit ? 'Update blog' : 'Add blog'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
