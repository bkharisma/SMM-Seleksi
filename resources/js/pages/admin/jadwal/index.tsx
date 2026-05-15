import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import DataTable from '@/components/ui/data-table';

interface Jadwal {
    id: number;
    nama_jadwal: string;
    keterangan: string | null;
    tgl_awal: string | null;
    tgl_akhir: string | null;
    jam_awal: string | null;
    jam_akhir: string | null;
    jenis: string | null;
    active: boolean;
    urutan: number;
}

interface PaginatedData {
    data: Jadwal[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
}

interface JadwalIndexProps {
    jadwal: PaginatedData;
    filters: { search?: string; jenis?: string };
}

export default function JadwalIndex({ jadwal, filters }: JadwalIndexProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const [jenis, setJenis] = useState(filters.jenis || '');

    useEffect(() => {
        if (flash?.success) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    }, [flash]);

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (search) {
params.set('search', search);
}

        if (jenis) {
params.set('jenis', jenis);
}

        router.get(`/admin/jadwal?${params.toString()}`, {}, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
            router.delete(`/admin/jadwal/${id}`);
        }
    };

    const handleMoveUp = (item: Jadwal) => {
        router.post('/admin/jadwal/reorder', {
            orders: [
                { id: item.id, urutan: item.urutan - 1 },
            ],
        });
    };

    const handleMoveDown = (item: Jadwal) => {
        router.post('/admin/jadwal/reorder', {
            orders: [
                { id: item.id, urutan: item.urutan + 1 },
            ],
        });
    };

    const formatDate = (date: string | null) => {
        if (!date) {
return '-';
}

        return new Date(date).toLocaleDateString('id-ID');
    };

    const columns = [
        { key: 'urutan', label: 'Urutan', render: (item: Jadwal) => (
            <div className="flex items-center gap-1">
                <span className="font-medium">{item.urutan}</span>
                <button
                    onClick={() => handleMoveUp(item)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                    title="Naik"
                >
                    <span className="material-symbols-outlined text-sm">arrow_upward</span>
                </button>
                <button
                    onClick={() => handleMoveDown(item)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                    title="Turun"
                >
                    <span className="material-symbols-outlined text-sm">arrow_downward</span>
                </button>
            </div>
        )},
        { key: 'nama_jadwal', label: 'Nama Jadwal', sortable: true },
        { key: 'jenis', label: 'Jenis' },
        { key: 'tgl_awal', label: 'Tanggal', render: (item: Jadwal) => `${formatDate(item.tgl_awal)} - ${formatDate(item.tgl_akhir)}` },
        { key: 'jam_awal', label: 'Jam', render: (item: Jadwal) => `${item.jam_awal || '-'} - ${item.jam_akhir || '-'}` },
        {
            key: 'active',
            label: 'Status',
            render: (item: Jadwal) => (
                <Badge variant={item.active ? 'success' : 'danger'}>
                    {item.active ? 'Aktif' : 'Nonaktif'}
                </Badge>
            ),
        },
    ];

    return (
        <AdminLayout title="Jadwal">
            <Head title="Jadwal" />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card
                title="Daftar Jadwal"
                action={
                    <Link href="/admin/jadwal/create">
                        <Button>Tambah Jadwal</Button>
                    </Link>
                }
            >
                <div className="mb-4 flex gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Cari jadwal..."
                        className="rounded-lg border border-outline-variant px-3 py-2 text-sm text-on-background bg-surface-container-lowest focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <select
                        value={jenis}
                        onChange={(e) => setJenis(e.target.value)}
                        className="rounded-lg border border-outline-variant px-3 py-2 text-sm text-on-background bg-surface-container-lowest focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        <option value="">Semua Jenis</option>
                        <option value="ujian">Ujian</option>
                        <option value="wawancara">Wawancara</option>
                        <option value="kesehatan">Kesehatan</option>
                        <option value="daftar">Pendaftaran</option>
                    </select>
                    <Button onClick={handleSearch} size="sm">Cari</Button>
                </div>

                <DataTable
                    data={jadwal.data}
                    columns={columns}
                    pagination={jadwal}
                    actions={(item: Jadwal) => (
                        <>
                            <button
                                onClick={() => router.patch(`/admin/jadwal/${item.id}/toggle-status`)}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                {item.active ? 'Nonaktifkan' : 'Aktifkan'}
                            </button>
                            <Link href={`/admin/jadwal/${item.id}/edit`} className="text-sm text-yellow-600 hover:text-yellow-800">
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
