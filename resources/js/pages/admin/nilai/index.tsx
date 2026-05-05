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

interface Prodi {
    nama_prodi: string;
}

interface Peserta {
    nup: string;
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
    skor_akhir: number | null;
    peserta: Peserta | null;
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
    psi_iq: 'IQ',
    psi_bobot: 'Bobot',
    bing_nil: 'Nilai Inggris',
    waw_nil: 'Nilai Wawancara',
    kes_tb: 'TB',
    kes_bw: 'BW',
    kes_obe: 'Obesitas',
    kes_nark: 'Narkoba',
    kes_hml: 'Hermes',
    kes_tato: 'Tato',
    kes_tindik: 'Tindik',
    kes_paru: 'Paru',
    kes_stra: 'Strabismus',
    kes_scol: 'Scoliosis',
    skor_akhir: 'Skor Akhir',
};

const BOOL_FIELDS = ['kes_bw', 'kes_nark', 'kes_hml', 'kes_tato', 'kes_tindik', 'kes_paru', 'kes_stra', 'kes_scol'];

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
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fields = ujian.fields_config?.fields || [];

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

        router.get(`/admin/nilai/${ujian.id}?${params.toString()}`, {}, { preserveState: true });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const formData = new FormData();
            formData.append('file', e.target.files[0]);
            router.post(`/admin/nilai/${ujian.id}/upload`, formData as any, {
                forceFormData: true,
            });
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
            } else if (field === 'kes_obe' || field === 'skor_akhir') {
                payload[field] = raw === '' ? null : parseFloat(raw);
            } else {
                payload[field] = raw === '' ? null : parseInt(raw, 10);
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

    const baseColumns = [
        { key: 'nup', label: 'NUP', sortable: true },
        { key: 'nus', label: 'No. Ujian' },
        {
            key: 'peserta',
            label: 'Nama',
            render: (item: NilaiRecord) => item.peserta?.nama || '-',
        },
        {
            key: 'peserta_prodi',
            label: 'Pilihan 1',
            render: (item: NilaiRecord) => item.peserta?.pil1_prodi?.nama_prodi || '-',
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
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
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
                </div>

                <DataTable
                    data={nilai.data}
                    columns={columns}
                    pagination={nilai}
                    emptyMessage="Belum ada data nilai"
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
                            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                                <span className="text-xs text-gray-500 dark:text-gray-400">NUP</span>
                                <p className="font-medium">{editItem.nup}</p>
                            </div>
                            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Nama</span>
                                <p className="font-medium">{editItem.peserta?.nama || '-'}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {fields.map((field) => (
                                <div key={field}>
                                    {BOOL_FIELDS.includes(field) ? (
                                        <div className="flex items-center gap-3">
                                            <label className="w-40 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {FIELD_LABELS[field] || field}
                                            </label>
                                            <select
                                                value={editData[field] || ''}
                                                onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
                                                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
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
                                            type={field === 'kes_obe' ? 'number' : 'number'}
                                            step={field === 'kes_obe' || field === 'skor_akhir' ? '0.01' : '1'}
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
        </AdminLayout>
    );
}
