import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import DataTable from '@/components/ui/data-table';

interface Periode {
    id: number;
    spmb: string;
    tgl_awal: string;
    tgl_akhir: string;
    active: boolean;
}

interface PaginatedData {
    data: Periode[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
}

interface PeriodeIndexProps {
    periode: PaginatedData;
    filters: { search?: string };
}

export default function PeriodeIndex({ periode, filters }: PeriodeIndexProps) {
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
        router.get(`/admin/periode${search ? `?search=${search}` : ''}`, {}, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus periode ini?')) {
            router.delete(`/admin/periode/${id}`);
        }
    };

    const columns = [
        { key: 'spmb', label: 'SPMB', sortable: true },
        { key: 'tgl_awal', label: 'Tanggal Awal', sortable: true },
        { key: 'tgl_akhir', label: 'Tanggal Akhir', sortable: true },
        {
            key: 'active',
            label: 'Status',
            render: (item: Periode) => (
                <Badge variant={item.active ? 'success' : 'danger'}>
                    {item.active ? 'Aktif' : 'Nonaktif'}
                </Badge>
            ),
        },
    ];

    return (
        <AdminLayout title="Periode Pendaftaran">
            <Head title="Periode" />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card
                title="Daftar Periode"
                action={
                    <Link href="/admin/periode/create">
                        <Button>Tambah Periode</Button>
                    </Link>
                }
            >
                <div className="mb-4 flex gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Cari SPMB..."
                        className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-background placeholder:text-on-surface-container/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <Button onClick={handleSearch} size="sm">Cari</Button>
                </div>

                <DataTable
                    data={periode.data}
                    columns={columns}
                    pagination={periode}
                    actions={(item: Periode) => (
                        <>
                            <button
                                onClick={() => router.patch(`/admin/periode/${item.id}/toggle-status`)}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                {item.active ? 'Nonaktifkan' : 'Aktifkan'}
                            </button>
                            <Link href={`/admin/periode/${item.id}/edit`} className="text-sm text-yellow-600 hover:text-yellow-800">
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
