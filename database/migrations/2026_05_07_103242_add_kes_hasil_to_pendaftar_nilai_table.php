<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pendaftar_nilai', function (Blueprint $table) {
            $table->boolean('kes_hasil')->nullable()->after('kes_hamil');
        });

        if (Schema::hasTable('peserta_nilai')) {
            Schema::table('peserta_nilai', function (Blueprint $table) {
                $table->boolean('kes_hasil')->nullable()->after('kes_hamil');
            });
        }
    }

    public function down(): void
    {
        Schema::table('pendaftar_nilai', function (Blueprint $table) {
            $table->dropColumn('kes_hasil');
        });

        if (Schema::hasTable('peserta_nilai')) {
            Schema::table('peserta_nilai', function (Blueprint $table) {
                $table->dropColumn('kes_hasil');
            });
        }
    }
};
