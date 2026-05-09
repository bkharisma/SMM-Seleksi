import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';

interface Prodi {
    id: number;
    nama_prodi: string;
    kode_prodi: string;
}

interface Tahap {
    id: number;
    nama: string;
    urutan: number;
}

interface UjianData {
    id: number;
    nama: string;
    kode: string;
    tahap_seleksi_id: number | null;
    fields_config?: Record<string, any>;
}

interface HealthField {
    key: string;
    label: string;
    type: 'boolean' | 'number' | 'string';
}

interface KriteriaUjianItem {
    id?: number;
    ujian_id: number;
    jenis: 'tes' | 'berkas' | 'kesehatan';
    nilai_standar: string;
    parameters: ParameterItem[] | null;
    ujian?: UjianData;
}

interface ParameterItem {
    nama: string;
    tipe_value: 'number' | 'string' | 'boolean';
    nilai: string;
    field_key?: string;
    enabled?: boolean;
}

interface Kriteria {
    id: number;
    prodi_id: number;
    tahap_seleksi_id: number;
    ordering: string;
    filter_pilihan: number;
    active: boolean;
}

interface KriteriaFormProps {
    kriteria: Kriteria | null;
    kriteriaUjian: KriteriaUjianItem[];
    prodi: Prodi[];
    tahap: Tahap[];
    ujian: UjianData[];
    health_fields: HealthField[];
}

