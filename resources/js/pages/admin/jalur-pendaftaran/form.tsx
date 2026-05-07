import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';

interface JalurPendaftaran {
    id: number;
    kode_jalur: string;
    nama_jalur: string;
    deskripsi: string | null;
    active: boolean;
}

interface JalurFormProps {
    jalur: JalurPendaftaran | null;
}

export default function JalurForm({ jalur }: JalurFormProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const isEdit = !!jalur;

    const { data, setData, post, put, processing, errors } = useForm({
        kode_jalur: jalur?.kode_jalur || '',
        nama_jalur: jalur?.nama_jalur || '',
        deskripsi: jalur?.deskripsi || '',
        active: jalur?.active ?? true,
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
            put(`/admin/jalur-pendaftaran/${jalur!.id}`);
        } else {
            post('/admin/jalur-pendaftaran');
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Jalur Pendaftaran' : 'Tambah Jalur Pendaftaran'}>
            <Head title={isEdit ? 'Edit Jalur' : 'Tambah Jalur'} />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card title={isEdit ? 'Edit Jalur Pendaftaran' : 'Tambah Jalur Pendaftaran'}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Input
                            id="kode_jalur"
                            label="Kode Jalur"
                            value={data.kode_jalur}
                            onChange={(e) => setData('kode_jalur', e.target.value)}
                            error={errors.kode_jalur}
                            required
                        />
                        <Input
                            id="nama_jalur"
                            label="Nama Jalur Pendaftaran"
                            value={data.nama_jalur}
                            onChange={(e) => setData('nama_jalur', e.target.value)}
                            error={errors.nama_jalur}
                            required
                        />
                    </div>
                    <Textarea
                        id="deskripsi"
                        label="Deskripsi"
                        value={data.deskripsi}
                        onChange={(e) => setData('deskripsi', e.target.value)}
                        error={errors.deskripsi}
                        rows={3}
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
                        <Link href="/admin/jalur-pendaftaran">
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
