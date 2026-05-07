<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pendaftar', function (Blueprint $table) {
            $table->id();
            $table->string('kode_pendaftar', 20)->unique()->comment('Kode pendaftar dari Excel');
            $table->string('noujian', 20)->unique()->nullable()->comment('Nomor ujian untuk login');
            $table->string('nama', 200);
            $table->date('tanggal_lahir');
            $table->string('email', 150)->nullable();
            $table->string('no_hp', 20)->nullable();

            $table->foreignId('pil1')->nullable()->constrained('prodi')->nullOnDelete();
            $table->foreignId('pil2')->nullable()->constrained('prodi')->nullOnDelete();
            $table->foreignId('pil3')->nullable()->constrained('prodi')->nullOnDelete();

            $table->foreignId('lulus')->nullable()->constrained('prodi')->nullOnDelete()->comment('Prodi kelulusan');
            $table->foreignId('lulus_tahap')->nullable()->constrained('tahap_seleksi')->nullOnDelete();
            $table->json('param_lulus')->nullable()->comment('Parameter kelulusan');

            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('ruang_id')->nullable()->constrained('ruang')->nullOnDelete();
            $table->string('ruang_kelompok', 50)->nullable();

            $table->date('tempat_lahir')->nullable();
            $table->string('jenis_kelamin', 10)->nullable();
            $table->text('alamat')->nullable();
            $table->string('agama', 50)->nullable();

            $table->string('nama_ayah', 200)->nullable();
            $table->string('nama_ibu', 200)->nullable();
            $table->string('hp_ayah', 20)->nullable();
            $table->string('hp_ibu', 20)->nullable();
            $table->string('pekerjaan_ayah', 100)->nullable();
            $table->string('pekerjaan_ibu', 100)->nullable();

            $table->string('nama_sekolah', 200)->nullable();
            $table->string('npsn', 20)->nullable();
            $table->string('akreditasi', 10)->nullable();
            $table->string('tahun_lulus', 10)->nullable();

            $table->string('prestasi', 500)->nullable();

            $table->float('nil_psikotes')->nullable();
            $table->float('nil_bhsinggris')->nullable();
            $table->float('nil_wawancara')->nullable();
            $table->float('nil_kesehatan')->nullable();

            $table->string('foto')->nullable()->comment('Path ke file foto');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pendaftar');
    }
};
