<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pendaftar_nilai', function (Blueprint $table) {
            $table->boolean('kes_hamil')->nullable()->after('kes_scol');
        });
    }

    public function down(): void
    {
        Schema::table('pendaftar_nilai', function (Blueprint $table) {
            $table->dropColumn('kes_hamil');
        });
    }
};
