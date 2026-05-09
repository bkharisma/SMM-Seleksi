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

interface News {
    id: number;
    post_name: string;
    title: string;
    news_type: string | null;
    status: string;
    published_at: string | null;
    created_at: string;
    creator: { name: string } | null;
}

interface PaginatedData {
    data: News[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
}

interface NewsIndexProps {
    news: PaginatedData;
    filters: { search?: string; status?: string };
}

export default function NewsIndex({ news, filters }: NewsIndexProps) {
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

        if (search) {
params.set('search', search);
}

        if (status) {
params.set('status', status);
}

        router.get(`/admin/news?${params.toString()}`, {}, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
            router.delete(`/admin/news/${id}`);
        }
    };

    const formatDate = (date: string | null) => {
        if (!date) {
return '-';
}

        return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const columns = [
        { key: 'post_name', label: 'Slug' },
        { key: 'title', label: 'Judul', sortable: true },
        { key: 'news_type', label: 'Tipe' },
        { key: 'created_at', label: 'Tanggal', sortable: true, render: (item: News) => formatDate(item.created_at) },
        {
            key: 'status',
            label: 'Status',
            render: (item: News) => (
                <Badge variant={item.status === 'published' ? 'success' : 'warning'}>
                    {item.status === 'published' ? 'Published' : 'Draft'}
                </Badge>
            ),
        },
    ];

    return (
        <AdminLayout title="Berita">
            <Head title="Berita" />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card
                title="Daftar Berita"
                action={
                    <Link href="/admin/news/create">
                        <Button>Tambah Berita</Button>
                    </Link>
                }
            >
                <div className="mb-4 flex gap-2">
                    <Input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Cari berita..."
                    />
                    <Select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        options={[
                            { value: '', label: 'Semua Status' },
                            { value: 'published', label: 'Published' },
                            { value: 'draft', label: 'Draft' }
                        ]}
                    />
                    <Button onClick={handleSearch} size="sm">Cari</Button>
                </div>

                <DataTable
                    data={news.data}
                    columns={columns}
                    pagination={news}
                    actions={(item: News) => (
                        <>
                            <Link href={`/admin/news/${item.id}/edit`} className="text-sm text-yellow-600 hover:text-yellow-800">
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
