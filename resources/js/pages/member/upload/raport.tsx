import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Alert from '@/components/ui/alert';
import Badge from '@/components/ui/badge';

interface Peserta {
    noujian: string | null;
}

interface Raport {
    id: number;
    npsn: string;
    akreditasi: string | null;
    ahuruf: string | null;
    anilai: number | null;
    x_1peng: number | null;
    x_1ket: number | null;
    x_2peng: number | null;
    x_2ket: number | null;
    xi_1peng: number | null;
    xi_1ket: number | null;
    xi_2peng: number | null;
    xi_2ket: number | null;
    xii_1peng: number | null;
    xii_1ket: number | null;
    xii_2peng: number | null;
    xii_2ket: number | null;
    status: string;
    catatan: string | null;
}

interface FileRaport {
    id: number;
    file_loc: string;
}

interface RaportUploadProps {
    peserta: Peserta;
    raport: Raport | null;
    files: FileRaport[];
}

const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    'Lengkap': 'success',
    'Tidak Lengkap': 'danger',
    'Perbaikan': 'warning',
    'Belum Diperiksa': 'info',
};

export default function RaportUpload({ peserta, raport, files }: RaportUploadProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [activeTab, setActiveTab] = useState<'input' | 'upload'>('input');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        npsn: raport?.npsn || '',
        akreditasi: raport?.akreditasi || '',
        ahuruf: raport?.ahuruf || '',
        anilai: raport?.anilai?.toString() || '',
        x_1peng: raport?.x_1peng?.toString() || '',
        x_1ket: raport?.x_1ket?.toString() || '',
        x_2peng: raport?.x_2peng?.toString() || '',
        x_2ket: raport?.x_2ket?.toString() || '',
        xi_1peng: raport?.xi_1peng?.toString() || '',
        xi_1ket: raport?.xi_1ket?.toString() || '',
        xi_2peng: raport?.xi_2peng?.toString() || '',
        xi_2ket: raport?.xi_2ket?.toString() || '',
        xii_1peng: raport?.xii_1peng?.toString() || '',
        xii_1ket: raport?.xii_1ket?.toString() || '',
        xii_2peng: raport?.xii_2peng?.toString() || '',
        xii_2ket: raport?.xii_2ket?.toString() || '',
    });

    const { data: fileData, setData: setFileData, post: postFile, processing: fileProcessing } = useForm({
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
        post('/member/upload/raport');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileData('file', e.target.files[0]);
        }
    };

    const handleUploadFile = () => {
        if (!fileData.file) return;
        const formData = new FormData();
        formData.append('file', fileData.file);
        router.post('/member/upload/raport/file', formData as any, {
            forceFormData: true,
        });
    };

    if (!peserta.noujian) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Head title="Upload Raport" />
                <div className="mx-auto max-w-4xl px-4 py-8">
                    <Card title="Upload Raport">
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
            <Head title="Upload Raport" />

            <div className="mx-auto max-w-4xl px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Raport</h1>
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

                {raport && (
                    <div className="mb-4">
                        <Badge variant={statusColors[raport.status] || 'info'}>
                            Status: {raport.status}
                        </Badge>
                        {raport.catatan && (
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Catatan: {raport.catatan}
                            </p>
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
                        Input Nilai
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
                    <Card title="Input Nilai Raport">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <Input
                                    id="npsn"
                                    label="NPSN Sekolah"
                                    value={data.npsn}
                                    onChange={(e) => setData('npsn', e.target.value)}
                                    error={errors.npsn}
                                    required
                                />
                                <Input
                                    id="akreditasi"
                                    label="Akreditasi"
                                    value={data.akreditasi}
                                    onChange={(e) => setData('akreditasi', e.target.value)}
                                    error={errors.akreditasi}
                                />
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="mb-3 font-medium text-gray-900 dark:text-white">Nilai Rata-rata</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Input
                                        id="anilai"
                                        label="Nilai Rata-rata"
                                        type="number"
                                        value={data.anilai}
                                        onChange={(e) => setData('anilai', e.target.value)}
                                    />
                                    <Input
                                        id="ahuruf"
                                        label="Nilai Huruf"
                                        value={data.ahuruf}
                                        onChange={(e) => setData('ahuruf', e.target.value)}
                                    />
                                </div>
                            </div>

                            {['x', 'xi', 'xii'].map((kelas) => (
                                <div key={kelas} className="border-t pt-4">
                                    <h3 className="mb-3 font-medium text-gray-900 dark:text-white">
                                        Kelas {kelas.toUpperCase()}
                                    </h3>
                                    <div className="grid gap-4 md:grid-cols-4">
                                        <Input
                                            id={`${kelas}_1peng`}
                                            label="Semester 1 (Peng)"
                                            type="number"
                                            value={data[`${kelas}_1peng` as keyof typeof data]}
                                            onChange={(e) => setData(`${kelas}_1peng` as any, e.target.value)}
                                        />
                                        <Input
                                            id={`${kelas}_1ket`}
                                            label="Semester 1 (Ket)"
                                            type="number"
                                            value={data[`${kelas}_1ket` as keyof typeof data]}
                                            onChange={(e) => setData(`${kelas}_1ket` as any, e.target.value)}
                                        />
                                        <Input
                                            id={`${kelas}_2peng`}
                                            label="Semester 2 (Peng)"
                                            type="number"
                                            value={data[`${kelas}_2peng` as keyof typeof data]}
                                            onChange={(e) => setData(`${kelas}_2peng` as any, e.target.value)}
                                        />
                                        <Input
                                            id={`${kelas}_2ket`}
                                            label="Semester 2 (Ket)"
                                            type="number"
                                            value={data[`${kelas}_2ket` as keyof typeof data]}
                                            onChange={(e) => setData(`${kelas}_2ket` as any, e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-end">
                                <Button type="submit" isLoading={processing}>Simpan Data</Button>
                            </div>
                        </form>
                    </Card>
                )}

                {activeTab === 'upload' && (
                    <Card title="Upload File Raport (PDF)">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <Button
                                    variant="secondary"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Pilih File PDF
                                </Button>
                                {fileData.file && (
                                    <>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {fileData.file.name}
                                        </span>
                                        <Button onClick={handleUploadFile} isLoading={fileProcessing} size="sm">
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
                                                    href={`/storage/${file.file_loc}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:underline"
                                                >
                                                    {file.file_loc.split('/').pop()}
                                                </a>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Hapus file ini?')) {
                                                            router.delete(`/member/upload/raport/file/${file.id}`);
                                                        }
                                                    }}
                                                    className="text-sm text-red-600 hover:text-red-800"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
