import { Head } from '@inertiajs/react';
import { useState } from 'react';
import PortalLayout from '@/components/layout/portal-layout';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';

interface PesertaData {
    nup: string;
    noujian: string | null;
    nama: string;
    foto: string | null;
    tempatlahir: string | null;
    tgllahir: string | null;
    sex: string | null;
    pil1: string | null;
    ruang: {
        nomor_ruang: string;
        nama_gedung: string;
    } | null;
    lulus: number | null;
    lulus_prodi: string | null;
    lulus_tahap: string | null;
}

interface VerifikasiProps {
    peserta: PesertaData | null;
}

export default function Verifikasi({ peserta }: VerifikasiProps) {
    const [noujian, setNoujian] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        if (noujian.trim()) {
            window.location.href = `/verifikasi/${noujian.trim()}`;
        }
    };

    return (
        <PortalLayout title="Verifikasi Peserta">
            <Head title="Verifikasi Peserta" />

            <div className="mx-auto max-w-2xl">
                <Card title="Verifikasi Peserta">
                    <form onSubmit={handleSearch} className="mb-6 space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Masukkan Nomor Ujian untuk memverifikasi data peserta.
                        </p>
                        <div className="flex gap-2">
                            <Input
                                value={noujian}
                                onChange={(e) => setNoujian(e.target.value)}
                                placeholder="Masukkan Nomor Ujian"
                                required
                            />
                            <Button type="submit">Cari</Button>
                        </div>
                    </form>

                    {peserta ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                {peserta.foto ? (
                                    <img
                                        src={`/storage/${peserta.foto}`}
                                        alt={peserta.nama}
                                        className="h-20 w-20 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-2xl dark:bg-gray-700">
                                        {peserta.nama?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{peserta.nama}</h3>
                                    <p className="text-sm text-gray-500">No. Ujian: {peserta.noujian || '-'}</p>
                                    <p className="text-sm text-gray-500">NUP: {peserta.nup}</p>
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                                    <span className="text-xs text-gray-500">Tempat, Tanggal Lahir</span>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {peserta.tempatlahir || '-'}, {peserta.tgllahir || '-'}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                                    <span className="text-xs text-gray-500">Jenis Kelamin</span>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {peserta.sex === 'L' ? 'Laki-laki' : peserta.sex === 'P' ? 'Perempuan' : '-'}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                                    <span className="text-xs text-gray-500">Pilihan 1</span>
                                    <p className="font-medium text-gray-900 dark:text-white">{peserta.pil1 || '-'}</p>
                                </div>
                                {peserta.ruang && (
                                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                                        <span className="text-xs text-gray-500">Ruang Ujian</span>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            Ruang {peserta.ruang.nomor_ruang} - {peserta.ruang.nama_gedung}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {peserta.lulus ? (
                                <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-900/20">
                                    <div className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-lg font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">LULUS</div>
                                    {peserta.lulus_prodi && (
                                        <p className="mt-2 text-green-700 dark:text-green-400">
                                            Diterima di: <strong>{peserta.lulus_prodi}</strong>
                                        </p>
                                    )}
                                    {peserta.lulus_tahap && (
                                        <p className="mt-1 text-sm text-green-600 dark:text-green-500">
                                            Tahap: {peserta.lulus_tahap}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="rounded-lg bg-yellow-50 p-4 text-center dark:bg-yellow-900/20">
                                    <Badge variant="warning">BELUM LULUS</Badge>
                                    <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
                                        Status kelulusan belum ditentukan atau belum mengikuti seleksi.
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="rounded-lg bg-gray-50 p-6 text-center dark:bg-gray-700">
                            <p className="text-gray-500">Masukkan Nomor Ujian untuk melihat data peserta.</p>
                        </div>
                    )}
                </Card>
            </div>
        </PortalLayout>
    );
}
