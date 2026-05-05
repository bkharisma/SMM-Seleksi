import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Card from '@/components/ui/card';
import Select from '@/components/ui/select';
import Textarea from '@/components/ui/textarea';
import Button from '@/components/ui/button';
import Alert from '@/components/ui/alert';
import Badge from '@/components/ui/badge';

interface Prodi {
    nama_prodi: string;
}

interface Peserta {
    nup: string;
    noujian: string | null;
    nama: string;
    pil1_prodi: Prodi | null;
}

interface FileKesehatan {
    id: number;
    file_lockes: string;
}

interface Kesehatan {
    id: number;
    noujian: string;
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
    peserta: Peserta | null;
    file_kesehatan: FileKesehatan[];
}

interface KesehatanFormProps {
    kesehatan: Kesehatan;
}

const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    'Lengkap': 'success',
    'Tidak Lengkap': 'danger',
    'Perbaikan': 'warning',
    'Belum Diperiksa': 'info',
};

export default function KesehatanForm({ kesehatan }: KesehatanFormProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        status: kesehatan.status,
        catatan: kesehatan.catatan || '',
    });

    useEffect(() => {
        if (flash?.success) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/upload/kesehatan/${kesehatan.id}/status`);
    };

    const healthFields = [
        { label: 'Lembaga', value: kesehatan.namalbg },
        { label: 'Lokasi', value: kesehatan.lokasi },
        { label: 'TB (cm)', value: kesehatan.tb },
        { label: 'BB (kg)', value: kesehatan.bb },
        { label: 'OW', value: kesehatan.ow },
        { label: 'Obesitas', value: kesehatan.obesitas },
        { label: 'Tensi', value: kesehatan.tensi },
        { label: 'Nadi', value: kesehatan.nadi },
        { label: 'Tato', value: kesehatan.tato },
        { label: 'Tindik', value: kesehatan.tindik },
        { label: 'Buta Warna', value: kesehatan.bw },
        { label: 'Strabismus', value: kesehatan.strab },
        { label: 'Pupil', value: kesehatan.pupil },
        { label: 'Paru-paru', value: kesehatan.paru },
        { label: 'Scoliosis', value: kesehatan.sco },
        { label: 'Morphin', value: kesehatan.mop },
        { label: 'Amphetamine', value: kesehatan.amp },
        { label: 'THC', value: kesehatan.thc },
        { label: 'Kehamilan', value: kesehatan.kehamilan },
    ];

    return (
        <AdminLayout title="Verifikasi Kesehatan">
            <Head title="Verifikasi Kesehatan" />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <div className="mb-4">
                <Link href="/admin/upload/kesehatan">
                    <Button variant="secondary" size="sm">Kembali</Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card title="Data Peserta">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">NUP</span>
                            <span className="font-medium">{kesehatan.peserta?.nup}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">No. Ujian</span>
                            <span className="font-medium">{kesehatan.peserta?.noujian || '-'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Nama</span>
                            <span className="font-medium">{kesehatan.peserta?.nama}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Pilihan 1</span>
                            <span className="font-medium">{kesehatan.peserta?.pil1_prodi?.nama_prodi}</span>
                        </div>
                        <div className="mt-2">
                            <Badge variant={statusColors[kesehatan.status] || 'info'}>
                                {kesehatan.status}
                            </Badge>
                        </div>
                    </div>
                </Card>

                <Card title="Update Status">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Select
                            id="status"
                            label="Status"
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            options={[
                                { value: 'Belum Diperiksa', label: 'Belum Diperiksa' },
                                { value: 'Lengkap', label: 'Lengkap' },
                                { value: 'Tidak Lengkap', label: 'Tidak Lengkap' },
                                { value: 'Perbaikan', label: 'Perbaikan' },
                            ]}
                            placeholder="Pilih Status"
                            error={errors.status}
                        />
                        <Textarea
                            id="catatan"
                            label="Catatan"
                            value={data.catatan}
                            onChange={(e) => setData('catatan', e.target.value)}
                            error={errors.catatan}
                            rows={3}
                        />
                        <Button type="submit" isLoading={processing}>Update Status</Button>
                    </form>
                </Card>

                <Card title="Data Kesehatan" className="md:col-span-2">
                    <div className="grid gap-2 md:grid-cols-3">
                        {healthFields.map((field, idx) => (
                            <div key={idx} className="flex justify-between rounded border p-2 text-sm">
                                <span className="text-gray-500">{field.label}</span>
                                <span className="font-medium">{field.value ?? '-'}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {kesehatan.file_kesehatan.length > 0 && (
                    <Card title="File Kesehatan" className="md:col-span-2">
                        <div className="space-y-2">
                            {kesehatan.file_kesehatan.map((file) => (
                                <a
                                    key={file.id}
                                    href={`/storage/${file.file_lockes}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 rounded border p-2 text-sm text-blue-600 hover:bg-gray-50"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    {file.file_lockes.split('/').pop()}
                                </a>
                            ))}
                        </div>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}
