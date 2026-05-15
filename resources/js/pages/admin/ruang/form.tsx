import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';

interface Ruang {
    id: number;
    nomor_ruang: string;
    nama_gedung: string | null;
    kapasitas: number | null;
    urutan: number;
    active: boolean;
}

interface RuangFormProps {
    ruang: Ruang | null;
}

export default function RuangForm({ ruang }: RuangFormProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const isEdit = !!ruang;

    const { data, setData, post, put, processing, errors } = useForm({
        nomor_ruang: ruang?.nomor_ruang || '',
        nama_gedung: ruang?.nama_gedung || '',
        kapasitas: ruang?.kapasitas?.toString() || '',
        urutan: ruang?.urutan?.toString() || '0',
        active: ruang?.active ?? true,
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

        if (isEdit) {
            put(`/admin/ruang/${ruang!.id}`);
        } else {
            post('/admin/ruang');
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Ruang Ujian' : 'Tambah Ruang Ujian'}>
            <Head title={isEdit ? 'Edit Ruang' : 'Tambah Ruang'} />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card title={isEdit ? 'Edit Ruang Ujian' : 'Tambah Ruang Ujian'}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Input
                            id="nomor_ruang"
                            label="Nomor Ruang"
                            value={data.nomor_ruang}
                            onChange={(e) => setData('nomor_ruang', e.target.value)}
                            error={errors.nomor_ruang}
                            required
                        />
                        <Input
                            id="nama_gedung"
                            label="Nama Gedung"
                            value={data.nama_gedung}
                            onChange={(e) => setData('nama_gedung', e.target.value)}
                            error={errors.nama_gedung}
                        />
                        <Input
                            id="kapasitas"
                            label="Kapasitas"
                            type="number"
                            value={data.kapasitas}
                            onChange={(e) => setData('kapasitas', e.target.value)}
                            error={errors.kapasitas}
                        />
                        <Input
                            id="urutan"
                            label="Urutan"
                            type="number"
                            value={data.urutan}
                            onChange={(e) => setData('urutan', e.target.value)}
                            error={errors.urutan}
                        />
                    </div>
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
                        <Link href="/admin/ruang">
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
