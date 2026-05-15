import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import DataTable from '@/components/ui/data-table';

interface JalurPendaftaran {
    id: number;
    kode_jalur: string;
    nama_jalur: string;
    deskripsi: string | null;
    active: boolean;
}

interface PaginatedData {
    data: JalurPendaftaran[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
}

interface JalurIndexProps {
    jalur: PaginatedData;
    filters: { search?: string };
}

export default function JalurIndex({ jalur, filters }: JalurIndexProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        if (flash?.success) {
            setTimeout(() => {
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 3000);
            }, 0);
        }
    }, [flash]);

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (search) {
params.set('search', search);
}

        router.get(`/admin/jalur-pendaftaran?${params.toString()}`, {}, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus jalur pendaftaran ini?')) {
            router.delete(`/admin/jalur-pendaftaran/${id}`);
        }
    };

    const toggleStatus = (id: number) => {
        router.patch(`/admin/jalur-pendaftaran/${id}/toggle-status`);
    };

    const columns = [
        { key: 'kode_jalur', label: 'Kode', sortable: true },
        { key: 'nama_jalur', label: 'Nama Jalur', sortable: true },
        { key: 'deskripsi', label: 'Deskripsi' },
        {
            key: 'active',
            label: 'Status',
            render: (item: JalurPendaftaran) => (
                <Badge variant={item.active ? 'success' : 'danger'}>
                    {item.active ? 'Aktif' : 'Nonaktif'}
                </Badge>
            ),
        },
    ];

    return (
        <AdminLayout title="Jalur Pendaftaran">
            <Head title="Jalur Pendaftaran" />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card
                title="Daftar Jalur Pendaftaran"
                action={
                    <Link href="/admin/jalur-pendaftaran/create">
                        <Button>Tambah Jalur</Button>
                    </Link>
                }
            >
                <div className="mb-4 flex gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Cari jalur..."
                        className="rounded-lg border border-outline-variant px-3 py-2 text-sm text-on-background bg-surface-container-lowest focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <Button onClick={handleSearch} size="sm">Cari</Button>
                </div>

                <DataTable
                    data={jalur.data}
                    columns={columns}
                    pagination={jalur}
                    actions={(item: JalurPendaftaran) => (
                        <>
                            <button
                                onClick={() => toggleStatus(item.id)}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                {item.active ? 'Nonaktifkan' : 'Aktifkan'}
                            </button>
                            <Link href={`/admin/jalur-pendaftaran/${item.id}/edit`} className="text-sm text-yellow-600 hover:text-yellow-800">
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
                />
            </Card>
        </AdminLayout>
    );
}
