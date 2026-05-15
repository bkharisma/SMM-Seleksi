import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';

interface Ujian {
    id: number;
    nama: string;
    kode: string;
}

interface Tahap {
    id: number;
    nama: string;
}

interface PembobotanData {
    id: number;
    tahap_seleksi_id: number;
    bobot_config: Record<string, number>;
}

interface Props {
    tahap: Tahap;
    ujian: Ujian[];
    pembobotan: PembobotanData | null;
}

export default function PembobotanEdit({ tahap, ujian, pembobotan }: Props) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [bobot, setBobot] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const initial: Record<string, string> = {};
        ujian.forEach((u) => {
            const existing = pembobotan?.bobot_config?.[u.id.toString()];
            initial[u.id.toString()] = existing !== undefined ? String(existing) : '';
        });
        setTimeout(() => setBobot(initial), 0);
    }, [ujian, pembobotan]);

    useEffect(() => {
        if (flash?.success) {
            setTimeout(() => {
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 3000);
            }, 0);
        }

        if (flash?.error) {
            setTimeout(() => {
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 5000);
            }, 0);
        }
    }, [flash]);

    const handleBobotChange = (ujianId: number, value: string) => {
        setBobot((prev) => ({ ...prev, [ujianId.toString()]: value }));
    };

    const total = Object.values(bobot).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    const isValid = Math.abs(total - 100) < 0.01 && ujian.length > 0;

    const handleSave = () => {
        setProcessing(true);
        const numeric: Record<string, number> = {};
        Object.entries(bobot).forEach(([key, val]) => {
            numeric[key] = parseFloat(val) || 0;
        });
        router.put(`/admin/pembobotan/${tahap.id}`, { bobot_config: numeric } as any, {
            onFinish: () => setProcessing(false),
        });
    };

    const handleHitung = () => {
        setProcessing(true);
        router.post(`/admin/pembobotan/${tahap.id}/hitung`, {}, {
            onFinish: () => setProcessing(false),
        });
    };

    const handleReset = () => {
        if (!confirm('Apakah Anda yakin ingin mereset semua nilai akhir yang sudah dihitung untuk tahap ini?')) {
            return;
        }

        setProcessing(true);
        router.delete(`/admin/pembobotan/${tahap.id}/reset-nilai-akhir`, {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdminLayout title={`Pembobotan - ${tahap.nama}`}>
            <Head title={`Pembobotan - ${tahap.nama}`} />

            {showAlert && (flash?.success || flash?.error) && (
                <div className="mb-4">
                    <Alert type={flash?.success ? 'success' : 'error'} message={flash?.success || flash?.error} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card title={`Atur Bobot: ${tahap.nama}`}>
                {ujian.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        Tidak ada jenis ujian dalam tahap ini. Tambahkan jenis ujian terlebih dahulu.
                    </p>
                ) : (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            {ujian.map((u) => (
                                <div key={u.id} className="flex items-center gap-4">
                                    <label className="w-48 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {u.nama} <span className="text-gray-400">({u.kode})</span>
                                    </label>
                                    <div className="relative w-32">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            value={bobot[u.id.toString()] || ''}
                                            onChange={(e) => handleBobotChange(u.id, e.target.value)}
                                            placeholder="0"
                                            className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 pr-8 text-sm text-on-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">%</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-lg bg-surface-container p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-on-surface">
                                    Total
                                </span>
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-48 overflow-hidden rounded-full bg-surface-container">
                                        <div
                                            className={`h-full rounded-full transition-all ${
                                                isValid ? 'bg-green-500' : total > 100 ? 'bg-red-500' : 'bg-primary'
                                            }`}
                                            style={{ width: `${Math.min(total, 100)}%` }}
                                        />
                                    </div>
                                    <span
                                        className={`text-sm font-bold ${
                                            isValid ? 'text-green-600' : total > 100 ? 'text-red-500' : 'text-on-surface-container'
                                        }`}
                                    >
                                        {total.toFixed(2)}%
                                    </span>
                                </div>
                            </div>
                            {!isValid && total > 0 && (
                                <p className="mt-2 text-xs text-red-500">
                                    Total harus tepat 100%. Saat ini: {total.toFixed(2)}%
                                </p>
                            )}
                        </div>

                        <div className="flex justify-between">
                            <Link href="/admin/pembobotan">
                                <Button variant="secondary">Kembali</Button>
                            </Link>
                            <div className="flex gap-2">
                                <Button
                                    variant="secondary"
                                    onClick={handleSave}
                                    disabled={!isValid || processing}
                                    isLoading={processing}
                                >
                                    Simpan Bobot
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={handleReset}
                                    disabled={processing}
                                    isLoading={processing}
                                >
                                    Reset Nilai Akhir
                                </Button>
                                <Button
                                    onClick={handleHitung}
                                    disabled={processing}
                                    isLoading={processing}
                                >
                                    Hitung Nilai Akhir
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </AdminLayout>
    );
}
