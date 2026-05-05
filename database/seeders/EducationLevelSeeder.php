<?php

namespace Database\Seeders;

use App\Models\EducationLevel;
use Illuminate\Database\Seeder;

class EducationLevelSeeder extends Seeder
{
    public function run(): void
    {
        $levels = [
            ['code' => 'SMA', 'description' => 'SMA/MA/SMK', 'orderby' => 1],
            ['code' => 'MA', 'description' => 'Madrasah Aliyah', 'orderby' => 2],
            ['code' => 'SMK', 'description' => 'Sekolah Menengah Kejuruan', 'orderby' => 3],
            ['code' => 'PAKET_C', 'description' => 'Paket C', 'orderby' => 4],
        ];

        foreach ($levels as $level) {
            EducationLevel::firstOrCreate(['code' => $level['code']], $level);
        }
    }
}
