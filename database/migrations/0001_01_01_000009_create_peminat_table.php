<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('peminat', function (Blueprint $table) {
            $table->id();
            $table->string('nup', 16)->unique();
            $table->string('spmb', 8)->nullable();
            $table->string('nama', 128)->nullable();
            $table->string('pwd', 32)->nullable();
            $table->string('email', 128)->nullable();
            $table->string('hp', 16)->nullable();
            $table->date('tgldaftar')->nullable();
            $table->date('tgllahir')->nullable();
            $table->char('kwng', 3)->default('WNI');
            $table->foreignId('pil1')->nullable();
            $table->foreignId('pil2')->nullable();
            $table->foreignId('pil3')->nullable();
            $table->foreignId('pil4')->nullable();
            $table->foreignId('taustp')->nullable();
            $table->string('nama_sekolah', 100)->nullable();
            $table->timestamps();

            $table->foreign('pil1')->references('id')->on('prodi')->nullOnDelete();
            $table->foreign('pil2')->references('id')->on('prodi')->nullOnDelete();
            $table->foreign('pil3')->references('id')->on('prodi')->nullOnDelete();
            $table->foreign('pil4')->references('id')->on('prodi')->nullOnDelete();
            $table->foreign('taustp')->references('id')->on('survey')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('peminat');
    }
};
