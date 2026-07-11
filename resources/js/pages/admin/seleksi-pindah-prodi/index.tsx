import { Head, router, usePage } from '@inertiajs/react';
import { Search, X, CheckCircle, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';

function SortIcon({ column, sortColumn, sortDirection }: { column: string; sortColumn: string; sortDirection: 'asc' | 'desc' }) {
    if (sortColumn !== column) {
        return <ArrowUpDown className="h-3 w-3 opacity-50" />;
    }

    return sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
}

interface ProdiInfo {
    id: number;
    kode: string;
    nama: string;
}

interface PesertaData {
    id: number;
    nup: string;
    noujian: string | null;
    nama: string;
    pil1: ProdiInfo | null;
    pil2: ProdiInfo | null;
    pil3: ProdiInfo | null;
    nilai_akhir: number;
    waw_bersedia_pindah: boolean;
    waw_rekomendasi_prodi: ProdiInfo | null;
    waw_catatan: string | null;
    waw_nilai: number | null;
}

interface ProdiWithKuota {
    id: number;
    kode_prodi: string;
    nama_prodi: string;
    kuota_smm: number | null;
    total_lulus: number;
    sisa_kuota: number | null;
    tersedia: boolean;
}

interface SeleksiPindahProdiProps {
    peserta: PesertaData[];
    prodiWithKuota: ProdiWithKuota[];
    filters: { search?: string };
}

export default function SeleksiPindahProdiIndex({ peserta, prodiWithKuota, filters }: SeleksiPindahProdiProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const [selectedPeserta, setSelectedPeserta] = useState<Set<string>>(new Set());
    const [detailPeserta, setDetailPeserta] = useState<PesertaData | null>(null);
    const [prodiTujuan, setProdiTujuan] = useState<Record<string, number>>({});
    const [bulkProdiId, setBulkProdiId] = useState<string>('');
    const [processing, setProcessing] = useState(false);
    const [sortColumn, setSortColumn] = useState<string>('nilai_akhir');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setTimeout(() => {
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 5000);
            }, 0);
        }
    }, [flash]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();

        if (search) {
params.set('search', search);
}

        router.get(`/admin/seleksi-pindah-prodi?${params.toString()}`, {}, { preserveState: true });
    };

    const handleSelectPeserta = (nup: string) => {
        const newSelected = new Set(selectedPeserta);

        if (newSelected.has(nup)) {
            newSelected.delete(nup);
        } else {
            newSelected.add(nup);
        }

        setSelectedPeserta(newSelected);
    };

    const handleSelectAll = () => {
        if (selectedPeserta.size === sortedPeserta.length) {
            setSelectedPeserta(new Set());
        } else {
            setSelectedPeserta(new Set(sortedPeserta.map(p => p.nup)));
        }
    };

    const handleShowDetail = (p: PesertaData) => {
        setDetailPeserta(p);

        if (!prodiTujuan[p.nup] && p.waw_rekomendasi_prodi) {
            setProdiTujuan(prev => ({ ...prev, [p.nup]: p.waw_rekomendasi_prodi!.id }));
        }
    };

    const handleProdiTujuanChange = (nup: string, prodiId: number) => {
        setProdiTujuan(prev => ({ ...prev, [nup]: prodiId }));
    };

    const handleSaveSingle = (nup: string) => {
        const prodiId = prodiTujuan[nup];

        if (!prodiId) {
            alert('Pilih prodi tujuan terlebih dahulu');

            return;
        }

        setProcessing(true);
        router.post('/admin/seleksi-pindah-prodi/save', {
            selections: [{ nup, prodi_id: prodiId }],
        }, {
            onFinish: () => {
                setProcessing(false);
                setDetailPeserta(null);
            },
        });
    };

    const handleBulkSave = () => {
        if (selectedPeserta.size === 0) {
return;
}

        const selections = Array.from(selectedPeserta).map(nup => ({
            nup,
            prodi_id: parseInt(bulkProdiId),
        }));

        if (!bulkProdiId) {
            alert('Pilih prodi tujuan terlebih dahulu');

            return;
        }

        setProcessing(true);
        router.post('/admin/seleksi-pindah-prodi/save', { selections }, {
            onFinish: () => {
                setProcessing(false);
                setSelectedPeserta(new Set());
                setBulkProdiId('');
            },
        });
    };

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const sortedPeserta = [...peserta].sort((a, b) => {
            let comparison = 0;

            switch (sortColumn) {
                case 'nup':
                    comparison = a.nup.localeCompare(b.nup);
                    break;
                case 'noujian':
                    comparison = (a.noujian || '').localeCompare(b.noujian || '');
                    break;
                case 'nilai_akhir':
                    comparison = a.nilai_akhir - b.nilai_akhir;
                    break;
                case 'pil1':
                    comparison = (a.pil1?.kode || '').localeCompare(b.pil1?.kode || '');
                    break;
                case 'pil2':
                    comparison = (a.pil2?.kode || '').localeCompare(b.pil2?.kode || '');
                    break;
                case 'pil3':
                    comparison = (a.pil3?.kode || '').localeCompare(b.pil3?.kode || '');
                    break;
                case 'bersedia_pindah':
                    comparison = (a.waw_bersedia_pindah === b.waw_bersedia_pindah) ? 0 : (a.waw_bersedia_pindah ? 1 : -1);
                    break;
                case 'rec_prodi':
                    comparison = (a.waw_rekomendasi_prodi?.kode || '').localeCompare(b.waw_rekomendasi_prodi?.kode || '');
                    break;
                default:
                    comparison = 0;
            }

            return sortDirection === 'asc' ? comparison : -comparison;
        });

    const prodiTersedia = prodiWithKuota.filter(p => p.tersedia);

    return (
        <AdminLayout title="Seleksi Pindah Prodi">
            <Head title="Seleksi Pindah Prodi" />

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
                <Card title="Informasi">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Halaman ini digunakan untuk melakukan seleksi pindah prodi bagi peserta yang belum lulus.
                        Data ditampilkan berdasarkan nilai akhir tertinggi. Pastikan peserta telah mengisi data wawancara
                        dan menyatakan bersedia ditempatkan di prodi lain.
                    </p>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card title="Prodi dengan Sisa Kuota">
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {prodiTersedia.length > 0 ? (
                                prodiTersedia.map(prodi => (
                                    <div key={prodi.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                                        <span className="font-medium">{prodi.kode_prodi} - {prodi.nama_prodi}</span>
                                        <Badge variant="success">Sisa: {prodi.sisa_kuota}</Badge>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">Tidak ada prodi dengan sisa kuota</p>
                            )}
                        </div>
                    </Card>

                    <Card title="Bulk Action">
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Pilih Prodi Tujuan</label>
                                <select
                                    value={bulkProdiId}
                                    onChange={(e) => setBulkProdiId(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md bg-white"
                                >
                                    <option value="">-- Pilih Prodi --</option>
                                    {prodiTersedia.map(prodi => (
                                        <option key={prodi.id} value={prodi.id}>
                                            {prodi.kode_prodi} - {prodi.nama_prodi} (Sisa: {prodi.sisa_kuota})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Button
                                onClick={handleBulkSave}
                                disabled={selectedPeserta.size === 0 || !bulkProdiId || processing}
                                isLoading={processing}
                                className="w-full"
                            >
                                Luluskan {selectedPeserta.size} Peserta ke Prodi Ini
                            </Button>
                        </div>
                    </Card>
                </div>

                <Card title="Data Peserta Belum Lulus">
                    <form onSubmit={handleSearch} className="mb-4">
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <Input
                                    type="text"
                                    placeholder="Cari berdasarkan No Pendaftar, No Ujian, atau Nama..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    icon={<Search className="h-4 w-4" />}
                                />
                            </div>
                            <Button type="submit">Cari</Button>
                        </div>
                    </form>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-outline-variant">
                            <thead className="bg-surface-container">
                                <tr>
                                    <th className="px-4 py-2 text-center w-12">
                                        <input
                                            type="checkbox"
                                            checked={selectedPeserta.size === sortedPeserta.length && sortedPeserta.length > 0}
                                            onChange={handleSelectAll}
                                            className="h-4 w-4 rounded border-gray-300"
                                        />
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                        <button type="button" onClick={() => handleSort('nup')} className="inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300">
                                            No Pendaftar
                                            <SortIcon column="nup" sortColumn={sortColumn} sortDirection={sortDirection} />
                                        </button>
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                        <button type="button" onClick={() => handleSort('noujian')} className="inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300">
                                            No Ujian
                                            <SortIcon column="noujian" sortColumn={sortColumn} sortDirection={sortDirection} />
                                        </button>
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Nama</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                        <button type="button" onClick={() => handleSort('pil1')} className="inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300">
                                            Pil 1
                                            <SortIcon column="pil1" sortColumn={sortColumn} sortDirection={sortDirection} />
                                        </button>
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                        <button type="button" onClick={() => handleSort('pil2')} className="inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300">
                                            Pil 2
                                            <SortIcon column="pil2" sortColumn={sortColumn} sortDirection={sortDirection} />
                                        </button>
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                        <button type="button" onClick={() => handleSort('pil3')} className="inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300">
                                            Pil 3
                                            <SortIcon column="pil3" sortColumn={sortColumn} sortDirection={sortDirection} />
                                        </button>
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider">
                                        <button type="button" onClick={() => handleSort('nilai_akhir')} className="inline-flex items-center gap-1 mx-auto hover:text-gray-700 dark:hover:text-gray-300">
                                            Nilai Akhir
                                            <SortIcon column="nilai_akhir" sortColumn={sortColumn} sortDirection={sortDirection} />
                                        </button>
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider">
                                        <button type="button" onClick={() => handleSort('bersedia_pindah')} className="inline-flex items-center gap-1 mx-auto hover:text-gray-700 dark:hover:text-gray-300">
                                            Bersedia Pindah
                                            <SortIcon column="bersedia_pindah" sortColumn={sortColumn} sortDirection={sortDirection} />
                                        </button>
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider">
                                        <button type="button" onClick={() => handleSort('rec_prodi')} className="inline-flex items-center gap-1 mx-auto hover:text-gray-700 dark:hover:text-gray-300">
                                            Rec Prodi
                                            <SortIcon column="rec_prodi" sortColumn={sortColumn} sortDirection={sortDirection} />
                                        </button>
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant">
                                {sortedPeserta.length > 0 ? (
                                    sortedPeserta.map((p) => (
                                        <tr
                                            key={p.nup}
                                            className="cursor-pointer hover:bg-surface-container"
                                            onClick={() => handleShowDetail(p)}
                                        >
                                            <td className="px-4 py-2 text-center" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPeserta.has(p.nup)}
                                                    onChange={() => handleSelectPeserta(p.nup)}
                                                    className="h-4 w-4 rounded border-gray-300"
                                                />
                                            </td>
                                            <td className="px-4 py-2 text-sm font-medium">{p.nup}</td>
                                            <td className="px-4 py-2 text-sm">{p.noujian || '-'}</td>
                                            <td className="px-4 py-2 text-sm">{p.nama}</td>
                                            <td className="px-4 py-2 text-sm">{p.pil1 ? `${p.pil1.kode}` : '-'}</td>
                                            <td className="px-4 py-2 text-sm">{p.pil2 ? `${p.pil2.kode}` : '-'}</td>
                                            <td className="px-4 py-2 text-sm">{p.pil3 ? `${p.pil3.kode}` : '-'}</td>
                                            <td className="px-4 py-2 text-center text-sm font-bold">{p.nilai_akhir.toFixed(2)}</td>
                                            <td className="px-4 py-2 text-center text-sm">
                                                <Badge variant={p.waw_bersedia_pindah ? 'success' : 'danger'}>
                                                    {p.waw_bersedia_pindah ? 'Ya' : 'Tidak'}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-2 text-center text-sm">
                                                {p.waw_rekomendasi_prodi ? (
                                                    <span className="font-medium">{p.waw_rekomendasi_prodi.kode}</span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-center text-sm">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleShowDetail(p);
                                                    }}
                                                >
                                                    Detail
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={11} className="px-4 py-8 text-center text-sm text-gray-500">
                                            Tidak ada data peserta
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {detailPeserta && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold">Detail Peserta</h3>
                                <button onClick={() => setDetailPeserta(null)} className="text-gray-500 hover:text-gray-700">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-500">No Pendaftar</label>
                                        <p className="font-medium">{detailPeserta.nup}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">No Ujian</label>
                                        <p className="font-medium">{detailPeserta.noujian || '-'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs text-gray-500">Nama</label>
                                        <p className="font-medium">{detailPeserta.nama}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Pilihan 1</label>
                                        <p className="font-medium">{detailPeserta.pil1 ? `${detailPeserta.pil1.kode} - ${detailPeserta.pil1.nama}` : '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Pilihan 2</label>
                                        <p className="font-medium">{detailPeserta.pil2 ? `${detailPeserta.pil2.kode} - ${detailPeserta.pil2.nama}` : '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Pilihan 3</label>
                                        <p className="font-medium">{detailPeserta.pil3 ? `${detailPeserta.pil3.kode} - ${detailPeserta.pil3.nama}` : '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Nilai Akhir</label>
                                        <p className="font-bold text-lg">{detailPeserta.nilai_akhir.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <h4 className="font-medium mb-2">Data Wawancara</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm">Bersedia ditempatkan di prodi lain:</span>
                                            <Badge variant={detailPeserta.waw_bersedia_pindah ? 'success' : 'danger'}>
                                                {detailPeserta.waw_bersedia_pindah ? 'Ya' : 'Tidak'}
                                            </Badge>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Rekomendasi Prodi</label>
                                            <p className="font-medium">
                                                {detailPeserta.waw_rekomendasi_prodi
                                                    ? `${detailPeserta.waw_rekomendasi_prodi.kode} - ${detailPeserta.waw_rekomendasi_prodi.nama}`
                                                    : '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Catatan Wawancara</label>
                                            <p className="text-sm bg-gray-50 p-2 rounded">
                                                {detailPeserta.waw_catatan || '-'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <h4 className="font-medium mb-2">Luluskan di Prodi</h4>
                                    <div className="space-y-3">
                                        <select
                                            value={prodiTujuan[detailPeserta.nup] || ''}
                                            onChange={(e) => handleProdiTujuanChange(detailPeserta.nup, parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border rounded-md bg-white"
                                        >
                                            <option value="">-- Pilih Prodi Tujuan --</option>
                                            {prodiTersedia.map(prodi => (
                                                <option key={prodi.id} value={prodi.id}>
                                                    {prodi.kode_prodi} - {prodi.nama_prodi} (Sisa: {prodi.sisa_kuota})
                                                </option>
                                            ))}
                                        </select>
                                        <Button
                                            onClick={() => handleSaveSingle(detailPeserta.nup)}
                                            disabled={!prodiTujuan[detailPeserta.nup] || processing}
                                            isLoading={processing}
                                            className="w-full"
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Luluskan di Prodi Ini
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
