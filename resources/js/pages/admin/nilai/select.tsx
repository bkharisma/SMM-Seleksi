import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import DataTable from '@/components/ui/data-table';

interface TahapSeleksi {
    id: number;
    nama: string;
    urutan: number;
}

interface Ujian {
    id: number;
    nama: string;
    kode: string;
    fields_config: { fields?: string[] } | null;
    tahap_seleksi: TahapSeleksi | null;
    peserta_nilai_count?: number;
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

interface SelectUjianProps {
    ujian: PaginatedData;
    filters: { search?: string };
}

export default function NilaiSelect({ ujian, filters }: SelectUjianProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = () => {
        router.get(`/admin/nilai${search ? `?search=${search}` : ''}`, {}, { preserveState: true });
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
        {
            key: 'fields',
            label: 'Field Nilai',
            render: (item: Ujian) => {
                const fields = item.fields_config?.fields;

                return fields && fields.length > 0 ? (
                    <Badge variant="info">{fields.length} field</Badge>
                ) : (
                    <span className="text-sm text-gray-400">-</span>
                );
            },
        },
    ];

    return (
        <AdminLayout title="Nilai Ujian">
            <Head title="Nilai Ujian" />

            <Card
                title="Pilih Jenis Ujian"
                action={
                    <Link href="/admin/ujian/create">
                        <Button variant="secondary" size="sm">Tambah Ujian</Button>
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
                        className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-background placeholder:text-on-surface-container/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <Button onClick={handleSearch} size="sm">Cari</Button>
                </div>

                <DataTable
                    data={ujian.data}
                    columns={columns}
                    pagination={ujian}
                    emptyMessage="Belum ada jenis ujian"
                    actions={(item: Ujian) => (
                        <Link href={`/admin/nilai/${item.id}`}>
                            <Button size="sm">Kelola Nilai</Button>
                        </Link>
                    )}
                />
            </Card>
        </AdminLayout>
    );
}