export default function KriteriaForm({ kriteria, kriteriaUjian, prodi, tahap, ujian, health_fields = [] }: KriteriaFormProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const isEdit = !!kriteria;

    const initHealthParameters = (ku: any): ParameterItem[] => {
        const fieldsConfig = ku.ujian?.fields_config?.fields || [];
        const existingParams = ku.parameters || [];

        if (!health_fields || health_fields.length === 0) {
            return [];
        }

        return health_fields
            .filter((hf) => fieldsConfig.includes(hf.key))
            .map((hf) => {
                const existing = existingParams.find((p: ParameterItem) => p.field_key === hf.key);
                return {
                    nama: hf.label,
                    tipe_value: hf.type,
                    nilai: existing ? existing.nilai : (hf.type === 'boolean' ? 'Tidak' : ''),
                    field_key: hf.key,
                    enabled: existing ? true : false,
                };
            });
    };

    const existingKuMap = useMemo(() => {
        const map: Record<number, KriteriaUjianItem> = {};

        if (kriteriaUjian && kriteriaUjian.length > 0) {
            kriteriaUjian.forEach((ku) => {
                let params: ParameterItem[] = [];
                if (ku.jenis === 'kesehatan') {
                    params = initHealthParameters(ku);
                } else {
                    params = Array.isArray(ku.parameters) ? ku.parameters : [];
                }
                map[ku.ujian_id] = {
                    ujian_id: ku.ujian_id,
                    jenis: ku.jenis,
                    nilai_standar: ku.nilai_standar?.toString() || '',
                    parameters: params,
                    ujian: ku.ujian,
                };
            });
        }

        return map;
    }, [kriteriaUjian]);

    const buildInitialKu = (tahapId: number, existingMap: Record<number, KriteriaUjianItem>): KriteriaUjianItem[] => {
        const initial: KriteriaUjianItem[] = [];
        const tahapUjian = ujian.filter((u) => u.tahap_seleksi_id === tahapId);
        tahapUjian.forEach((u) => {
            const existing = existingMap[u.id];
            const params = existing?.parameters ? [...existing.parameters] : [];
            initial.push({
                ujian_id: u.id,
                jenis: existing?.jenis || 'tes',
                nilai_standar: existing?.nilai_standar || '',
                parameters: params,
                ujian: u,
            });
        });
        return initial;
    };

    const initialKu = useMemo(() => {
        if (kriteria?.tahap_seleksi_id) {
            return buildInitialKu(kriteria.tahap_seleksi_id, existingKuMap);
        }
        return [];
    }, [kriteria, ujian, existingKuMap]);

    const { data, setData, post, put, processing, errors } = useForm({
        prodi_id: kriteria?.prodi_id?.toString() || '',
        tahap_seleksi_id: kriteria?.tahap_seleksi_id?.toString() || '',
        ordering: kriteria?.ordering || 'DESC',
        filter_pilihan: kriteria?.filter_pilihan?.toString() || '1',
        active: kriteria?.active ?? true,
        kriteria_ujian: initialKu as any[],
    });

    useEffect(() => {
        if (flash?.success) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const sanitized = (data.kriteria_ujian as any[]).map((ku: any) => {
            let params = null;

            if (ku.jenis === 'kesehatan') {
                const healthParams = ku.parameters || [];
                params = healthParams
                    .filter((p: ParameterItem) => p.enabled)
                    .map((p: ParameterItem) => ({
                        nama: p.nama,
                        tipe_value: p.tipe_value,
                        nilai: p.nilai,
                        field_key: p.field_key,
                    }));
                if (params.length === 0) {
                    params = null;
                }
            } else if (ku.jenis === 'berkas') {
                params = ku.parameters;
            }

            return {
                ujian_id: ku.ujian_id,
                jenis: ku.jenis,
                nilai_standar: ku.jenis === 'tes' ? (ku.nilai_standar || null) : null,
                parameters: params,
            };
        });

        const submitData = {
            prodi_id: data.prodi_id,
            tahap_seleksi_id: data.tahap_seleksi_id,
            ordering: data.ordering,
            filter_pilihan: data.filter_pilihan,
            active: data.active,
            kriteria_ujian: sanitized,
        };

        if (isEdit) {
            put(`/admin/kriteria/${kriteria!.id}`, submitData as any);
        } else {
            post('/admin/kriteria', submitData as any);
        }
    };

    const handleTahapChange = (tahapId: string) => {
        setData('tahap_seleksi_id', tahapId);
        const newKu = buildInitialKu(parseInt(tahapId), existingKuMap);
        setData('kriteria_ujian', newKu as any);
    };

    const updateKuField = (index: number, field: string, value: any) => {
        const updated = [...(data.kriteria_ujian as any[])];
        updated[index] = { ...updated[index], [field]: value };

        if (field === 'jenis' && value === 'kesehatan') {
            updated[index].parameters = initHealthParameters(updated[index]);
        } else if (field === 'jenis' && value !== 'kesehatan') {
            updated[index].parameters = [];
        }

        setData('kriteria_ujian', updated as any);
    };

    const updateParameter = (kuIndex: number, paramIndex: number, field: string, value: any) => {
        const updated = [...(data.kriteria_ujian as any[])];
        const params = [...(updated[kuIndex].parameters || [])];
        params[paramIndex] = { ...params[paramIndex], [field]: value };
        updated[kuIndex] = { ...updated[kuIndex], parameters: params };
        setData('kriteria_ujian', updated as any);
    };

    const addParameter = (kuIndex: number) => {
        const updated = [...(data.kriteria_ujian as any[])];
        const params = [...(updated[kuIndex].parameters || [])];
        params.push({ nama: '', tipe_value: 'number', nilai: '' });
        updated[kuIndex] = { ...updated[kuIndex], parameters: params };
        setData('kriteria_ujian', updated as any);
    };

    const removeParameter = (kuIndex: number, paramIndex: number) => {
        const updated = [...(data.kriteria_ujian as any[])];
        const params = [...(updated[kuIndex].parameters || [])];
        params.splice(paramIndex, 1);
        updated[kuIndex] = { ...updated[kuIndex], parameters: params };
        setData('kriteria_ujian', updated as any);
    };

    const kuArray = (data.kriteria_ujian as any[]) || [];
    const selectedTahapId = data.tahap_seleksi_id;

    return (
        <AdminLayout title={isEdit ? 'Edit Kriteria' : 'Tambah Kriteria'}>
            <Head title={isEdit ? 'Edit Kriteria' : 'Tambah Kriteria'} />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card title={isEdit ? 'Edit Kriteria Kelulusan' : 'Tambah Kriteria Kelulusan'}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Select
                            id="prodi_id"
                            label="Program Studi"
                            value={data.prodi_id}
                            onChange={(e) => setData('prodi_id', e.target.value)}
                            options={prodi.map((p) => ({ value: p.id.toString(), label: p.nama_prodi }))}
                            placeholder="Pilih Prodi"
                            error={errors.prodi_id}
                        />
                        <Select
                            id="tahap_seleksi_id"
                            label="Tahap Seleksi"
                            value={data.tahap_seleksi_id}
                            onChange={(e) => handleTahapChange(e.target.value)}
                            options={tahap.map((t) => ({ value: t.id.toString(), label: `${t.nama} (Urutan ${t.urutan})` }))}
                            placeholder="Pilih Tahap"
                            error={errors.tahap_seleksi_id}
                        />
                    </div>

                    {selectedTahapId && kuArray.length > 0 && (
                        <div className="border-t pt-6">
                            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                                Konfigurasi Ujian
                            </h3>
                            <div className="space-y-6">
                                {kuArray.map((ku: any, kuIndex: number) => (
                                    <div
                                        key={kuIndex}
                                        className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                                    >
                                        <div className="mb-3 flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {ku.ujian?.nama || `Ujian #${ku.ujian_id}`}
                                            </span>
                                            {ku.ujian?.kode && (
                                                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                                                    {ku.ujian.kode}
                                                </span>
                                            )}
                                        </div>

                                        <Select
                                            id={`ku_jenis_${kuIndex}`}
                                            label="Tipe Seleksi"
                                            value={ku.jenis}
                                            onChange={(e) => updateKuField(kuIndex, 'jenis', e.target.value)}
                                            options={[
                                                { value: 'tes', label: 'Ujian Tes / CBT' },
                                                { value: 'berkas', label: 'Upload Berkas' },
                                                { value: 'kesehatan', label: 'Cek Kesehatan' },
                                            ]}
                                        />

                                        {ku.jenis === 'tes' && (
                                            <div className="mt-3">
                                                <Input
                                                    id={`ku_nilai_standar_${kuIndex}`}
                                                    label="Nilai Standar (Passing Grade)"
                                                    type="number"
                                                    step="0.01"
                                                    value={ku.nilai_standar || ''}
                                                    onChange={(e) => updateKuField(kuIndex, 'nilai_standar', e.target.value)}
                                                    placeholder="Contoh: 75"
                                                />
                                            </div>
                                        )}

                                        {ku.jenis === 'berkas' && (
                                            <div className="mt-3 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Parameter Penilaian
                                                    </span>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={() => addParameter(kuIndex)}
                                                    >
                                                        + Tambah Parameter
                                                    </Button>
                                                </div>
                                                {(ku.parameters || []).map((param: ParameterItem, pIndex: number) => (
                                                    <div
                                                        key={pIndex}
                                                        className="grid gap-3 rounded border border-gray-100 p-3 dark:border-gray-600 md:grid-cols-[1fr_120px_1fr_40px]"
                                                    >
                                                        <Input
                                                            id={`ku_${kuIndex}_param_nama_${pIndex}`}
                                                            label="Syarat"
                                                            value={param.nama}
                                                            onChange={(e) =>
                                                                updateParameter(kuIndex, pIndex, 'nama', e.target.value)
                                                            }
                                                            placeholder="Nama syarat"
                                                        />
                                                        <Select
                                                            id={`ku_${kuIndex}_param_tipe_${pIndex}`}
                                                            label="Tipe"
                                                            value={param.tipe_value}
                                                            onChange={(e) =>
                                                                updateParameter(kuIndex, pIndex, 'tipe_value', e.target.value)
                                                            }
                                                            options={[
                                                                { value: 'number', label: 'Number' },
                                                                { value: 'string', label: 'String' },
                                                                { value: 'boolean', label: 'Boolean' },
                                                            ]}
                                                        />
                                                        <Input
                                                            id={`ku_${kuIndex}_param_nilai_${pIndex}`}
                                                            label="Nilai"
                                                            value={param.nilai}
                                                            onChange={(e) =>
                                                                updateParameter(kuIndex, pIndex, 'nilai', e.target.value)
                                                            }
                                                        />
                                                        <div className="flex items-end pb-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => removeParameter(kuIndex, pIndex)}
                                                                className="rounded p-1 text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {(!ku.parameters || ku.parameters.length === 0) && (
                                                    <p className="text-sm text-gray-400">
                                                        Belum ada parameter. Klik "Tambah Parameter" untuk menambahkan.
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {ku.jenis === 'kesehatan' && ku.parameters && ku.parameters.length > 0 && (
                                            <div className="mt-3 space-y-3">
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Parameter Penilaian
                                                </span>
                                                {ku.parameters.map((param: ParameterItem, pIndex: number) => (
                                                    <div
                                                        key={param.field_key || pIndex}
                                                        className="grid gap-3 rounded border border-gray-100 p-3 dark:border-gray-600 md:grid-cols-[40px_1fr_120px]"
                                                    >
                                                        <div className="flex items-end pb-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={param.enabled || false}
                                                                onChange={(e) =>
                                                                    updateParameter(kuIndex, pIndex, 'enabled', e.target.checked)
                                                                }
                                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                        <div className="flex items-end pb-2">
                                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                {param.nama}
                                                            </span>
                                                        </div>
                                                        {param.tipe_value === 'boolean' ? (
                                                            <Select
                                                                id={`ku_${kuIndex}_param_nilai_${pIndex}`}
                                                                label="Nilai"
                                                                value={param.nilai || 'Tidak'}
                                                                onChange={(e) =>
                                                                    updateParameter(kuIndex, pIndex, 'nilai', e.target.value)
                                                                }
                                                                options={[
                                                                    { value: 'Tidak', label: 'Tidak' },
                                                                    { value: 'Ya', label: 'Ya' },
                                                                ]}
                                                            />
                                                        ) : param.tipe_value === 'number' ? (
                                                            <Input
                                                                id={`ku_${kuIndex}_param_nilai_${pIndex}`}
                                                                label="Nilai"
                                                                type="number"
                                                                value={param.nilai || ''}
                                                                onChange={(e) =>
                                                                    updateParameter(kuIndex, pIndex, 'nilai', e.target.value)
                                                                }
                                                            />
                                                        ) : (
                                                            <Input
                                                                id={`ku_${kuIndex}_param_nilai_${pIndex}`}
                                                                label="Nilai"
                                                                type="text"
                                                                value={param.nilai || ''}
                                                                onChange={(e) =>
                                                                    updateParameter(kuIndex, pIndex, 'nilai', e.target.value)
                                                                }
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {ku.jenis === 'kesehatan' && (!ku.parameters || ku.parameters.length === 0) && (
                                            <div className="mt-3">
                                                <p className="text-sm text-gray-400">
                                                    Tidak ada field kesehatan yang dikonfigurasi untuk ujian ini.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedTahapId && kuArray.length === 0 && (
                        <div className="border-t pt-6">
                            <p className="text-sm text-gray-400">
                                Tidak ada ujian pada tahap seleksi ini. Silakan tambahkan ujian terlebih dahulu di menu Ujian.
                            </p>
                        </div>
                    )}

                    <div className="border-t pt-6">
                        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Konfigurasi Seleksi</h3>
                        <div className="grid gap-6 md:grid-cols-2">
                            <Select
                                id="ordering"
                                label="Urutan"
                                value={data.ordering}
                                onChange={(e) => setData('ordering', e.target.value)}
                                options={[
                                    { value: 'DESC', label: 'Descending (Tertinggi)' },
                                    { value: 'ASC', label: 'Ascending (Terendah)' },
                                ]}
                            />
                            <Select
                                id="filter_pilihan"
                                label="Filter Pilihan"
                                value={data.filter_pilihan}
                                onChange={(e) => setData('filter_pilihan', e.target.value)}
                                options={[
                                    { value: '1', label: 'Pilihan 1' },
                                    { value: '2', label: 'Pilihan 1-2' },
                                    { value: '3', label: 'Pilihan 1-3' },
                                    { value: '4', label: 'Semua Pilihan' },
                                ]}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="active"
                            checked={data.active}
                            onChange={(e) => setData('active', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="active" className="text-sm text-gray-700 dark:text-gray-300">
                            Aktif
                        </label>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Link href="/admin/kriteria">
                            <Button variant="secondary" type="button">Batal</Button>
                        </Link>
                        <Button type="submit" isLoading={processing}>
                            {isEdit ? 'Perbarui' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </Card>
        </AdminLayout>
    );
}
