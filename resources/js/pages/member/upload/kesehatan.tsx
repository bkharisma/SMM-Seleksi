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

interface Kesehatan {
    id: number;
    namalbg: string | null;
    lokasi: string | null;
    tb: number | null;
    bb: number | null;
    ow: number | null;
    obesitas: number | null;
    tensi: string | null;
    nadi: string | null;
    tato: string | null;
    tindik: number | null;
    bw: string | null;
    strab: number | null;
    pupil: string | null;
    paru: string | null;
    sco: string | null;
    mop: number | null;
    amp: number | null;
    thc: number | null;
    kehamilan: number | null;
    status: string;
    catatan: string | null;
}

interface FileKesehatan {
    id: number;
    file_lockes: string;
}

interface KesehatanUploadProps {
    peserta: Peserta;
    kesehatan: Kesehatan | null;
    files: FileKesehatan[];
}

const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    'Lengkap': 'success',
    'Tidak Lengkap': 'danger',
    'Perbaikan': 'warning',
    'Belum Diperiksa': 'info',
};

export default function KesehatanUpload({ peserta, kesehatan, files }: KesehatanUploadProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [activeTab, setActiveTab] = useState<'input' | 'upload'>('input');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        namalbg: kesehatan?.namalbg || '',
        lokasi: kesehatan?.lokasi || '',
        tb: kesehatan?.tb?.toString() || '',
        bb: kesehatan?.bb?.toString() || '',
        ow: kesehatan?.ow?.toString() || '',
        obesitas: kesehatan?.obesitas?.toString() || '',
        tensi: kesehatan?.tensi || '',
        nadi: kesehatan?.nadi || '',
        tato: kesehatan?.tato || '',
        tindik: kesehatan?.tindik?.toString() || '',
        bw: kesehatan?.bw || '',
        strab: kesehatan?.strab?.toString() || '',
        pupil: kesehatan?.pupil || '',
        paru: kesehatan?.paru || '',
        sco: kesehatan?.sco || '',
        mop: kesehatan?.mop?.toString() || '',
        amp: kesehatan?.amp?.toString() || '',
        thc: kesehatan?.thc?.toString() || '',
        kehamilan: kesehatan?.kehamilan?.toString() || '',
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
        post('/member/upload/kesehatan');
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
        router.post('/member/upload/kesehatan/file', formData as any, {
            forceFormData: true,
        });
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
                        <Badge variant={statusColors[kesehatan.status] || 'info'}>
                            Status: {kesehatan.status}
                        </Badge>
                        {kesehatan.catatan && (
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Catatan: {kesehatan.catatan}
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
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <Input
                                    id="namalbg"
                                    label="Nama Lembaga"
                                    value={data.namalbg}
                                    onChange={(e) => setData('namalbg', e.target.value)}
                                    error={errors.namalbg}
                                />
                                <Input
                                    id="lokasi"
                                    label="Lokasi"
                                    value={data.lokasi}
                                    onChange={(e) => setData('lokasi', e.target.value)}
                                    error={errors.lokasi}
                                />
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="mb-3 font-medium text-gray-900 dark:text-white">Fisik</h3>
                                <div className="grid gap-4 md:grid-cols-4">
                                    <Input
                                        id="tb"
                                        label="TB (cm)"
                                        type="number"
                                        value={data.tb}
                                        onChange={(e) => setData('tb', e.target.value)}
                                    />
                                    <Input
                                        id="bb"
                                        label="BB (kg)"
                                        type="number"
                                        value={data.bb}
                                        onChange={(e) => setData('bb', e.target.value)}
                                    />
                                    <Input
                                        id="ow"
                                        label="OW"
                                        type="number"
                                        value={data.ow}
                                        onChange={(e) => setData('ow', e.target.value)}
                                    />
                                    <Input
                                        id="obesitas"
                                        label="Obesitas"
                                        type="number"
                                        value={data.obesitas}
                                        onChange={(e) => setData('obesitas', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="mb-3 font-medium text-gray-900 dark:text-white">Vital Sign</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Input
                                        id="tensi"
                                        label="Tensi"
                                        value={data.tensi}
                                        onChange={(e) => setData('tensi', e.target.value)}
                                    />
                                    <Input
                                        id="nadi"
                                        label="Nadi"
                                        value={data.nadi}
                                        onChange={(e) => setData('nadi', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="mb-3 font-medium text-gray-900 dark:text-white">Pemeriksaan</h3>
                                <div className="grid gap-4 md:grid-cols-3">
                                    <Input
                                        id="tato"
                                        label="Tato"
                                        value={data.tato}
                                        onChange={(e) => setData('tato', e.target.value)}
                                    />
                                    <Input
                                        id="tindik"
                                        label="Tindik"
                                        type="number"
                                        value={data.tindik}
                                        onChange={(e) => setData('tindik', e.target.value)}
                                    />
                                    <Input
                                        id="bw"
                                        label="Buta Warna"
                                        value={data.bw}
                                        onChange={(e) => setData('bw', e.target.value)}
                                    />
                                    <Input
                                        id="strab"
                                        label="Strabismus"
                                        type="number"
                                        value={data.strab}
                                        onChange={(e) => setData('strab', e.target.value)}
                                    />
                                    <Input
                                        id="pupil"
                                        label="Pupil"
                                        value={data.pupil}
                                        onChange={(e) => setData('pupil', e.target.value)}
                                    />
                                    <Input
                                        id="paru"
                                        label="Paru-paru"
                                        value={data.paru}
                                        onChange={(e) => setData('paru', e.target.value)}
                                    />
                                    <Input
                                        id="sco"
                                        label="Scoliosis"
                                        value={data.sco}
                                        onChange={(e) => setData('sco', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="mb-3 font-medium text-gray-900 dark:text-white">Tes Narkoba</h3>
                                <div className="grid gap-4 md:grid-cols-3">
                                    <Input
                                        id="mop"
                                        label="Morphin"
                                        type="number"
                                        value={data.mop}
                                        onChange={(e) => setData('mop', e.target.value)}
                                    />
                                    <Input
                                        id="amp"
                                        label="Amphetamine"
                                        type="number"
                                        value={data.amp}
                                        onChange={(e) => setData('amp', e.target.value)}
                                    />
                                    <Input
                                        id="thc"
                                        label="THC"
                                        type="number"
                                        value={data.thc}
                                        onChange={(e) => setData('thc', e.target.value)}
                                    />
                                    <Input
                                        id="kehamilan"
                                        label="Kehamilan"
                                        type="number"
                                        value={data.kehamilan}
                                        onChange={(e) => setData('kehamilan', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" isLoading={processing}>Simpan Data</Button>
                            </div>
                        </form>
                    </Card>
                )}

                {activeTab === 'upload' && (
                    <Card title="Upload File Kesehatan">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.jpeg,.png,.jpg"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <Button
                                    variant="secondary"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Pilih File
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
                            <p className="text-xs text-gray-500">Format: PDF, JPG, PNG. Maks: 5MB</p>

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
