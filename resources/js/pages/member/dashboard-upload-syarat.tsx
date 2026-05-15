import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { getStoredTheme, setStoredTheme } from '@/lib/theme';
import Alert from '@/components/ui/alert';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';

interface FileKesehatan {
    id: number;
    file_lockes: string;
    is_revisi: boolean;
}

interface Parameter {
    nama: string;
    tipe_value: 'number' | 'string' | 'boolean';
    nilai: string;
}

interface KesehatanFull {
    id: number;
    namalbg: string | null;
    lokasi: string | null;
    tb: number | null;
    bb: number | null;
    tensi: string | null;
    nadi: string | null;
    param_kesehatan: Record<string, any> | null;
    status: string;
    catatan: string | null;
}

interface KesehatanData {
    status: string | null;
    catatan: string | null;
    finalized: boolean;
    finalized_at: string | null;
    files: FileKesehatan[];
    full: KesehatanFull | null;
    parameters: Parameter[];
}

interface PesertaData {
    id: number;
    nama: string;
    nup: string;
    noujian: string | null;
    status: boolean;
    foto: string | null;
    email: string | null;
    tanggal_lahir: string | null;
    jenis_kelamin: string | null;
    no_hp: string | null;
    lulus_tahap_1: boolean;
    lulus_tahap_1_prodi: string | null;
    is_finalized: boolean;
}

interface DashboardUploadSyaratProps {
    peserta: PesertaData | null;
    kesehatan: KesehatanData | null;
}

