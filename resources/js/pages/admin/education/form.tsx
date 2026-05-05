import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Alert from '@/components/ui/alert';

interface EducationLevel {
    code: string;
    description: string;
    orderby: number;
    active: boolean;
}

interface EducationFormProps {
    education: EducationLevel | null;
}

export default function EducationForm({ education }: EducationFormProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const isEdit = !!education;

    const { data, setData, post, put, processing, errors } = useForm({
        code: education?.code || '',
        description: education?.description || '',
        orderby: education?.orderby?.toString() || '0',
        active: education?.active ?? true,
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
            put(`/admin/education/${education!.code}`);
        } else {
            post('/admin/education');
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Jenjang Pendidikan' : 'Tambah Jenjang Pendidikan'}>
            <Head title={isEdit ? 'Edit Education' : 'Tambah Education'} />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card title={isEdit ? 'Edit Jenjang Pendidikan' : 'Tambah Jenjang Pendidikan'}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-3">
                        <Input
                            id="code"
                            label="Kode"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                            error={errors.code}
                            required
                            placeholder="Contoh: SMA"
                            disabled={isEdit}
                        />
                        <Input
                            id="description"
                            label="Deskripsi"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            error={errors.description}
                            required
                        />
                        <Input
                            id="orderby"
                            label="Urutan"
                            type="number"
                            min="0"
                            value={data.orderby}
                            onChange={(e) => setData('orderby', e.target.value)}
                            error={errors.orderby}
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
                        <Link href="/admin/education">
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
