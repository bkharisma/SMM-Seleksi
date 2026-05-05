<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('provinsi', function (Blueprint $table) {
            $table->string('kode_prop', 2)->primary();
            $table->string('nama_prop', 128)->nullable();
            $table->string('kode_pulau', 8)->nullable();
            $table->float('map_lat', 10, 6)->nullable();
            $table->float('map_lng', 10, 6)->nullable();
        });

        Schema::create('kabupaten', function (Blueprint $table) {
            $table->string('kode_kab', 4)->primary();
            $table->string('kode_prop', 2)->nullable();
            $table->string('nama_kab', 128)->nullable();
            $table->foreign('kode_prop')->references('kode_prop')->on('provinsi')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kabupaten');
        Schema::dropIfExists('provinsi');
    }
};
