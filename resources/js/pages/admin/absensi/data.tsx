import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';

interface Prodi {
    nama_prodi: string;
}

interface Peserta {
    nup: string;
    noujian: string | null;
    nama: string;
    pil1_prodi: Prodi | null;
}

interface AbsensiDetail {
    id: number;
    peserta_id: number | null;
    hadir: boolean;
    peserta: Peserta | null;
}

interface Ruang {
    id: number;
    nomor_ruang: string;
    nama_gedung: string | null;
}

interface DataAbsensi {
    id: number;
    jenis: string | null;
    kelompok: number | null;
    tanggal: string | null;
    waktu: string | null;
    ruang_id: number | null;
    nomor_awal: string | null;
    nomor_akhir: string | null;
    ruang: Ruang | null;
    absensi: AbsensiDetail[];
}

interface AbsensiDataProps {
    dataAbsensi: DataAbsensi;
}

export default function AbsensiData({ dataAbsensi }: AbsensiDataProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [attendance, setAttendance] = useState<{ id: number; hadir: boolean }[]>(
        dataAbsensi.absensi.map(a => ({ id: a.id, hadir: a.hadir }))
    );

    useEffect(() => {
        if (flash?.success) {
            setTimeout(() => {
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 3000);
            }, 0);
        }
    }, [flash]);

    const toggleHadir = (id: number) => {
        setAttendance(prev =>
            prev.map(a => a.id === id ? { ...a, hadir: !a.hadir } : a)
        );
    };

    const handleSave = () => {
        router.post(`/admin/absensi/${dataAbsensi.id}/save`, { attendance });
    };

    const handleSelectAll = (hadir: boolean) => {
        setAttendance(prev => prev.map(a => ({ ...a, hadir })));
    };

    const hadirCount = attendance.filter(a => a.hadir).length;
    const totalCount = attendance.length;

    return (
        <AdminLayout title="Data Absensi">
            <Head title="Data Absensi" />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card title="Data Absensi">
                <div className="mb-4 grid gap-4 md:grid-cols-4">
                    <div className="rounded-lg bg-surface-container p-3">
                        <p className="text-xs text-on-surface-container">Tanggal</p>
                        <p className="text-sm font-medium text-on-surface">
                            {dataAbsensi.tanggal ? new Date(dataAbsensi.tanggal).toLocaleDateString('id-ID') : '-'}
                        </p>
                    </div>
                    <div className="rounded-lg bg-surface-container p-3">
                        <p className="text-xs text-on-surface-container">Waktu</p>
                        <p className="text-sm font-medium text-on-surface">{dataAbsensi.waktu || '-'}</p>
                    </div>
                    <div className="rounded-lg bg-surface-container p-3">
                        <p className="text-xs text-on-surface-container">Jenis</p>
                        <p className="text-sm font-medium text-on-surface">{dataAbsensi.jenis || '-'}</p>
                    </div>
                    <div className="rounded-lg bg-surface-container p-3">
                        <p className="text-xs text-on-surface-container">Ruang</p>
                        <p className="text-sm font-medium text-on-surface">
                            {dataAbsensi.ruang ? `${dataAbsensi.ruang.nomor_ruang} - ${dataAbsensi.ruang.nama_gedung}` : '-'}
                        </p>
                    </div>
                </div>

                <div className="mb-4 flex items-center justify-between">
                    <div className="flex gap-2">
                        <Badge variant="success">Hadir: {hadirCount}</Badge>
                        <Badge variant="danger">Tidak Hadir: {totalCount - hadirCount}</Badge>
                        <Badge variant="info">Total: {totalCount}</Badge>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="secondary" size="sm" onClick={() => handleSelectAll(true)}>
                            Semua Hadir
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => handleSelectAll(false)}>
                            Semua Tidak Hadir
                        </Button>
                        <Button onClick={handleSave} size="sm">Simpan</Button>
                        {dataAbsensi.ruang_id && (
                            <a href={`/admin/absensi/${dataAbsensi.id}/cetak/${dataAbsensi.ruang_id}`}>
                                <Button variant="secondary" size="sm">Cetak PDF</Button>
                            </a>
                        )}
                        <Link href="/admin/absensi">
                            <Button variant="secondary" size="sm">Kembali</Button>
                        </Link>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
                    <table className="w-full">
                        <thead className="bg-surface-container">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">No</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">No Pendaftar</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">No. Ujian</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Nama</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Pilihan 1</th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Kehadiran</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant bg-surface-container-lowest">
                            {dataAbsensi.absensi.map((item, index) => (
                                <tr key={item.id} className="hover:bg-surface-container">
                                    <td className="px-4 py-3 text-sm dark:text-gray-300">{index + 1}</td>
                                    <td className="px-4 py-3 text-sm dark:text-gray-300">{item.peserta?.nup}</td>
                                    <td className="px-4 py-3 text-sm dark:text-gray-300">{item.peserta?.noujian}</td>
                                    <td className="px-4 py-3 text-sm font-medium dark:text-gray-200">{item.peserta?.nama}</td>
                                    <td className="px-4 py-3 text-sm dark:text-gray-300">{item.peserta?.pil1_prodi?.nama_prodi}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => toggleHadir(item.id)}
                                            className={`rounded-full px-4 py-1 text-sm font-medium transition-colors ${
                                                attendance.find(a => a.id === item.id)?.hadir
                                                    ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                                            }`}
                                        >
                                            {attendance.find(a => a.id === item.id)?.hadir ? 'Hadir' : 'Tidak Hadir'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </AdminLayout>
    );
}
