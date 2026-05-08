import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ArrowUpDown, Star } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Alert from '@/components/ui/alert';

interface ProdiDetail {
    id: number;
    kode_prodi: string;
    nama_prodi: string;
    kuota_smm: number | null;
}

interface PesertaLulus {
    id: number;
    nup: string;
    nama: string;
    noujian: string | null;
    pilihan: string;
    tahap_lulus: string | null;
    total_skor: number;
    status: string;
    lulus_prodi: string | null;
    is_referensi: boolean;
}

interface Statistik {
    min: number;
    max: number;
    median: number;
}

interface DetailData {
    error?: string;
    prodi?: ProdiDetail;
    total_peserta?: number;
    total_lulus?: number;
    statistik?: Statistik | null;
    peserta?: PesertaLulus[];
}

interface RekapDetailProps {
    detail: DetailData;
}

export default function RekapDetail({ detail }: RekapDetailProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [allSelected, setAllSelected] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [sortColumn, setSortColumn] = useState<string>('nama');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
        }
    }, [flash]);

    const handleRevoke = (id: number, nama: string) => {
        if (confirm(`Batalkan kelulusan ${nama}?`)) {
            router.delete(`/admin/seleksi/revoke/${id}`);
        }
    };

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

    const handleBulkRevoke = () => {
        const count = selectedIds.size;
        if (count === 0) return;
        if (!confirm(`Batalkan kelulusan ${count} peserta yang dipilih?`)) return;

        setProcessing(true);
        router.delete('/admin/seleksi/bulk-revoke', {
            data: { ids: Array.from(selectedIds) },
            onFinish: () => {
                setProcessing(false);
                setSelectedIds(new Set());
                setAllSelected(false);
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
        if (!detail.peserta) return [];
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
                case 'total_skor':
                    comparison = a.total_skor - b.total_skor;
                    break;
            }
            return sortDirection === 'asc' ? comparison : -comparison;
        });
    }, [detail.peserta, sortColumn, sortDirection]);

    const kuota = detail.prodi?.kuota_smm;
    const totalPeserta = detail.total_peserta ?? 0;
    const totalLulus = detail.total_lulus ?? 0;
    const rasio = totalPeserta > 0 ? Math.round((totalLulus / totalPeserta) * 100) : 0;

    if (detail?.error) {
        return (
            <AdminLayout title="Detail Kelulusan">
                <Head title="Detail Kelulusan" />
                <Alert type="error" message={detail.error} />
                <div className="mt-4">
                    <Link href="/admin/seleksi/rekap">
                        <Button variant="secondary">Kembali ke Rekap</Button>
                    </Link>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title={`Detail Lulus - ${detail.prodi?.nama_prodi}`}>
            <Head title={`Detail Lulus - ${detail.prodi?.nama_prodi}`} />

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
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900">{totalPeserta}</div>
                            <div className="text-sm text-gray-500">Total Peserta</div>
                        </div>
                    </Card>
                    <Card>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600">{kuota ?? '-'}</div>
                            <div className="text-sm text-gray-500">Kuota Prodi</div>
                        </div>
                    </Card>
                    <Card>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">{totalLulus}</div>
                            <div className="text-sm text-gray-500">Total Lulus</div>
                        </div>
                    </Card>
                    <Card>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{rasio}%</div>
                            <div className="text-sm text-gray-500">Rasio Kelulusan</div>
                        </div>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{detail.statistik?.min ?? '-'}</div>
                            <div className="text-sm text-gray-500">Skor Min</div>
                        </div>
                    </Card>
                    <Card>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{detail.statistik?.max ?? '-'}</div>
                            <div className="text-sm text-gray-500">Skor Max</div>
                        </div>
                    </Card>
                    <Card>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{detail.statistik?.median ?? '-'}</div>
                            <div className="text-sm text-gray-500">Skor Median</div>
                        </div>
                    </Card>
                </div>

                <Card
                    title={`Peserta Lulus - ${detail.prodi?.nama_prodi} (${detail.prodi?.kode_prodi})`}
                    action={
                        <div className="flex gap-2">
                            {selectedIds.size > 0 && (
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={handleBulkRevoke}
                                    disabled={processing}
                                    isLoading={processing}
                                >
                                    Hapus {selectedIds.size} Kelulusan
                                </Button>
                            )}
                            <a href={`/admin/seleksi/rekap/${detail.prodi?.id}/export`}>
                                <Button variant="outline" size="sm">Export Excel</Button>
                            </a>
                            <Link href="/admin/seleksi/rekap">
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
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Pilihan</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Tahap Lulus</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        <button type="button" onClick={() => handleSort('total_skor')} className="inline-flex items-center gap-1 mx-auto hover:text-gray-700 dark:hover:text-gray-300">
                                            Nilai Akhir
                                            {sortColumn === 'total_skor' ? (
                                                sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                                            ) : (
                                                <ArrowUpDown className="h-3 w-3 opacity-50" />
                                            )}
                                        </button>
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Lulus di Prodi</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant">
                                {sortedPeserta.length > 0 ? (
                                    sortedPeserta.map((p) => (
                                        <tr key={p.id}>
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
                                            <td className="whitespace-nowrap px-4 py-2 text-sm">{p.pilihan}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-sm">{p.tahap_lulus || '-'}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-semibold">{p.total_skor}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-center text-sm">
                                                <span className="inline-block rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">{p.status}</span>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2 text-sm">
                                                {p.lulus_prodi || '-'}
                                                {p.is_referensi && <Star className="inline h-4 w-4 text-amber-500 ml-1" />}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2 text-center text-sm">
                                                <button
                                                    onClick={() => handleRevoke(p.id, p.nama)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={10} className="px-4 py-8 text-center text-sm text-gray-500">
                                            Belum ada peserta yang lulus untuk prodi ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
}
