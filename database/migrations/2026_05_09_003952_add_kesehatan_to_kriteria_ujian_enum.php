<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE kriteria_ujian MODIFY COLUMN jenis ENUM('tes', 'berkas', 'kesehatan') NOT NULL");
    }

    public function down(): void
    {
        DB::statement("UPDATE kriteria_ujian SET jenis = 'berkas' WHERE jenis = 'kesehatan'");
        DB::statement("ALTER TABLE kriteria_ujian MODIFY COLUMN jenis ENUM('tes', 'berkas') NOT NULL");
    }
};
