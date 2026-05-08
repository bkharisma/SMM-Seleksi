<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pendaftar_nilai', function (Blueprint $table) {
            $table->decimal('psi_iq', 8, 2)->nullable()->change();
            $table->decimal('psi_bobot', 8, 2)->nullable()->change();
            $table->decimal('bing_nil', 8, 2)->nullable()->change();
            $table->decimal('waw_nil', 8, 2)->nullable()->change();
            $table->decimal('kes_tb', 8, 2)->nullable()->change();
            $table->decimal('minat_dominan', 8, 2)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('pendaftar_nilai', function (Blueprint $table) {
            $table->integer('psi_iq')->nullable()->change();
            $table->integer('psi_bobot')->nullable()->change();
            $table->integer('bing_nil')->nullable()->change();
            $table->integer('waw_nil')->nullable()->change();
            $table->integer('kes_tb')->nullable()->change();
            $table->integer('minat_dominan')->nullable()->change();
        });
    }
};
