import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Modal from '@/components/ui/modal';

interface ProdiDetail {
    id: number;
    kode_prodi: string;
    nama_prodi: string;
}

interface Peserta {
    id: number;
    nup: string;
    nama: string;
    noujian: string | null;
    status_berkas: string;
    tahap_lulus: string;
    finalisasi_tahap2: boolean;
    is_lulus_final: boolean;
    is_tidak_lulus_final: boolean;
}

interface DetailData {
    error?: string;
    prodi?: ProdiDetail;
    total_lulus_tahap1?: number;
    berkas_lengkap?: number;
    berkas_tidak_lengkap?: number;
    belum_upload?: number;
    finalisasi_tahap2?: number;
    peserta?: Peserta[];
}

interface RekapDetailProps {
    detail: DetailData;
}

const statusBerkasColors: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
    'Lengkap': 'success',
    'Tidak Lengkap': 'danger',
    'Perbaikan': 'warning',
    'Belum Diperiksa': 'info',
    'Belum Upload': 'neutral',
};

export default function RekapDetail({ detail }: RekapDetailProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [allSelected, setAllSelected] = useState(false);
    const [showFinalizeModal, setShowFinalizeModal] = useState(false);
    const [showRevertModal, setShowRevertModal] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [sortColumn, setSortColumn] = useState<string>('nama');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
        }
    }, [flash]);

    const handleSelectAll = (checked: boolean) => {
        setAllSelected(checked);

        if (checked && detail.peserta) {
            setSelectedIds(new Set(detail.peserta.map(p => p.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleSelectOne = (id: number, checked: boolean) => {
        const newSelected = new Set(selectedIds);

        if (checked) {
            newSelected.add(id);
        } else {
            newSelected.delete(id);
        }

        setSelectedIds(newSelected);
        setAllSelected(newSelected.size === detail.peserta?.length);
    };

    const handleFinalize = () => {
        setProcessing(true);
        router.post(`/admin/syarat/rekap/finalisasi?prodi_id=${detail.prodi?.id}`, {}, {
            onFinish: () => {
                setProcessing(false);
                setShowFinalizeModal(false);
            },
        });
    };

    const handleRevert = () => {
        setProcessing(true);
        router.post(`/admin/syarat/rekap/revert-finalisasi?prodi_id=${detail.prodi?.id}`, {}, {
            onFinish: () => {
                setProcessing(false);
                setShowRevertModal(false);
            },
        });
    };

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const sortedPeserta = useMemo(() => {
        if (!detail.peserta) {
return [];
}

        return [...detail.peserta].sort((a, b) => {
            let comparison = 0;

            switch (sortColumn) {
                case 'nup':
                    comparison = a.nup.localeCompare(b.nup);
                    break;
                case 'nama':
                    comparison = a.nama.localeCompare(b.nama);
                    break;
                case 'noujian':
                    comparison = (a.noujian || '').localeCompare(b.noujian || '');
                    break;
                case 'status_berkas':
                    comparison = a.status_berkas.localeCompare(b.status_berkas);
                    break;
            }

            return sortDirection === 'asc' ? comparison : -comparison;
        });
    }, [detail.peserta, sortColumn, sortDirection]);

    const totalPeserta = detail.total_lulus_tahap1 ?? 0;
    const berkasLengkap = detail.berkas_lengkap ?? 0;
    const berkasTidakLengkap = detail.berkas_tidak_lengkap ?? 0;
    const belumUpload = detail.belum_upload ?? 0;
    const finalisasiTahap2 = detail.finalisasi_tahap2 ?? 0;
    const rasio = totalPeserta > 0 ? Math.round((finalisasiTahap2 / totalPeserta) * 100) : 0;

    if (detail?.error) {
        return (
            <AdminLayout title="Detail Kelulusan">
                <Head title="Detail Kelulusan" />
                <Alert type="error" message={detail.error} />
                <div className="mt-4">
                    <Link href="/admin/syarat/rekap">
                        <Button variant="secondary">Kembali ke Rekap</Button>
                    </Link>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title={`Detail Kelulusan - ${detail.prodi?.nama_prodi}`}>
            <Head title={`Detail Kelulusan - ${detail.prodi?.nama_prodi}`} />

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
                <div className="grid gap-4 md:grid-cols-5">
                    <Card>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">{totalPeserta}</div>
                            <div className="text-sm text-gray-500">Lulus Tahap 1</div>
                        </div>
                    </Card>
                    <Card>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-emerald-600">{berkasLengkap}</div>
                            <div className="text-sm text-gray-500">Berkas Lengkap</div>
                        </div>
                    </Card>
                    <Card>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-rose-600">{berkasTidakLengkap}</div>
                            <div className="text-sm text-gray-500">Tidak Lengkap</div>
                        </div>
                    </Card>
                    <Card>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-600">{belumUpload}</div>
                            <div className="text-sm text-gray-500">Belum Upload</div>
                        </div>
                    </Card>
                    <Card>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{rasio}%</div>
                            <div className="text-sm text-gray-500">Finalisasi Tahap 2</div>
                        </div>
                    </Card>
                </div>

                <Card
                    title={`Peserta Lulus Tahap 1 - ${detail.prodi?.nama_prodi} (${detail.prodi?.kode_prodi})`}
                    action={
                        <div className="flex gap-2">
                            {selectedIds.size > 0 && (
                                <span className="text-sm text-gray-500 self-center">
                                    {selectedIds.size} peserta dipilih
                                </span>
                            )}
                            <a href={`/admin/syarat/rekap/${detail.prodi?.id}/export`}>
                                <Button variant="outline" size="sm">Export Lulus Tahap 2</Button>
                            </a>
                            <Button variant="primary" size="sm" onClick={() => setShowFinalizeModal(true)} disabled={processing}>
                                Finalisasi Tahap 2
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => setShowRevertModal(true)} disabled={processing}>
                                Revert Finalisasi
                            </Button>
                            <Link href="/admin/syarat/rekap">
                                <Button variant="secondary" size="sm">Kembali</Button>
                            </Link>
                        </div>
                    }
                >
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-surface-container">
                                <tr>
                                    <th className="px-4 py-2 text-center w-12">
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            onChange={(e) => handleSelectAll(e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        <button type="button" onClick={() => handleSort('nup')} className="inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300">
                                            NUP
                                            {sortColumn === 'nup' ? (
                                                sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                                            ) : (
                                                <ArrowUpDown className="h-3 w-3 opacity-50" />
                                            )}
                                        </button>
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        <button type="button" onClick={() => handleSort('nama')} className="inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300">
                                            Nama
                                            {sortColumn === 'nama' ? (
                                                sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                                            ) : (
                                                <ArrowUpDown className="h-3 w-3 opacity-50" />
                                            )}
                                        </button>
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        <button type="button" onClick={() => handleSort('noujian')} className="inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300">
                                            No. Ujian
                                            {sortColumn === 'noujian' ? (
                                                sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                                            ) : (
                                                <ArrowUpDown className="h-3 w-3 opacity-50" />
                                            )}
                                        </button>
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        <button type="button" onClick={() => handleSort('status_berkas')} className="inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300">
                                            Status Berkas
                                            {sortColumn === 'status_berkas' ? (
                                                sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                                            ) : (
                                                <ArrowUpDown className="h-3 w-3 opacity-50" />
                                            )}
                                        </button>
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status Finalisasi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant">
                                {sortedPeserta.length > 0 ? (
                                    sortedPeserta.map((p) => (
                                        <tr key={p.id} className={p.is_tidak_lulus_final ? 'bg-red-50 dark:bg-red-900/10' : ''}>
                                            <td className="px-4 py-2 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.has(p.id)}
                                                    onChange={(e) => handleSelectOne(p.id, e.target.checked)}
                                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                />
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2 text-sm">{p.nup}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-sm font-medium">{p.nama}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-sm">{p.noujian || '-'}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-sm">
                                                <Badge variant={statusBerkasColors[p.status_berkas] || 'info'}>
                                                    {p.status_berkas}
                                                </Badge>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2 text-center text-sm">
                                                {p.is_lulus_final ? (
                                                    <span className="inline-block rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">LULUS Tahap 2</span>
                                                ) : p.is_tidak_lulus_final ? (
                                                    <span className="inline-block rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">TIDAK LULUS</span>
                                                ) : (
                                                    <span className="inline-block rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">Belum Finalisasi</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                                            Belum ada peserta yang lulus Tahap 1 untuk prodi ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
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
                        Finalisasi Tahap 2 untuk prodi <strong>{detail.prodi?.nama_prodi}</strong>:
                    </p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
                        <li>Peserta dengan berkas <strong>Lengkap</strong> akan ditandai <strong>LULUS Tahap 2</strong></li>
                        <li>Peserta dengan berkas <strong>Belum Upload, Belum Diperiksa, Tidak Lengkap, atau Perbaikan</strong> akan ditandai <strong>TIDAK LULUS</strong></li>
                    </ul>
                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => setShowFinalizeModal(false)} disabled={processing}>Batal</Button>
                        <Button variant="primary" onClick={handleFinalize} disabled={processing} isLoading={processing}>Finalisasi</Button>
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
                        Revert finalisasi akan mengembalikan semua peserta di prodi <strong>{detail.prodi?.nama_prodi}</strong> ke status sebelum finalisasi.
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => setShowRevertModal(false)} disabled={processing}>Batal</Button>
                        <Button variant="danger" onClick={handleRevert} disabled={processing} isLoading={processing}>Revert Finalisasi</Button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
