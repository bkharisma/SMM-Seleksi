import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import DataTable from '@/components/ui/data-table';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Alert from '@/components/ui/alert';
import Card from '@/components/ui/card';

interface Prodi {
    nama_prodi: string;
}

interface Peserta {
    nup: string;
    noujian: string | null;
    nama: string;
    pil1_prodi: Prodi | null;
}

interface Kesehatan {
    id: number;
    noujian: string;
    namalbg: string | null;
    tb: number | null;
    bb: number | null;
    status: string;
    peserta: Peserta | null;
}

interface PaginatedData {
    data: Kesehatan[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
}

interface KesehatanIndexProps {
    kesehatan: PaginatedData;
    filters: { search?: string; status?: string };
}

const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    'Lengkap': 'success',
    'Tidak Lengkap': 'danger',
    'Perbaikan': 'warning',
    'Belum Diperiksa': 'info',
};

export default function KesehatanIndex({ kesehatan, filters }: KesehatanIndexProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    useEffect(() => {
        if (flash?.success) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    }, [flash]);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (status) params.set('status', status);
        router.get(`/admin/upload/kesehatan?${params.toString()}`, {}, { preserveState: true });
    };

    const columns = [
        { key: 'noujian', label: 'No. Ujian', sortable: true },
        {
            key: 'peserta',
            label: 'Nama',
            render: (item: Kesehatan) => item.peserta?.nama || '-',
        },
        {
            key: 'peserta_prodi',
            label: 'Pilihan 1',
            render: (item: Kesehatan) => item.peserta?.pil1_prodi?.nama_prodi || '-',
        },
        { key: 'namalbg', label: 'Lembaga' },
        {
            key: 'tb_bb',
            label: 'TB/BB',
            render: (item: Kesehatan) => `${item.tb || '-'} / ${item.bb || '-'}`,
        },
        {
            key: 'status',
            label: 'Status',
            render: (item: Kesehatan) => (
                <Badge variant={statusColors[item.status] || 'info'}>
                    {item.status}
                </Badge>
            ),
        },
    ];

    return (
        <AdminLayout title="Verifikasi Kesehatan">
            <Head title="Verifikasi Kesehatan" />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card title="Daftar Kesehatan">
                <div className="mb-4 flex flex-wrap gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Cari nama, NUP, no ujian..."
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                        <option value="">Semua Status</option>
                        <option value="Belum Diperiksa">Belum Diperiksa</option>
                        <option value="Lengkap">Lengkap</option>
                        <option value="Tidak Lengkap">Tidak Lengkap</option>
                        <option value="Perbaikan">Perbaikan</option>
                    </select>
                    <Button onClick={handleSearch} size="sm">Cari</Button>
                    <Link href="/admin/upload/kesehatan/export">
                        <Button variant="secondary" size="sm">Export Excel</Button>
                    </Link>
                </div>

                <DataTable
                    data={kesehatan.data}
                    columns={columns}
                    pagination={kesehatan}
                    actions={(item: Kesehatan) => (
                        <Link href={`/admin/upload/kesehatan/${item.id}`} className="text-sm text-blue-600 hover:text-blue-800">
                            Verifikasi
                        </Link>
                    )}
                />
            </Card>
        </AdminLayout>
    );
}
