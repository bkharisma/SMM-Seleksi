import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';

interface Document {
    name: string;
    size: number;
    url: string;
    created_at: string;
}

interface DocumentsProps {
    documents: Document[];
}

export default function DocumentsIndex({ documents }: DocumentsProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [uploading, setUploading] = useState(false);

    const { post, processing, errors, reset } = useForm({
        file: null as File | null,
    });

    useEffect(() => {
        if (flash?.success) {
            setTimeout(() => {
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 3000);
            }, 0);
        }
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        post('/admin/documents/upload', {
            onSuccess: () => {
                reset();
                setUploading(false);
            },
            onError: () => {
                setUploading(false);
            },
        });
    };

    const handleDelete = (filename: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus file "${filename}"?`)) {
            router.delete(`/admin/documents/${filename}`);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) {
return bytes + ' B';
}

        if (bytes < 1024 * 1024) {
return (bytes / 1024).toFixed(1) + ' KB';
}

        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AdminLayout title="Dokumen">
            <Head title="Dokumen" />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card title="Upload Dokumen" className="mb-6">
                <form onSubmit={handleSubmit} className="flex items-end gap-4">
                    <div className="flex-1">
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            File PDF
                        </label>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setData('file', e.target.files?.[0] || null)}
                            className="w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:text-gray-400 dark:file:bg-blue-900/20 dark:file:text-blue-400"
                        />
                        {errors.file && <p className="mt-1 text-sm text-red-600">{errors.file}</p>}
                    </div>
                    <Button type="submit" isLoading={processing || uploading}>
                        Upload
                    </Button>
                </form>
                <p className="mt-2 text-xs text-gray-500">Format: PDF, Maksimum: 10MB</p>
            </Card>

            <Card title="Daftar Dokumen">
                {documents.length === 0 ? (
                    <p className="py-8 text-center text-sm text-gray-500">Belum ada dokumen</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-surface-container">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Nama File
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Ukuran
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Tanggal Upload
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant bg-surface-container-lowest">
                                {documents.map((doc) => (
                                    <tr key={doc.name} className="hover:bg-surface-container">
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                {doc.name}
                                            </a>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{formatSize(doc.size)}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{formatDate(doc.created_at)}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                                            <button
                                                onClick={() => handleDelete(doc.name)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </AdminLayout>
    );
}
