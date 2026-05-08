<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pembobotan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tahap_seleksi_id')->unique()->constrained('tahap_seleksi')->cascadeOnDelete();
            $table->json('bobot_config');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pembobotan');
    }
};
