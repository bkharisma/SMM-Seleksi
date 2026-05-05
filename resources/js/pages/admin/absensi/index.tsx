import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import DataTable from '@/components/ui/data-table';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Alert from '@/components/ui/alert';
import Card from '@/components/ui/card';

interface Ruang {
    id: number;
    nomor_ruang: string;
    nama_gedung: string | null;
}

interface DataAbsensi {
    id: number;
    jenis: string | null;
    kelompok: number | null;
    tanggal: string | null;
    waktu: string | null;
    ruang_id: number | null;
    nomor_awal: string | null;
    nomor_akhir: string | null;
    ruang: Ruang | null;
}

interface PaginatedData {
    data: DataAbsensi[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
}

interface AbsensiIndexProps {
    absensi: PaginatedData;
    filters: { tanggal?: string; jenis?: string };
    ruang: Ruang[];
}

export default function AbsensiIndex({ absensi, filters, ruang }: AbsensiIndexProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [tanggal, setTanggal] = useState(filters.tanggal || '');
    const [jenis, setJenis] = useState(filters.jenis || '');

    useEffect(() => {
        if (flash?.success) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    }, [flash]);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (tanggal) params.set('tanggal', tanggal);
        if (jenis) params.set('jenis', jenis);
        router.get(`/admin/absensi?${params.toString()}`, {}, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus sesi absensi ini?')) {
            router.delete(`/admin/absensi/${id}`);
        }
    };

    const columns = [
        {
            key: 'tanggal',
            label: 'Tanggal',
            sortable: true,
            render: (item: DataAbsensi) => item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID') : '-',
        },
        { key: 'waktu', label: 'Waktu' },
        {
            key: 'jenis',
            label: 'Jenis',
            render: (item: DataAbsensi) => (
                <Badge variant="info">{item.jenis || '-'}</Badge>
            ),
        },
        {
            key: 'kelompok',
            label: 'Kelompok',
            render: (item: DataAbsensi) => item.kelompok ?? '-',
        },
        {
            key: 'ruang',
            label: 'Ruang',
            render: (item: DataAbsensi) => item.ruang ? `${item.ruang.nomor_ruang} - ${item.ruang.nama_gedung}` : '-',
        },
    ];

    return (
        <AdminLayout title="Absensi">
            <Head title="Absensi" />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card
                title="Sesi Absensi"
                action={
                    <Link href="/admin/absensi/create">
                        <Button>Tambah Sesi</Button>
                    </Link>
                }
            >
                <div className="mb-4 flex flex-wrap gap-2">
                    <input
                        type="date"
                        value={tanggal}
                        onChange={(e) => setTanggal(e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
                    <select
                        value={jenis}
                        onChange={(e) => setJenis(e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                        <option value="">Semua Jenis</option>
                        <option value="psikotes">Psikotes</option>
                        <option value="wawancara">Wawancara</option>
                        <option value="kesehatan">Kesehatan</option>
                    </select>
                    <Button onClick={handleSearch} size="sm">Cari</Button>
                </div>

                <DataTable
                    data={absensi.data}
                    columns={columns}
                    pagination={absensi}
                    actions={(item: DataAbsensi) => (
                        <>
                            <Link href={`/admin/absensi/${item.id}`} className="text-sm text-blue-600 hover:text-blue-800">
                                Lihat
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
