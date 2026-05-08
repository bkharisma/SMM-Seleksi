import { Head, Link, router } from '@inertiajs/react';
import {
    Search,
    Download,
    Upload,
    FileText,
    Trash2,
    Eye,
    Edit,
    CreditCard,
    UserPlus,
} from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import DataTable from '@/components/ui/data-table';
import UploadProgressModal from '@/components/ui/upload-progress-modal';

interface Pendaftar {
    id: number;
    kode_pendaftar: string;
    noujian: string | null;
    nama: string;
    jenis_kelamin: string | null;
    tanggal_lahir: string | null;
    email: string | null;
    no_hp: string | null;
    pil1_prodi: { id: number; nama_prodi: string } | null;
    lulus_prodi: { id: number; nama_prodi: string } | null;
    ruang: { id: number; nomor_ruang: string } | null;
    jalur: { id: number; nama_jalur: string } | null;
}

interface Filters {
    search?: string;
    prodi_id?: string;
    ruang_id?: string;
    jalur_id?: string;
    lulus?: string;
    noujian?: string;
}

interface Props {
    pendaftar: {
        data: Pendaftar[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
        from: number;
        to: number;
    };
    filters: Filters;
    prodi: { id: number; nama_prodi: string; kode_prodi: string }[];
    ruang: { id: number; nomor_ruang: string }[];
    jalur: { id: number; nama_jalur: string; kode_jalur: string }[];
}

export default function PendaftarIndex({ pendaftar, filters, prodi, ruang, jalur }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [prodiId, setProdiId] = useState(filters.prodi_id || '');
    const [ruangId, setRuangId] = useState(filters.ruang_id || '');
    const [jalurId, setJalurId] = useState(filters.jalur_id || '');
    const [lulus, setLulus] = useState(filters.lulus || '');
    const [noujian, setNoujian] = useState(filters.noujian || '');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [uploadMessage, setUploadMessage] = useState('');
    const [uploadErrorUrl, setUploadErrorUrl] = useState('');

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx,.xls,.csv';
        input.onchange = (e: Event) => {
            const target = e.target as HTMLInputElement;

            if (target.files && target.files[0]) {
                setUploadModalOpen(true);
                setUploadStatus('uploading');
                setUploadMessage('');
                setUploadErrorUrl('');

                const formData = new FormData();
                formData.append('file', target.files[0]);
                fetch('/admin/pendaftar/import', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                        'Accept': 'application/json',
                    },
                })
                    .then((res) => {
                        if (!res.ok) {
                            throw new Error('Server error: ' + res.status);
                        }

                        const ct = res.headers.get('content-type');

                        if (ct && ct.includes('application/json')) {
                            return res.json();
                        }

                        return res.text().then((t) => {
                            throw new Error(t || 'Empty response');
                        });
                    })
                    .then((data) => {
                        setUploadStatus(data.success ? 'success' : 'error');
                        setUploadMessage(data.message || 'Import selesai');

                        if (data.download_error_url) {
                            setUploadErrorUrl(data.download_error_url);
                        }

                        router.reload();
                    })
                    .catch((err) => {
                        setUploadStatus('error');
                        setUploadMessage('Gagal import: ' + (err?.message || 'Unknown error'));
                        router.reload();
                    });
            }
        };
        input.click();
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (prodiId) params.set('prodi_id', prodiId);
        if (ruangId) params.set('ruang_id', ruangId);
        if (jalurId) params.set('jalur_id', jalurId);
        if (lulus) params.set('lulus', lulus);
        if (noujian) params.set('noujian', noujian);
        router.get(`/admin/pendaftar?${params.toString()}`, {}, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus data pendaftar ini?')) {
            router.delete(`/admin/pendaftar/${id}`);
        }
    };

    const handleGenerateNoUjian = () => {
        if (selectedIds.length === 0) {
            alert('Pilih pendaftar terlebih dahulu');

            return;
        }

        if (confirm(`Generate nomor ujian untuk ${selectedIds.length} pendaftar?`)) {
            router.post('/admin/pendaftar/generate-noujian', { pendaftar_ids: selectedIds });
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(pendaftar.data.map((p) => p.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelect = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds((prev) => [...prev, id]);
        } else {
            setSelectedIds((prev) => prev.filter((i) => i !== id));
        }
    };

    const columns = [
        {
            key: 'checkbox',
            label: '',
            render: (item: Pendaftar) => (
                <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={(e) => handleSelect(item.id, e.target.checked)}
                />
            ),
        },
        {
            key: 'kode_pendaftar',
            label: 'Kode',
            render: (item: Pendaftar) => (
                <span className="font-mono text-sm">{item.kode_pendaftar}</span>
            ),
        },
        {
            key: 'noujian',
            label: 'No. Ujian',
            render: (item: Pendaftar) => (
                <span className="font-mono text-sm">{item.noujian || '-'}</span>
            ),
        },
        {
            key: 'nama',
            label: 'Nama',
        },
        {
            key: 'jenis_kelamin',
            label: 'JK',
            render: (item: Pendaftar) => item.jenis_kelamin || '-',
        },
        {
            key: 'tanggal_lahir',
            label: 'Tgl Lahir',
            render: (item: Pendaftar) =>
                item.tanggal_lahir ? new Date(item.tanggal_lahir).toLocaleDateString('id-ID') : '-',
        },
        {
            key: 'pil1_prodi',
            label: 'Pilihan 1',
            render: (item: Pendaftar) => item.pil1_prodi?.nama_prodi || '-',
        },
        {
            key: 'jalur',
            label: 'Jalur',
            render: (item: Pendaftar) => item.jalur?.nama_jalur || '-',
        },
        {
            key: 'lulus_prodi',
            label: 'Lulus',
            render: (item: Pendaftar) =>
                item.lulus_prodi ? (
                    <Badge variant="success">{item.lulus_prodi.nama_prodi}</Badge>
                ) : (
                    <Badge variant="info">Belum</Badge>
                ),
        },
    ];

    return (
        <AdminLayout title="Data Pendaftar">
            <Head title="Pendaftar" />

            {/* Actions */}
            <div className="mb-4 flex flex-wrap gap-2">
                <a href="/admin/pendaftar/template">
                    <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        Template
                    </Button>
                </a>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        (window.location.href = `/admin/pendaftar/export?search=${search}&prodi_id=${prodiId}&ruang_id=${ruangId}&jalur_id=${jalurId}&lulus=${lulus}&noujian=${noujian}`)
                    }
                >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleImport}
                >
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                </Button>
                <Button variant="outline" size="sm" onClick={handleGenerateNoUjian}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Generate No. Ujian
                </Button>
            </div>

            {/* Filters */}
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-6">
                <div>
                    <input
                        type="text"
                        placeholder="Cari nama/kode/noujian..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full rounded-lg border border-outline-variant px-3 py-2 text-sm text-on-background bg-surface-container-lowest focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
                <div>
                    <select
                        value={prodiId}
                        onChange={(e) => setProdiId(e.target.value)}
                        className="w-full rounded-lg border border-outline-variant px-3 py-2 text-sm text-on-background bg-surface-container-lowest focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        <option value="">Semua Prodi</option>
                        {prodi.map((p) => (
                            <option key={p.id} value={p.id.toString()}>
                                {p.nama_prodi}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <select
                        value={ruangId}
                        onChange={(e) => setRuangId(e.target.value)}
                        className="w-full rounded-lg border border-outline-variant px-3 py-2 text-sm text-on-background bg-surface-container-lowest focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        <option value="">Semua Ruang</option>
                        {ruang.map((r) => (
                            <option key={r.id} value={r.id.toString()}>
                                {r.nomor_ruang}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <select
                        value={jalurId}
                        onChange={(e) => setJalurId(e.target.value)}
                        className="w-full rounded-lg border border-outline-variant px-3 py-2 text-sm text-on-background bg-surface-container-lowest focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        <option value="">Semua Jalur</option>
                        {jalur.map((j) => (
                            <option key={j.id} value={j.id.toString()}>
                                {j.nama_jalur}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <select
                        value={lulus}
                        onChange={(e) => setLulus(e.target.value)}
                        className="w-full rounded-lg border border-outline-variant px-3 py-2 text-sm text-on-background bg-surface-container-lowest focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        <option value="">Semua</option>
                        <option value="lulus">Lulus</option>
                        <option value="belum">Belum Lulus</option>
                    </select>
                </div>
                <div>
                    <select
                        value={noujian}
                        onChange={(e) => setNoujian(e.target.value)}
                        className="w-full rounded-lg border border-outline-variant px-3 py-2 text-sm text-on-background bg-surface-container-lowest focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        <option value="">Semua</option>
                        <option value="ya">Sudah Ada</option>
                        <option value="tidak">Belum Ada</option>
                    </select>
                </div>
            </div>
            <Button onClick={handleSearch} className="mb-4">
                <Search className="mr-2 h-4 w-4" />
                Cari
            </Button>

            {/* Table */}
            <DataTable
                data={pendaftar.data}
                columns={columns}
                pagination={{
                    links: pendaftar.links,
                    from: pendaftar.from,
                    to: pendaftar.to,
                    total: pendaftar.total,
                    current_page: pendaftar.current_page,
                    last_page: pendaftar.last_page,
                    per_page: pendaftar.per_page,
                }}
                actions={(item: Pendaftar) => (
                    <>
                        <Link href={`/admin/pendaftar/${item.id}`} className="text-blue-600 hover:text-blue-800">
                            <Eye className="h-4 w-4" />
                        </Link>
                        <Link href={`/admin/pendaftar/${item.id}/edit`} className="text-yellow-600 hover:text-yellow-800">
                            <Edit className="h-4 w-4" />
                        </Link>
                        {item.noujian && (
                            <a href={`/admin/pendaftar/${item.id}/kartu`} className="text-green-600 hover:text-green-800">
                                <CreditCard className="h-4 w-4" />
                            </a>
                        )}
                        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </>
                )}
                emptyMessage="Tidak ada data pendaftar"
            />

            <UploadProgressModal
                isOpen={uploadModalOpen}
                status={uploadStatus}
                title="Upload Peserta"
                message={uploadMessage}
                errorUrl={uploadErrorUrl}
                onClose={() => setUploadModalOpen(false)}
            />
        </AdminLayout>
    );
}
