export const FIELD_LABELS: Record<string, string> = {
    psi_iq: 'Bakat Skolastik',
    psi_bobot: 'Psikotes',
    bing_nil: 'Nilai Inggris',
    waw_nil: 'Nilai Wawancara',
    kes_tb: 'TB',
    kes_bw: 'BW',
    kes_paru: 'TBC',
    kes_scol: 'Scoliosis',
    kes_hamil: 'Kehamilan',
    skor_akhir: 'Skor Akhir',
};

export const BOOL_FIELDS = ['kes_bw', 'kes_paru', 'kes_scol', 'kes_hamil'];

export function resolveFieldLabel(
    field: string,
    ujianName: string,
    fieldsConfig?: { fields?: string[]; labels?: Record<string, string> } | null,
): string {
    const fields = fieldsConfig?.fields || [];

    return fieldsConfig?.labels?.[field]
        || (fields.length === 1 ? `Nilai ${ujianName}` : (FIELD_LABELS[field] || field));
}
