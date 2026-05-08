import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, XCircle } from 'lucide-react';
import AdminLayout from '@/components/layout/admin-layout';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import { FIELD_LABELS, BOOL_FIELDS } from '@/lib/nilai';

interface ProdiData {
    id: number;
    nama_prodi: string;
    kode_prodi?: string;
}

interface RuangData {
    id: number;
    nomor_ruang: string;
}

interface JalurPendaftaranData {
    id: number;
    nama_jalur: string;
    kode_jalur?: string;
}

interface TahapSeleksiData {
    id: number;
    nama_tahap?: string;
    nama?: string;
}

interface UserData {
    id: number;
    name: string;
    username: string;
}

interface NilaiData {
    id: number;
    nup: string | null;
    nus: string | null;
    ujian_id: number | null;
    psi_iq: string | null;
    psi_bobot: string | null;
    bing_nil: string | null;
    waw_nil: string | null;
    kes_tb: string | null;
    kes_bw: boolean;
    kes_paru: boolean;
    kes_scol: boolean;
    kes_hamil: boolean;
    minat_dominan: string | null;
    type: string | null;
    skor_akhir: string | null;
    ujian?: { id: number; nama_ujian?: string; nama?: string; fields_config?: { fields?: string[]; labels?: Record<string, string> } | null } | null;
}

interface RaportData {
    id: number;
    noujian: string | null;
    npsn: string | null;
    akreditasi: string | null;
    ahuruf: string | null;
    anilai: string | null;
    status: string | null;
    catatan: string | null;
}

interface KesehatanData {
    id: number;
    noujian: string | null;
    namalbg: string | null;
    lokasi: string | null;
    tb: string | null;
    bb: string | null;
    ow: string | null;
    obesitas: string | null;
    tensi: string | null;
    nadi: string | null;
    tato: string | null;
    tindik: string | null;
    bw: string | null;
    strab: string | null;
    pupil: string | null;
    paru: string | null;
    sco: string | null;
    mop: string | null;
    amp: string | null;
    thc: string | null;
    kehamilan: string | null;
    status: string | null;
    catatan: string | null;
}

interface FileData {
    id: number;
    pendaftar_id: number;
    file_loc?: string;
    file_lockes?: string;
}

interface PendaftarDetail {
    id: number;
    kode_pendaftar: string;
    noujian: string | null;
    nama: string;
    tanggal_lahir: string | null;
    tempat_lahir: string | null;
    email: string | null;
    no_hp: string | null;
    jenis_kelamin: string | null;
    alamat: string | null;
    agama: string | null;
    nama_ayah: string | null;
    nama_ibu: string | null;
    hp_ayah: string | null;
    hp_ibu: string | null;
    pekerjaan_ayah: string | null;
    pekerjaan_ibu: string | null;
    nama_sekolah: string | null;
    npsn: string | null;
    akreditasi: string | null;
    tahun_lulus: string | null;
    prestasi: string | null;
    ruang_kelompok: string | null;
    is_referensi: boolean;
    catatan_referensi: string | null;
    param_lulus: any;
    foto: string | null;
    pil1_prodi: ProdiData | null;
    pil2_prodi: ProdiData | null;
    pil3_prodi: ProdiData | null;
    lulus_prodi: ProdiData | null;
    lulus_tahap: TahapSeleksiData | null;
    ruang: RuangData | null;
    jalur: JalurPendaftaranData | null;
    user: UserData | null;
    nilai: NilaiData[];
    raport: RaportData | null;
    kesehatan: KesehatanData | null;
    file_raport: FileData[];
    file_kesehatan: FileData[];
}

interface Props {
    pendaftar: PendaftarDetail;
}

const itemStyle = 'flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0';
const labelStyle = 'text-sm font-medium text-gray-500 dark:text-gray-400';
const valueStyle = 'text-sm text-gray-900 dark:text-white text-right max-w-[60%]';

function DetailItem({ label, value, className = '' }: { label: string; value: React.ReactNode; className?: string }) {
    return (
        <div className={className ? className : itemStyle}>
            <span className={labelStyle}>{label}</span>
            <span className={valueStyle}>{value || '-'}</span>
        </div>
    );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return <h4 className="mb-2 mt-4 text-base font-semibold text-gray-800 dark:text-gray-200 first:mt-0">{children}</h4>;
}

