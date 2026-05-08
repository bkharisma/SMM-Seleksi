import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
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
}

interface DetailData {
    error?: string;
    prodi?: ProdiDetail;
    total_peserta?: number;
    total_lulus?: number;
    peserta?: PesertaLulus[];
}

interface RekapDetailProps {
    detail: DetailData;
}

export default function RekapDetail({ detail }: RekapDetailProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);

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
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">{totalPeserta}</div>
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

                <Card
                    title={`Peserta Lulus - ${detail.prodi?.nama_prodi} (${detail.prodi?.kode_prodi})`}
                    action={
                        <div className="flex gap-2">
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
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">NUP</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Nama</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">No. Ujian</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Pilihan</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Tahap Lulus</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Nilai Akhir</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Lulus di Prodi</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {detail.peserta && detail.peserta.length > 0 ? (
                                    detail.peserta.map((p) => (
                                        <tr key={p.id}>
                                            <td className="whitespace-nowrap px-4 py-2 text-sm">{p.nup}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-sm font-medium">{p.nama}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-sm">{p.noujian || '-'}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-sm">{p.pilihan}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-sm">{p.tahap_lulus || '-'}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-semibold">{p.total_skor}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-center text-sm">
                                                <span className="inline-block rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">{p.status}</span>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2 text-sm">{p.lulus_prodi || '-'}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-center text-sm">
                                                <button
                                                    onClick={() => handleRevoke(p.id, p.nama)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    Hapus Kelulusan
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-500">
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
