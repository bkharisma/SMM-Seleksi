import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import PortalLayout from '@/components/layout/portal-layout';
import Alert from '@/components/ui/alert';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';

interface ScoreDetail {
    [key: string]: number | null;
}

interface TahapResult {
    nup: string;
    nama: string;
    noujian: string | null;
    lulus: boolean;
    reasons: string[];
    scores: ScoreDetail;
    total_skor: number;
    is_referensi: boolean;
}

interface PesertaTahap1Result {
    nup: string;
    nama: string;
    pil1: string | null;
    lulus: number | null;
    lulus_prodi: string | null;
    lulus_tahap_nama: string | null;
    lulus_tahap_1: boolean;
    status_kelulusan: 'lulus' | 'tidak_lulus' | 'belum_diproses';
    nilai: {
        psikotes: number | null;
        inggris: number | null;
        wawancara: number | null;
        kesehatan: number | null;
    };
    detail: TahapResult | null;
    tgl_cek: string | null;
}

interface Tahap1Props {
    peserta: PesertaTahap1Result | null;
}

export default function KelulusanTahap1({ peserta }: Tahap1Props) {
    const { errors } = usePage().props as any;
    const [showError, setShowError] = useState(false);

    const { data, setData, post, processing } = useForm({
        nup: '',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/kelulusan/tahap-1');
    };

    return (
        <PortalLayout title="Pengumuman Kelulusan Tahap 1">
            <Head title="Pengumuman Kelulusan Tahap 1" />

            {showError && errors && (
                <div className="mx-auto mb-4 max-w-2xl">
                    <Alert
                        type="error"
                        message={errors.nup || errors.password || 'Data tidak ditemukan.'}
                        onClose={() => setShowError(false)}
                    />
                </div>
            )}

            <div className="mx-auto max-w-3xl">
                {!peserta ? (
                    <Card title="Cek Kelulusan Tahap 1">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Masukkan No Pendaftar dan password Anda untuk melihat hasil kelulusan Tahap 1.
                            </p>
                            <Input
                                id="nup"
                                label="No Pendaftar"
                                value={data.nup}
                                onChange={(e) => setData('nup', e.target.value)}
                                error={errors?.nup}
                                required
                                placeholder="Masukkan No Pendaftar"
                            />
                            <Input
                                id="password"
                                label="Password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                error={errors?.password}
                                required
                                placeholder="Masukkan password"
                            />
                            <div className="flex justify-end">
                                <Button type="submit" isLoading={processing}>
                                    Cek Kelulusan Tahap 1
                                </Button>
                            </div>
                        </form>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        <Card>
                            <div className="text-center">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{peserta.nama}</h2>
                                <p className="text-sm text-gray-500">No Pendaftar: {peserta.nup}</p>
                                {peserta.pil1 && (
                                    <p className="text-sm text-gray-500">Pilihan 1: {peserta.pil1}</p>
                                )}
                            </div>

                            <div className="mt-6">
                                {peserta.status_kelulusan === 'lulus' ? (
                                    <div className="rounded-lg bg-green-50 p-6 text-center dark:bg-green-900/20">
                                        <svg className="mx-auto h-16 w-16 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <h3 className="mt-3 text-2xl font-bold text-green-800 dark:text-green-300">LULUS TAHAP 1</h3>
                                        <p className="mt-2 text-green-700 dark:text-green-400">
                                            Anda dinyatakan <strong>LULUS</strong> seleksi Tahap 1.
                                        </p>
                                        {peserta.lulus_prodi && (
                                            <p className="mt-1 text-green-700 dark:text-green-400">
                                                Program Studi: <strong>{peserta.lulus_prodi}</strong>
                                            </p>
                                        )}
                                        {peserta.lulus_tahap_nama && (
                                            <p className="mt-1 text-sm text-green-600 dark:text-green-500">
                                                Tahap: {peserta.lulus_tahap_nama}
                                            </p>
                                        )}
                                    </div>
                                ) : peserta.status_kelulusan === 'tidak_lulus' ? (
                                    <div className="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/20">
                                        <svg className="mx-auto h-16 w-16 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-6 6a9 9 0 110-18 9 9 0 010 18z" />
                                        </svg>
                                        <h3 className="mt-3 text-2xl font-bold text-red-800 dark:text-red-300">TIDAK LULUS</h3>
                                        <p className="mt-2 text-red-700 dark:text-red-400">
                                            Maaf, Anda tidak memenuhi kriteria kelulusan Tahap 1.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="rounded-lg bg-yellow-50 p-6 text-center dark:bg-yellow-900/20">
                                        <svg className="mx-auto h-16 w-16 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <h3 className="mt-3 text-2xl font-bold text-yellow-800 dark:text-yellow-300">BELUM ADA HASIL</h3>
                                        <p className="mt-2 text-yellow-700 dark:text-yellow-400">
                                            Proses seleksi Tahap 1 belum dilaksanakan. Silakan periksa kembali secara berkala.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        <div className="text-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Cek Ulang
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </PortalLayout>
    );
}
