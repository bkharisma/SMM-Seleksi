interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';
}

const variants = {
    default: 'bg-surface-container text-on-surface',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-error-container text-on-error-container',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-sky-100 text-sky-800',
    neutral: 'bg-gray-100 text-gray-800',
};

export default function Badge({ children, variant = 'default' }: BadgeProps) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}>
            {children}
        </span>
    );
}
