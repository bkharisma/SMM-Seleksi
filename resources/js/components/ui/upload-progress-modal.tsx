import { CheckCircle, Download, Loader2, XCircle } from 'lucide-react';

interface UploadProgressModalProps {
    isOpen: boolean;
    status: 'idle' | 'uploading' | 'success' | 'error';
    title?: string;
    message?: string;
    errorUrl?: string;
    onClose: () => void;
}

export default function UploadProgressModal({
    isOpen,
    status,
    title,
    message,
    errorUrl,
    onClose,
}: UploadProgressModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden p-4">
            <div
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={status !== 'uploading' ? onClose : undefined}
            />
            <div className="relative w-full max-w-md transform transition-all scale-100 opacity-100">
                <div className="relative rounded-xl bg-white shadow-xl dark:bg-gray-800">
                    <div className="flex items-center justify-between border-b px-6 py-4 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {title || (status === 'uploading' ? 'Upload Data' : 'Hasil Upload')}
                        </h3>
                        {status !== 'uploading' && (
                            <button
                                onClick={onClose}
                                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <div className="p-6">
                        <div className="flex flex-col items-center gap-4 py-4 text-center">
                            {status === 'uploading' && (
                                <>
                                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Sedang memproses upload data. Harap tunggu...
                                    </p>
                                </>
                            )}

                            {status === 'success' && (
                                <>
                                    <CheckCircle className="h-12 w-12 text-green-500" />
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
                                    {errorUrl && (
                                        <a
                                            href={errorUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            <Download className="h-4 w-4" />
                                            Download Laporan Error
                                        </a>
                                    )}
                                    <button
                                        onClick={onClose}
                                        className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
                                    >
                                        Tutup
                                    </button>
                                </>
                            )}

                            {status === 'error' && (
                                <>
                                    <XCircle className="h-12 w-12 text-red-500" />
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
                                    <button
                                        onClick={onClose}
                                        className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
                                    >
                                        Tutup
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
