<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pendaftar', function (Blueprint $table) {
            $table->dropColumn(['nil_psikotes', 'nil_bhsinggris', 'nil_wawancara', 'nil_kesehatan']);
        });
    }

    public function down(): void
    {
        Schema::table('pendaftar', function (Blueprint $table) {
            $table->float('nil_psikotes')->nullable();
            $table->float('nil_bhsinggris')->nullable();
            $table->float('nil_wawancara')->nullable();
            $table->float('nil_kesehatan')->nullable();
        });
    }
};
