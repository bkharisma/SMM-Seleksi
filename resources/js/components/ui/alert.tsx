interface AlertProps {
    type?: 'success' | 'error' | 'warning' | 'info';
    message: string;
    onClose?: () => void;
}

const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-sky-50 text-sky-800 border-sky-200',
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
