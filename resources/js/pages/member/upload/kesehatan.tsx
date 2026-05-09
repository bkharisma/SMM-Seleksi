import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import Alert from '@/components/ui/alert';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';

interface Peserta {
    noujian: string | null;
}

interface Kesehatan {
    id: number;
    namalbg: string | null;
    lokasi: string | null;
    tb: number | null;
    bb: number | null;
    tensi: string | null;
    nadi: string | null;
    tato: string | null;
    tindik: number | null;
    bw: string | null;
    strab: number | null;
    pupil: string | null;
    paru: string | null;
    sco: string | null;
    param_kesehatan: Record<string, any> | null;
    status: string;
    catatan: string | null;
    finalized: boolean;
    finalized_at: string | null;
}

interface FileKesehatan {
    id: number;
    file_lockes: string;
}

interface Parameter {
    nama: string;
    tipe_value: 'number' | 'string' | 'boolean';
    nilai: string;
}

interface KesehatanUploadProps {
    peserta: Peserta;
    kesehatan: Kesehatan | null;
    files: FileKesehatan[];
    parameters: Parameter[];
}

const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    'Lengkap': 'success',
    'Tidak Lengkap': 'danger',
    'Perbaikan': 'warning',
    'Belum Diperiksa': 'info',
};

export default function KesehatanUpload({ peserta, kesehatan, files, parameters }: KesehatanUploadProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [activeTab, setActiveTab] = useState<'input' | 'upload'>('input');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const paramData: Record<string, any> = {};

    if (kesehatan?.param_kesehatan) {
        Object.entries(kesehatan.param_kesehatan).forEach(([key, value]) => {
            paramData[key] = value;
        });
    }

    const { data, setData, post, processing, errors } = useForm({
        namalbg: kesehatan?.namalbg || '',
        lokasi: kesehatan?.lokasi || '',
        ...parameters.reduce((acc, param) => {
            const key = `param_${param.nama}`;
            const existingValue = paramData[param.nama];

            if (existingValue !== undefined) {
                acc[key] = param.tipe_value === 'boolean' ? (existingValue ? '1' : '0') : existingValue.toString();
            } else if (param.tipe_value === 'boolean') {
                acc[key] = '0';
            } else {
                acc[key] = '';
            }

            return acc;
        }, {} as Record<string, string>),
    });

    const { data: fileData, setData: setFileData, processing: fileProcessing } = useForm({
        file: null as File | null,
    });

    useEffect(() => {
        if (flash?.success) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }

        if (flash?.error) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/member/upload/kesehatan', {
            data: {
                ...data,
                parameters: parameters,
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileData('file', e.target.files[0]);
        }
    };

    const handleUploadFile = () => {
        if (!fileData.file) {
            return;
        }

        const formData = new FormData();
        formData.append('file', fileData.file);
        router.post('/member/upload/kesehatan/file', formData as any, {
            forceFormData: true,
        });
    };

    const handleFinalize = () => {
        if (confirm('Apakah Anda yakin ingin memfinalisasi data kesehatan? Setelah difinalisasi, data dan dokumen tidak dapat diubah atau dihapus lagi.')) {
            router.post('/member/upload/kesehatan/finalize', {}, {
                preserveScroll: true,
            });
        }
    };

    if (!peserta.noujian) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Head title="Upload Kesehatan" />
                <div className="mx-auto max-w-4xl px-4 py-8">
                    <Card title="Upload Kesehatan">
                        <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                Nomor ujian belum tersedia. Silakan hubungi admin.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Head title="Upload Kesehatan" />

            <div className="mx-auto max-w-4xl px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Kesehatan</h1>
                    <Link href="/member/dashboard">
                        <Button variant="secondary" size="sm">Kembali</Button>
                    </Link>
                </div>

                {showAlert && flash?.success && (
                    <div className="mb-4">
                        <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                    </div>
                )}
                {showAlert && flash?.error && (
                    <div className="mb-4">
                        <Alert type="error" message={flash.error} onClose={() => setShowAlert(false)} />
                    </div>
                )}

                {kesehatan && (
                    <div className="mb-4">
                        <div className="flex items-center gap-2">
                            <Badge variant={statusColors[kesehatan.status] || 'info'}>
                                Status: {kesehatan.status}
                            </Badge>
                            {kesehatan.finalized && (
                                <Badge variant="success">Finalized</Badge>
                            )}
                        </div>
                        {kesehatan.catatan && (kesehatan.status === 'Tidak Lengkap' || kesehatan.status === 'Perbaikan') && (
                            <div className="mt-2 rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
                                <p className="text-sm font-medium text-red-700 dark:text-red-300">Catatan Admin:</p>
                                <p className="text-sm text-red-600 dark:text-red-400">{kesehatan.catatan}</p>
                                <p className="mt-1 text-xs text-red-500">Silakan perbaiki dan upload ulang dokumen Anda.</p>
                            </div>
                        )}
                        {kesehatan.status === 'Lengkap' && kesehatan.catatan && (
                            <div className="mt-2 rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                                <p className="text-sm text-green-700 dark:text-green-300">Catatan: {kesehatan.catatan}</p>
                            </div>
                        )}
                    </div>
                )}

                <div className="mb-4 flex gap-2">
                    <button
                        onClick={() => setActiveTab('input')}
                        className={`rounded-lg px-4 py-2 text-sm font-medium ${
                            activeTab === 'input'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-600 shadow dark:bg-gray-800 dark:text-gray-300'
                        }`}
                    >
                        Input Data
                    </button>
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`rounded-lg px-4 py-2 text-sm font-medium ${
                            activeTab === 'upload'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-600 shadow dark:bg-gray-800 dark:text-gray-300'
                        }`}
                    >
                        Upload File
                    </button>
                </div>

                {activeTab === 'input' && (
                    <Card title="Input Data Kesehatan">
                        {kesehatan?.finalized && (
                            <div className="mb-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                                <p className="text-sm text-blue-700 dark:text-blue-300">Data sudah difinalisasi dan tidak dapat diubah.</p>
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <Input
                                    id="namalbg"
                                    label="Nama Lembaga"
                                    value={data.namalbg}
                                    onChange={(e) => setData('namalbg', e.target.value)}
                                    error={errors.namalbg}
                                    disabled={kesehatan?.finalized}
                                />
                                <Input
                                    id="lokasi"
                                    label="Lokasi"
                                    value={data.lokasi}
                                    onChange={(e) => setData('lokasi', e.target.value)}
                                    error={errors.lokasi}
                                    disabled={kesehatan?.finalized}
                                />
                            </div>

                            {parameters.length > 0 && (
                                <div className="border-t pt-4">
                                    <h3 className="mb-3 font-medium text-gray-900 dark:text-white">Pemeriksaan</h3>
                                    <div className="grid gap-4 md:grid-cols-3">
                                        {parameters.map((param) => {
                                            const key = `param_${param.nama}`;
                                            const errorKey = key;

                                            if (param.tipe_value === 'boolean') {
                                                return (
                                                    <div key={param.nama}>
                                                        <label className="mb-1 block text-sm font-medium text-on-surface-container">
                                                            {param.nama}
                                                        </label>
                                                        <select
                                                            value={data[key] || '0'}
                                                            onChange={(e) => setData(key, e.target.value)}
                                                            className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                                                            disabled={kesehatan?.finalized}
                                                        >
                                                            <option value="1">Ya</option>
                                                            <option value="0">Tidak</option>
                                                        </select>
                                                        {param.nilai && (
                                                            <p className="mt-1 text-xs text-gray-500">Standar: {param.nilai}</p>
                                                        )}
                                                        {errors[errorKey] && (
                                                            <p className="mt-1 text-xs text-red-600">{errors[errorKey]}</p>
                                                        )}
                                                    </div>
                                                );
                                            }

                                            return (
                                                <Input
                                                    key={param.nama}
                                                    id={key}
                                                    label={param.nama}
                                                    type={param.tipe_value === 'number' ? 'number' : 'text'}
                                                    value={data[key] || ''}
                                                    onChange={(e) => setData(key, e.target.value)}
                                                    error={errors[errorKey]}
                                                    placeholder={param.nilai ? `Standar: ${param.nilai}` : undefined}
                                                    disabled={kesehatan?.finalized}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end">
                                <Button type="submit" isLoading={processing} disabled={kesehatan?.finalized}>Simpan Data</Button>
                            </div>
                        </form>
                    </Card>
                )}

                {activeTab === 'upload' && (
                    <Card title="Upload File Kesehatan">
                        {kesehatan?.finalized && (
                            <div className="mb-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                                <p className="text-sm text-blue-700 dark:text-blue-300">Dokumen sudah difinalisasi dan tidak dapat dihapus.</p>
                            </div>
                        )}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    disabled={kesehatan?.finalized}
                                />
                                <Button
                                    variant="secondary"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={kesehatan?.finalized}
                                >
                                    Pilih File
                                </Button>
                                {fileData.file && (
                                    <>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {fileData.file.name}
                                        </span>
                                        <Button onClick={handleUploadFile} isLoading={fileProcessing} size="sm" disabled={kesehatan?.finalized}>
                                            Upload
                                        </Button>
                                    </>
                                )}
                            </div>
                            <p className="text-xs text-gray-500">Format: PDF. Maks: 5MB</p>

                            {files.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="mb-2 font-medium text-gray-900 dark:text-white">File Terupload</h3>
                                    <div className="space-y-2">
                                        {files.map((file) => (
                                            <div key={file.id} className="flex items-center justify-between rounded border p-2">
                                                <a
                                                    href={`/storage/${file.file_lockes}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:underline"
                                                >
                                                    {file.file_lockes.split('/').pop()}
                                                </a>
                                                {!kesehatan?.finalized && (
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Hapus file ini?')) {
                                                                router.delete(`/member/upload/kesehatan/file/${file.id}`);
                                                            }
                                                        }}
                                                        className="text-sm text-red-600 hover:text-red-800"
                                                    >
                                                        Hapus
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {!kesehatan?.finalized && files.length > 0 && (
                                <div className="mt-6 border-t pt-4">
                                    <Button onClick={handleFinalize} variant="primary">
                                        Finalisasi Dokumen
                                    </Button>
                                    <p className="mt-2 text-xs text-gray-500">
                                        Setelah finalisasi, dokumen tidak dapat dihapus atau diubah lagi.
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
