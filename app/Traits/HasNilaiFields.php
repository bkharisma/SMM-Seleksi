<?php

namespace App\Traits;

trait HasNilaiFields
{
    const FIELD_META = [
        'psi_iq' => ['label' => 'Bakat Skolastik', 'type' => 'float'],
        'psi_bobot' => ['label' => 'Psikotes', 'type' => 'float'],
        'bing_nil' => ['label' => 'Literasi Bahasa Inggris', 'type' => 'float'],
        'waw_nil' => ['label' => 'Wawancara', 'type' => 'float'],
        'kes_hasil' => ['label' => 'Tes Kesehatan', 'type' => 'bool'],
        'kes_tb' => ['label' => 'Tinggi Badan', 'type' => 'float'],
        'kes_bw' => ['label' => 'Buta Warna', 'type' => 'bool'],
        'kes_scol' => ['label' => 'Skoliosis', 'type' => 'bool'],
        'kes_hamil' => ['label' => 'Kehamilan', 'type' => 'bool'],
        'minat_dominan' => ['label' => 'Minat Dominan', 'type' => 'float'],
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
