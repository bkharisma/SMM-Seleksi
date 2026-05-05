<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('periode', function (Blueprint $table) {
            $table->id();
            $table->string('spmb', 8);
            $table->date('tgl_awal');
            $table->date('tgl_akhir');
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        Schema::create('ruang', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_ruang', 8);
            $table->string('nama_gedung', 128)->nullable();
            $table->integer('kapasitas')->nullable();
            $table->integer('urutan')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        Schema::create('jadwal', function (Blueprint $table) {
            $table->id();
            $table->string('nama_jadwal', 128);
            $table->string('keterangan', 64)->nullable();
            $table->date('tgl_awal')->nullable();
            $table->date('tgl_akhir')->nullable();
            $table->string('jam_awal', 16)->nullable();
            $table->string('jam_akhir', 16)->nullable();
            $table->string('jenis', 16)->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jadwal');
        Schema::dropIfExists('ruang');
        Schema::dropIfExists('periode');
    }
};
