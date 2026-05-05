interface AlertProps {
    type?: 'success' | 'error' | 'warning' | 'info';
    message: string;
    onClose?: () => void;
}

const styles = {
    success: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
    error: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
    info: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
};

export default function Alert({ type = 'info', message, onClose }: AlertProps) {
    return (
        <div className={`flex items-center justify-between rounded-lg border px-4 py-3 ${styles[type]}`}>
            <span className="text-sm">{message}</span>
            {onClose && (
                <button onClick={onClose} className="ml-4 opacity-70 hover:opacity-100">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}
