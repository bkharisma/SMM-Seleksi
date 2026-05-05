<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('setup', function (Blueprint $table) {
            $table->string('code', 64)->primary();
            $table->integer('int_val')->nullable();
            $table->string('char_val', 512)->nullable();
            $table->timestamps();
        });

        Schema::create('counter', function (Blueprint $table) {
            $table->string('data', 20)->primary();
            $table->bigInteger('counter')->default(0);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('setup');
        Schema::dropIfExists('counter');
    }
};
