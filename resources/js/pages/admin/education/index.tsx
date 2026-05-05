import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import DataTable from '@/components/ui/data-table';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Alert from '@/components/ui/alert';
import Card from '@/components/ui/card';

interface EducationLevel {
    code: string;
    description: string;
    orderby: number;
    active: boolean;
}

interface PaginatedData {
    data: EducationLevel[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
}

interface EducationIndexProps {
    education: PaginatedData;
    filters: { search?: string };
}

export default function EducationIndex({ education, filters }: EducationIndexProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        if (flash?.success) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    }, [flash]);

    const handleSearch = () => {
        router.get(`/admin/education${search ? `?search=${search}` : ''}`, {}, { preserveState: true });
    };

    const handleDelete = (code: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus jenjang pendidikan ini?')) {
            router.delete(`/admin/education/${code}`);
        }
    };

    const columns = [
        { key: 'code', label: 'Kode', sortable: true },
        { key: 'description', label: 'Deskripsi', sortable: true },
        { key: 'orderby', label: 'Urutan', sortable: true },
        {
            key: 'active',
            label: 'Status',
            render: (item: EducationLevel) => (
                <Badge variant={item.active ? 'success' : 'danger'}>
                    {item.active ? 'Aktif' : 'Nonaktif'}
                </Badge>
            ),
        },
    ];

    return (
        <AdminLayout title="Jenjang Pendidikan">
            <Head title="Jenjang Pendidikan" />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card
                title="Daftar Jenjang Pendidikan"
                action={
                    <Link href="/admin/education/create">
                        <Button>Tambah</Button>
                    </Link>
                }
            >
                <div className="mb-4 flex gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Cari..."
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
                    <Button onClick={handleSearch} size="sm">Cari</Button>
                </div>

                <DataTable
                    data={education.data}
                    columns={columns}
                    pagination={education}
                    actions={(item: EducationLevel) => (
                        <>
                            <Link href={`/admin/education/${item.code}/edit`} className="text-sm text-yellow-600 hover:text-yellow-800">
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(item.code)}
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
