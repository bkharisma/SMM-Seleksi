import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import DataTable from '@/components/ui/data-table';
import Input from '@/components/ui/input';
import Modal from '@/components/ui/modal';
import UploadProgressModal from '@/components/ui/upload-progress-modal';

interface Prodi {
    nama_prodi: string;
}

interface Pendaftar {
    kode_pendaftar: string;
    noujian: string | null;
    nama: string;
    pil1_prodi: Prodi | null;
}

interface NilaiRecord {
    id: number;
    nup: string;
    nus: string | null;
    psi_iq: number | null;
    psi_bobot: number | null;
    bing_nil: number | null;
    waw_nil: number | null;
    kes_tb: number | null;
    kes_bw: number | null;
    kes_obe: number | null;
    kes_nark: number | null;
    kes_hml: number | null;
    kes_tato: number | null;
    kes_tindik: number | null;
    kes_paru: number | null;
    kes_stra: number | null;
    kes_scol: number | null;
    minat_dominan: number | null;
    skor_akhir: number | null;
    pendaftar: Pendaftar | null;
}

interface Ujian {
    id: number;
    nama: string;
    kode: string;
    fields_config: { fields?: string[] } | null;
}

interface PaginatedData {
    data: NilaiRecord[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
}

interface NilaiIndexProps {
    nilai: PaginatedData;
    ujian: Ujian;
    filters: { search?: string };
}

const FIELD_LABELS: Record<string, string> = {
    psi_iq: 'Bakat Skolastik',
    psi_bobot: 'Psikotes',
    bing_nil: 'Literasi Bahasa Inggris',
    waw_nil: 'Wawancara',
    kes_hasil: 'Tes Kesehatan',
    kes_tb: 'Tinggi Badan',
    kes_bw: 'Buta Warna',
    kes_scol: 'Skoliosis',
    kes_hamil: 'Kehamilan',
    minat_dominan: 'Minat Dominan',
    skor_akhir: 'Skor Akhir',
};

const BOOL_FIELDS = ['kes_hasil', 'kes_bw', 'kes_scol', 'kes_hamil'];

function getNilaiDisplay(val: number | null | undefined, isBool: boolean): React.ReactNode {
    if (val === null || val === undefined) {
return '-';
}

    if (isBool) {
return <Badge variant={val ? 'danger' : 'success'}>{val ? 'Ya' : 'Tidak'}</Badge>;
}

    return (
        <Badge variant={val >= 70 ? 'success' : val >= 50 ? 'warning' : 'danger'}>
            {val}
        </Badge>
    );
}

export default function NilaiIndex({ nilai, ujian, filters }: NilaiIndexProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<NilaiRecord | null>(null);
    const [editData, setEditData] = useState<Record<string, string>>({});
    const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false);
    const [deleteAllConfirm, setDeleteAllConfirm] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [uploadMessage, setUploadMessage] = useState('');
    const [uploadErrorUrl, setUploadErrorUrl] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fields = ujian.fields_config?.fields || [];

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

        router.get(`/admin/nilai/${ujian.id}?${params.toString()}`, {}, { preserveState: true });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadModalOpen(true);
            setUploadStatus('uploading');
            setUploadMessage('');
            setUploadErrorUrl('');

            const formData = new FormData();
            formData.append('file', e.target.files[0]);
            fetch(`/admin/nilai/${ujian.id}/upload`, {
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

            e.target.value = '';
        }
    };

    const openEditModal = (item: NilaiRecord) => {
        setEditItem(item);
        const data: Record<string, string> = {};
        fields.forEach((field) => {
            const val = (item as any)[field];
            data[field] = val !== null && val !== undefined ? String(val) : '';
        });
        setEditData(data);
        setEditModalOpen(true);
    };

