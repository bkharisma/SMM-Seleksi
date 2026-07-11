import { Head, router, usePage } from '@inertiajs/react';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Select from '@/components/ui/select';

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

interface Jalur {
    id: number;
    kode_jalur: string;
    nama_jalur: string;
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
    is_referensi?: boolean;
}

interface PreviewData {
    error?: string;
    tahap?: Tahap;
    prodi?: Prodi;
    total?: number;
    lulus?: number;
    tidak_lulus?: number;
    kuota?: number | null;
    sisa_kuota?: number | null;
    jalur_id?: number | null;
    results?: PreviewResult[];
}

interface SeleksiPreviewProps {
    tahap: Tahap[];
    jalur: Jalur[];
    prodi: Prodi[];
    preview: PreviewData;
    filters: { tahap_id?: string; jalur_id?: string; prodi_id?: string; pilihan?: string };
}

export default function SeleksiPreview({ tahap, jalur, prodi, preview, filters }: SeleksiPreviewProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [selectedNup, setSelectedNup] = useState<string[]>([]);
    const [processing, setProcessing] = useState(false);
    const [tahapId, setTahapId] = useState(filters.tahap_id || '');
    const [jalurId, setJalurId] = useState(filters.jalur_id || '');
    const [prodiId, setProdiId] = useState(filters.prodi_id || '');
    const [pilihan, setPilihan] = useState(filters.pilihan || '');

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setTimeout(() => {
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 5000);
            }, 0);
        }
    }, [flash]);

    useEffect(() => {
        if (preview?.results) {
            const lulusNup = preview.results
                .filter((r) => r.lulus)
                .map((r) => r.nup);
            setTimeout(() => setSelectedNup(lulusNup), 0);
        }
    }, [preview]);

    const handleToggleAll = () => {
        if (!preview?.results) {
return;
}

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
            jalur_id: jalurId === 'all' ? null : jalurId,
            prodi_id: prodiId,
            pilihan: pilihan || null,
            selected_nup: selectedNup,
        }, {
            onFinish: () => setProcessing(false),
        });
    };

    const handleRepreview = (e: React.FormEvent) => {
        e.preventDefault();

        if (!tahapId || jalurId === '' || !prodiId) {
return;
}

        router.post('/admin/seleksi/preview', {
            tahap_id: tahapId,
            jalur_id: jalurId === 'all' ? null : jalurId,
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
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${tahapId ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                                    1
                                </div>
                                <div className="flex-1">
                                    <Select
                                        label="Tahap Seleksi"
                                        required
                                        value={tahapId}
                                        onChange={(e) => setTahapId(e.target.value)}
                                        options={[{ value: '', label: '-- Pilih Tahap --' }, ...tahap.map((t) => ({ value: t.id, label: t.nama }))]}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${jalurId ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                                    2
                                </div>
                                <div className="flex-1">
                                    <Select
                                        label="Jalur Pendaftaran"
                                        required
                                        disabled={!tahapId}
                                        value={jalurId}
                                        onChange={(e) => setJalurId(e.target.value)}
                                        options={[
                                            { value: '', label: '-- Pilih Jalur --' },
                                            { value: 'all', label: 'Semua Jalur' },
                                            ...jalur.map((j) => ({ value: j.id, label: `${j.kode_jalur} - ${j.nama_jalur}` })),
                                        ]}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${prodiId ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                                    3
                                </div>
                                <div className="flex-1">
                                    <Select
                                        label="Program Studi"
                                        required
                                        disabled={!jalurId}
                                        value={prodiId}
                                        onChange={(e) => setProdiId(e.target.value)}
                                        options={[{ value: '', label: '-- Pilih Prodi --' }, ...prodi.map((p) => ({ value: p.id, label: p.nama_prodi }))]}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${pilihan ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                                    4
                                </div>
                                <div className="flex-1">
                                    <Select
                                        label="Filter Pilihan"
                                        disabled={!prodiId}
                                        value={pilihan}
                                        onChange={(e) => setPilihan(e.target.value)}
                                        options={[
                                            { value: '', label: 'Semua Pilihan' },
                                            { value: '1', label: 'Pilihan 1' },
                                            { value: '2', label: 'Pilihan 2' },
                                            { value: '3', label: 'Pilihan 3' }
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" variant="outline" disabled={!tahapId || !jalurId || !prodiId}>Preview Ulang</Button>
                        </div>
                    </form>
                </Card>

                {hasError ? (
                    <Alert type="error" message={hasError} />
                ) : preview?.results ? (
                    <>
                        <div className="grid gap-4 md:grid-cols-6">
                            <Card>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-on-background">{preview.total}</div>
                                    <div className="text-sm text-on-surface-container">Total Peserta</div>
                                </div>
                            </Card>
                            <Card>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600">{preview.lulus}</div>
                                    <div className="text-sm text-on-surface-container">Lulus Seleksi</div>
                                </div>
                            </Card>
                            <Card>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-red-600">{preview.tidak_lulus}</div>
                                    <div className="text-sm text-on-surface-container">Tidak Lulus</div>
                                </div>
                            </Card>
                            <Card>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-purple-600">{preview.kuota ?? '-'}</div>
                                    <div className="text-sm text-on-surface-container">Kuota Prodi</div>
                                </div>
                            </Card>
                            <Card>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-amber-600">{preview.sisa_kuota ?? '-'}</div>
                                    <div className="text-sm text-on-surface-container">Sisa Kuota</div>
                                </div>
                            </Card>
                            <Card>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600">{selectedNup.length}</div>
                                    <div className="text-sm text-on-surface-container">Dipilih Lulus</div>
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
                                <span className="text-sm text-on-surface-container">Pilih semua yang lulus seleksi</span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-outline-variant">
                                    <thead className="bg-surface-container">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-on-surface-container">No Pendaftar</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-on-surface-container">Nama</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-on-surface-container">No. Ujian</th>
                                            {preview.results[0] && Object.keys(preview.results[0].scores || {}).map((key) => (
                                                <th key={key} className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-on-surface-container">
                                                    {key.toUpperCase()}
                                                </th>
                                            ))}
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-on-surface-container">Nilai Akhir</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-on-surface-container">Peringkat</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-on-surface-container">Status</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-on-surface-container">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant">
                                        {preview.results.map((result) => {
                                            const hasWarning = result.reasons.some(r => r.includes('di bawah standar') || r.includes('Melebihi kuota'));

                                            return (
                                                <tr key={result.nup} className={hasWarning ? 'bg-red-50' : ''}>
                                                    <td className="whitespace-nowrap px-4 py-2 text-sm text-on-surface">{result.nup}</td>
                                                    <td className="whitespace-nowrap px-4 py-2 text-sm font-medium text-on-surface">{result.nama}</td>
                                                    <td className="whitespace-nowrap px-4 py-2 text-sm text-on-surface">{result.noujian || '-'}</td>
                                                    {Object.values(result.scores || {}).map((val, idx) => (
                                                        <td key={idx} className="whitespace-nowrap px-4 py-2 text-sm text-on-surface">
                                                            {val !== null ? val : '-'}
                                                        </td>
                                                    ))}
                                                    <td className="whitespace-nowrap px-4 py-2 text-sm font-semibold text-on-surface">
                                                        {typeof result.total_skor === 'number' ? result.total_skor.toFixed(2) : result.total_skor}
                                                        {result.is_referensi && <Star className="inline h-4 w-4 text-amber-500 ml-1" />}
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-2 text-sm text-on-surface-container">
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
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {preview.results.some((r) => r.reasons.length > 0) && (
                                <div className="mt-4">
                                    <h4 className="mb-2 text-sm font-medium text-on-surface">Catatan Peserta:</h4>
                                    <div className="max-h-48 overflow-y-auto space-y-1">
                                        {preview.results
                                            .filter((r) => r.reasons.length > 0)
                                            .map((r) => (
                                                <div key={r.nup} className="text-xs text-on-surface-container">
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
                        <p className="text-center text-on-surface-container">Silakan pilih tahap dan prodi untuk preview.</p>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}
