import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';

interface Prodi {
    id: number;
    nama_prodi: string;
    kode_prodi: string;
}

interface RekapProdi {
    prodi_id: number;
    nama_prodi: string;
    kode_prodi: string;
    total_lulus: number;
    kuota: number | null;
    pilihan_1: number;
    pilihan_2: number;
    pilihan_3: number;
    pilihan_4: number;
    tersisa: number | null;
}

interface RekapData {
    rekap_per_prodi: RekapProdi[];
    total_lulus: number;
    total_peserta: number;
    total_peminat: number;
}

interface SeleksiRekapProps {
    rekap: RekapData;
    prodi: Prodi[];
    filters: { prodi_id?: string };
}

export default function SeleksiRekap({ rekap, prodi, filters }: SeleksiRekapProps) {
    const [prodiId, setProdiId] = useState(filters.prodi_id || '');

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (prodiId) params.set('prodi_id', prodiId);
        router.get(`/admin/seleksi/rekap?${params.toString()}`, {}, { preserveState: true });
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        if (prodiId) params.set('prodi_id', prodiId);
        window.location.href = `/admin/seleksi/export?${params.toString()}`;
    };

    const getKuotaStatus = (item: RekapProdi) => {
        if (!item.kuota) return null;
        const pct = (item.total_lulus / item.kuota) * 100;
        if (pct >= 100) return { label: 'Penuh', variant: 'success' as const };
        if (pct >= 75) return { label: `${Math.round(pct)}%`, variant: 'warning' as const };
        return { label: `${Math.round(pct)}%`, variant: 'danger' as const };
    };

    return (
        <AdminLayout title="Rekap Kelulusan">
            <Head title="Rekap Kelulusan" />

            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{rekap.total_peminat}</div>
                            <div className="text-sm text-gray-500">Total Peminat</div>
                        </div>
                    </Card>
                    <Card>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">{rekap.total_peserta}</div>
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
                </div>

                <Card
                    title="Rekapitulasi Kelulusan per Program Studi"
                    action={
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleExport}>
                                Export Excel
                            </Button>
                        </div>
                    }
                >
                    <div className="mb-4 flex gap-2">
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
                        <Button size="sm" onClick={handleFilter}>Filter</Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Kode</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Program Studi</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500">Total Lulus</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500">Kuota</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500">Pilihan 1</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500">Pilihan 2</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500">Pilihan 3</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500">Pilihan 4</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500">Sisa Kuota</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {rekap.rekap_per_prodi.map((item) => {
                                    const status = getKuotaStatus(item);
                                    return (
                                        <tr key={item.prodi_id}>
                                            <td className="whitespace-nowrap px-4 py-2 text-sm font-medium">{item.kode_prodi}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-sm">{item.nama_prodi}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-bold text-green-600">{item.total_lulus}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-center text-sm">{item.kuota ?? '-'}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-center text-sm">{item.pilihan_1}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-center text-sm">{item.pilihan_2}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-center text-sm">{item.pilihan_3}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-center text-sm">{item.pilihan_4}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-center text-sm">{item.tersisa ?? '-'}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-center text-sm">
                                                {status ? (
                                                    <Badge variant={status.variant}>{status.label}</Badge>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot className="bg-gray-50 dark:bg-gray-800 font-bold">
                                <tr>
                                    <td colSpan={2} className="px-4 py-2 text-sm">TOTAL</td>
                                    <td className="px-4 py-2 text-center text-sm text-green-600">{rekap.total_lulus}</td>
                                    <td className="px-4 py-2 text-center text-sm">
                                        {rekap.rekap_per_prodi.reduce((sum, i) => sum + (i.kuota ?? 0), 0) || '-'}
                                    </td>
                                    <td className="px-4 py-2 text-center text-sm">
                                        {rekap.rekap_per_prodi.reduce((sum, i) => sum + i.pilihan_1, 0)}
                                    </td>
                                    <td className="px-4 py-2 text-center text-sm">
                                        {rekap.rekap_per_prodi.reduce((sum, i) => sum + i.pilihan_2, 0)}
                                    </td>
                                    <td className="px-4 py-2 text-center text-sm">
                                        {rekap.rekap_per_prodi.reduce((sum, i) => sum + i.pilihan_3, 0)}
                                    </td>
                                    <td className="px-4 py-2 text-center text-sm">
                                        {rekap.rekap_per_prodi.reduce((sum, i) => sum + i.pilihan_4, 0)}
                                    </td>
                                    <td className="px-4 py-2 text-center text-sm">
                                        {rekap.rekap_per_prodi.reduce((sum, i) => sum + (i.tersisa ?? 0), 0) || '-'}
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
}
