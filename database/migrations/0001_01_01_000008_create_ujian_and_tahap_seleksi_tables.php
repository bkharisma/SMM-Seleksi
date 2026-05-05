<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ujian', function (Blueprint $table) {
            $table->id();
            $table->string('nama', 64);
            $table->string('kode', 32)->unique();
            $table->text('deskripsi')->nullable();
            $table->json('fields_config')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        Schema::create('tahap_seleksi', function (Blueprint $table) {
            $table->id();
            $table->string('nama', 64);
            $table->integer('urutan')->default(1);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tahap_seleksi');
        Schema::dropIfExists('ujian');
    }
};
