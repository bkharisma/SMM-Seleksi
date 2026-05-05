import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Alert from '@/components/ui/alert';

interface TahapSeleksi {
    id: number;
    nama: string;
    urutan: number;
    active: boolean;
}

interface TahapSeleksiFormProps {
    tahap: TahapSeleksi | null;
    maxUrutan: number;
}

export default function TahapSeleksiForm({ tahap, maxUrutan }: TahapSeleksiFormProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const isEdit = !!tahap;

    const { data, setData, post, put, processing, errors } = useForm({
        nama: tahap?.nama || '',
        urutan: tahap?.urutan?.toString() || maxUrutan.toString(),
        active: tahap?.active ?? true,
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
            put(`/admin/tahap-seleksi/${tahap!.id}`);
        } else {
            post('/admin/tahap-seleksi');
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Tahap Seleksi' : 'Tambah Tahap Seleksi'}>
            <Head title={isEdit ? 'Edit Tahap' : 'Tambah Tahap'} />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card title={isEdit ? 'Edit Tahap Seleksi' : 'Tambah Tahap Seleksi'}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Input
                            id="nama"
                            label="Nama Tahap"
                            value={data.nama}
                            onChange={(e) => setData('nama', e.target.value)}
                            error={errors.nama}
                            required
                            placeholder="Contoh: Seleksi Administrasi"
                        />
                        <Input
                            id="urutan"
                            label="Urutan"
                            type="number"
                            min="1"
                            value={data.urutan}
                            onChange={(e) => setData('urutan', e.target.value)}
                            error={errors.urutan}
                            required
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
                        <Link href="/admin/tahap-seleksi">
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
