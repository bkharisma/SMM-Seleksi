import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import DataTable from '@/components/ui/data-table';

interface Survey {
    id: number;
    keterangan: string;
}

interface PaginatedData {
    data: Survey[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
}

interface SurveyIndexProps {
    survey: PaginatedData;
    filters: { search?: string };
}

export default function SurveyIndex({ survey, filters }: SurveyIndexProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        if (flash?.success) {
            setTimeout(() => {
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 3000);
            }, 0);
        }
    }, [flash]);

    const handleSearch = () => {
        router.get(`/admin/survey${search ? `?search=${search}` : ''}`, {}, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus sumber informasi ini?')) {
            router.delete(`/admin/survey/${id}`);
        }
    };

    const columns = [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'keterangan', label: 'Keterangan', sortable: true },
    ];

    return (
        <AdminLayout title="Sumber Informasi">
            <Head title="Sumber Informasi" />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card
                title="Daftar Sumber Informasi"
                action={
                    <Link href="/admin/survey/create">
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
                        className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-background placeholder:text-on-surface-container/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <Button onClick={handleSearch} size="sm">Cari</Button>
                </div>

                <DataTable
                    data={survey.data}
                    columns={columns}
                    pagination={survey}
                    actions={(item: Survey) => (
                        <>
                            <Link href={`/admin/survey/${item.id}/edit`} className="text-sm text-yellow-600 hover:text-yellow-800">
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