    const handleEditSave = () => {
        if (!editItem) {
return;
}

        const payload: Record<string, any> = {};
        fields.forEach((field) => {
            const raw = editData[field];

            if (BOOL_FIELDS.includes(field)) {
                payload[field] = raw === '' ? null : raw === '1' || raw === 'true';
            } else {
                payload[field] = raw === '' ? null : parseFloat(raw);
            }
        });
        router.put(`/admin/nilai/${editItem.id}`, payload as any, {
            onSuccess: () => setEditModalOpen(false),
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus data nilai ini?')) {
            router.delete(`/admin/nilai/${id}`);
        }
    };

    const handleToggle = (id: number) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);

            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }

            return next;
        });
    };

    const handleToggleAll = () => {
        const allIds = new Set(nilai.data.map((item) => item.id));

        if (allIds.size > 0 && selectedIds.size === allIds.size) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(allIds);
        }
    };

    const handleBulkDelete = () => {
        if (selectedIds.size === 0) {
return;
}

        if (!confirm(`Hapus ${selectedIds.size} data nilai terpilih?`)) {
return;
}

        router.delete('/admin/nilai-bulk', {
            data: { ids: Array.from(selectedIds) },
            onSuccess: () => setSelectedIds(new Set()),
        });
    };

    const handleDeleteAll = () => {
        if (deleteAllConfirm !== 'YA') {
return;
}

        router.delete('/admin/nilai-bulk', {
            data: { all: true, ujian_id: ujian.id },
            onSuccess: () => {
                setDeleteAllModalOpen(false);
                setDeleteAllConfirm('');
                setSelectedIds(new Set());
            },
        });
    };

    const baseColumns = [
        { key: 'nup', label: 'NUP', sortable: true },
        { key: 'nus', label: 'No. Ujian' },
        {
            key: 'pendaftar',
            label: 'Nama',
            render: (item: NilaiRecord) => item.pendaftar?.nama || '-',
        },
        {
            key: 'pendaftar_prodi',
            label: 'Pilihan 1',
            render: (item: NilaiRecord) => item.pendaftar?.pil1_prodi?.nama_prodi || '-',
        },
    ];

    const fieldColumns = fields.map((field) => ({
        key: field,
        label: FIELD_LABELS[field] || field,
        render: (item: NilaiRecord) => getNilaiDisplay((item as any)[field], BOOL_FIELDS.includes(field)),
    }));

    const columns = [...baseColumns, ...fieldColumns];

    return (
        <AdminLayout title={`Nilai ${ujian.nama}`}>
            <Head title={`Nilai ${ujian.nama}`} />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card title={`Nilai Ujian: ${ujian.nama}`}>
                <div className="mb-4 flex flex-wrap gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Cari nama, NUP, no ujian..."
                        className="rounded-lg border border-outline-variant px-3 py-2 text-sm text-on-background bg-surface-container-lowest focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <Button onClick={handleSearch} size="sm">Cari</Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                        Upload Excel
                    </Button>
                    <a href={`/admin/nilai/${ujian.id}/template`}>
                        <Button variant="secondary" size="sm">Download Template</Button>
                    </a>
                    <a href={`/admin/nilai/${ujian.id}/export`}>
                        <Button variant="secondary" size="sm">Export Excel</Button>
                    </a>
                    <Link href="/admin/nilai">
                        <Button variant="secondary" size="sm">Kembali</Button>
                    </Link>
                    <div className="ml-auto flex gap-2">
                        <Button
                            variant="danger"
                            size="sm"
                            disabled={selectedIds.size === 0}
                            onClick={handleBulkDelete}
                        >
                            Hapus Terpilih ({selectedIds.size})
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                                setDeleteAllConfirm('');
                                setDeleteAllModalOpen(true);
                            }}
                        >
                            Hapus Semua
                        </Button>
                    </div>
                </div>

                <DataTable
                    data={nilai.data}
                    columns={columns}
                    pagination={nilai}
                    emptyMessage="Belum ada data nilai"
                    selectable
                    selectedIds={selectedIds}
                    onToggle={handleToggle}
                    onToggleAll={handleToggleAll}
                    idKey="id"
                    actions={(item: NilaiRecord) => (
                        <>
                            <button
                                onClick={() => openEditModal(item)}
                                className="text-sm text-yellow-600 hover:text-yellow-800"
                            >
                                Edit
                            </button>
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

            <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Nilai" size="lg">
                {editItem && (
                    <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-lg bg-surface-container p-3">
                                <span className="text-xs text-on-surface-container">NUP</span>
                                <p className="font-medium">{editItem.nup}</p>
                            </div>
                            <div className="rounded-lg bg-surface-container p-3">
                                <span className="text-xs text-on-surface-container">Nama</span>
                                <p className="font-medium">{editItem.pendaftar?.nama || '-'}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {fields.map((field) => (
                                <div key={field}>
                                    {BOOL_FIELDS.includes(field) ? (
                                        <div className="flex items-center gap-3">
                                            <label className="w-40 text-sm font-medium text-on-surface-container">
                                                {FIELD_LABELS[field] || field}
                                            </label>
                                            <select
                                                value={editData[field] || ''}
                                                onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
                                                className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                            >
                                                <option value="">-</option>
                                                <option value="1">Ya</option>
                                                <option value="0">Tidak</option>
                                            </select>
                                        </div>
                                    ) : (
                                        <Input
                                            id={`edit_${field}`}
                                            label={FIELD_LABELS[field] || field}
                                            type="number"
                                            step="0.01"
                                            value={editData[field] || ''}
                                            onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="secondary" onClick={() => setEditModalOpen(false)}>Batal</Button>
                            <Button onClick={handleEditSave}>Simpan</Button>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal isOpen={deleteAllModalOpen} onClose={() => setDeleteAllModalOpen(false)} title="Hapus Semua Nilai">
                <div className="space-y-4">
                    <p className="text-sm text-on-surface-container">
                        Anda akan menghapus <strong className="text-error">semua data nilai</strong> untuk ujian <strong>{ujian.nama}</strong>.
                    </p>
                    <p className="text-sm text-on-surface-variant">
                        Total data: <strong>{nilai.total}</strong>
                    </p>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-on-surface-container">
                            Ketik <strong>YA</strong> untuk mengonfirmasi
                        </label>
                        <input
                            type="text"
                            value={deleteAllConfirm}
                            onChange={(e) => setDeleteAllConfirm(e.target.value)}
                            placeholder="YA"
                            className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-background focus:border-error focus:outline-none focus:ring-1 focus:ring-error"
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="secondary" onClick={() => setDeleteAllModalOpen(false)}>Batal</Button>
                        <Button variant="danger" disabled={deleteAllConfirm !== 'YA'} onClick={handleDeleteAll}>
                            Hapus Semua
                        </Button>
                    </div>
                </div>
            </Modal>

            <UploadProgressModal
                isOpen={uploadModalOpen}
                status={uploadStatus}
                title="Upload Nilai"
                message={uploadMessage}
                errorUrl={uploadErrorUrl}
                onClose={() => setUploadModalOpen(false)}
            />
        </AdminLayout>
    );
}
