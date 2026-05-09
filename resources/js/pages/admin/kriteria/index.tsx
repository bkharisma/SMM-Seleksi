import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import DataTable from '@/components/ui/data-table';
import Select from '@/components/ui/select';

interface Prodi {
    id: number;
    nama_prodi: string;
    kode_prodi: string;
}

interface Tahap {
    id: number;
    nama: string;
    urutan: number;
}

interface KriteriaUjianItem {
    id: number;
    ujian_id: number;
    jenis: 'tes' | 'berkas';
    nilai_standar: number | null;
    parameters: { nama: string; tipe_value: string; nilai: string }[] | null;
    ujian: { id: number; nama: string; kode: string };
}

interface Kriteria {
    id: number;
    prodi_id: number;
    tahap_seleksi_id: number;
    ordering: string;
    filter_pilihan: number;
    active: boolean;
    prodi: Prodi;
    tahap_seleksi: Tahap;
    kriteria_ujian: KriteriaUjianItem[];
}

interface PaginatedData {
    data: Kriteria[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
}

interface KriteriaIndexProps {
    kriteria: PaginatedData;
    prodi: Prodi[];
    tahap: Tahap[];
    filters: { prodi_id?: string; tahap_seleksi_id?: string };
}

export default function KriteriaIndex({ kriteria, prodi, tahap, filters }: KriteriaIndexProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [prodiId, setProdiId] = useState(filters.prodi_id || '');
    const [tahapId, setTahapId] = useState(filters.tahap_seleksi_id || '');

    useEffect(() => {
        if (flash?.success) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    }, [flash]);

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (prodiId) {
params.set('prodi_id', prodiId);
}

        if (tahapId) {
params.set('tahap_seleksi_id', tahapId);
}

        router.get(`/admin/kriteria?${params.toString()}`, {}, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus kriteria ini?')) {
            router.delete(`/admin/kriteria/${id}`);
        }
    };

    const columns = [
        {
            key: 'prodi',
            label: 'Program Studi',
            render: (item: Kriteria) => item.prodi?.nama_prodi || '-',
        },
        {
            key: 'tahap',
            label: 'Tahap',
            render: (item: Kriteria) => item.tahap_seleksi?.nama || '-',
        },
        {
            key: 'ujian',
            label: 'Jumlah Ujian',
            render: (item: Kriteria) => {
                const count = item.kriteria_ujian?.length || 0;
                const rincian = item.kriteria_ujian?.map((ku) => ku.ujian?.nama).join(', ') || '-';

                return (
                    <span title={rincian}>
                        {count} ujian
                    </span>
                );
            },
        },
        {
            key: 'jenis',
            label: 'Tipe Ujian',
            render: (item: Kriteria) => {
                const types = item.kriteria_ujian?.map((ku) => {
                    const variant = ku.jenis === 'tes' ? 'info' : ku.jenis === 'kesehatan' ? 'success' : 'warning';
                    const label = ku.jenis === 'tes' ? 'Tes' : ku.jenis === 'kesehatan' ? 'Kesehatan' : 'Berkas';

                    return (
                        <Badge key={ku.id} variant={variant}>
                            {label}
                        </Badge>
                    );
                });

                return <div className="flex flex-wrap gap-1">{types}</div>;
            },
        },
        {
            key: 'active',
            label: 'Status',
            render: (item: Kriteria) => (
                <Badge variant={item.active ? 'success' : 'danger'}>
                    {item.active ? 'Aktif' : 'Nonaktif'}
                </Badge>
            ),
        },
    ];

    return (
        <AdminLayout title="Kriteria Kelulusan">
            <Head title="Kriteria Kelulusan" />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card
                title="Kriteria Kelulusan"
                action={
                    <Link href="/admin/kriteria/create">
                        <Button>Tambah Kriteria</Button>
                    </Link>
                }
            >
                <div className="mb-4 flex flex-wrap gap-2">
                    <Select
                        value={prodiId}
                        onChange={(e) => setProdiId(e.target.value)}
                        options={[{ value: '', label: 'Semua Prodi' }, ...prodi.map((p) => ({ value: p.id, label: p.nama_prodi }))]}
                    />
                    <Select
                        value={tahapId}
                        onChange={(e) => setTahapId(e.target.value)}
                        options={[{ value: '', label: 'Semua Tahap' }, ...tahap.map((t) => ({ value: t.id, label: t.nama }))]}
                    />
                    <Button onClick={handleSearch} size="sm">Cari</Button>
                </div>

                <DataTable
                    data={kriteria.data}
                    columns={columns}
                    pagination={kriteria}
                    actions={(item: Kriteria) => (
                        <>
                            <Link href={`/admin/kriteria/${item.id}/edit`} className="text-sm text-yellow-600 hover:text-yellow-800">
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
