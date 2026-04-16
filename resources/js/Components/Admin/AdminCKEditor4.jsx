import { useEffect, useId, useRef } from 'react';

function loadCKEditorScript() {
    return new Promise((resolve, reject) => {
        if (typeof window !== 'undefined' && window.CKEDITOR) {
            resolve();
            return;
        }
        const existing = document.querySelector('script[data-admin-ckeditor]');
        if (existing) {
            existing.addEventListener('load', () => resolve(), { once: true });
            existing.addEventListener('error', () => reject(new Error('CKEditor load failed')), { once: true });
            return;
        }
        const s = document.createElement('script');
        s.src = '/admin/ckeditor/ckeditor.js';
        s.async = true;
        s.dataset.adminCkeditor = '1';
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('CKEditor load failed'));
        document.body.appendChild(s);
    });
}

/**
 * CKEditor 4 — same bundle as legacy admin (`/admin/ckeditor/ckeditor.js`).
 */
export default function AdminCKEditor4({ value, onChange, minHeight = 280 }) {
    const editorId = useId().replace(/:/g, '_');
    const instanceRef = useRef(null);
    const lastExternal = useRef(value ?? '');
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    useEffect(() => {
        let cancelled = false;
        const id = `admin_cke_${editorId}`;

        (async () => {
            try {
                await loadCKEditorScript();
            } catch {
                return;
            }
            if (cancelled) {
                return;
            }
            const el = document.getElementById(id);
            if (!el || instanceRef.current) {
                return;
            }
            instanceRef.current = window.CKEDITOR.replace(el, { height: minHeight });
            instanceRef.current.setData(value ?? '');
            lastExternal.current = value ?? '';
            instanceRef.current.on('change', () => {
                onChangeRef.current(instanceRef.current.getData());
            });
            instanceRef.current.on('blur', () => {
                onChangeRef.current(instanceRef.current.getData());
            });
        })();

        return () => {
            cancelled = true;
            if (instanceRef.current) {
                try {
                    instanceRef.current.destroy(true);
                } catch {
                    /* ignore */
                }
                instanceRef.current = null;
            }
        };
    }, [editorId, minHeight]);

    useEffect(() => {
        const next = value ?? '';
        if (!instanceRef.current || next === lastExternal.current) {
            return;
        }
        if (instanceRef.current.getData() === next) {
            lastExternal.current = next;
            return;
        }
        instanceRef.current.setData(next);
        lastExternal.current = next;
    }, [value]);

    return (
        <textarea
            id={`admin_cke_${editorId}`}
            name="rich_text_stub"
            rows={8}
            className="w-full rounded-lg border border-slate-200 text-sm"
            defaultValue={value ?? ''}
        />
    );
}
