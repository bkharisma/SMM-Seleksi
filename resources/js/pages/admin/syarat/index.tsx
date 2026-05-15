import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import DataTable from '@/components/ui/data-table';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';

interface Prodi {
    nama_prodi: string;
}

interface PesertaData {
    id: number;
    nup: string;
    noujian: string | null;
    nama: string;
    pil1_prodi: Prodi | null;
    lulus_prodi: Prodi | null;
    kesehatan_status: string;
    kesehatan_id: number | null;
    kesehatan_data: {
        id: number;
        noujian: string;
        namalbg: string | null;
        tb: number | null;
        bb: number | null;
    } | null;
}

interface PaginatedData {
    data: PesertaData[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
}

interface SyaratStats {
    total_lulus: number;
    belum_upload: number;
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

const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
    'Lengkap': 'success',
    'Tidak Lengkap': 'danger',
    'Perbaikan': 'warning',
    'Belum Diperiksa': 'info',
    'Belum Upload': 'neutral',
};

export default function SyaratIndex({ kesehatan_stats, kesehatan, filters }: SyaratIndexProps) {
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

        router.get(`/admin/syarat?${params.toString()}`, {}, { preserveState: true });
    };

    const stats = [
        {
            label: 'Total Lulus',
            value: kesehatan_stats.total_lulus,
            border: 'border-l-blue-400',
            bg: 'bg-blue-50',
            text: 'text-blue-600',
        },
        {
            label: 'Belum Upload',
            value: kesehatan_stats.belum_upload,
            border: 'border-l-gray-400',
            bg: 'bg-gray-50',
            text: 'text-gray-600',
        },
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
            key: 'nama',
            label: 'Nama',
            render: (item: PesertaData) => item.nama || '-',
        },
        {
            key: 'lulus_prodi',
            label: 'Lulus Thp-1',
            render: (item: PesertaData) => item.lulus_prodi?.nama_prodi || '-',
        },
        {
            key: 'namalbg',
            label: 'Lembaga',
            render: (item: PesertaData) => item.kesehatan_data?.namalbg || '-',
        },
        {
            key: 'tb_bb',
            label: 'TB/BB',
            render: (item: PesertaData) => `${item.kesehatan_data?.tb || '-'} / ${item.kesehatan_data?.bb || '-'}`,
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (item: PesertaData) => (
                <Badge variant={statusColors[item.kesehatan_status] || 'info'}>
                    {item.kesehatan_status}
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

            <Card title="Verifikasi Syarat Kelulusan ">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
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
                            { value: 'Belum Upload', label: 'Belum Upload' },
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
                    actions={(item: PesertaData) => (
                        item.kesehatan_id ? (
                            <Link href={`/admin/syarat/kesehatan/${item.kesehatan_id}`} className="text-sm text-blue-600 hover:text-blue-800">
                                Verifikasi
                            </Link>
                        ) : (
                            <span className="text-sm text-gray-400">-</span>
                        )
                    )}
                />
            </Card>
        </AdminLayout>
    );
}
