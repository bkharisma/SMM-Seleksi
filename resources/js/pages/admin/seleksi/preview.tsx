import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Alert from '@/components/ui/alert';
import Card from '@/components/ui/card';

interface Prodi {
    id: number;
    nama_prodi: string;
    kode_prodi: string;
    kuota_smm: number | null;
}

interface Tahap {
    id: number;
    nama: string;
    urutan: number;
}

interface PreviewResult {
    nup: string;
    nama: string;
    noujian: string | null;
    lulus: boolean;
    reasons: string[];
    scores: Record<string, number | null>;
    total_skor: number;
    peringkat?: number;
}

interface PreviewData {
    error?: string;
    tahap?: Tahap;
    prodi?: Prodi;
    total?: number;
    lulus?: number;
    tidak_lulus?: number;
    kuota?: number | null;
    results?: PreviewResult[];
}

interface SeleksiPreviewProps {
    tahap: Tahap[];
    prodi: Prodi[];
    preview: PreviewData;
    filters: { tahap_id?: string; prodi_id?: string; pilihan?: string };
}

export default function SeleksiPreview({ tahap, prodi, preview, filters }: SeleksiPreviewProps) {
    const { flash, errors } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [selectedNup, setSelectedNup] = useState<string[]>([]);
    const [processing, setProcessing] = useState(false);
    const [tahapId, setTahapId] = useState(filters.tahap_id || '');
    const [prodiId, setProdiId] = useState(filters.prodi_id || '');
    const [pilihan, setPilihan] = useState(filters.pilihan || '');

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
        }
    }, [flash]);

    useEffect(() => {
        if (preview?.results) {
            const lulusNup = preview.results
                .filter((r) => r.lulus)
                .map((r) => r.nup);
            setSelectedNup(lulusNup);
        }
    }, [preview]);

    const handleToggleAll = () => {
        if (!preview?.results) return;
        const lulusNup = preview.results
            .filter((r) => r.lulus)
            .map((r) => r.nup);

        if (selectedNup.length === lulusNup.length) {
            setSelectedNup([]);
        } else {
            setSelectedNup(lulusNup);
        }
    };

    const handleToggle = (nup: string) => {
        setSelectedNup((prev) =>
            prev.includes(nup) ? prev.filter((n) => n !== nup) : [...prev, nup]
        );
    };

    const handleSave = () => {
        if (selectedNup.length === 0) {
            return;
        }
        setProcessing(true);
        router.post('/admin/seleksi/save', {
            tahap_id: tahapId,
            prodi_id: prodiId,
            pilihan: pilihan || null,
            selected_nup: selectedNup,
        }, {
            onFinish: () => setProcessing(false),
        });
    };

    const handleRepreview = (e: React.FormEvent) => {
        e.preventDefault();
        if (!tahapId || !prodiId) return;
        router.post('/admin/seleksi/preview', {
            tahap_id: tahapId,
            prodi_id: prodiId,
            pilihan: pilihan || null,
        });
    };

    const hasError = preview?.error;

    return (
        <AdminLayout title="Preview Seleksi">
            <Head title="Preview Seleksi" />

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
                <Card title="Filter Seleksi">
                    <form onSubmit={handleRepreview} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Tahap Seleksi
                                </label>
                                <select
                                    value={tahapId}
                                    onChange={(e) => setTahapId(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    required
                                >
                                    <option value="">-- Pilih Tahap --</option>
                                    {tahap.map((t) => (
                                        <option key={t.id} value={t.id}>{t.nama}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Program Studi
                                </label>
                                <select
                                    value={prodiId}
                                    onChange={(e) => setProdiId(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    required
                                >
                                    <option value="">-- Pilih Prodi --</option>
                                    {prodi.map((p) => (
                                        <option key={p.id} value={p.id}>{p.nama_prodi}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Filter Pilihan
                                </label>
                                <select
                                    value={pilihan}
                                    onChange={(e) => setPilihan(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                >
                                    <option value="">Semua Pilihan</option>
                                    <option value="1">Pilihan 1</option>
                                    <option value="2">Pilihan 2</option>
                                    <option value="3">Pilihan 3</option>
                                    <option value="3">Pilihan 3</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" variant="outline">Preview Ulang</Button>
                        </div>
                    </form>
                </Card>

                {hasError ? (
                    <Alert type="error" message={hasError} />
                ) : preview?.results ? (
                    <>
                        <div className="grid gap-4 md:grid-cols-5">
                            <Card>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{preview.total}</div>
                                    <div className="text-sm text-gray-500">Total Peserta</div>
                                </div>
                            </Card>
                            <Card>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600">{preview.lulus}</div>
                                    <div className="text-sm text-gray-500">Lulus Seleksi</div>
                                </div>
                            </Card>
                            <Card>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-red-600">{preview.tidak_lulus}</div>
                                    <div className="text-sm text-gray-500">Tidak Lulus</div>
                                </div>
                            </Card>
                            <Card>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-purple-600">{preview.kuota ?? '-'}</div>
                                    <div className="text-sm text-gray-500">Kuota Prodi</div>
                                </div>
                            </Card>
                            <Card>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600">{selectedNup.length}</div>
                                    <div className="text-sm text-gray-500">Dipilih Lulus</div>
                                </div>
                            </Card>
                        </div>

                        <Card
                            title={`Hasil Evaluasi - ${preview.tahap?.nama} / ${preview.prodi?.nama_prodi}`}
                            action={
                                <Button
                                    onClick={handleSave}
                                    isLoading={processing}
                                    disabled={selectedNup.length === 0 || processing}
                                >
                                    Simpan Keputusan ({selectedNup.length})
                                </Button>
                            }
                        >
                            <div className="mb-4 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={selectedNup.length === preview.results?.filter((r) => r.lulus).length && preview.results?.some((r) => r.lulus)}
                                    onChange={handleToggleAll}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-400">Pilih semua yang memenuhi kriteria</span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">NUP</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Nama</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">No. Ujian</th>
                                            {preview.results[0] && Object.keys(preview.results[0].scores || {}).map((key) => (
                                                <th key={key} className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                    {key.toUpperCase()}
                                                </th>
                                            ))}
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Nilai Akhir</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Peringkat</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {preview.results.map((result) => (
                                            <tr key={result.nup} className={!result.lulus ? 'bg-red-50 dark:bg-red-900/10' : ''}>
                                                <td className="whitespace-nowrap px-4 py-2 text-sm">{result.nup}</td>
                                                <td className="whitespace-nowrap px-4 py-2 text-sm font-medium">{result.nama}</td>
                                                <td className="whitespace-nowrap px-4 py-2 text-sm">{result.noujian || '-'}</td>
                                                {Object.values(result.scores || {}).map((val, idx) => (
                                                    <td key={idx} className="whitespace-nowrap px-4 py-2 text-sm">
                                                        {val !== null ? val : '-'}
                                                    </td>
                                                ))}
                                                <td className="whitespace-nowrap px-4 py-2 text-sm font-semibold">
                                                    {typeof result.total_skor === 'number' ? result.total_skor.toFixed(2) : result.total_skor}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-500">
                                                    {result.peringkat ? `#${result.peringkat}` : '-'}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-2 text-sm">
                                                    <Badge variant={result.lulus ? 'success' : 'danger'}>
                                                        {result.lulus ? 'LULUS' : 'TIDAK LULUS'}
                                                    </Badge>
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-2 text-sm">
                                                    {result.lulus && (
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedNup.includes(result.nup)}
                                                            onChange={() => handleToggle(result.nup)}
                                                            className="h-4 w-4 rounded border-gray-300"
                                                        />
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {preview.results.some((r) => !r.lulus && r.reasons.length > 0) && (
                                <div className="mt-4">
                                    <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Alasan Tidak Lulus:</h4>
                                    <div className="max-h-48 overflow-y-auto space-y-1">
                                        {preview.results
                                            .filter((r) => !r.lulus && r.reasons.length > 0)
                                            .map((r) => (
                                                <div key={r.nup} className="text-xs text-gray-600 dark:text-gray-400">
                                                    <strong>{r.nup}</strong> - {r.nama}: {r.reasons.join('; ')}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </Card>
                    </>
                ) : (
                    <Card>
                        <p className="text-center text-gray-500">Silakan pilih tahap dan prodi untuk preview.</p>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}
