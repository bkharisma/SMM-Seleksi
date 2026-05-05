<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mnoujian', function (Blueprint $table) {
            $table->string('noujian', 16)->primary();
            $table->string('nup', 16)->unique();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mnoujian');
    }
};
