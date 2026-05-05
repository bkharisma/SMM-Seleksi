<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('peserta', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('nup', 16)->unique();
            $table->string('noujian', 16)->nullable();
            $table->foreignId('ruang_id')->nullable()->constrained('ruang')->nullOnDelete();
            $table->integer('ruang_kelompok')->nullable();
            $table->date('tgldaftar')->nullable();
            $table->string('nama', 128);
            $table->string('foto', 128)->nullable();
            $table->string('nik', 16)->nullable();
            $table->string('tempatlahir', 64)->nullable();
            $table->date('tgllahir')->nullable();
            $table->string('goldarah', 5)->nullable();
            $table->char('sex', 1)->nullable();
            $table->string('agama', 64)->nullable();
            $table->string('email', 128)->nullable();
            $table->string('hp', 16)->nullable();
            $table->string('kode_prop', 2)->nullable();
            $table->string('kode_kab', 4)->nullable();
            $table->string('propinsi', 64)->nullable();
            $table->string('kabupaten', 64)->nullable();
            $table->string('kecamatan', 64)->nullable();
            $table->string('alamat', 128)->nullable();
            $table->string('kodepos', 8)->nullable();
            $table->char('kwng', 3)->default('WNI');
            $table->foreignId('pil1')->nullable()->constrained('prodi')->nullOnDelete();
            $table->foreignId('pil2')->nullable()->constrained('prodi')->nullOnDelete();
            $table->foreignId('pil3')->nullable()->constrained('prodi')->nullOnDelete();
            $table->foreignId('pil4')->nullable()->constrained('prodi')->nullOnDelete();
            $table->foreignId('taustp')->nullable()->constrained('survey')->nullOnDelete();
            $table->boolean('bersedia')->nullable();
            $table->boolean('bersedia_data')->nullable();
            $table->foreignId('lulus')->nullable()->constrained('prodi')->nullOnDelete();
            $table->json('param_lulus')->nullable();
            $table->string('lulus_tahap', 16)->nullable();
            $table->boolean('status')->default(true);
            $table->integer('nil_psikotes')->nullable();
            $table->integer('nil_bhsinggris')->nullable();
            $table->integer('nil_wawancara')->nullable();
            $table->integer('nil_kesehatan')->nullable();
            $table->string('nm_ayah', 64)->nullable();
            $table->string('nm_ibu', 64)->nullable();
            $table->string('pek_ayah', 64)->nullable();
            $table->string('pek_ibu', 64)->nullable();
            $table->string('telp_ortu', 64)->nullable();
            $table->string('hp_ortu', 64)->nullable();
            $table->string('email_ortu', 64)->nullable();
            $table->string('jenis_sma', 8)->nullable();
            $table->string('kota_sekolah', 64)->nullable();
            $table->string('prop_sekolah', 64)->nullable();
            $table->string('thn_sttb', 4)->nullable();
            $table->string('nama_sekolah', 64)->nullable();
            $table->string('presor_tkt', 32)->nullable();
            $table->boolean('presor_juara')->nullable();
            $table->string('presor', 64)->nullable();
            $table->string('preskes_tkt', 32)->nullable();
            $table->boolean('preskes_juara')->nullable();
            $table->string('preskes', 64)->nullable();
            $table->string('prespen_tkt', 32)->nullable();
            $table->boolean('prespen_juara')->nullable();
            $table->string('prespen', 64)->nullable();
            $table->string('tgl_cek_lulus', 100)->nullable();
            $table->string('tgl_cek_kali', 100)->nullable();
            $table->timestamps();

            $table->foreign('kode_prop')->references('kode_prop')->on('provinsi')->nullOnDelete();
            $table->foreign('kode_kab')->references('kode_kab')->on('kabupaten')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('peserta');
    }
};
