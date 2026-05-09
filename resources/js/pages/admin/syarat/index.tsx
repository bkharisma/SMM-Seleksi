import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import DataTable from '@/components/ui/data-table';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Alert from '@/components/ui/alert';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';

interface Prodi {
    nama_prodi: string;
}

interface Peserta {
    nup: string;
    noujian: string | null;
    nama: string;
    pil1_prodi: Prodi | null;
    lulus_prodi: Prodi | null;
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

interface SyaratStats {
    total: number;
    belum_diperiksa: number;
    lengkap: number;
    tidak_lengkap: number;
    perbaikan: number;
}

interface SyaratIndexProps {
    kesehatan_stats: SyaratStats;
    kesehatan: PaginatedData;
    filters: { search?: string; status?: string };
}

const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    'Lengkap': 'success',
    'Tidak Lengkap': 'danger',
    'Perbaikan': 'warning',
    'Belum Diperiksa': 'info',
};

export default function SyaratIndex({ kesehatan_stats, kesehatan, filters }: SyaratIndexProps) {
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
        router.get(`/admin/syarat?${params.toString()}`, {}, { preserveState: true });
    };

    const stats = [
        {
            label: 'Belum Diperiksa',
            value: kesehatan_stats.belum_diperiksa,
            border: 'border-l-slate-400',
            bg: 'bg-slate-50',
            text: 'text-slate-600',
        },
        {
            label: 'Lengkap',
            value: kesehatan_stats.lengkap,
            border: 'border-l-emerald-400',
            bg: 'bg-emerald-50',
            text: 'text-emerald-600',
        },
        {
            label: 'Tidak Lengkap',
            value: kesehatan_stats.tidak_lengkap,
            border: 'border-l-rose-400',
            bg: 'bg-rose-50',
            text: 'text-rose-600',
        },
        {
            label: 'Perbaikan',
            value: kesehatan_stats.perbaikan,
            border: 'border-l-amber-400',
            bg: 'bg-amber-50',
            text: 'text-amber-600',
        },
    ];

    const columns = [
        { key: 'noujian', label: 'No. Ujian', sortable: true },
        {
            key: 'peserta',
            label: 'Nama',
            render: (item: Kesehatan) => item.peserta?.nama || '-',
        },
        {
            key: 'lulus_prodi',
            label: 'Lulus Thp-1',
            render: (item: Kesehatan) => item.peserta?.lulus_prodi?.nama_prodi || '-',
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
            sortable: true,
            render: (item: Kesehatan) => (
                <Badge variant={statusColors[item.status] || 'info'}>
                    {item.status}
                </Badge>
            ),
        },
    ];

    return (
        <AdminLayout title="Verifikasi Syarat">
            <Head title="Verifikasi Syarat" />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card title="Surat Keterangan Sehat">
                <div className="space-y-4">
                    <div className="flex items-baseline gap-2 border-b border-gray-200 pb-4 dark:border-gray-700">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">{kesehatan_stats.total}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Total Peserta</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className={`flex flex-col items-center justify-center rounded-lg border-l-4 p-4 ${stat.border} ${stat.bg}`}
                            >
                                <span className={`text-3xl font-bold ${stat.text}`}>{stat.value}</span>
                                <span className={`mt-1 text-xs font-medium text-center ${stat.text}`}>{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            <Card title="Data Peserta" className="mt-4">
                <div className="mb-4 flex flex-wrap gap-2">
                    <Input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Cari nama, NUP, no ujian..."
                    />
                    <Select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        options={[
                            { value: '', label: 'Semua Status' },
                            { value: 'Belum Diperiksa', label: 'Belum Diperiksa' },
                            { value: 'Lengkap', label: 'Lengkap' },
                            { value: 'Tidak Lengkap', label: 'Tidak Lengkap' },
                            { value: 'Perbaikan', label: 'Perbaikan' }
                        ]}
                    />
                    <Button onClick={handleSearch} size="sm">Cari</Button>
                </div>

                <DataTable
                    data={kesehatan.data}
                    columns={columns}
                    pagination={kesehatan}
                    actions={(item: Kesehatan) => (
                        <Link href={`/admin/syarat/kesehatan/${item.id}`} className="text-sm text-blue-600 hover:text-blue-800">
                            Verifikasi
                        </Link>
                    )}
                />
            </Card>
        </AdminLayout>
    );
}
