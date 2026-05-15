import { Head, router, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight, Star, StarOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Modal from '@/components/ui/modal';
import Select from '@/components/ui/select';
import Textarea from '@/components/ui/textarea';
import { FIELD_LABELS, BOOL_FIELDS } from '@/lib/nilai';

interface ProdiData {
    id: number;
    nama_prodi: string;
    kode_prodi: string;
}

interface PendaftarItem {
    id: number;
    kode_pendaftar: string;
    noujian: string | null;
    nama: string;
    is_referensi: boolean;
    catatan_referensi: string | null;
    pil1_prodi: ProdiData | null;
    pil2_prodi: ProdiData | null;
    pil3_prodi: ProdiData | null;
    lulus_prodi: ProdiData | null;
}

interface NilaiItem {
    id: number;
    nup: string | null;
    nus: string | null;
    type: string | null;
    skor_akhir: string | null;
    ujian_nama: string;
    fields_config: { fields?: string[]; labels?: Record<string, string> } | null;
    psi_iq: string | null;
    psi_bobot: string | null;
    bing_nil: string | null;
    waw_nil: string | null;
    kes_tb: string | null;
    kes_bw: boolean;
    kes_paru: boolean;
    kes_scol: boolean;
    kes_hamil: boolean;
    minat_dominan: string | null;
}

interface AgregasiNilaiAkhir {
    max: number | null;
    min: number | null;
    median: number | null;
}

interface AgregasiData {
    has_lulus: boolean;
    prodi_nama?: string;
    jumlah_lulus?: number;
    nilai_akhir?: AgregasiNilaiAkhir;
}

interface NilaiResponse {
    nama: string;
    kode_pendaftar: string;
    noujian: string | null;
    nilai: NilaiItem[];
    agregasi: AgregasiData;
}

interface Props {
    pendaftar: {
        data: PendaftarItem[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    prodi: ProdiData[];
    filters: { search?: string; prodi_id?: string; is_referensi?: string };
}

export default function ReferensiIndex({ pendaftar, prodi, filters }: Props) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const [prodiId, setProdiId] = useState(filters.prodi_id || '');
    const [isReferensi, setIsReferensi] = useState(filters.is_referensi || '');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [catatan, setCatatan] = useState('');
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [nilaiCache, setNilaiCache] = useState<Record<number, NilaiResponse | null>>({});
    const [nilaiLoading, setNilaiLoading] = useState<number | null>(null);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setTimeout(() => {
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 5000);
            }, 0);
        }
    }, [flash]);

    const handleSearch = () => {
        const params: Record<string, string> = {};

        if (search) {
            params.search = search;
        }

        if (prodiId) {
            params.prodi_id = prodiId;
        }

        if (isReferensi) {
            params.is_referensi = isReferensi;
        }

        router.get('/admin/referensi', params, { preserveState: true });
    };

    const handleToggle = (id: number, itemCatatan: string | null) => {
        const item = pendaftar.data.find(p => p.id === id);

        if (item?.is_referensi) {
            router.post(`/admin/referensi/${id}/toggle`, {}, { preserveState: true, preserveScroll: true });
        } else {
            setSelectedId(id);
            setCatatan(itemCatatan || '');
            setModalOpen(true);
        }
    };

    const handleSubmitModal = () => {
        if (selectedId) {
            router.post(`/admin/referensi/${selectedId}/toggle`, { catatan_referensi: catatan }, { preserveState: true, preserveScroll: true });
            setModalOpen(false);
            setSelectedId(null);
            setCatatan('');
        }
    };

    const handleRowClick = async (id: number) => {
        if (expandedRow === id) {
            setExpandedRow(null);

            return;
        }

        if (nilaiCache[id] !== undefined) {
            setExpandedRow(id);

            return;
        }

        setNilaiLoading(id);

        try {
            const res = await fetch(`/admin/referensi/${id}/nilai`);
            const data: NilaiResponse = await res.json();
            setNilaiCache(prev => ({ ...prev, [id]: data }));
            setExpandedRow(id);
        } catch {
            setNilaiCache(prev => ({ ...prev, [id]: null }));
        } finally {
            setNilaiLoading(null);
        }
    };

    const renderNilaiDetail = (nilai: NilaiItem) => {
        const fields = nilai.fields_config?.fields || [];
        const labels = nilai.fields_config?.labels || {};
        const allFields = fields.length > 0 ? fields : ['psi_iq', 'psi_bobot', 'bing_nil', 'waw_nil', 'kes_tb', 'kes_bw', 'kes_paru', 'kes_scol', 'kes_hamil', 'minat_dominan'];

        return (
            <div key={nilai.id} className="mb-3 last:mb-0">
                <h5 className="mb-1 text-sm font-semibold text-on-surface">
                    {nilai.ujian_nama}
                    {nilai.type && <span className="ml-2"><Badge variant="info">{nilai.type}</Badge></span>}
                </h5>
                <div className="rounded-lg border border-outline-variant p-3">
                    <div className="grid gap-1 sm:grid-cols-2">
                        {allFields.map((field: string) => {
                            const val = (nilai as any)[field];

                            if (val === null || val === undefined || val === '') {
return null;
}

                            const label = labels[field] || FIELD_LABELS[field] || field;
                            const display = BOOL_FIELDS.includes(field)
                                ? (val === true || val === 1 || val === '1' ? 'Ya' : 'Tidak')
                                : String(val);

                            return (
                                <div key={field} className="flex items-center justify-between py-1 text-sm">
                                    <span className="text-on-surface-container">{label}</span>
                                    <span className="font-medium text-on-background">{display}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AdminLayout title="Referensi Mahasiswa">
            <Head title="Referensi" />

            {showAlert && (flash?.success || flash?.error) && (
                <div className="mb-4">
                    <Alert
                        type={flash?.success ? 'success' : 'error'}
                        message={flash?.success || flash?.error}
                        onClose={() => setShowAlert(false)}
                    />
                </div>
            )}

            <div className="space-y-6">
                <Card title="Data Referensi">
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                            <Input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Cari nama, NUP, atau no. ujian..."
                            />
                            <Select
                                value={prodiId}
                                onChange={(e) => setProdiId(e.target.value)}
                                options={[{ value: '', label: 'Semua Prodi' }, ...prodi.map((p) => ({ value: p.id, label: p.nama_prodi }))]}
                            />
                            <Select
                                value={isReferensi}
                                onChange={(e) => setIsReferensi(e.target.value)}
                                options={[
                                    { value: '', label: 'Semua Status' },
                                    { value: '1', label: 'Referensi' },
                                    { value: '0', label: 'Regular' }
                                ]}
                            />
                            <Button onClick={handleSearch} size="sm">Cari</Button>
                        </div>
                    </div>

                    <div className="mb-4 flex items-center gap-2">
                        <Badge variant="info">Total: {pendaftar.total}</Badge>
                        <Badge variant="warning">
                            Referensi: {pendaftar.data.filter((p) => p.is_referensi).length}
                        </Badge>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-outline-variant">
                            <thead className="bg-surface-container">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-on-surface-container w-8"></th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-on-surface-container">NUP</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-on-surface-container">No. Ujian</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-on-surface-container">Nama</th>
                                    <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider text-on-surface-container">Pil 1</th>
                                    <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider text-on-surface-container">Pil 2</th>
                                    <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider text-on-surface-container">Pil 3</th>
                                    <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider text-on-surface-container">Lulus</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-on-surface-container">Catatan</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-on-surface-container">Status</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-on-surface-container">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant bg-surface-container-lowest">
                                {pendaftar.data.map((item) => (
                                    <>
                                        <tr
                                            key={item.id}
                                            className={`cursor-pointer ${
                                                item.is_referensi
                                                    ? 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/10 dark:hover:bg-amber-900/20'
                                                    : 'hover:bg-surface-container'
                                            }`}
                                            onClick={() => handleRowClick(item.id)}
                                        >
                                            <td className="px-4 py-3 text-sm text-on-surface-container">
                                                {expandedRow === item.id ? (
                                                    <ChevronDown className="h-4 w-4" />
                                                ) : (
                                                    <ChevronRight className="h-4 w-4" />
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm font-mono text-on-background">{item.kode_pendaftar}</td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm font-mono text-on-background">{item.noujian || '-'}</td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-on-background">{item.nama}</td>
                                            <td className="whitespace-nowrap px-2 py-3 text-sm font-mono text-on-surface">{item.pil1_prodi?.kode_prodi || '-'}</td>
                                            <td className="whitespace-nowrap px-2 py-3 text-sm font-mono text-on-surface">{item.pil2_prodi?.kode_prodi || '-'}</td>
                                            <td className="whitespace-nowrap px-2 py-3 text-sm font-mono text-on-surface">{item.pil3_prodi?.kode_prodi || '-'}</td>
                                            <td className="whitespace-nowrap px-2 py-3 text-sm font-mono text-on-surface">
                                                {item.lulus_prodi ? (
                                                    <Badge variant="success">{item.lulus_prodi.kode_prodi}</Badge>
                                                ) : (
                                                    <Badge variant="danger">-</Badge>
                                                )}
                                            </td>
                                            <td className="max-w-xs truncate px-4 py-3 text-sm text-on-surface" title={item.catatan_referensi || '-'}>{item.catatan_referensi || '-'}</td>
                                            <td className="whitespace-nowrap px-4 py-3 text-center">
                                                {item.is_referensi ? (
                                                    <Badge variant="warning">Referensi</Badge>
                                                ) : (
                                                    <Badge variant="info">Regular</Badge>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-center">
                                                <Button
                                                    size="sm"
                                                    variant={item.is_referensi ? 'danger' : 'primary'}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleToggle(item.id, item.catatan_referensi);
                                                    }}
                                                >
                                                    {item.is_referensi ? (
                                                        <><StarOff className="mr-1 h-3.5 w-3.5" /> Hapus</>
                                                    ) : (
                                                        <><Star className="mr-1 h-3.5 w-3.5" /> Referensi</>
                                                    )}
                                                </Button>
                                            </td>
                                        </tr>
                                        {expandedRow === item.id && (
                                            <tr key={`${item.id}-detail`}>
                                                <td colSpan={11} className="bg-surface-container px-4 py-4">
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <span className="font-semibold text-on-background">{item.nama}</span>
                                                            <span className="text-on-surface-container">NUP: <span className="font-mono">{item.kode_pendaftar}</span></span>
                                                            {item.noujian && <span className="text-on-surface-container">No. Ujian: <span className="font-mono">{item.noujian}</span></span>}
                                                        </div>
                                                        {nilaiLoading === item.id && (
                                                            <div className="py-4 text-center text-sm text-on-surface-container">Memuat data nilai...</div>
                                                        )}
                                                        {!nilaiLoading && nilaiCache[item.id] && (
                                                            <>
                                                                {nilaiCache[item.id]!.agregasi.has_lulus ? (
                                                                    <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-4">
                                                                        <div className="mb-3 flex items-center gap-2">
                                                                            <h5 className="text-sm font-semibold text-on-background">
                                                                                Statistik Kelulusan Prodi {nilaiCache[item.id]!.agregasi.prodi_nama}
                                                                            </h5>
                                                                            <Badge variant="success">{nilaiCache[item.id]!.agregasi.jumlah_lulus} lulus</Badge>
                                                                        </div>
                                                                        <div className="flex flex-wrap gap-4 text-sm">
                                                                            <div className="flex items-center gap-1">
                                                                                <span className="text-on-surface-container">Skor Min:</span>
                                                                                <span className="font-mono font-medium text-on-background">{nilaiCache[item.id]!.agregasi.nilai_akhir!.min ?? '-'}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-1">
                                                                                <span className="text-on-surface-container">Skor Max:</span>
                                                                                <span className="font-mono font-medium text-on-background">{nilaiCache[item.id]!.agregasi.nilai_akhir!.max ?? '-'}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-1">
                                                                                <span className="text-on-surface-container">Skor Median:</span>
                                                                                <span className="font-mono font-medium text-on-background">{nilaiCache[item.id]!.agregasi.nilai_akhir!.median ?? '-'}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="rounded-lg border border-outline-variant bg-amber-50 p-4 text-center text-sm font-medium text-amber-700 dark:bg-amber-900/10 dark:text-amber-400">
                                                                        Kelulusan belum diproses
                                                                    </div>
                                                                )}
                                                                {nilaiCache[item.id]!.nilai.length > 0 ? (
                                                                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                                        {nilaiCache[item.id]!.nilai.map((n) => renderNilaiDetail(n))}
                                                                    </div>
                                                                ) : (
                                                                    <div className="py-4 text-center text-sm text-on-surface-container">Belum ada data nilai.</div>
                                                                )}
                                                            </>
                                                        )}
                                                        {!nilaiLoading && !nilaiCache[item.id] && (
                                                            <div className="py-4 text-center text-sm text-error">Gagal memuat data nilai.</div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                                {pendaftar.data.length === 0 && (
                                    <tr>
                                        <td colSpan={11} className="px-4 py-8 text-center text-sm text-on-surface-container">
                                            Tidak ada data pendaftar.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {pendaftar.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-on-surface-container">
                                Menampilkan {pendaftar.from} - {pendaftar.to} dari {pendaftar.total}
                            </div>
                            <div className="flex gap-1">
                                {pendaftar.links.map((link, i) => {
                                    if (link.url === null) {
                                        return (
                                            <span
                                                key={i}
                                                className="inline-flex items-center rounded-md px-3 py-1 text-sm text-on-surface-container/50"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    }

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                if (link.url) {
                                                    router.get(link.url, {}, { preserveState: true });
                                                }
                                            }}
                                            className={`inline-flex items-center rounded-md px-3 py-1 text-sm ${
                                                link.active
                                                    ? 'bg-primary text-on-primary'
                                                    : 'text-on-surface hover:bg-surface-container'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </Card>

                <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Tandai sebagai Referensi">
                    <div className="space-y-4">
                        <p className="text-sm text-on-surface-container">
                            Masukkan catatan untuk pendaftar ini. Catatan bersifat opsional.
                        </p>
                        <Textarea
                            value={catatan}
                            onChange={(e) => setCatatan(e.target.value)}
                            placeholder="Catatan referensi (opsional)..."
                            rows={4}
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setModalOpen(false)}>
                                Batal
                            </Button>
                            <Button onClick={handleSubmitModal}>
                                Simpan
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </AdminLayout>
    );
}
