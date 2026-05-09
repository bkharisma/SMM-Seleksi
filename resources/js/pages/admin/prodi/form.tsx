import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Textarea from '@/components/ui/textarea';

interface Prodi {
    id: number;
    kode_prodi: string;
    nama_prodi: string;
    singkatan_prodi: string | null;
    jenjang_prodi: string;
    kapasitas: number | null;
    kuota_smm: number | null;
    deskripsi: string | null;
    active: boolean;
}

interface ProdiFormProps {
    prodi: Prodi | null;
}

export default function ProdiForm({ prodi }: ProdiFormProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const isEdit = !!prodi;

    const { data, setData, post, put, processing, errors } = useForm({
        kode_prodi: prodi?.kode_prodi || '',
        nama_prodi: prodi?.nama_prodi || '',
        singkatan_prodi: prodi?.singkatan_prodi || '',
        jenjang_prodi: prodi?.jenjang_prodi || '',
        kapasitas: prodi?.kapasitas?.toString() || '',
        kuota_smm: prodi?.kuota_smm?.toString() || '0',
        deskripsi: prodi?.deskripsi || '',
        active: prodi?.active ?? true,
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
            put(`/admin/prodi/${prodi!.id}`);
        } else {
            post('/admin/prodi');
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Program Studi' : 'Tambah Program Studi'}>
            <Head title={isEdit ? 'Edit Prodi' : 'Tambah Prodi'} />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card title={isEdit ? 'Edit Program Studi' : 'Tambah Program Studi'}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Input
                            id="kode_prodi"
                            label="Kode Prodi"
                            value={data.kode_prodi}
                            onChange={(e) => setData('kode_prodi', e.target.value)}
                            error={errors.kode_prodi}
                            required
                        />
                        <Input
                            id="nama_prodi"
                            label="Nama Program Studi"
                            value={data.nama_prodi}
                            onChange={(e) => setData('nama_prodi', e.target.value)}
                            error={errors.nama_prodi}
                            required
                        />
                        <Input
                            id="singkatan_prodi"
                            label="Singkatan"
                            value={data.singkatan_prodi}
                            onChange={(e) => setData('singkatan_prodi', e.target.value)}
                            error={errors.singkatan_prodi}
                        />
                        <Select
                            id="jenjang_prodi"
                            label="Jenjang"
                            value={data.jenjang_prodi}
                            onChange={(e) => setData('jenjang_prodi', e.target.value)}
                            options={[
                                { value: 'D3', label: 'D3' },
                                { value: 'D4', label: 'D4' },
                                { value: 'S1', label: 'S1' },
                                { value: 'S2', label: 'S2' },
                            ]}
                            placeholder="Pilih Jenjang"
                            error={errors.jenjang_prodi}
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
                            id="kuota_smm"
                            label="Kuota SMM"
                            type="number"
                            value={data.kuota_smm}
                            onChange={(e) => setData('kuota_smm', e.target.value)}
                            error={errors.kuota_smm}
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
                        <Link href="/admin/prodi">
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
