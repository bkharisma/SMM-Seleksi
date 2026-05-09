import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Select from '@/components/ui/select';
import Textarea from '@/components/ui/textarea';

interface Prodi {
    nama_prodi: string;
}

interface Peserta {
    nup: string;
    noujian: string | null;
    nama: string;
    pil1_prodi: Prodi | null;
}

interface FileRaport {
    id: number;
    file_loc: string;
}

interface Raport {
    id: number;
    noujian: string;
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
    peserta: Peserta | null;
    file_raport: FileRaport[];
}

interface RaportFormProps {
    raport: Raport;
}

const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    'Lengkap': 'success',
    'Tidak Lengkap': 'danger',
    'Perbaikan': 'warning',
    'Belum Diperiksa': 'info',
};

export default function RaportForm({ raport }: RaportFormProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        status: raport.status,
        catatan: raport.catatan || '',
    });

    useEffect(() => {
        if (flash?.success) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/upload/raport/${raport.id}/status`);
    };

    const nilaiFields = [
        { label: 'Rata-rata', value: raport.anilai },
        { label: 'X Semester 1 (Peng)', value: raport.x_1peng },
        { label: 'X Semester 1 (Ket)', value: raport.x_1ket },
        { label: 'X Semester 2 (Peng)', value: raport.x_2peng },
        { label: 'X Semester 2 (Ket)', value: raport.x_2ket },
        { label: 'XI Semester 1 (Peng)', value: raport.xi_1peng },
        { label: 'XI Semester 1 (Ket)', value: raport.xi_1ket },
        { label: 'XI Semester 2 (Peng)', value: raport.xi_2peng },
        { label: 'XI Semester 2 (Ket)', value: raport.xi_2ket },
        { label: 'XII Semester 1 (Peng)', value: raport.xii_1peng },
        { label: 'XII Semester 1 (Ket)', value: raport.xii_1ket },
        { label: 'XII Semester 2 (Peng)', value: raport.xii_2peng },
        { label: 'XII Semester 2 (Ket)', value: raport.xii_2ket },
    ];

    return (
        <AdminLayout title="Verifikasi Raport">
            <Head title="Verifikasi Raport" />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <div className="mb-4">
                <Link href="/admin/upload/raport">
                    <Button variant="secondary" size="sm">Kembali</Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card title="Data Peserta">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">NUP</span>
                            <span className="font-medium">{raport.peserta?.nup}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">No. Ujian</span>
                            <span className="font-medium">{raport.peserta?.noujian || '-'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Nama</span>
                            <span className="font-medium">{raport.peserta?.nama}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Pilihan 1</span>
                            <span className="font-medium">{raport.peserta?.pil1_prodi?.nama_prodi}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">NPSN</span>
                            <span className="font-medium">{raport.npsn}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Akreditasi</span>
                            <span className="font-medium">{raport.akreditasi || '-'}</span>
                        </div>
                        <div className="mt-2">
                            <Badge variant={statusColors[raport.status] || 'info'}>
                                {raport.status}
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

                <Card title="Nilai Raport" className="md:col-span-2">
                    <div className="grid gap-2 md:grid-cols-3">
                        {nilaiFields.map((field, idx) => (
                            <div key={idx} className="flex justify-between rounded border p-2 text-sm">
                                <span className="text-gray-500">{field.label}</span>
                                <span className="font-medium">{field.value ?? '-'}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {raport.file_raport.length > 0 && (
                    <Card title="File Raport" className="md:col-span-2">
                        <div className="space-y-2">
                            {raport.file_raport.map((file) => (
                                <a
                                    key={file.id}
                                    href={`/storage/${file.file_loc}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 rounded border p-2 text-sm text-blue-600 hover:bg-gray-50"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    {file.file_loc.split('/').pop()}
                                </a>
                            ))}
                        </div>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}
