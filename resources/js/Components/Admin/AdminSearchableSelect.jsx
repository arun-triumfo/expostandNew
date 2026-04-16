import { useId } from 'react';
import Select from 'react-select';

const adminSelectStyles = {
    control: (base, state) => ({
        ...base,
        minHeight: 40,
        borderRadius: '0.5rem',
        borderWidth: 1,
        borderColor: state.isFocused ? '#6366f1' : '#e2e8f0',
        boxShadow: state.isFocused ? '0 0 0 2px rgba(99, 102, 241, 0.25)' : 'none',
        fontSize: '0.875rem',
        '&:hover': { borderColor: state.isFocused ? '#6366f1' : '#cbd5e1' },
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    menu: (base) => ({ ...base, zIndex: 9999, fontSize: '0.875rem' }),
    option: (base, state) => ({
        ...base,
        fontSize: '0.875rem',
        backgroundColor: state.isSelected ? '#4f46e5' : state.isFocused ? '#eef2ff' : 'white',
        color: state.isSelected ? 'white' : '#0f172a',
    }),
    multiValue: (base) => ({
        ...base,
        backgroundColor: '#e0e7ff',
        borderRadius: '0.375rem',
    }),
    multiValueLabel: (base) => ({ ...base, color: '#312e81', fontSize: '0.8125rem' }),
    placeholder: (base) => ({ ...base, color: '#94a3b8', fontSize: '0.875rem' }),
    singleValue: (base) => ({ ...base, color: '#0f172a', fontSize: '0.875rem' }),
    input: (base) => ({ ...base, fontSize: '0.875rem' }),
};

/**
 * Searchable dropdown for long option lists (react-select).
 * @param {object} props
 * @param {{ value: string, label: string }[]} props.options
 * @param {string|string[]} props.value — single id string, or array of id strings when isMulti
 * @param {function} props.onChange
 * @param {boolean} [props.isMulti]
 * @param {string} [props.placeholder]
 * @param {boolean} [props.isDisabled]
 * @param {boolean} [props.isClearable]
 * @param {boolean} [props.isSearchable]
 * @param {string} [props.error]
 */
export default function AdminSearchableSelect({
    options,
    value,
    onChange,
    isMulti = false,
    placeholder = 'Search and select…',
    isDisabled = false,
    isClearable = true,
    isSearchable = true,
    error,
}) {
    const instanceId = useId().replace(/:/g, '');
    const mapped = options.map((o) => ({ value: String(o.value), label: o.label }));

    let selected;
    if (isMulti) {
        const ids = Array.isArray(value) ? value.map(String) : [];
        selected = mapped.filter((o) => ids.includes(o.value));
    } else {
        selected = mapped.find((o) => o.value === String(value || '')) ?? null;
    }

    const handleChange = (opt) => {
        if (isMulti) {
            onChange((opt ?? []).map((o) => o.value));
        } else {
            onChange(opt ? opt.value : '');
        }
    };

    return (
        <div>
            <Select
                instanceId={instanceId}
                options={mapped}
                value={isMulti ? selected : selected || null}
                onChange={handleChange}
                isMulti={isMulti}
                isSearchable={isSearchable}
                isDisabled={isDisabled}
                isClearable={isClearable}
                placeholder={placeholder}
                styles={adminSelectStyles}
                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                menuPosition="fixed"
                noOptionsMessage={() => 'No matches'}
            />
            {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
        </div>
    );
}
