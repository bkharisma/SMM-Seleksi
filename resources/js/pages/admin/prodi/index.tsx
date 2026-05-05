import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import DataTable from '@/components/ui/data-table';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Alert from '@/components/ui/alert';
import Card from '@/components/ui/card';

interface Prodi {
    id: number;
    kode_prodi: string;
    nama_prodi: string;
    singkatan_prodi: string | null;
    jenjang_prodi: string;
    kapasitas: number | null;
    kuota_smm: number | null;
    active: boolean;
}

interface PaginatedData {
    data: Prodi[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
}

interface ProdiIndexProps {
    prodi: PaginatedData;
    filters: { search?: string; jenjang?: string };
}

export default function ProdiIndex({ prodi, filters }: ProdiIndexProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const [jenjang, setJenjang] = useState(filters.jenjang || '');

    useEffect(() => {
        if (flash?.success) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    }, [flash]);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (jenjang) params.set('jenjang', jenjang);
        router.get(`/admin/prodi?${params.toString()}`, {}, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus program studi ini?')) {
            router.delete(`/admin/prodi/${id}`);
        }
    };

    const toggleStatus = (id: number) => {
        router.patch(`/admin/prodi/${id}/toggle-status`);
    };

    const columns = [
        { key: 'kode_prodi', label: 'Kode', sortable: true },
        { key: 'nama_prodi', label: 'Nama Program Studi', sortable: true },
        { key: 'singkatan_prodi', label: 'Singkatan' },
        { key: 'jenjang_prodi', label: 'Jenjang', sortable: true },
        { key: 'kapasitas', label: 'Kapasitas' },
        {
            key: 'active',
            label: 'Status',
            render: (item: Prodi) => (
                <Badge variant={item.active ? 'success' : 'danger'}>
                    {item.active ? 'Aktif' : 'Nonaktif'}
                </Badge>
            ),
        },
    ];

    return (
        <AdminLayout title="Program Studi">
            <Head title="Program Studi" />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card
                title="Daftar Program Studi"
                action={
                    <Link href="/admin/prodi/create">
                        <Button>Tambah Prodi</Button>
                    </Link>
                }
            >
                <div className="mb-4 flex gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Cari prodi..."
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
                    <select
                        value={jenjang}
                        onChange={(e) => setJenjang(e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                        <option value="">Semua Jenjang</option>
                        <option value="D3">D3</option>
                        <option value="D4">D4</option>
                        <option value="S1">S1</option>
                        <option value="S2">S2</option>
                    </select>
                    <Button onClick={handleSearch} size="sm">Cari</Button>
                </div>

                <DataTable
                    data={prodi.data}
                    columns={columns}
                    pagination={prodi}
                    actions={(item: Prodi) => (
                        <>
                            <button
                                onClick={() => toggleStatus(item.id)}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                {item.active ? 'Nonaktifkan' : 'Aktifkan'}
                            </button>
                            <Link href={`/admin/prodi/${item.id}/edit`} className="text-sm text-yellow-600 hover:text-yellow-800">
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
