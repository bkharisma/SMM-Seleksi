import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';

interface Tahap {
    id: number;
    nama: string;
    urutan: number;
    ujian: { id: number; nama: string; kode: string }[];
}

interface Props {
    tahap: Tahap[];
    pembobotan: Record<string, Record<string, number>>;
}

export default function PembobotanIndex({ tahap, pembobotan }: Props) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
        }
    }, [flash]);

    return (
        <AdminLayout title="Pembobotan">
            <Head title="Pembobotan" />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card title="Pembobotan Nilai Akhir">
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    Atur bobot persentase untuk setiap jenis ujian di tiap tahap seleksi, lalu hitung nilai akhir pendaftar berdasarkan bobot tersebut.
                </p>

                {tahap.length === 0 ? (
                    <p className="text-sm text-gray-500">Belum ada tahap seleksi.</p>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {tahap.map((item) => {
                            const config = pembobotan[item.id.toString()] as Record<string, number> | undefined;
                            const hasConfig = config && Object.keys(config).length > 0;

                            return (
                                <div key={item.id} className="flex items-center justify-between py-4">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {item.nama}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {item.ujian.length} jenis ujian
                                            </p>
                                        </div>
                                        {hasConfig ? (
                                            <Badge variant="success">Sudah diatur</Badge>
                                        ) : (
                                            <Badge variant="warning">Belum diatur</Badge>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/admin/pembobotan/${item.id}`}>
                                            <Button variant="secondary" size="sm">
                                                {hasConfig ? 'Edit Bobot' : 'Atur Bobot'}
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>
        </AdminLayout>
    );
}
