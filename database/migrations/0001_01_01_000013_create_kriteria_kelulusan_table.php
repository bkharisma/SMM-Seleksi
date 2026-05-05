<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kriteria_kelulusan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prodi_id')->constrained('prodi')->cascadeOnDelete();
            $table->foreignId('tahap_seleksi_id')->constrained('tahap_seleksi')->cascadeOnDelete();
            $table->integer('min_iq')->nullable();
            $table->integer('bobot_iq')->nullable();
            $table->integer('min_english')->nullable();
            $table->integer('min_wawancara')->nullable();
            $table->integer('min_tb')->nullable();
            $table->integer('max_tb')->nullable();
            $table->integer('max_bw')->nullable();
            $table->float('max_obe')->nullable();
            $table->boolean('allow_nark')->default(false);
            $table->boolean('allow_hml')->default(false);
            $table->boolean('allow_tato')->default(false);
            $table->boolean('allow_tindik')->default(false);
            $table->boolean('allow_paru')->default(false);
            $table->boolean('allow_strab')->default(false);
            $table->boolean('allow_scol')->default(false);
            $table->string('ordering', 8)->default('ASC');
            $table->integer('filter_pilihan')->default(1);
            $table->boolean('active')->default(true);
            $table->timestamps();

            $table->unique(['prodi_id', 'tahap_seleksi_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kriteria_kelulusan');
    }
};
