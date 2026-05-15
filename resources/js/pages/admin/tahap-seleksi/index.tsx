import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import DataTable from '@/components/ui/data-table';

interface TahapSeleksi {
    id: number;
    nama: string;
    urutan: number;
    active: boolean;
}

interface TahapSeleksiIndexProps {
    tahap: TahapSeleksi[];
}

export default function TahapSeleksiIndex({ tahap }: TahapSeleksiIndexProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setTimeout(() => {
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 3000);
            }, 0);
        }
    }, [flash]);

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus tahap seleksi ini?')) {
            router.delete(`/admin/tahap-seleksi/${id}`);
        }
    };

    const columns = [
        { key: 'urutan', label: 'Urutan', sortable: true },
        { key: 'nama', label: 'Nama Tahap', sortable: true },
        {
            key: 'active',
            label: 'Status',
            render: (item: TahapSeleksi) => (
                <Badge variant={item.active ? 'success' : 'danger'}>
                    {item.active ? 'Aktif' : 'Nonaktif'}
                </Badge>
            ),
        },
    ];

    return (
        <AdminLayout title="Tahap Seleksi">
            <Head title="Tahap Seleksi" />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card
                title="Daftar Tahap Seleksi"
                action={
                    <Link href="/admin/tahap-seleksi/create">
                        <Button>Tambah Tahap</Button>
                    </Link>
                }
            >
                <DataTable
                    data={tahap}
                    columns={columns}
                    actions={(item: TahapSeleksi) => (
                        <>
                            <Link href={`/admin/tahap-seleksi/${item.id}/edit`} className="text-sm text-yellow-600 hover:text-yellow-800">
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="text-sm text-red-600 hover:text-red-800"
                            >
                                Hapus
                            </button>
                        </>
                    )}
                    emptyMessage="Belum ada tahap seleksi"
                />
            </Card>
        </AdminLayout>
    );
}
