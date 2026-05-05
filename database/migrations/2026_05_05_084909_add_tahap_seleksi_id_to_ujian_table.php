<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ujian', function (Blueprint $table) {
            $table->foreignId('tahap_seleksi_id')->nullable()->after('kode')->constrained('tahap_seleksi')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('ujian', function (Blueprint $table) {
            $table->dropForeign(['tahap_seleksi_id']);
            $table->dropColumn('tahap_seleksi_id');
        });
    }
};