export default function PendaftarShow({ pendaftar }: Props) {
    const getLulusStatus = () => {
        if (pendaftar.lulus_prodi) {
            return <Badge variant="success">{pendaftar.lulus_prodi.nama_prodi}</Badge>;
        }

        return <Badge variant="info">Belum Lulus</Badge>;
    };

    const handleResetLulus = () => {
        if (!confirm(`Yakin batalkan kelulusan ${pendaftar.nama}?`)) {
            return;
        }

        router.post(`/admin/seleksi/reset/${pendaftar.id}`);
    };

    const formatDate = (date: string | null) => {
        if (!date) {
return '-';
}

        return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <AdminLayout title={`Detail Pendaftar: ${pendaftar.nama}`}>
            <Head title={`Detail: ${pendaftar.nama}`} />

            <div className="mb-4 flex items-center gap-2">
                <Link href="/admin/pendaftar">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                    </Button>
                </Link>
                <Link href={`/admin/pendaftar/${pendaftar.id}/edit`}>
                    <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                </Link>
                {pendaftar.noujian && (
                    <a href={`/admin/pendaftar/${pendaftar.id}/kartu`} target="_blank">
                        <Button variant="outline" size="sm">
                            Kartu Ujian
                        </Button>
                    </a>
                )}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Identitas Pendaftar */}
                <Card title="Identitas Pendaftar" className="lg:col-span-1">
                    {pendaftar.foto && (
                        <div className="mb-4 flex justify-center">
                            <img
                                src={pendaftar.foto}
                                alt="Foto"
                                className="h-32 w-32 rounded-full object-cover border-2 border-gray-200"
                            />
                        </div>
                    )}
                    <DetailItem label="Kode" value={<span className="font-mono">{pendaftar.kode_pendaftar}</span>} />
                    <DetailItem label="No. Ujian" value={<span className="font-mono">{pendaftar.noujian || '-'}</span>} />
                    <DetailItem label="Nama" value={pendaftar.nama} />
                    <DetailItem label="Tempat Lahir" value={pendaftar.tempat_lahir} />
                    <DetailItem label="Tanggal Lahir" value={formatDate(pendaftar.tanggal_lahir)} />
                    <DetailItem label="Jenis Kelamin" value={pendaftar.jenis_kelamin} />
                    <DetailItem label="Agama" value={pendaftar.agama} />
                    <DetailItem label="Alamat" value={pendaftar.alamat} />
                    <DetailItem label="Email" value={pendaftar.email} />
                    <DetailItem label="No. HP" value={pendaftar.no_hp} />
                </Card>

                {/* Pilihan & Status */}
                <Card title="Pilihan Prodi & Status" className="lg:col-span-1">
                    <DetailItem label="Jalur Pendaftaran" value={pendaftar.jalur?.nama_jalur || '-'} />
                    <DetailItem label="Pilihan 1" value={pendaftar.pil1_prodi?.nama_prodi || '-'} />
                    <DetailItem label="Pilihan 2" value={pendaftar.pil2_prodi?.nama_prodi || '-'} />
                    <DetailItem label="Pilihan 3" value={pendaftar.pil3_prodi?.nama_prodi || '-'} />
                    <DetailItem label="Ruang" value={pendaftar.ruang?.nomor_ruang || '-'} />
                    <DetailItem label="Kelompok" value={pendaftar.ruang_kelompok || '-'} />
                    <DetailItem label="Status Kelulusan" value={getLulusStatus()} />
                    {pendaftar.is_referensi && (
                        <>
                            <DetailItem label="Referensi" value={<Badge variant="warning">Ya</Badge>} />
                            {pendaftar.catatan_referensi && (
                                <DetailItem label="Catatan Referensi" value={pendaftar.catatan_referensi} />
                            )}
                        </>
                    )}
                    {pendaftar.lulus_tahap && (
                        <DetailItem label="Lulus Tahap" value={pendaftar.lulus_tahap.nama_tahap || pendaftar.lulus_tahap.nama || '-'} />
                    )}
                    {pendaftar.param_lulus?.scores && Object.keys(pendaftar.param_lulus.scores).length > 0 && (
                        <>
                            <SectionTitle>Detail Seleksi</SectionTitle>
                            <DetailItem label="Pilihan Ke" value={pendaftar.param_lulus.pilihan ?? '-'} />
                            {Object.entries(pendaftar.param_lulus.scores).map(([nama, skor]) => (
                                <DetailItem key={nama} label={`Nilai ${nama}`} value={skor != null ? String(skor) : '-'} />
                            ))}
                        </>
                    )}
                    <DetailItem label="Akun User" value={pendaftar.user?.username || '-'} />
                    {pendaftar.lulus_prodi && (
                        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={handleResetLulus}
                                className="w-full"
                            >
                                <XCircle className="mr-2 h-4 w-4" />
                                Batal Kelulusan
                            </Button>
                        </div>
                    )}
                </Card>

                {/* Data Orang Tua */}
                <Card title="Data Orang Tua" className="lg:col-span-1">
                    <DetailItem label="Nama Ayah" value={pendaftar.nama_ayah || '-'} />
                    <DetailItem label="Pekerjaan Ayah" value={pendaftar.pekerjaan_ayah || '-'} />
                    <DetailItem label="HP Ayah" value={pendaftar.hp_ayah || '-'} />
                    <DetailItem label="Nama Ibu" value={pendaftar.nama_ibu || '-'} />
                    <DetailItem label="Pekerjaan Ibu" value={pendaftar.pekerjaan_ibu || '-'} />
                    <DetailItem label="HP Ibu" value={pendaftar.hp_ibu || '-'} />
                </Card>

                {/* Data Sekolah */}
                <Card title="Data Sekolah" className="lg:col-span-1">
                    <DetailItem label="Nama Sekolah" value={pendaftar.nama_sekolah || '-'} />
                    <DetailItem label="NPSN" value={pendaftar.npsn || '-'} />
                    <DetailItem label="Akreditasi" value={pendaftar.akreditasi || '-'} />
                    <DetailItem label="Tahun Lulus" value={pendaftar.tahun_lulus || '-'} />
                    <DetailItem label="Prestasi" value={pendaftar.prestasi || '-'} />
                </Card>

                {/* Data Raport */}
                {pendaftar.raport && (
                    <Card title="Data Raport" className="lg:col-span-1">
                        <DetailItem label="NPSN" value={pendaftar.raport.npsn || '-'} />
                        <DetailItem label="Akreditasi" value={pendaftar.raport.akreditasi || '-'} />
                        <DetailItem label="Nilai Huruf" value={pendaftar.raport.ahuruf || '-'} />
                        <DetailItem label="Nilai Angka" value={pendaftar.raport.anilai || '-'} />
                        <DetailItem label="Status" value={pendaftar.raport.status || '-'} />
                        {pendaftar.raport.catatan && <DetailItem label="Catatan" value={pendaftar.raport.catatan} />}
                    </Card>
                )}

                {/* Data Kesehatan */}
                {pendaftar.kesehatan && (
                    <Card title="Data Kesehatan" className="lg:col-span-1">
                        <DetailItem label="Nama Lab" value={pendaftar.kesehatan.namalbg || '-'} />
                        <DetailItem label="Lokasi" value={pendaftar.kesehatan.lokasi || '-'} />
                        <DetailItem label="TB" value={pendaftar.kesehatan.tb || '-'} />
                        <DetailItem label="BB" value={pendaftar.kesehatan.bb || '-'} />
                        <DetailItem label="Obesitas" value={pendaftar.kesehatan.obesitas || '-'} />
                        <DetailItem label="Tensi" value={pendaftar.kesehatan.tensi || '-'} />
                        <DetailItem label="Nadi" value={pendaftar.kesehatan.nadi || '-'} />
                        <DetailItem label="Status" value={pendaftar.kesehatan.status || '-'} />
                        {pendaftar.kesehatan.catatan && <DetailItem label="Catatan" value={pendaftar.kesehatan.catatan} />}
                    </Card>
                )}

                {/* Detail Nilai per Ujian */}
                {pendaftar.nilai && pendaftar.nilai.length > 0 && (
                    <Card title="Detail Nilai Tes" className="lg:col-span-full">
                        {pendaftar.nilai.map((nilai, index) => {
                            const ujianFields = nilai.ujian?.fields_config?.fields || [];
                            const ujianLabels = nilai.ujian?.fields_config?.labels || {};
                            const ujianName = nilai.ujian?.nama_ujian || nilai.ujian?.nama || `Nilai #${index + 1}`;
                            const allFields = ujianFields.length > 0 ? ujianFields : [];

                            return (
                                <div key={nilai.id} className="mb-4 last:mb-0">
                                    <h5 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        {ujianName}
                                        {nilai.type && <span className="ml-2"><Badge variant="info">{nilai.type}</Badge></span>}
                                    </h5>
                                    <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-600">
                                        <DetailItem label="NUP" value={nilai.nup || '-'} />
                                        <DetailItem label="No. Seleksi" value={nilai.nus || '-'} />
                                        {allFields.map((field: string) => {
                                            const val = (nilai as any)[field];
                                            const label = ujianLabels[field] || FIELD_LABELS[field] || field;
                                            const display = BOOL_FIELDS.includes(field)
                                                ? (val === true || val === 1 || val === '1' ? 'Ya' : val === false || val === 0 || val === '0' ? 'Tidak' : '-')
                                                : (val !== null && val !== undefined && val !== '' ? String(val) : '-');

                                            return <DetailItem key={field} label={label} value={display} />;
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </Card>
                )}

                {/* File Raport */}
                {pendaftar.file_raport && pendaftar.file_raport.length > 0 && (
                    <Card title="File Raport" className="lg:col-span-1">
                        <ul className="space-y-1">
                            {pendaftar.file_raport.map((file) => (
                                <li key={file.id}>
                                    <a
                                        href={file.file_loc}
                                        target="_blank"
                                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                        File #{file.id}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </Card>
                )}

                {/* File Kesehatan */}
                {pendaftar.file_kesehatan && pendaftar.file_kesehatan.length > 0 && (
                    <Card title="File Kesehatan" className="lg:col-span-1">
                        <ul className="space-y-1">
                            {pendaftar.file_kesehatan.map((file) => (
                                <li key={file.id}>
                                    <a
                                        href={file.file_lockes}
                                        target="_blank"
                                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                        File #{file.id}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}
