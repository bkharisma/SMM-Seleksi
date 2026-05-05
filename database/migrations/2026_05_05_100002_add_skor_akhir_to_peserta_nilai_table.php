<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('peserta_nilai', function (Blueprint $table) {
            $table->decimal('skor_akhir', 9, 2)->nullable()->after('bing_nil');
        });
    }

    public function down(): void
    {
        Schema::table('peserta_nilai', function (Blueprint $table) {
            $table->dropColumn('skor_akhir');
        });
    }
};
