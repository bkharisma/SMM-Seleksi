import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Modal from '@/components/ui/modal';
import Select from '@/components/ui/select';

interface Prodi {
    id: number;
    nama_prodi: string;
    kode_prodi: string;
}

interface RekapProdi {
    prodi_id: number;
    nama_prodi: string;
    kode_prodi: string;
    total_peserta: number;
    total_lulus: number;
    tidak_lulus: number;
    kuota: number | null;
    pilihan_1: number;
    pilihan_2: number;
    pilihan_3: number;
    diluar_pilihan: number;
    tersisa: number | null;
}

interface Statistik {
    min: number;
    max: number;
    median: number;
}

interface RekapData {
    rekap_per_prodi: RekapProdi[];
    total_lulus: number;
    total_peserta: number;
    total_peminat: number;
    statistik: Statistik | null;
}

interface SeleksiRekapProps {
    rekap: RekapData;
    prodi: Prodi[];
    is_finalized: boolean;
    filters: { prodi_id?: string };
}

export default function SeleksiRekap({ rekap, prodi, is_finalized, filters }: SeleksiRekapProps) {
    const { flash } = usePage().props as any;
    const [prodiId, setProdiId] = useState(filters.prodi_id || '');
    const [showFinalizeModal, setShowFinalizeModal] = useState(false);
    const [showRevertModal, setShowRevertModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setTimeout(() => {
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 5000);
            }, 0);
        }
    }, [flash]);

    const handleFilter = () => {
        const params = new URLSearchParams();

        if (prodiId) {
            params.set('prodi_id', prodiId);
        }

        router.get(`/admin/seleksi/rekap?${params.toString()}`, {}, { preserveState: true });
    };

    const handleExport = () => {
        const params = new URLSearchParams();

        if (prodiId) {
            params.set('prodi_id', prodiId);
        }

        window.location.href = `/admin/seleksi/export?${params.toString()}`;
    };

    const handleFinalize = () => {
        router.post('/admin/seleksi/finalisasi', {}, {
            onSuccess: () => setShowFinalizeModal(false),
        });
    };

    const handleRevert = () => {
        router.post('/admin/seleksi/revert-finalisasi', {}, {
            onSuccess: () => setShowRevertModal(false),
        });
    };

    const getKuotaStatus = (item: RekapProdi) => {
        if (!item.kuota) {
return null;
}

        const pct = Math.round((item.total_lulus / item.kuota) * 100);

        if (pct > 100) {
return { label: `Overload (${pct}%)`, variant: 'danger' as const };
}

        if (pct === 100) {
return { label: 'Penuh', variant: 'success' as const };
}

        if (pct >= 75) {
return { label: `${pct}%`, variant: 'warning' as const };
}

        return { label: `${pct}%`, variant: 'danger' as const };
    };

    return (
        <AdminLayout title="Rekap Kelulusan">
            <Head title="Rekap Kelulusan" />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}
            {showAlert && flash?.error && (
                <div className="mb-4">
                    <Alert type="error" message={flash.error} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900">{rekap.total_peserta}</div>
                            <div className="text-sm text-gray-500">Total Peserta</div>
                        </div>
                    </Card>
                    <Card>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">{rekap.total_lulus}</div>
                            <div className="text-sm text-gray-500">Total Lulus</div>
                        </div>
                    </Card>
                    <Card>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600">
                                {rekap.total_peserta > 0 ? Math.round((rekap.total_lulus / rekap.total_peserta) * 100) : 0}%
                            </div>
                            <div className="text-sm text-gray-500">Rasio Kelulusan</div>
                        </div>
                    </Card>
                    <Card>
                        <div className="text-center">
                            {is_finalized ? (
                                <Badge variant="success" className="text-sm">Sudah Difinalisasi</Badge>
                            ) : (
                                <Badge variant="warning" className="text-sm">Belum Difinalisasi</Badge>
                            )}
                            <div className="text-sm text-gray-500 mt-2">Status Finalisasi</div>
                        </div>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{rekap.statistik?.min ?? '-'}</div>
                            <div className="text-sm text-gray-500">Skor Min</div>
                        </div>
                    </Card>
                    <Card>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{rekap.statistik?.max ?? '-'}</div>
                            <div className="text-sm text-gray-500">Skor Max</div>
                        </div>
                    </Card>
                    <Card>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{rekap.statistik?.median ?? '-'}</div>
                            <div className="text-sm text-gray-500">Skor Median</div>
                        </div>
                    </Card>
                </div>

                {(() => {
                    const overloaded = rekap.rekap_per_prodi.filter((item) => item.kuota && item.total_lulus > item.kuota);

                    if (overloaded.length > 0) {
                        return (
                            <Alert
                                type="error"
                                message={`Peringatan: ${overloaded.length} prodi kelebihan kuota (${overloaded.map((p) => p.nama_prodi).join(', ')}). Silakan buka detail prodi untuk membatalkan kelulusan yang berlebih.`}
                            />
                        );
                    }

                    return null;
                })()}

                <Card
                    title="Rekapitulasi Kelulusan per Program Studi"
                    action={
                        <div className="flex gap-2">
                            {!is_finalized && (
                                <Button variant="primary" size="sm" onClick={() => setShowFinalizeModal(true)}>
                                    Finalisasi
                                </Button>
                            )}
                            {is_finalized && (
                                <Button variant="danger" size="sm" onClick={() => setShowRevertModal(true)}>
                                    Revert Finalisasi
                                </Button>
                            )}
                            <Button variant="outline" size="sm" onClick={handleExport}>
                                Export Excel
                            </Button>
                        </div>
                    }
                >
                    <div className="mb-4 flex gap-2">
                        <Select
                            value={prodiId}
                            onChange={(e) => setProdiId(e.target.value)}
                            options={[{ value: '', label: 'Semua Prodi' }, ...prodi.map((p) => ({ value: p.id, label: p.nama_prodi }))]}
                        />
                        <Button size="sm" onClick={handleFilter}>Filter</Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-outline-variant">
                            <thead className="bg-surface-container">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-on-surface-container">Kode</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-on-surface-container">Program Studi</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-on-surface-container">Total Peserta</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-on-surface-container">Total Lulus</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-on-surface-container">Tidak Lulus</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-on-surface-container">Kuota</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-on-surface-container">Pilihan 1</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-on-surface-container">Pilihan 2</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-on-surface-container">Pilihan 3</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-on-surface-container">Diluar Pilihan</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-on-surface-container">Sisa Kuota</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-on-surface-container">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant">
                                {rekap.rekap_per_prodi.map((item) => {
                                    const status = getKuotaStatus(item);
                                    const isOverload = item.kuota && item.total_lulus > item.kuota;

                                    return (
                                        <tr
                                            key={item.prodi_id}
                                            onClick={() => router.get(`/admin/seleksi/rekap/${item.prodi_id}`)}
                                            className={`cursor-pointer hover:bg-surface-container ${isOverload ? 'bg-red-50 dark:bg-red-900/10' : ''}`}
                                        >
                                            <td className="whitespace-nowrap px-4 py-2 text-sm font-medium">{item.kode_prodi}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-sm text-blue-600 hover:underline">{item.nama_prodi}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-center text-sm">{item.total_peserta}</td>
                                            <td className={`whitespace-nowrap px-4 py-2 text-center text-sm font-bold ${isOverload ? 'text-red-600' : 'text-green-600'}`}>{item.total_lulus}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-center text-sm text-red-600">{item.tidak_lulus}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-center text-sm">{item.kuota ?? '-'}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-center text-sm">{item.pilihan_1}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-center text-sm">{item.pilihan_2}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-center text-sm">{item.pilihan_3}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-center text-sm text-blue-600 font-medium">{item.diluar_pilihan}</td>
                                            <td className={`whitespace-nowrap px-4 py-2 text-center text-sm ${isOverload ? 'font-semibold text-red-600' : ''}`}>{item.tersisa ?? '-'}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-center text-sm">
                                                {status ? <Badge variant={status.variant}>{status.label}</Badge> : '-'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot className="bg-surface-container font-bold">
                                <tr>
                                    <td colSpan={2} className="px-4 py-2 text-sm text-on-surface">TOTAL</td>
                                    <td className="px-4 py-2 text-center text-sm text-on-surface">{rekap.rekap_per_prodi.reduce((sum, i) => sum + i.total_peserta, 0)}</td>
                                    <td className="px-4 py-2 text-center text-sm text-green-600">{rekap.total_lulus}</td>
                                    <td className="px-4 py-2 text-center text-sm text-red-600">{rekap.rekap_per_prodi.reduce((sum, i) => sum + i.tidak_lulus, 0)}</td>
                                    <td className="px-4 py-2 text-center text-sm text-on-surface">{rekap.rekap_per_prodi.reduce((sum, i) => sum + (i.kuota ?? 0), 0) || '-'}</td>
                                    <td className="px-4 py-2 text-center text-sm text-on-surface">{rekap.rekap_per_prodi.reduce((sum, i) => sum + i.pilihan_1, 0)}</td>
                                    <td className="px-4 py-2 text-center text-sm text-on-surface">{rekap.rekap_per_prodi.reduce((sum, i) => sum + i.pilihan_2, 0)}</td>
                                    <td className="px-4 py-2 text-center text-sm text-on-surface">{rekap.rekap_per_prodi.reduce((sum, i) => sum + i.pilihan_3, 0)}</td>
                                    <td className="px-4 py-2 text-center text-sm text-blue-600">{rekap.rekap_per_prodi.reduce((sum, i) => sum + i.diluar_pilihan, 0)}</td>
                                    <td className="px-4 py-2 text-center text-sm text-on-surface">{rekap.rekap_per_prodi.reduce((sum, i) => sum + (i.tersisa ?? 0), 0) || '-'}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </Card>
            </div>

            <Modal
                isOpen={showFinalizeModal}
                onClose={() => setShowFinalizeModal(false)}
                title="Konfirmasi Finalisasi"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Finalisasi akan menandai semua peserta yang <strong>belum lulus</strong> sebagai <strong>TIDAK LULUS</strong> secara definitif.
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Peserta yang tidak lulus Tahap 1 tidak akan dapat melakukan upload dokumen persyaratan.
                    </p>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                        Tindakan ini dapat dibatalkan dengan tombol "Revert Finalisasi".
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => setShowFinalizeModal(false)}>Batal</Button>
                        <Button variant="primary" onClick={handleFinalize}>Finalisasi</Button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={showRevertModal}
                onClose={() => setShowRevertModal(false)}
                title="Konfirmasi Revert Finalisasi"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Revert finalisasi akan mengembalikan semua peserta ke status <strong>belum diproses</strong>.
                    </p>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                        Peserta yang sebelumnya ditandai tidak lulus akan kembali ke status awal.
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => setShowRevertModal(false)}>Batal</Button>
                        <Button variant="danger" onClick={handleRevert}>Revert Finalisasi</Button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
