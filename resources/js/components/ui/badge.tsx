interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';
}

const variants = {
    default: 'bg-surface-container text-on-surface',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    danger: 'bg-error-container text-on-error-container',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    info: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300',
    neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

export default function Badge({ children, variant = 'default' }: BadgeProps) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}>
            {children}
        </span>
    );
}
