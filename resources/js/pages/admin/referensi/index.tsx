import { Head, router, usePage } from '@inertiajs/react';
import { Star, StarOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Modal from '@/components/ui/modal';
import Textarea from '@/components/ui/textarea';

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

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
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
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Cari nama, NUP, atau no. ujian..."
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            />
                            <select
                                value={prodiId}
                                onChange={(e) => setProdiId(e.target.value)}
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            >
                                <option value="">Semua Prodi</option>
                                {prodi.map((p) => (
                                    <option key={p.id} value={p.id}>{p.nama_prodi}</option>
                                ))}
                            </select>
                            <select
                                value={isReferensi}
                                onChange={(e) => setIsReferensi(e.target.value)}
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            >
                                <option value="">Semua Status</option>
                                <option value="1">Referensi</option>
                                <option value="0">Regular</option>
                            </select>
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
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">NUP</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">No. Ujian</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nama</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Pil 1</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Pil 2</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Pil 3</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status Kelulusan</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Catatan</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                                {pendaftar.data.map((item) => (
                                    <tr
                                        key={item.id}
                                        className={
                                            item.is_referensi
                                                ? 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/10 dark:hover:bg-amber-900/20'
                                                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }
                                    >
                                        <td className="whitespace-nowrap px-4 py-3 text-sm font-mono">{item.kode_pendaftar}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm font-mono">{item.noujian || '-'}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">{item.nama}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm">{item.pil1_prodi?.nama_prodi || '-'}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm">{item.pil2_prodi?.nama_prodi || '-'}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm">{item.pil3_prodi?.nama_prodi || '-'}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                                            {item.lulus_prodi ? (
                                                <Badge variant="success">Lulus - {item.lulus_prodi.nama_prodi}</Badge>
                                            ) : (
                                                <Badge variant="danger">Belum Lulus</Badge>
                                            )}
                                        </td>
                                        <td className="max-w-xs truncate px-4 py-3 text-sm text-gray-700 dark:text-gray-300" title={item.catatan_referensi || '-'}>{item.catatan_referensi || '-'}</td>
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
                                                onClick={() => handleToggle(item.id, item.catatan_referensi)}
                                            >
                                                {item.is_referensi ? (
                                                    <><StarOff className="mr-1 h-3.5 w-3.5" /> Hapus</>
                                                ) : (
                                                    <><Star className="mr-1 h-3.5 w-3.5" /> Referensi</>
                                                )}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {pendaftar.data.length === 0 && (
                                    <tr>
                                        <td colSpan={10} className="px-4 py-8 text-center text-sm text-gray-500">
                                            Tidak ada data pendaftar.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {pendaftar.last_page > 1 && (
                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                Menampilkan {pendaftar.from} - {pendaftar.to} dari {pendaftar.total}
                            </div>
                            <div className="flex gap-1">
                                {pendaftar.links.map((link, i) => {
                                    if (link.url === null) {
                                        return (
                                            <span
                                                key={i}
                                                className="inline-flex items-center rounded-md px-3 py-1 text-sm text-gray-400"
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
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
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
                        <p className="text-sm text-gray-600 dark:text-gray-400">
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
