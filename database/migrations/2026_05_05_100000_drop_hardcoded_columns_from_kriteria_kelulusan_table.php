<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('kriteria_kelulusan', function (Blueprint $table) {
            $table->dropColumn([
                'min_iq',
                'bobot_iq',
                'min_english',
                'min_wawancara',
                'min_tb',
                'max_tb',
                'max_bw',
                'max_obe',
                'allow_nark',
                'allow_hml',
                'allow_tato',
                'allow_tindik',
                'allow_paru',
                'allow_strab',
                'allow_scol',
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('kriteria_kelulusan', function (Blueprint $table) {
            $table->integer('min_iq')->nullable();
            $table->integer('bobot_iq')->nullable();
            $table->integer('min_english')->nullable();
            $table->integer('min_wawancara')->nullable();
            $table->integer('min_tb')->nullable();
            $table->integer('max_tb')->nullable();
            $table->integer('max_bw')->nullable();
            $table->float('max_obe')->nullable();
            $table->boolean('allow_nark')->default(false);
            $table->boolean('allow_hml')->default(false);
            $table->boolean('allow_tato')->default(false);
            $table->boolean('allow_tindik')->default(false);
            $table->boolean('allow_paru')->default(false);
            $table->boolean('allow_strab')->default(false);
            $table->boolean('allow_scol')->default(false);
        });
    }
};
