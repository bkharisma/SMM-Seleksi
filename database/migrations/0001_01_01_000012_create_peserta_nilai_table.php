<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('peserta_nilai', function (Blueprint $table) {
            $table->id();
            $table->string('nup', 20)->nullable();
            $table->string('nus', 20)->nullable();
            $table->foreignId('ujian_id')->nullable()->constrained('ujian')->nullOnDelete();
            $table->integer('psi_iq')->nullable();
            $table->integer('psi_bobot')->nullable();
            $table->integer('bing_nil')->nullable();
            $table->integer('waw_nil')->nullable();
            $table->integer('kes_tb')->nullable();
            $table->boolean('kes_bw')->nullable();
            $table->float('kes_obe', 9, 2)->nullable();
            $table->boolean('kes_nark')->nullable();
            $table->boolean('kes_hml')->nullable();
            $table->boolean('kes_tato')->nullable();
            $table->boolean('kes_tindik')->nullable();
            $table->boolean('kes_paru')->nullable();
            $table->boolean('kes_stra')->nullable();
            $table->boolean('kes_scol')->nullable();
            $table->string('type', 20)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('peserta_nilai');
    }
};
