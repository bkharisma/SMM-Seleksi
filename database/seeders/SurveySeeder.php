<?php

namespace Database\Seeders;

use App\Models\Survey;
use Illuminate\Database\Seeder;

class SurveySeeder extends Seeder
{
    public function run(): void
    {
        $surveys = [
            'Internet', 'Media Sosial', 'Teman/Keluarga', 'Sekolah', 'Brosur/Pamflet',
            'Media Cetak', 'Radio/TV', 'Lainnya',
        ];

        foreach ($surveys as $survey) {
            Survey::firstOrCreate(['keterangan' => $survey]);
        }
    }
}
