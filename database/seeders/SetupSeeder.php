<?php

namespace Database\Seeders;

use App\Models\Setup;
use Illuminate\Database\Seeder;

class SetupSeeder extends Seeder
{
    public function run(): void
    {
        Setup::firstOrCreate(['code' => 'limit_spotlight'], ['int_val' => 5, 'char_val' => '5']);
        Setup::firstOrCreate(['code' => 'app_title'], ['char_val' => 'SELEKSI MANDIRI MASUK']);
        Setup::firstOrCreate(['code' => 'app_subtitle'], ['char_val' => 'POLITEKNIK PARIWISATA PALEMBANG']);
        Setup::firstOrCreate(['code' => 'ta'], ['char_val' => 'T.A 2025/2026']);
    }
}
