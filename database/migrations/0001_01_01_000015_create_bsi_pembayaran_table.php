<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bsi_pembayaran', function (Blueprint $table) {
            $table->unsignedBigInteger('trx_id')->primary();
            $table->foreignId('peminat_id')->constrained('peminat')->cascadeOnDelete();
            $table->unsignedBigInteger('trx_amount');
            $table->unsignedBigInteger('virtual_account');
            $table->string('description', 255);
            $table->dateTime('datetime_expired');
            $table->unsignedBigInteger('payment_amount')->nullable();
            $table->unsignedBigInteger('cumulative_payment_amount')->nullable();
            $table->dateTime('datetime_payment')->nullable();
            $table->timestamp('datetime_payment_iso8601')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bsi_pembayaran');
    }
};
