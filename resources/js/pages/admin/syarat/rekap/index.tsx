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
    total_lulus_tahap1: number;
    berkas_lengkap: number;
    berkas_tidak_lengkap: number;
    belum_upload: number;
    belum_diperiksa: number;
    finalisasi_tahap2: number;
    belum_finalisasi: number;
}

interface RekapData {
    rekap_per_prodi: RekapProdi[];
    total_lulus_tahap1: number;
    kelulusan_final: number;
    berkas_lengkap: number;
    berkas_tidak_lengkap: number;
    belum_upload: number;
    is_finalized_tahap2: boolean;
}

interface RekapProps {
    rekap: RekapData;
    prodi: Prodi[];
    is_finalized: boolean;
    filters: { prodi_id?: string };
}

export default function RekapIndex({ rekap, prodi, is_finalized, filters }: RekapProps) {
    const { flash } = usePage().props as any;
    const [prodiId, setProdiId] = useState(filters.prodi_id || '');
    const [showFinalizeModal, setShowFinalizeModal] = useState(false);
    const [showRevertModal, setShowRevertModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
        }
    }, [flash]);

    const handleFilter = () => {
        const params = new URLSearchParams();

        if (prodiId) {
            params.set('prodi_id', prodiId);
        }

        router.get(`/admin/syarat/rekap?${params.toString()}`, {}, { preserveState: true });
    };

    const handleFinalize = () => {
        const params = new URLSearchParams();

        if (prodiId) {
            params.set('prodi_id', prodiId);
        }

        router.post(`/admin/syarat/rekap/finalisasi?${params.toString()}`, {}, {
            onSuccess: () => setShowFinalizeModal(false),
        });
    };

    const handleRevert = () => {
        const params = new URLSearchParams();

        if (prodiId) {
            params.set('prodi_id', prodiId);
        }

        router.post(`/admin/syarat/rekap/revert-finalisasi?${params.toString()}`, {}, {
            onSuccess: () => setShowRevertModal(false),
        });
    };

    const ratioKelulusan = rekap.total_lulus_tahap1 > 0
        ? Math.round((rekap.kelulusan_final / rekap.total_lulus_tahap1) * 100)
        : 0;

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
                            <div className="text-3xl font-bold text-green-600">{rekap.total_lulus_tahap1}</div>
                            <div className="text-sm text-gray-500">Lulus Tahap 1</div>
                        </div>
                    </Card>
                    <Card>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{rekap.kelulusan_final}</div>
                            <div className="text-sm text-gray-500">Kelulusan Final</div>
                        </div>
                    </Card>
                    <Card>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600">{ratioKelulusan}%</div>
                            <div className="text-sm text-gray-500">Rasio Kelulusan</div>
                        </div>
                    </Card>
                    <Card>
                        <div className="text-center">
                            {is_finalized ? (
                                <Badge variant="success">Sudah Difinalisasi</Badge>
                            ) : (
                                <Badge variant="warning">Belum Difinalisasi</Badge>
                            )}
                            <div className="text-sm text-gray-500 mt-2">Status Finalisasi</div>
                        </div>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-emerald-600">{rekap.berkas_lengkap}</div>
                            <div className="text-sm text-gray-500">Berkas Lengkap</div>
                        </div>
                    </Card>
                    <Card>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-rose-600">{rekap.berkas_tidak_lengkap}</div>
                            <div className="text-sm text-gray-500">Tidak Lengkap</div>
                        </div>
                    </Card>
                    <Card>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-600">{rekap.belum_upload}</div>
                            <div className="text-sm text-gray-500">Belum Upload</div>
                        </div>
                    </Card>
                </div>

                <Card
                    title="Rekapitulasi Kelulusan per Program Studi"
                    action={
                        <div className="flex gap-2">
                            {!is_finalized && (
                                <Button variant="primary" size="sm" onClick={() => setShowFinalizeModal(true)}>
                                    Finalisasi Tahap 2
                                </Button>
                            )}
                            {is_finalized && (
                                <Button variant="danger" size="sm" onClick={() => setShowRevertModal(true)}>
                                    Revert Finalisasi
                                </Button>
                            )}
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
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-on-surface-container">Lulus Tahap 1</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-on-surface-container">Berkas Lengkap</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-on-surface-container">Tidak Lengkap</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-on-surface-container">Belum Upload</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-on-surface-container">Final Tahap 2</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-on-surface-container">Belum Finalisasi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant">
                                {rekap.rekap_per_prodi.map((item) => (
                                    <tr
                                        key={item.prodi_id}
                                        onClick={() => router.get(`/admin/syarat/rekap/${item.prodi_id}`)}
                                        className="cursor-pointer hover:bg-surface-container"
                                    >
                                        <td className="whitespace-nowrap px-4 py-2 text-sm font-medium">{item.kode_prodi}</td>
                                        <td className="whitespace-nowrap px-4 py-2 text-sm text-blue-600 hover:underline">{item.nama_prodi}</td>
                                        <td className="whitespace-nowrap px-4 py-2 text-center text-sm text-green-600 font-bold">{item.total_lulus_tahap1}</td>
                                        <td className="whitespace-nowrap px-4 py-2 text-center text-sm text-emerald-600">{item.berkas_lengkap}</td>
                                        <td className="whitespace-nowrap px-4 py-2 text-center text-sm text-rose-600">{item.berkas_tidak_lengkap}</td>
                                        <td className="whitespace-nowrap px-4 py-2 text-center text-sm text-gray-600">{item.belum_upload}</td>
                                        <td className="whitespace-nowrap px-4 py-2 text-center text-sm text-blue-600 font-semibold">{item.finalisasi_tahap2}</td>
                                        <td className="whitespace-nowrap px-4 py-2 text-center text-sm text-amber-600">{item.belum_finalisasi}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-surface-container font-bold">
                                <tr>
                                    <td colSpan={2} className="px-4 py-2 text-sm text-on-surface">TOTAL</td>
                                    <td className="px-4 py-2 text-center text-sm text-green-600">{rekap.rekap_per_prodi.reduce((sum, i) => sum + i.total_lulus_tahap1, 0)}</td>
                                    <td className="px-4 py-2 text-center text-sm text-emerald-600">{rekap.rekap_per_prodi.reduce((sum, i) => sum + i.berkas_lengkap, 0)}</td>
                                    <td className="px-4 py-2 text-center text-sm text-rose-600">{rekap.rekap_per_prodi.reduce((sum, i) => sum + i.berkas_tidak_lengkap, 0)}</td>
                                    <td className="px-4 py-2 text-center text-sm text-gray-600">{rekap.rekap_per_prodi.reduce((sum, i) => sum + i.belum_upload, 0)}</td>
                                    <td className="px-4 py-2 text-center text-sm text-blue-600">{rekap.rekap_per_prodi.reduce((sum, i) => sum + i.finalisasi_tahap2, 0)}</td>
                                    <td className="px-4 py-2 text-center text-sm text-amber-600">{rekap.rekap_per_prodi.reduce((sum, i) => sum + i.belum_finalisasi, 0)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </Card>
            </div>

            <Modal
                isOpen={showFinalizeModal}
                onClose={() => setShowFinalizeModal(false)}
                title="Konfirmasi Finalisasi Tahap 2"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Finalisasi Tahap 2 akan menentukan kelulusan final berdasarkan status verifikasi berkas:
                    </p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
                        <li>Peserta dengan berkas <strong>Lengkap</strong> akan ditandai <strong>LULUS Tahap 2</strong></li>
                        <li>Peserta dengan berkas <strong>Belum Upload, Belum Diperiksa, Tidak Lengkap, atau Perbaikan</strong> akan ditandai <strong>TIDAK LULUS Tahap 2</strong></li>
                    </ul>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                        Tindakan ini dapat dibatalkan dengan tombol "Revert Finalisasi".
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => setShowFinalizeModal(false)}>Batal</Button>
                        <Button variant="primary" onClick={handleFinalize}>Finalisasi Tahap 2</Button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={showRevertModal}
                onClose={() => setShowRevertModal(false)}
                title="Konfirmasi Revert Finalisasi Tahap 2"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Revert finalisasi akan mengembalikan semua peserta ke status <strong>sebelum finalisasi Tahap 2</strong>.
                    </p>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                        Peserta yang sebelumnya ditandai lulus/tidak lulus Tahap 2 akan kembali ke status awal.
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
