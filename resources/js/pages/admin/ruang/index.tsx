import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import DataTable from '@/components/ui/data-table';
import Tabs from '@/components/ui/tabs';

interface Ruang {
    id: number;
    nomor_ruang: string;
    nama_gedung: string | null;
    kapasitas: number | null;
    urutan: number;
    active: boolean;
}

interface RuangSummary {
    id: number;
    nomor_ruang: string;
    nama_gedung: string | null;
    kapasitas: number | null;
    terisi: number;
    tersisa: number;
    active: boolean;
}

interface PaginatedData {
    data: Ruang[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
}

interface RuangIndexProps {
    ruang?: PaginatedData;
    ruangSummary?: RuangSummary[];
    showSummary?: boolean;
    filters?: { search?: string };
}

export default function RuangIndex({ ruang, ruangSummary, showSummary, filters }: RuangIndexProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [search, setSearch] = useState(filters?.search || '');
    const [activeTab, setActiveTab] = useState(showSummary ? 'summary' : 'list');

    useEffect(() => {
        if (flash?.success) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    }, [flash]);

    const handleSearch = () => {
        router.get(`/admin/ruang${search ? `?search=${search}` : ''}`, {}, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus ruang ini?')) {
            router.delete(`/admin/ruang/${id}`);
        }
    };

    const columns = [
        { key: 'nomor_ruang', label: 'No. Ruang', sortable: true },
        { key: 'nama_gedung', label: 'Nama Gedung' },
        { key: 'kapasitas', label: 'Kapasitas' },
        { key: 'urutan', label: 'Urutan', sortable: true },
        {
            key: 'active',
            label: 'Status',
            render: (item: Ruang) => (
                <Badge variant={item.active ? 'success' : 'danger'}>
                    {item.active ? 'Aktif' : 'Nonaktif'}
                </Badge>
            ),
        },
    ];

    return (
        <AdminLayout title="Ruang Ujian">
            <Head title="Ruang Ujian" />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Tabs
                tabs={[
                    { key: 'list', label: 'Daftar Ruang' },
                    { key: 'summary', label: 'Ringkasan' },
                ]}
                activeTab={activeTab}
                onChange={(key) => {
                    setActiveTab(key);

                    if (key === 'summary') {
                        router.get('/admin/ruang/summary', {}, { preserveState: true });
                    } else {
                        router.get('/admin/ruang', {}, { preserveState: true });
                    }
                }}
            />

            <Card
                title={activeTab === 'summary' ? 'Ringkasan Ruang Ujian' : 'Daftar Ruang Ujian'}
                action={
                    <Link href="/admin/ruang/create">
                        <Button>Tambah Ruang</Button>
                    </Link>
                }
            >
                {activeTab === 'summary' && ruangSummary ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {ruangSummary.map((r) => (
                            <div key={r.id} className="rounded-lg border p-4 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white">{r.nomor_ruang}</h3>
                                <p className="text-sm text-gray-500">{r.nama_gedung || '-'}</p>
                                <div className="mt-3 space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Kapasitas:</span>
                                        <span className="font-medium">{r.kapasitas || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Terisi:</span>
                                        <span className="font-medium text-blue-600">{r.terisi}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Tersisa:</span>
                                        <span className={`font-medium ${r.tersisa === 0 ? 'text-red-600' : 'text-green-600'}`}>
                                            {r.tersisa}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                        <div
                                            className="h-2 rounded-full bg-blue-600"
                                            style={{
                                                width: `${r.kapasitas ? Math.min((r.terisi / r.kapasitas) * 100, 100) : 0}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : ruang ? (
                    <>
                        <div className="mb-4 flex gap-2">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Cari ruang..."
                                className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-background placeholder:text-on-surface-container/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <Button onClick={handleSearch} size="sm">Cari</Button>
                        </div>

                        <DataTable
                            data={ruang.data}
                            columns={columns}
                            pagination={ruang}
                            actions={(item: Ruang) => (
                                <>
                                    <button
                                        onClick={() => router.patch(`/admin/ruang/${item.id}/toggle-status`)}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        {item.active ? 'Nonaktifkan' : 'Aktifkan'}
                                    </button>
                                    <Link href={`/admin/ruang/${item.id}/edit`} className="text-sm text-yellow-600 hover:text-yellow-800">
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
                    </>
                ) : null}
            </Card>
        </AdminLayout>
    );
}
