<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kriteria_ujian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kriteria_kelulusan_id')->constrained('kriteria_kelulusan')->cascadeOnDelete();
            $table->foreignId('ujian_id')->constrained('ujian');
            $table->enum('jenis', ['tes', 'berkas']);
            $table->decimal('nilai_standar', 9, 2)->nullable();
            $table->json('parameters')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kriteria_ujian');
    }
};
