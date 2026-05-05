import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import DataTable from '@/components/ui/data-table';

interface Prodi {
    id: number;
    nama_prodi: string;
    kode_prodi: string;
}

interface BsiPembayaran {
    datetime_payment: string | null;
}

interface Peminat {
    id: number;
    nup: string;
    nama: string;
    email: string | null;
    hp: string | null;
    tgllahir: string | null;
    tgldaftar: string | null;
    nama_sekolah: string | null;
    pil1_prodi: Prodi | null;
    pil2_prodi: Prodi | null;
    bsi_pembayaran: BsiPembayaran | null;
}

interface PaginatedData {
    data: Peminat[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
}

interface PeminatIndexProps {
    peminat: PaginatedData;
    filters: { search?: string; prodi_id?: string; status?: string };
}

export default function PeminatIndex({ peminat, filters }: PeminatIndexProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const [prodiId, setProdiId] = useState(filters.prodi_id || '');
    const [status, setStatus] = useState(filters.status || '');
    const fileInputRef = useRef<HTMLInputElement>(null);

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

        if (prodiId) {
params.set('prodi_id', prodiId);
}

        if (status) {
params.set('status', status);
}

        router.get(`/admin/peminat?${params.toString()}`, {}, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus data peminat ini?')) {
            router.delete(`/admin/peminat/${id}`);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const formData = new FormData();
            formData.append('file', e.target.files[0]);
            router.post('/admin/peminat/import', formData as any, {
                forceFormData: true,
            });
        }
    };

    const columns = [
        { key: 'nup', label: 'NUP', sortable: true },
        { key: 'nama', label: 'Nama', sortable: true },
        { key: 'email', label: 'Email' },
        { key: 'hp', label: 'HP' },
        {
            key: 'pil1_prodi',
            label: 'Pilihan 1',
            render: (item: Peminat) => item.pil1_prodi?.nama_prodi || '-',
        },
        {
            key: 'tgldaftar',
            label: 'Tgl Daftar',
            render: (item: Peminat) => item.tgldaftar ? new Date(item.tgldaftar).toLocaleDateString('id-ID') : '-',
        },
        {
            key: 'payment_status',
            label: 'Pembayaran',
            render: (item: Peminat) => (
                <Badge variant={item.bsi_pembayaran?.datetime_payment ? 'success' : 'warning'}>
                    {item.bsi_pembayaran?.datetime_payment ? 'Lunas' : 'Belum Lunas'}
                </Badge>
            ),
        },
    ];

    return (
        <AdminLayout title="Data Peminat">
            <Head title="Data Peminat" />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card title="Daftar Peminat">
                <div className="mb-4 flex flex-wrap gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Cari nama, NUP, email..."
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                        <option value="">Semua Status</option>
                        <option value="paid">Sudah Bayar</option>
                        <option value="unpaid">Belum Bayar</option>
                    </select>
                    <Button onClick={handleSearch} size="sm">Cari</Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                        Import Excel
                    </Button>
                    <a href="/admin/peminat/template">
                        <Button variant="secondary" size="sm">Download Template</Button>
                    </a>
                    <a href={`/admin/peminat/export?search=${search}&prodi_id=${prodiId}&status=${status}`}>
                        <Button variant="secondary" size="sm">Export Excel</Button>
                    </a>
                </div>

                <DataTable
                    data={peminat.data}
                    columns={columns}
                    pagination={peminat}
                    actions={(item: Peminat) => (
                        <>
                            <Link href={`/admin/peserta?search=${item.nup}`} className="text-sm text-blue-600 hover:text-blue-800">
                                Lihat Peserta
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
