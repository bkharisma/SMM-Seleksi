import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/components/layout/admin-layout';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';

interface Prodi {
    id: number;
    nama_prodi: string;
    kode_prodi: string;
}

interface Ruang {
    id: number;
    nomor_ruang: string;
    nama_gedung: string | null;
}

interface Survey {
    id: number;
    keterangan: string;
}

interface Peserta {
    id: number;
    nup: string;
    noujian: string | null;
    nama: string;
    foto: string | null;
    nik: string | null;
    tempatlahir: string | null;
    tgllahir: string | null;
    goldarah: string | null;
    sex: string | null;
    agama: string | null;
    email: string | null;
    hp: string | null;
    alamat: string | null;
    kodepos: string | null;
    kabupaten: string | null;
    propinsi: string | null;
    status: boolean;
    lulus: number | null;
    lulus_tahap: string | null;
    nm_ayah: string | null;
    nm_ibu: string | null;
    pek_ayah: string | null;
    pek_ibu: string | null;
    telp_ortu: string | null;
    hp_ortu: string | null;
    email_ortu: string | null;
    jenis_sma: string | null;
    nama_sekolah: string | null;
    kota_sekolah: string | null;
    thn_sttb: string | null;
    pil1_prodi: Prodi | null;
    pil2_prodi: Prodi | null;
    pil3_prodi: Prodi | null;
    pil4_prodi: Prodi | null;
    ruang: Ruang | null;
    ruang_kelompok: number | null;
    lulus_prodi: Prodi | null;
    survey: Survey | null;
    nil_psikotes: number | null;
    nil_bhsinggris: number | null;
    nil_wawancara: number | null;
    nil_kesehatan: number | null;
}

interface PesertaShowProps {
    peserta: Peserta;
}

function InfoRow({ label, value }: { label: string; value: string | null }) {
    return (
        <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
            <span className="text-sm text-gray-400">:</span>
            <span className="text-sm text-gray-900 dark:text-white">{value || '-'}</span>
        </div>
    );
}

export default function PesertaShow({ peserta }: PesertaShowProps) {
    return (
        <AdminLayout title={`Detail Peserta - ${peserta.nama}`}>
            <Head title={`Detail ${peserta.nama}`} />

            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Detail Peserta: {peserta.nama}
                </h1>
                <div className="flex gap-2">
                    <Link href={`/admin/peserta/${peserta.id}/edit`}>
                        <Button variant="secondary" size="sm">Edit</Button>
                    </Link>
                    {peserta.noujian && (
                        <a href={`/admin/peserta/${peserta.id}/kartu`}>
                            <Button variant="secondary" size="sm">Kartu PDF</Button>
                        </a>
                    )}
                    <a href={`/admin/peserta/${peserta.id}/profile-pdf`}>
                        <Button variant="secondary" size="sm">Profile PDF</Button>
                    </a>
                    <Link href="/admin/peserta">
                        <Button variant="secondary" size="sm">Kembali</Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card title="Data Pribadi">
                    <div className="space-y-1">
                        <InfoRow label="NUP" value={peserta.nup} />
                        <InfoRow label="No. Ujian" value={peserta.noujian} />
                        <InfoRow label="NIK" value={peserta.nik} />
                        <InfoRow label="Nama" value={peserta.nama} />
                        <InfoRow
                            label="TTL"
                            value={peserta.tempatlahir && peserta.tgllahir
                                ? `${peserta.tempatlahir}, ${new Date(peserta.tgllahir).toLocaleDateString('id-ID')}`
                                : null}
                        />
                        <InfoRow
                            label="Jenis Kelamin"
                            value={peserta.sex === 'L' ? 'Laki-laki' : peserta.sex === 'P' ? 'Perempuan' : null}
                        />
                        <InfoRow label="Gol. Darah" value={peserta.goldarah} />
                        <InfoRow label="Agama" value={peserta.agama} />
                        <InfoRow label="Email" value={peserta.email} />
                        <InfoRow label="HP" value={peserta.hp} />
                        <InfoRow label="Alamat" value={peserta.alamat} />
                        <InfoRow label="Kabupaten" value={peserta.kabupaten} />
                        <InfoRow label="Provinsi" value={peserta.propinsi} />
                        <InfoRow label="Kode Pos" value={peserta.kodepos} />
                        <InfoRow
                            label="Status"
                            value={peserta.status ? 'Aktif' : 'Nonaktif'}
                        />
                    </div>
                </Card>

                <Card title="Pilihan Program Studi">
                    <div className="space-y-1">
                        <InfoRow label="Pilihan 1" value={peserta.pil1_prodi?.nama_prodi ?? null} />
                        <InfoRow label="Pilihan 2" value={peserta.pil2_prodi?.nama_prodi ?? null} />
                        <InfoRow label="Pilihan 3" value={peserta.pil3_prodi?.nama_prodi ?? null} />
                        <InfoRow label="Pilihan 4" value={peserta.pil4_prodi?.nama_prodi ?? null} />
                        <InfoRow label="Sumber Info" value={peserta.survey?.keterangan ?? null} />
                        {peserta.lulus_prodi && (
                            <div className="mt-4">
                                <Badge variant="success">
                                    Lulus: {peserta.lulus_prodi.nama_prodi}
                                </Badge>
                                {peserta.lulus_tahap && (
                                    <p className="mt-1 text-sm text-gray-500">Tahap: {peserta.lulus_tahap}</p>
                                )}
                            </div>
                        )}
                    </div>
                </Card>

                <Card title="Data Orang Tua">
                    <div className="space-y-1">
                        <InfoRow label="Nama Ayah" value={peserta.nm_ayah} />
                        <InfoRow label="Nama Ibu" value={peserta.nm_ibu} />
                        <InfoRow label="Pekerjaan Ayah" value={peserta.pek_ayah} />
                        <InfoRow label="Pekerjaan Ibu" value={peserta.pek_ibu} />
                        <InfoRow label="Telp. Ortu" value={peserta.telp_ortu} />
                        <InfoRow label="HP Ortu" value={peserta.hp_ortu} />
                        <InfoRow label="Email Ortu" value={peserta.email_ortu} />
                    </div>
                </Card>

                <Card title="Data Pendidikan">
                    <div className="space-y-1">
                        <InfoRow label="Jenis SMA" value={peserta.jenis_sma} />
                        <InfoRow label="Nama Sekolah" value={peserta.nama_sekolah} />
                        <InfoRow label="Kota Sekolah" value={peserta.kota_sekolah} />
                        <InfoRow label="Tahun STTB" value={peserta.thn_sttb} />
                    </div>
                </Card>

                {peserta.ruang && (
                    <Card title="Ruang Ujian">
                        <div className="space-y-1">
                            <InfoRow label="Ruang" value={peserta.ruang.nomor_ruang} />
                            <InfoRow label="Gedung" value={peserta.ruang.nama_gedung ?? null} />
                            <InfoRow label="Kelompok" value={peserta.ruang_kelompok?.toString() ?? null} />
                        </div>
                    </Card>
                )}

                <Card title="Nilai">
                    <div className="space-y-1">
                        <InfoRow label="Psikotes (IQ/Bobot)" value={peserta.nil_psikotes?.toString() ?? null} />
                        <InfoRow label="B. Inggris" value={peserta.nil_bhsinggris?.toString() ?? null} />
                        <InfoRow label="Wawancara" value={peserta.nil_wawancara?.toString() ?? null} />
                        <InfoRow label="Kesehatan" value={peserta.nil_kesehatan?.toString() ?? null} />
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
}
