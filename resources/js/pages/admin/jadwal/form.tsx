import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';

interface Jadwal {
    id: number;
    nama_jadwal: string;
    keterangan: string | null;
    tgl_awal: string | null;
    tgl_akhir: string | null;
    jam_awal: string | null;
    jam_akhir: string | null;
    jenis: string | null;
    active: boolean;
}

interface JadwalFormProps {
    jadwal: Jadwal | null;
}

export default function JadwalForm({ jadwal }: JadwalFormProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const isEdit = !!jadwal;

    const formatDate = (date: string | null) => {
        if (!date) {
return '';
}

        return date.split('T')[0];
    };

    const { data, setData, post, put, processing, errors } = useForm({
        nama_jadwal: jadwal?.nama_jadwal || '',
        keterangan: jadwal?.keterangan || '',
        tgl_awal: jadwal?.tgl_awal ? formatDate(jadwal.tgl_awal) : '',
        tgl_akhir: jadwal?.tgl_akhir ? formatDate(jadwal.tgl_akhir) : '',
        jam_awal: jadwal?.jam_awal || '',
        jam_akhir: jadwal?.jam_akhir || '',
        jenis: jadwal?.jenis || '',
        active: jadwal?.active ?? true,
    });

    useEffect(() => {
        if (flash?.success) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(`/admin/jadwal/${jadwal!.id}`);
        } else {
            post('/admin/jadwal');
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Jadwal' : 'Tambah Jadwal'}>
            <Head title={isEdit ? 'Edit Jadwal' : 'Tambah Jadwal'} />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card title={isEdit ? 'Edit Jadwal' : 'Tambah Jadwal'}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Input
                            id="nama_jadwal"
                            label="Nama Jadwal"
                            value={data.nama_jadwal}
                            onChange={(e) => setData('nama_jadwal', e.target.value)}
                            error={errors.nama_jadwal}
                            required
                        />
                        <Select
                            id="jenis"
                            label="Jenis"
                            value={data.jenis}
                            onChange={(e) => setData('jenis', e.target.value)}
                            options={[
                                { value: 'ujian', label: 'Ujian' },
                                { value: 'wawancara', label: 'Wawancara' },
                                { value: 'kesehatan', label: 'Kesehatan' },
                                { value: 'daftar', label: 'Pendaftaran' },
                                { value: 'lainnya', label: 'Lainnya' },
                            ]}
                            placeholder="Pilih Jenis"
                        />
                        <Input
                            id="tgl_awal"
                            label="Tanggal Awal"
                            type="date"
                            value={data.tgl_awal}
                            onChange={(e) => setData('tgl_awal', e.target.value)}
                        />
                        <Input
                            id="tgl_akhir"
                            label="Tanggal Akhir"
                            type="date"
                            value={data.tgl_akhir}
                            onChange={(e) => setData('tgl_akhir', e.target.value)}
                        />
                        <Input
                            id="jam_awal"
                            label="Jam Awal"
                            type="time"
                            value={data.jam_awal}
                            onChange={(e) => setData('jam_awal', e.target.value)}
                        />
                        <Input
                            id="jam_akhir"
                            label="Jam Akhir"
                            type="time"
                            value={data.jam_akhir}
                            onChange={(e) => setData('jam_akhir', e.target.value)}
                        />
                    </div>
                    <Input
                        id="keterangan"
                        label="Keterangan"
                        value={data.keterangan}
                        onChange={(e) => setData('keterangan', e.target.value)}
                    />
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="active"
                            checked={data.active}
                            onChange={(e) => setData('active', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="active" className="text-sm text-gray-700 dark:text-gray-300">
                            Aktif
                        </label>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Link href="/admin/jadwal">
                            <Button variant="secondary" type="button">Batal</Button>
                        </Link>
                        <Button type="submit" isLoading={processing}>
                            {isEdit ? 'Perbarui' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </Card>
        </AdminLayout>
    );
}
