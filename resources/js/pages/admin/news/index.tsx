import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import DataTable from '@/components/ui/data-table';
import Input from '@/components/ui/input';
import Modal from '@/components/ui/modal';
import Select from '@/components/ui/select';

interface News {
    id: number;
    post_name: string;
    title: string;
    news_type: string | null;
    description: string;
    img: string | null;
    pdf: string | null;
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
    const [selectedNews, setSelectedNews] = useState<News | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

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

        router.get(`/admin/news?${params.toString()}`, {}, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
            router.delete(`/admin/news/${id}`);
        }
    };

    const handleViewDetail = (item: News) => {
        setSelectedNews(item);
        setShowDetailModal(true);
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
                            <button
                                onClick={() => handleViewDetail(item)}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Detail
                            </button>
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

            <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Detail Berita" size="lg">
                {selectedNews && (
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium text-on-surface-variant">Judul</h4>
                            <p className="mt-1 text-lg font-semibold text-on-surface">{selectedNews.title}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-on-surface-variant">Slug</h4>
                                <p className="mt-1 text-on-surface">{selectedNews.post_name}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-on-surface-variant">Tipe</h4>
                                <p className="mt-1 text-on-surface">{selectedNews.news_type || '-'}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-on-surface-variant">Deskripsi</h4>
                            <p className="mt-1 whitespace-pre-wrap text-on-surface">{selectedNews.description}</p>
                        </div>

                        {selectedNews.img && (
                            <div>
                                <h4 className="text-sm font-medium text-on-surface-variant">Gambar</h4>
                                <div className="mt-2">
                                    <img
                                        src={`/storage/${selectedNews.img}`}
                                        alt={selectedNews.title}
                                        className="rounded-lg object-contain max-h-96 bg-surface-container"
                                    />
                                </div>
                            </div>
                        )}

                        {selectedNews.pdf && (
                            <div>
                                <h4 className="text-sm font-medium text-on-surface-variant">File PDF</h4>
                                <div className="mt-2 flex items-center gap-2">
                                    <a
                                        href={`/storage/${selectedNews.pdf}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 rounded-lg bg-primary-container px-3 py-2 text-sm text-on-primary-container hover:opacity-90"
                                    >
                                        <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                                        Lihat PDF
                                    </a>
                                    <a
                                        href={`/storage/${selectedNews.pdf}`}
                                        download
                                        className="inline-flex items-center gap-1 rounded-lg bg-surface-container px-3 py-2 text-sm text-on-surface hover:bg-surface-container-high"
                                    >
                                        <span className="material-symbols-outlined text-lg">download</span>
                                        Download
                                    </a>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-on-surface-variant">Status</h4>
                                <div className="mt-1">
                                    <Badge variant={selectedNews.status === 'published' ? 'success' : 'warning'}>
                                        {selectedNews.status === 'published' ? 'Published' : 'Draft'}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-on-surface-variant">Dibuat oleh</h4>
                                <p className="mt-1 text-on-surface">{selectedNews.creator?.name || '-'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-on-surface-variant">Tanggal Dibuat</h4>
                                <p className="mt-1 text-on-surface">{formatDate(selectedNews.created_at)}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-on-surface-variant">Tanggal Dipublikasi</h4>
                                <p className="mt-1 text-on-surface">{formatDate(selectedNews.published_at)}</p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button onClick={() => setShowDetailModal(false)}>Tutup</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </AdminLayout>
    );
}