export default function DashboardUploadSyarat({ peserta, kesehatan }: DashboardUploadSyaratProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [themeOpen, setThemeOpen] = useState(false);
    const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>(getStoredTheme());
    const fileInputRef = useRef<HTMLInputElement>(null);
    const themeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
                setThemeOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
        setStoredTheme(theme);
        setCurrentTheme(theme);
        setThemeOpen(false);
    };

    const parametersRef = useRef<Parameter[]>(kesehatan?.parameters || []);
    parametersRef.current = kesehatan?.parameters || [];

    const paramData: Record<string, any> = {};

    if (kesehatan?.full?.param_kesehatan) {
        Object.entries(kesehatan.full.param_kesehatan).forEach(([key, value]) => {
            paramData[key] = value;
        });
    }

    const { data, setData, post, processing, errors, reset, transform } = useForm({
        namalbg: kesehatan?.full?.namalbg || '',
        lokasi: kesehatan?.full?.lokasi || '',
        ...(kesehatan?.parameters || []).reduce((acc, param) => {
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

    transform((formData) => ({
        ...formData,
        parameters: parametersRef.current,
    }));

    const { data: fileData, setData: setFileData, processing: fileProcessing } = useForm({
        file: null as File | null,
    });

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    }, [flash]);

    const handleHealthSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/member/upload/kesehatan', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
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
            preserveScroll: true,
            onSuccess: () => {
                setFileData('file', null);

                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    const handleDeleteFile = (fileId: number) => {
        if (confirm('Hapus file ini?')) {
            router.delete(`/member/upload/kesehatan/file/${fileId}`, {
                preserveScroll: true,
            });
        }
    };

    const handleFinalize = () => {
        if (confirm('Apakah Anda yakin ingin memfinalisasi data kesehatan? Setelah difinalisasi, data dan dokumen tidak dapat diubah atau dihapus lagi.')) {
            router.post('/member/upload/kesehatan/finalize', {}, {
                preserveScroll: true,
            });
        }
    };

    const getDocStatusVariant = (status: string | null) => {
        switch (status) {
            case 'Lengkap': return 'success';
            case 'Tidak Lengkap': return 'danger';
            case 'Perbaikan': return 'warning';
            default: return 'info';
        }
    };

    const getDocStatusLabel = (status: string | null) => {
        return status || 'Belum Upload';
    };

    const isNotLulusFinal = peserta?.is_finalized === true && peserta?.lulus_tahap_1 === false;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 dark:from-gray-900 dark:to-gray-800">
            <Head title="Dashboard Upload Syarat" />
            <div className="mx-auto max-w-5xl">
                <div className="mb-8 text-center relative">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Seleksi Mandiri Masuk</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Politeknik Pariwisata Palembang</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Dashboard Upload Syarat Peserta</p>

                    <div className="absolute right-0 top-0" ref={themeRef}>
                        <button
                            onClick={() => setThemeOpen(!themeOpen)}
                            className="rounded-full p-2 text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 transition-all"
                            title="Tema"
                        >
                            <span className="material-symbols-outlined text-lg">
                                {currentTheme === 'light' && 'light_mode'}
                                {currentTheme === 'dark' && 'dark_mode'}
                                {currentTheme === 'system' && 'desktop_windows'}
                            </span>
                        </button>
                        {themeOpen && (
                            <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50">
                                <button
                                    onClick={() => handleThemeChange('light')}
                                    className={`flex items-center gap-2 px-3 py-2 w-full text-left transition-all text-sm ${
                                        currentTheme === 'light'
                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-lg">light_mode</span> Light
                                </button>
                                <button
                                    onClick={() => handleThemeChange('dark')}
                                    className={`flex items-center gap-2 px-3 py-2 w-full text-left transition-all text-sm ${
                                        currentTheme === 'dark'
                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-lg">dark_mode</span> Dark
                                </button>
                                <button
                                    onClick={() => handleThemeChange('system')}
                                    className={`flex items-center gap-2 px-3 py-2 w-full text-left transition-all text-sm ${
                                        currentTheme === 'system'
                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-lg">desktop_windows</span> System
                                </button>
                            </div>
                        )}
                    </div>
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

                {peserta ? (
                    <div className="space-y-6">
                        <Card>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {peserta.foto ? (
                                        <img src={`/storage/${peserta.foto}`} alt={peserta.nama} className="h-16 w-16 rounded-full object-cover" />
                                    ) : (
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                            {peserta.nama?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Selamat datang, {peserta.nama}
                                        </h2>
                                        <p className="text-sm text-gray-500">NUP: {peserta.nup}</p>
                                    </div>
                                </div>
                                <Badge variant={peserta.status ? 'success' : 'danger'}>
                                    {peserta.status ? 'Aktif' : 'Tidak Aktif'}
                                </Badge>
                            </div>
                        </Card>

                        <Card title="Data Diri">
                            <div className="space-y-3">
                                <div className="flex justify-between border-b border-gray-100 pb-2 dark:border-gray-700">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Nama</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{peserta.nama}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2 dark:border-gray-700">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Tanggal Lahir</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {peserta.tanggal_lahir ? new Date(peserta.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2 dark:border-gray-700">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Jenis Kelamin</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{peserta.jenis_kelamin || '-'}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2 dark:border-gray-700">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">No HP</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{peserta.no_hp || '-'}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2 dark:border-gray-700">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{peserta.email || '-'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Status Kelulusan Tahap 1</span>
                                    {peserta.lulus_tahap_1 ? (
                                        <Badge variant="success">
                                            LULUS{peserta.lulus_tahap_1_prodi ? ` - ${peserta.lulus_tahap_1_prodi}` : ''}
                                        </Badge>
                                    ) : peserta.is_finalized ? (
                                        <Badge variant="danger">TIDAK LULUS</Badge>
                                    ) : (
                                        <Badge variant="warning">BELUM LULUS</Badge>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {isNotLulusFinal ? (
                            <Card>
                                <div className="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/20">
                                    <svg className="mx-auto h-12 w-12 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    <h3 className="mt-3 text-lg font-bold text-red-800 dark:text-red-300">Maaf, Anda Tidak Lulus Tahap 1</h3>
                                    <p className="mt-2 text-sm text-red-700 dark:text-red-400">
                                        Anda tidak dapat melanjutkan ke tahap verifikasi dokumen persyaratan.
                                    </p>
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                                        Silakan hubungi panitia jika ada pertanyaan.
                                    </p>
                                </div>
                            </Card>
                        ) : (
                            <>
                                <Card title="Data Kesehatan">
                                    {kesehatan && (
                                        <div className="mb-4">
                                            <div className="flex items-center gap-2">
                                                <Badge variant={getDocStatusVariant(kesehatan.status)}>
                                                    Status: {getDocStatusLabel(kesehatan.status)}
                                                </Badge>
                                                {kesehatan.finalized && (
                                                    <Badge variant="success">Finalized</Badge>
                                                )}
                                            </div>
                                            {kesehatan.catatan && (kesehatan.status === 'Tidak Lengkap' || kesehatan.status === 'Perbaikan') && (
                                                <div className="mt-2 rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
                                                    <p className="text-sm font-medium text-red-700 dark:text-red-300">Catatan Admin:</p>
                                                    <p className="text-sm text-red-600 dark:text-red-400">{kesehatan.catatan}</p>
                                                </div>
                                            )}
                                            {kesehatan.status === 'Lengkap' && kesehatan.catatan && (
                                                <div className="mt-2 rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                                                    <p className="text-sm text-green-700 dark:text-green-300">Catatan: {kesehatan.catatan}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <form onSubmit={handleHealthSubmit} className="space-y-6">
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

                                        {kesehatan?.parameters && kesehatan.parameters.length > 0 && (
                                            <div className="border-t pt-4">
                                                <h3 className="mb-3 font-medium text-gray-900 dark:text-white">Pemeriksaan</h3>
                                                <div className="grid gap-4 md:grid-cols-3">
                                                    {kesehatan.parameters.map((param) => {
                                                        const key = `param_${param.nama}`;
                                                        const errorKey = key;

                                                        if (param.tipe_value === 'boolean') {
                                                            return (
                                                                <div key={param.nama}>
                                                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                        {param.nama}
                                                                    </label>
                                                                    <select
                                                                        value={data[key] || '0'}
                                                                        onChange={(e) => setData(key, e.target.value)}
                                                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
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

                                <Card title="Upload Dokumen Kesehatan">
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
                                                accept=".pdf,.jpeg,.png,.jpg"
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
                                        <p className="text-xs text-gray-500">Format: PDF, JPG, PNG. Maks: 5MB</p>

                                        {kesehatan?.files && kesehatan.files.length > 0 && (
                                            <div className="mt-4">
                                                <h3 className="mb-2 font-medium text-gray-900 dark:text-white">File Terupload</h3>
                                                <div className="space-y-2">
                                                    {kesehatan.files.map((file) => (
                                                        <div key={file.id} className="flex items-center justify-between rounded border p-2 dark:border-gray-700">
                                                            <a
                                                                href={`/storage/${file.file_lockes}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                                                            >
                                                                {file.file_lockes.split('/').pop()}
                                                            </a>
                                                            {!kesehatan?.finalized && (
                                                                <button
                                                                    onClick={() => handleDeleteFile(file.id)}
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

                                        {!kesehatan?.finalized && kesehatan?.files && kesehatan.files.length > 0 && (
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
                            </>
                        )}

                        <Card>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="block w-full rounded-lg bg-red-600 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-red-700"
                            >
                                Logout
                            </Link>
                        </Card>
                    </div>
                ) : (
                    <Card>
                        <p className="text-gray-600 dark:text-gray-400">
                            Data peserta tidak ditemukan. Silakan hubungi admin.
                        </p>
                    </Card>
                )}
            </div>
        </div>
    );
}
