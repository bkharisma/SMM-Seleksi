<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prodi', function (Blueprint $table) {
            $table->id();
            $table->string('kode_prodi', 16);
            $table->string('nama_prodi', 128);
            $table->string('singkatan_prodi', 16)->nullable();
            $table->string('jenjang_prodi', 8);
            $table->integer('kapasitas')->nullable();
            $table->integer('kuota_smm')->default(0);
            $table->text('deskripsi')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prodi');
    }
};
