import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';

interface Survey {
    id: number;
    keterangan: string;
}

interface SurveyFormProps {
    survey: Survey | null;
}

export default function SurveyForm({ survey }: SurveyFormProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const isEdit = !!survey;

    const { data, setData, post, put, processing, errors } = useForm({
        keterangan: survey?.keterangan || '',
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
            put(`/admin/survey/${survey!.id}`);
        } else {
            post('/admin/survey');
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Sumber Informasi' : 'Tambah Sumber Informasi'}>
            <Head title={isEdit ? 'Edit Survey' : 'Tambah Survey'} />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card title={isEdit ? 'Edit Sumber Informasi' : 'Tambah Sumber Informasi'}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        id="keterangan"
                        label="Keterangan"
                        value={data.keterangan}
                        onChange={(e) => setData('keterangan', e.target.value)}
                        error={errors.keterangan}
                        required
                        placeholder="Contoh: Internet, Teman, Sekolah, dll"
                    />
                    <div className="flex justify-end gap-2">
                        <Link href="/admin/survey">
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
