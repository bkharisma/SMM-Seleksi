<?php

namespace App\Traits;

trait HasNilaiFields
{
    const FIELD_META = [
        'psi_iq' => ['label' => 'Bakat Skolastik', 'type' => 'int'],
        'psi_bobot' => ['label' => 'Psikotes', 'type' => 'int'],
        'bing_nil' => ['label' => 'Literasi Bahasa Inggris', 'type' => 'int'],
        'waw_nil' => ['label' => 'Wawancara', 'type' => 'int'],
        'kes_hasil' => ['label' => 'Tes Kesehatan', 'type' => 'bool'],
        'kes_tb' => ['label' => 'Tinggi Badan', 'type' => 'int'],
        'kes_bw' => ['label' => 'Buta Warna', 'type' => 'bool'],
        'kes_scol' => ['label' => 'Skoliosis', 'type' => 'bool'],
        'kes_hamil' => ['label' => 'Kehamilan', 'type' => 'bool'],
        'skor_akhir' => ['label' => 'Skor Akhir', 'type' => 'float'],
    ];

    public function metaLabels(): array
    {
        $labels = [];
        foreach (self::FIELD_META as $key => $meta) {
            $labels[$key] = $meta['label'];
        }

        return $labels;
    }

    public function fieldValidationRules(array $fieldNames): array
    {
        $rules = [];
        foreach ($fieldNames as $field) {
            $meta = self::FIELD_META[$field] ?? null;
            if (! $meta) {
                continue;
            }
            $type = match ($meta['type']) {
                'int' => 'integer',
                'float' => 'numeric',
                'bool' => 'boolean',
                default => 'string',
            };
            $rules[$field] = "nullable|{$type}";
        }

        return $rules;
    }
}
