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
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('bsi_pembayaran');
        Schema::dropIfExists('mnoujian');
        Schema::dropIfExists('peserta');
        Schema::dropIfExists('peminat');
        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('survey', function (Blueprint $table) {
            $table->id();
            $table->string('keterangan')->nullable();
            $table->timestamps();
        });

        Schema::create('peminat', function (Blueprint $table) {
            $table->id();
            $table->string('nup', 50)->unique();
            $table->string('spmb', 20);
            $table->string('nama', 200);
            $table->string('pwd')->nullable();
            $table->string('email', 150)->nullable();
            $table->string('hp', 20)->nullable();
            $table->date('tgldaftar');
            $table->date('tgllahir')->nullable();
            $table->string('kwng', 100)->nullable();
            $table->foreignId('pil1')->nullable()->constrained('prodi')->nullOnDelete();
            $table->foreignId('pil2')->nullable()->constrained('prodi')->nullOnDelete();
            $table->foreignId('pil3')->nullable()->constrained('prodi')->nullOnDelete();
            $table->foreignId('pil4')->nullable()->constrained('prodi')->nullOnDelete();
            $table->foreignId('taustp')->nullable()->constrained('survey')->nullOnDelete();
            $table->string('nama_sekolah')->nullable();
            $table->timestamps();
        });

        Schema::create('peserta', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('nup', 50)->unique();
            $table->string('noujian', 20)->unique()->nullable();
            $table->foreignId('ruang_id')->nullable()->constrained('ruang')->nullOnDelete();
            $table->string('ruang_kelompok')->nullable();
            $table->string('nama', 200);
            $table->date('tgllahir')->nullable();
            $table->string('tempat_lahir')->nullable();
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
            $table->foreignId('pil1')->nullable()->constrained('prodi')->nullOnDelete();
            $table->foreignId('pil2')->nullable()->constrained('prodi')->nullOnDelete();
            $table->foreignId('pil3')->nullable()->constrained('prodi')->nullOnDelete();
            $table->foreignId('pil4')->nullable()->constrained('prodi')->nullOnDelete();
            $table->foreignId('lulus')->nullable()->constrained('prodi')->nullOnDelete();
            $table->json('param_lulus')->nullable();
            $table->foreignId('lulus_tahap')->nullable()->constrained('tahap_seleksi')->nullOnDelete();
            $table->float('nil_psikotes')->nullable();
            $table->float('nil_bhsinggris')->nullable();
            $table->float('nil_wawancara')->nullable();
            $table->float('nil_kesehatan')->nullable();
            $table->string('prestasi', 500)->nullable();
            $table->string('foto')->nullable();
            $table->timestamps();
        });

        Schema::create('mnoujian', function (Blueprint $table) {
            $table->string('noujian')->primary();
            $table->string('nup')->unique();
        });

        Schema::create('bsi_pembayaran', function (Blueprint $table) {
            $table->string('trx_id')->primary();
            $table->foreignId('peminat_id')->constrained('peminat')->onDelete('cascade');
            $table->decimal('trx_amount', 15, 2);
            $table->string('virtual_account', 50);
            $table->text('description')->nullable();
            $table->timestamp('datetime_expired')->nullable();
            $table->decimal('payment_amount', 15, 2)->nullable();
            $table->timestamp('datetime_payment')->nullable();
            $table->timestamps();
        });
    }
};
