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

interface Ruang {
    id: number;
    nomor_ruang: string;
}

interface Peserta {
    id: number;
    nup: string;
    noujian: string | null;
    nama: string;
    nik: string | null;
    sex: string | null;
    email: string | null;
    hp: string | null;
    status: boolean;
    lulus: number | null;
    pil1_prodi: Prodi | null;
    ruang: Ruang | null;
    lulus_prodi: Prodi | null;
}

interface PaginatedData {
    data: Peserta[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
}

interface PesertaIndexProps {
    peserta: PaginatedData;
    filters: { search?: string; prodi_id?: string; ruang_id?: string; status?: string; lulus?: string };
    prodi: Prodi[];
    ruang: Ruang[];
}

export default function PesertaIndex({ peserta, filters, prodi, ruang }: PesertaIndexProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const [prodiId, setProdiId] = useState(filters.prodi_id || '');
    const [ruangId, setRuangId] = useState(filters.ruang_id || '');
    const [status, setStatus] = useState(filters.status || '');
    const [lulus, setLulus] = useState(filters.lulus || '');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

        if (prodiId) {
params.set('prodi_id', prodiId);
}

        if (ruangId) {
params.set('ruang_id', ruangId);
}

        if (status) {
params.set('status', status);
}

        if (lulus) {
params.set('lulus', lulus);
}

        router.get(`/admin/peserta?${params.toString()}`, {}, { preserveState: true });
    };

    const handleGenerateNoUjian = () => {
        if (selectedIds.length === 0) {
            alert('Pilih peserta terlebih dahulu');

            return;
        }

        if (confirm(`Generate nomor ujian untuk ${selectedIds.length} peserta?`)) {
            router.post('/admin/peserta/generate-noujian', { peserta_ids: selectedIds });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const formData = new FormData();
            formData.append('file', e.target.files[0]);
            router.post('/admin/peserta/import', formData as any, {
                forceFormData: true,
            });
        }
    };

    const toggleSelect = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const columns = [
        {
            key: 'checkbox',
            label: '',
            render: (item: Peserta) => (
                <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="rounded border-gray-300"
                />
            ),
        },
        { key: 'nup', label: 'NUP', sortable: true },
        { key: 'noujian', label: 'No. Ujian', sortable: true },
        { key: 'nama', label: 'Nama', sortable: true },
        {
            key: 'sex',
            label: 'L/P',
            render: (item: Peserta) => item.sex || '-',
        },
        {
            key: 'pil1_prodi',
            label: 'Pilihan 1',
            render: (item: Peserta) => item.pil1_prodi?.nama_prodi || '-',
        },
        {
            key: 'ruang',
            label: 'Ruang',
            render: (item: Peserta) => item.ruang?.nomor_ruang || '-',
        },
        {
            key: 'status',
            label: 'Status',
            render: (item: Peserta) => (
                <Badge variant={item.status ? 'success' : 'danger'}>
                    {item.status ? 'Aktif' : 'Nonaktif'}
                </Badge>
            ),
        },
        {
            key: 'lulus',
            label: 'Kelulusan',
            render: (item: Peserta) => (
                item.lulus_prodi ? (
                    <Badge variant="success">Lulus: {item.lulus_prodi.nama_prodi}</Badge>
                ) : (
                    <Badge variant="warning">Belum</Badge>
                )
            ),
        },
    ];

    return (
        <AdminLayout title="Data Peserta">
            <Head title="Data Peserta" />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card title="Daftar Peserta">
                <div className="mb-4 flex flex-wrap gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Cari nama, NUP, no ujian..."
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
                    <select
                        value={prodiId}
                        onChange={(e) => setProdiId(e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                        <option value="">Semua Prodi</option>
                        {prodi.map(p => (
                            <option key={p.id} value={p.id}>{p.nama_prodi}</option>
                        ))}
                    </select>
                    <select
                        value={ruangId}
                        onChange={(e) => setRuangId(e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                        <option value="">Semua Ruang</option>
                        {ruang.map(r => (
                            <option key={r.id} value={r.id}>{r.nomor_ruang}</option>
                        ))}
                    </select>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                        <option value="">Semua Status</option>
                        <option value="active">Aktif</option>
                        <option value="inactive">Nonaktif</option>
                    </select>
                    <select
                        value={lulus}
                        onChange={(e) => setLulus(e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                        <option value="">Semua</option>
                        <option value="lulus">Lulus</option>
                        <option value="belum">Belum Lulus</option>
                    </select>
                    <Button onClick={handleSearch} size="sm">Cari</Button>
                    {selectedIds.length > 0 && (
                        <Button onClick={handleGenerateNoUjian} variant="secondary" size="sm">
                            Generate No. Ujian ({selectedIds.length})
                        </Button>
                    )}
                    <Link href="/admin/peserta/export">
                        <Button variant="secondary" size="sm">Export Excel</Button>
                    </Link>
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
                    <a href="/admin/peserta/template">
                        <Button variant="secondary" size="sm">Download Template</Button>
                    </a>
                </div>

                <DataTable
                    data={peserta.data}
                    columns={columns}
                    pagination={peserta}
                    actions={(item: Peserta) => (
                        <>
                            <Link href={`/admin/peserta/${item.id}`} className="text-sm text-blue-600 hover:text-blue-800">
                                Detail
                            </Link>
                            <Link href={`/admin/peserta/${item.id}/edit`} className="text-sm text-yellow-600 hover:text-yellow-800">
                                Edit
                            </Link>
                            {item.noujian && (
                                <a href={`/admin/peserta/${item.id}/kartu`} className="text-sm text-green-600 hover:text-green-800">
                                    Kartu
                                </a>
                            )}
                            <button
                                onClick={() => {
                                    if (confirm('Apakah Anda yakin ingin menghapus peserta ini?')) {
                                        router.delete(`/admin/peserta/${item.id}`);
                                    }
                                }}
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
