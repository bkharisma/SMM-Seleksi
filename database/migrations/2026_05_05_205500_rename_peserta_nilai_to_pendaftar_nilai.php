<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('peserta_nilai') && ! Schema::hasTable('pendaftar_nilai')) {
            Schema::rename('peserta_nilai', 'pendaftar_nilai');
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('pendaftar_nilai') && ! Schema::hasTable('peserta_nilai')) {
            Schema::rename('pendaftar_nilai', 'peserta_nilai');
        }
    }
};
