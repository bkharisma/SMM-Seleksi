<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('raport', function (Blueprint $table) {
            $table->id();
            $table->string('noujian', 20);
            $table->string('npsn', 20);
            $table->string('akreditasi', 2)->nullable();
            $table->string('ahuruf', 2)->nullable();
            $table->float('anilai')->nullable();
            $table->float('x_1peng')->nullable();
            $table->float('x_1ket')->nullable();
            $table->float('x_2peng')->nullable();
            $table->float('x_2ket')->nullable();
            $table->float('xi_1peng')->nullable();
            $table->float('xi_1ket')->nullable();
            $table->float('xi_2peng')->nullable();
            $table->float('xi_2ket')->nullable();
            $table->float('xii_1peng')->nullable();
            $table->float('xii_1ket')->nullable();
            $table->float('xii_2peng')->nullable();
            $table->float('xii_2ket')->nullable();
            $table->string('status', 50)->default('Belum Diperiksa');
            $table->text('catatan')->nullable();
            $table->timestamps();

            $table->index('noujian');
        });

        Schema::create('kesehatan', function (Blueprint $table) {
            $table->id();
            $table->string('noujian', 20);
            $table->string('namalbg', 100)->nullable();
            $table->string('lokasi', 100)->nullable();
            $table->float('tb')->nullable();
            $table->float('bb')->nullable();
            $table->float('ow')->nullable();
            $table->integer('obesitas')->nullable();
            $table->string('tensi', 20)->nullable();
            $table->string('nadi', 20)->nullable();
            $table->string('tato', 20)->nullable();
            $table->integer('tindik')->nullable();
            $table->string('bw', 50)->nullable();
            $table->integer('strab')->nullable();
            $table->string('pupil', 50)->nullable();
            $table->string('paru', 50)->nullable();
            $table->string('sco', 50)->nullable();
            $table->integer('mop')->nullable();
            $table->integer('amp')->nullable();
            $table->integer('thc')->nullable();
            $table->integer('kehamilan')->nullable();
            $table->string('status', 20)->default('Belum Diperiksa');
            $table->string('catatan', 100)->nullable();
            $table->timestamps();

            $table->index('noujian');
        });

        Schema::create('file_raport', function (Blueprint $table) {
            $table->id();
            $table->string('noujian', 20);
            $table->string('file_loc', 100);
            $table->timestamps();

            $table->index('noujian');
        });

        Schema::create('file_kesehatan', function (Blueprint $table) {
            $table->id();
            $table->string('noujian', 20);
            $table->string('file_lockes', 100);
            $table->timestamps();

            $table->index('noujian');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('file_kesehatan');
        Schema::dropIfExists('file_raport');
        Schema::dropIfExists('kesehatan');
        Schema::dropIfExists('raport');
    }
};
