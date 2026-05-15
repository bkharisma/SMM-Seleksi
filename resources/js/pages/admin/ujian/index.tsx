import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import DataTable from '@/components/ui/data-table';

interface Ujian {
    id: number;
    nama: string;
    kode: string;
    deskripsi: string | null;
    tahap_seleksi: { id: number; nama: string; urutan: number } | null;
    active: boolean;
}

interface PaginatedData {
    data: Ujian[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
}

interface UjianIndexProps {
    ujian: PaginatedData;
    filters: { search?: string };
}

export default function UjianIndex({ ujian, filters }: UjianIndexProps) {
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
        router.get(`/admin/ujian${search ? `?search=${search}` : ''}`, {}, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus jenis ujian ini?')) {
            router.delete(`/admin/ujian/${id}`);
        }
    };

    const columns = [
        { key: 'kode', label: 'Kode', sortable: true },
        { key: 'nama', label: 'Nama Ujian', sortable: true },
        {
            key: 'tahap',
            label: 'Tahap Seleksi',
            render: (item: Ujian) => (
                <span>{item.tahap_seleksi ? `${item.tahap_seleksi.nama}` : '-'}</span>
            ),
        },
        { key: 'deskripsi', label: 'Deskripsi' },
        {
            key: 'active',
            label: 'Status',
            render: (item: Ujian) => (
                <Badge variant={item.active ? 'success' : 'danger'}>
                    {item.active ? 'Aktif' : 'Nonaktif'}
                </Badge>
            ),
        },
    ];

    return (
        <AdminLayout title="Jenis Ujian">
            <Head title="Jenis Ujian" />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card
                title="Daftar Jenis Ujian"
                action={
                    <Link href="/admin/ujian/create">
                        <Button>Tambah Ujian</Button>
                    </Link>
                }
            >
                <div className="mb-4 flex gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Cari ujian..."
                        className="rounded-lg border border-outline-variant px-3 py-2 text-sm text-on-background bg-surface-container-lowest focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <Button onClick={handleSearch} size="sm">Cari</Button>
                </div>

                <DataTable
                    data={ujian.data}
                    columns={columns}
                    pagination={ujian}
                    actions={(item: Ujian) => (
                        <>
                            <Link href={`/admin/nilai/${item.id}`} className="text-sm text-blue-600 hover:text-blue-800">
                                Nilai
                            </Link>
                            <Link href={`/admin/ujian/${item.id}/edit`} className="text-sm text-yellow-600 hover:text-yellow-800">
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
