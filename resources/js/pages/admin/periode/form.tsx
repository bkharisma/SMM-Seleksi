import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';

interface Periode {
    id: number;
    spmb: string;
    tgl_awal: string;
    tgl_akhir: string;
    active: boolean;
}

interface PeriodeFormProps {
    periode: Periode | null;
}

export default function PeriodeForm({ periode }: PeriodeFormProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const isEdit = !!periode;

    const formatDate = (date: string) => {
        if (!date) {
return '';
}

        return date.split('T')[0];
    };

    const { data, setData, post, put, processing, errors } = useForm({
        spmb: periode?.spmb || '',
        tgl_awal: periode?.tgl_awal ? formatDate(periode.tgl_awal) : '',
        tgl_akhir: periode?.tgl_akhir ? formatDate(periode.tgl_akhir) : '',
        active: periode?.active ?? true,
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
            put(`/admin/periode/${periode!.id}`);
        } else {
            post('/admin/periode');
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Periode' : 'Tambah Periode'}>
            <Head title={isEdit ? 'Edit Periode' : 'Tambah Periode'} />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card title={isEdit ? 'Edit Periode' : 'Tambah Periode'}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-3">
                        <Input
                            id="spmb"
                            label="SPMB"
                            value={data.spmb}
                            onChange={(e) => setData('spmb', e.target.value)}
                            error={errors.spmb}
                            required
                            placeholder="Contoh: 20251"
                        />
                        <Input
                            id="tgl_awal"
                            label="Tanggal Awal"
                            type="date"
                            value={data.tgl_awal}
                            onChange={(e) => setData('tgl_awal', e.target.value)}
                            error={errors.tgl_awal}
                            required
                        />
                        <Input
                            id="tgl_akhir"
                            label="Tanggal Akhir"
                            type="date"
                            value={data.tgl_akhir}
                            onChange={(e) => setData('tgl_akhir', e.target.value)}
                            error={errors.tgl_akhir}
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
                        <Link href="/admin/periode">
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
