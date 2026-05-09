interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    label?: string;
    id?: string;
}

export default function Toggle({ checked, onChange, disabled = false, label, id }: ToggleProps) {
    return (
        <div className="flex items-center gap-3">
            <button
                type="button"
                id={id}
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
                    checked ? 'bg-primary' : 'bg-outline-variant'
                } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            >
                <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        checked ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
            </button>
            {label && (
                <label htmlFor={id} className="text-sm text-on-surface-variant cursor-pointer select-none">
                    {label}
                </label>
            )}
        </div>
    );
}
