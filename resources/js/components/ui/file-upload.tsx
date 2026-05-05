interface FileUploadProps {
    label?: string;
    accept?: string;
    onChange: (file: File | null) => void;
    error?: string;
    preview?: string | null;
    maxSize?: string;
}

export default function FileUpload({ label, accept = '*/*', onChange, error, preview, maxSize }: FileUploadProps) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        onChange(file);
    };

    return (
        <div className="w-full">
            {label && <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
            <div className="flex items-center gap-4">
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-3 hover:border-blue-500 dark:border-gray-600 dark:hover:border-blue-400">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Pilih file</span>
                    <input type="file" accept={accept} onChange={handleFileChange} className="hidden" />
                </label>
                {preview && accept.includes('image') && (
                    <img src={preview} alt="Preview" className="h-16 w-16 rounded-lg object-cover" />
                )}
            </div>
            {maxSize && <p className="mt-1 text-xs text-gray-500">Ukuran maksimal: {maxSize}</p>}
            {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}
