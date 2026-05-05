<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('data_absensi', function (Blueprint $table) {
            $table->id();
            $table->string('jenis', 16)->nullable();
            $table->integer('kelompok')->nullable();
            $table->date('tanggal')->nullable();
            $table->string('waktu', 16)->nullable();
            $table->foreignId('ruang_id')->nullable()->constrained('ruang')->nullOnDelete();
            $table->string('nomor_awal', 16)->nullable();
            $table->string('nomor_akhir', 16)->nullable();
            $table->boolean('upd_data')->default(false);
            $table->timestamps();
        });

        Schema::create('absensi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('data_absensi_id')->nullable()->constrained('data_absensi')->nullOnDelete();
            $table->foreignId('peserta_id')->nullable()->constrained('peserta')->nullOnDelete();
            $table->foreignId('ruang_id')->nullable()->constrained('ruang')->nullOnDelete();
            $table->boolean('hadir')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('absensi');
        Schema::dropIfExists('data_absensi');
    }
};
