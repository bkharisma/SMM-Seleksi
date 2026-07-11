import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import DataTable from '@/components/ui/data-table';

interface Prodi {
    nama_prodi: string;
}

interface Peserta {
    nup: string;
    noujian: string | null;
    nama: string;
    pil1_prodi: Prodi | null;
}

interface Raport {
    id: number;
    noujian: string;
    npsn: string;
    akreditasi: string | null;
    status: string;
    peserta: Peserta | null;
}

interface PaginatedData {
    data: Raport[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
}

interface RaportIndexProps {
    raport: PaginatedData;
    filters: { search?: string; status?: string };
}

const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    'Lengkap': 'success',
    'Tidak Lengkap': 'danger',
    'Perbaikan': 'warning',
    'Belum Diperiksa': 'info',
};

export default function RaportIndex({ raport, filters }: RaportIndexProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

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

        if (status) {
params.set('status', status);
}

        router.get(`/admin/upload/raport?${params.toString()}`, {}, { preserveState: true });
    };

    const columns = [
        { key: 'noujian', label: 'No. Ujian', sortable: true },
        {
            key: 'peserta',
            label: 'Nama',
            render: (item: Raport) => item.peserta?.nama || '-',
        },
        {
            key: 'peserta_prodi',
            label: 'Pilihan 1',
            render: (item: Raport) => item.peserta?.pil1_prodi?.nama_prodi || '-',
        },
        { key: 'npsn', label: 'NPSN' },
        { key: 'akreditasi', label: 'Akreditasi' },
        {
            key: 'status',
            label: 'Status',
            render: (item: Raport) => (
                <Badge variant={statusColors[item.status] || 'info'}>
                    {item.status}
                </Badge>
            ),
        },
    ];

    return (
        <AdminLayout title="Verifikasi Raport">
            <Head title="Verifikasi Raport" />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card title="Daftar Raport">
                <div className="mb-4 flex flex-wrap gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Cari nama, No Pendaftar, no ujian..."
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
                    <Link href="/admin/upload/raport/export">
                        <Button variant="secondary" size="sm">Export Excel</Button>
                    </Link>
                </div>

                <DataTable
                    data={raport.data}
                    columns={columns}
                    pagination={raport}
                    actions={(item: Raport) => (
                        <Link href={`/admin/upload/raport/${item.id}`} className="text-sm text-blue-600 hover:text-blue-800">
                            Verifikasi
                        </Link>
                    )}
                />
            </Card>
        </AdminLayout>
    );
}
