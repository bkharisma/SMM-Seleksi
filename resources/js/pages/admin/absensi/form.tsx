import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Button from '@/components/ui/button';
import Alert from '@/components/ui/alert';
import Badge from '@/components/ui/badge';

interface Ruang {
    id: number;
    nomor_ruang: string;
    nama_gedung: string | null;
    kapasitas: number | null;
}

interface Peserta {
    id: number;
    nup: string;
    noujian: string | null;
    nama: string;
    ruang_id: number | null;
}

interface AbsensiFormProps {
    ruang: Ruang[];
    peserta: Peserta[];
}

export default function AbsensiForm({ ruang, peserta }: AbsensiFormProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [selectedPeserta, setSelectedPeserta] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        jenis: '',
        kelompok: '',
        tanggal: '',
        waktu: '',
        ruang_id: '',
        nomor_awal: '',
        nomor_akhir: '',
        peserta_ids: [] as number[],
    });

    useEffect(() => {
        if (flash?.success) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    }, [flash]);

    useEffect(() => {
        setData('peserta_ids', selectedPeserta);
    }, [selectedPeserta]);

    const togglePeserta = (id: number) => {
        setSelectedPeserta(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedPeserta([]);
        } else {
            setSelectedPeserta(peserta.map(p => p.id));
        }
        setSelectAll(!selectAll);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/absensi');
    };

    const filteredPeserta = selectedPeserta.length > 0
        ? peserta.filter(p => selectedPeserta.includes(p.id))
        : peserta;

    return (
        <AdminLayout title="Tambah Sesi Absensi">
            <Head title="Tambah Sesi Absensi" />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card title="Tambah Sesi Absensi">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Select
                            id="jenis"
                            label="Jenis Ujian"
                            value={data.jenis}
                            onChange={(e) => setData('jenis', e.target.value)}
                            options={[
                                { value: 'psikotes', label: 'Psikotes' },
                                { value: 'wawancara', label: 'Wawancara' },
                                { value: 'kesehatan', label: 'Kesehatan' },
                            ]}
                            placeholder="Pilih Jenis"
                            error={errors.jenis}
                        />
                        <Input
                            id="tanggal"
                            label="Tanggal"
                            type="date"
                            value={data.tanggal}
                            onChange={(e) => setData('tanggal', e.target.value)}
                            error={errors.tanggal}
                        />
                        <Input
                            id="waktu"
                            label="Waktu"
                            type="time"
                            value={data.waktu}
                            onChange={(e) => setData('waktu', e.target.value)}
                            error={errors.waktu}
                        />
                        <Select
                            id="ruang_id"
                            label="Ruang"
                            value={data.ruang_id}
                            onChange={(e) => setData('ruang_id', e.target.value)}
                            options={ruang.map(r => ({ value: r.id.toString(), label: `${r.nomor_ruang} - ${r.nama_gedung} (Kap: ${r.kapasitas})` }))}
                            placeholder="Pilih Ruang"
                            error={errors.ruang_id}
                        />
                        <Input
                            id="kelompok"
                            label="Kelompok"
                            type="number"
                            value={data.kelompok}
                            onChange={(e) => setData('kelompok', e.target.value)}
                            error={errors.kelompok}
                        />
                    </div>

                    <div className="border-t pt-6">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Peserta ({selectedPeserta.length} dipilih)
                            </h3>
                            <button
                                type="button"
                                onClick={toggleSelectAll}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                {selectAll ? 'Batal Pilih Semua' : 'Pilih Semua'}
                            </button>
                        </div>

                        <div className="max-h-64 overflow-y-auto rounded-lg border dark:border-gray-700">
                            <table className="w-full">
                                <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                                            <input
                                                type="checkbox"
                                                checked={selectAll}
                                                onChange={toggleSelectAll}
                                                className="rounded border-gray-300"
                                            />
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">NUP</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">No. Ujian</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Nama</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Ruang</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {peserta.map(p => (
                                        <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <td className="px-3 py-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPeserta.includes(p.id)}
                                                    onChange={() => togglePeserta(p.id)}
                                                    className="rounded border-gray-300"
                                                />
                                            </td>
                                            <td className="px-3 py-2 text-sm">{p.nup}</td>
                                            <td className="px-3 py-2 text-sm">{p.noujian || '-'}</td>
                                            <td className="px-3 py-2 text-sm">{p.nama}</td>
                                            <td className="px-3 py-2 text-sm">
                                                {p.ruang_id ? (
                                                    <Badge variant="info">Assigned</Badge>
                                                ) : (
                                                    <Badge variant="warning">Belum</Badge>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Link href="/admin/absensi">
                            <Button variant="secondary" type="button">Batal</Button>
                        </Link>
                        <Button type="submit" isLoading={processing}>Simpan Sesi</Button>
                    </div>
                </form>
            </Card>
        </AdminLayout>
    );
}
