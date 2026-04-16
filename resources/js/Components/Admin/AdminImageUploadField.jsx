import { Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function fieldClass(err) {
    return `mt-1 w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
        err ? 'border-red-300 bg-red-50/50' : 'border-slate-200'
    }`;
}

/**
 * File input + preview of newly chosen file and/or existing server image (edit).
 * @param {object} props
 * @param {string} props.label
 * @param {File|null} props.uploadfile
 * @param {function(File|null): void} props.onFileChange
 * @param {string} props.existingFilename — stored filename only (e.g. from DB)
 * @param {string} props.publicBasePath — e.g. `/uploads/tradeshow`
 * @param {boolean} props.isEdit
 * @param {boolean} props.clearExisting — user chose to remove existing image
 * @param {function(boolean): void} props.onClearExisting
 * @param {string} [props.error]
 */
export default function AdminImageUploadField({
    label,
    uploadfile,
    onFileChange,
    existingFilename,
    publicBasePath,
    isEdit,
    clearExisting,
    onClearExisting,
    error,
}) {
    const inputRef = useRef(null);
    const [objectUrl, setObjectUrl] = useState(null);

    useEffect(() => {
        if (!uploadfile) {
            setObjectUrl(null);
            return;
        }
        const url = URL.createObjectURL(uploadfile);
        setObjectUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [uploadfile]);

    const serverSrc =
        isEdit && existingFilename && !clearExisting && !uploadfile
            ? `${publicBasePath}/${existingFilename}`
            : null;

    const showNewPreview = Boolean(uploadfile && objectUrl);

    const clearNewUpload = () => {
        onFileChange(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const removeExisting = () => {
        onClearExisting(true);
        clearNewUpload();
    };

    return (
        <div>
            <label className="text-sm font-medium text-slate-700">{label}</label>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    onFileChange(f);
                    if (f && clearExisting) {
                        onClearExisting(false);
                    }
                }}
                className={fieldClass(error)}
            />
            {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}

            {(showNewPreview || serverSrc) && (
                <div className="relative mt-3 inline-block max-w-full">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                        <img
                            src={showNewPreview ? objectUrl : serverSrc}
                            alt="Preview"
                            className="max-h-40 max-w-full rounded object-contain"
                        />
                        <p className="mt-1 text-xs text-slate-500">
                            {showNewPreview ? 'New upload preview' : 'Current image'}
                        </p>
                    </div>
                    {showNewPreview ? (
                        <button
                            type="button"
                            onClick={clearNewUpload}
                            className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-red-600 shadow-md transition hover:bg-red-50"
                            title="Remove selected file"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    ) : null}
                    {isEdit && serverSrc ? (
                        <button
                            type="button"
                            onClick={removeExisting}
                            className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-red-600 shadow-md transition hover:bg-red-50"
                            title="Delete current image"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    ) : null}
                </div>
            )}
        </div>
    );
}
