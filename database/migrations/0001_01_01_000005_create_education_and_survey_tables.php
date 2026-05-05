<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('education_level', function (Blueprint $table) {
            $table->string('code', 8)->primary();
            $table->string('description', 128)->nullable();
            $table->integer('orderby')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        Schema::create('survey', function (Blueprint $table) {
            $table->id();
            $table->string('keterangan', 128)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('survey');
        Schema::dropIfExists('education_level');
    }
};
