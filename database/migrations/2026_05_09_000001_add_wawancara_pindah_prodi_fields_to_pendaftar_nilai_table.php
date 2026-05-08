<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pendaftar_nilai', function (Blueprint $table) {
            $table->boolean('waw_bersedia_pindah')->nullable()->after('waw_nil')->comment('Bersedia ditempatkan di prodi lain');
            $table->foreignId('waw_rekomendasi_prodi_id')->nullable()->after('waw_bersedia_pindah')->constrained('prodi')->nullOnDelete()->comment('Rekomendasi prodi tujuan');
            $table->text('waw_catatan')->nullable()->after('waw_rekomendasi_prodi_id')->comment('Catatan wawancara');
        });
    }

    public function down(): void
    {
        Schema::table('pendaftar_nilai', function (Blueprint $table) {
            $table->dropForeign(['waw_rekomendasi_prodi_id']);
            $table->dropColumn(['waw_bersedia_pindah', 'waw_rekomendasi_prodi_id', 'waw_catatan']);
        });
    }
};
