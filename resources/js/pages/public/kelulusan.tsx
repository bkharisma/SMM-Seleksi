import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import PortalLayout from '@/components/layout/portal-layout';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Alert from '@/components/ui/alert';

interface ScoreDetail {
    [key: string]: number | null;
}

interface TahapDetail {
    tahap_nama: string;
    urutan: number;
    lulus: boolean;
    scores: ScoreDetail;
    reasons: string[];
}

interface PesertaResult {
    nup: string;
    nama: string;
    foto: string | null;
    pil1: string | null;
    lulus: number | null;
    lulus_prodi: string | null;
    lulus_tahap: string | null;
    nilai: {
        psikotes: number | null;
        inggris: number | null;
        wawancara: number | null;
        kesehatan: number | null;
    };
    details_per_tahap: TahapDetail[];
    tgl_cek_lulus: string | null;
}

interface KelulusanProps {
    peserta: PesertaResult | null;
}

export default function Kelulusan({ peserta }: KelulusanProps) {
    const { errors } = usePage().props as any;
    const [showError, setShowError] = useState(false);

    const { data, setData, post, processing } = useForm({
        nup: '',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/kelulusan');
    };

    return (
        <PortalLayout title="Pengumuman Kelulusan">
            <Head title="Pengumuman Kelulusan" />

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
                    <Card title="Cek Status Kelulusan">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Masukkan NUP dan password Anda untuk melihat status kelulusan.
                            </p>
                            <Input
                                id="nup"
                                label="NUP (Nomor Ujian Peserta)"
                                value={data.nup}
                                onChange={(e) => setData('nup', e.target.value)}
                                error={errors?.nup}
                                required
                                placeholder="Masukkan NUP"
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
                                    Cek Kelulusan
                                </Button>
                            </div>
                        </form>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        <Card>
                            <div className="text-center">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{peserta.nama}</h2>
                                <p className="text-sm text-gray-500">NUP: {peserta.nup}</p>
                                {peserta.pil1 && (
                                    <p className="text-sm text-gray-500">Pilihan 1: {peserta.pil1}</p>
                                )}
                            </div>

                            <div className="mt-6">
                                {peserta.lulus ? (
                                    <div className="rounded-lg bg-green-50 p-6 text-center dark:bg-green-900/20">
                                        <svg className="mx-auto h-16 w-16 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <h3 className="mt-3 text-2xl font-bold text-green-800 dark:text-green-300">SELAMAT!</h3>
                                        <p className="mt-2 text-green-700 dark:text-green-400">
                                            Anda dinyatakan <strong>LULUS</strong> seleksi.
                                        </p>
                                        {peserta.lulus_prodi && (
                                            <p className="mt-1 text-green-700 dark:text-green-400">
                                                Program Studi: <strong>{peserta.lulus_prodi}</strong>
                                            </p>
                                        )}
                                        {peserta.lulus_tahap && (
                                            <p className="mt-1 text-sm text-green-600 dark:text-green-500">
                                                Tahap: {peserta.lulus_tahap}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/20">
                                        <svg className="mx-auto h-16 w-16 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-6 6a9 9 0 110-18 9 9 0 010 18z" />
                                        </svg>
                                        <h3 className="mt-3 text-2xl font-bold text-red-800 dark:text-red-300">BELUM LULUS</h3>
                                        <p className="mt-2 text-red-700 dark:text-red-400">
                                            Maaf, Anda belum memenuhi kriteria kelulusan.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {peserta.details_per_tahap && peserta.details_per_tahap.length > 0 && (
                            <Card title="Hasil per Tahap Seleksi">
                                <div className="space-y-4">
                                    {peserta.details_per_tahap.map((tahap, idx) => (
                                        <div key={idx} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                                            <div className="mb-2 flex items-center justify-between">
                                                <h4 className="font-medium text-gray-900 dark:text-white">
                                                    Tahap {tahap.urutan}: {tahap.tahap_nama}
                                                </h4>
                                                <Badge variant={tahap.lulus ? 'success' : 'danger'}>
                                                    {tahap.lulus ? 'LULUS' : 'BELUM LULUS'}
                                                </Badge>
                                            </div>

                                            {Object.keys(tahap.scores).length > 0 && (
                                                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                                                    {Object.entries(tahap.scores).map(([key, val]) => (
                                                        <div key={key} className="flex items-center justify-between rounded bg-gray-50 px-3 py-2 text-sm dark:bg-gray-700">
                                                            <span className="text-gray-600 dark:text-gray-400">{key.toUpperCase()}</span>
                                                            <span className="font-medium text-gray-900 dark:text-white">
                                                                {val !== null ? val : '-'}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {tahap.reasons && tahap.reasons.length > 0 && (
                                                <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                                                    {tahap.reasons.map((reason, rIdx) => (
                                                        <div key={rIdx}>• {reason}</div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        <Card title="Nilai Anda">
                            <div className="grid gap-3 sm:grid-cols-2">
                                {[
                                    { label: 'Psikotes', value: peserta.nilai.psikotes },
                                    { label: 'Bahasa Inggris', value: peserta.nilai.inggris },
                                    { label: 'Wawancara', value: peserta.nilai.wawancara },
                                    { label: 'Kesehatan', value: peserta.nilai.kesehatan },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-700">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                                        <span className="font-bold text-gray-900 dark:text-white">
                                            {item.value !== null ? item.value : '-'}
                                        </span>
                                    </div>
                                ))}
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
