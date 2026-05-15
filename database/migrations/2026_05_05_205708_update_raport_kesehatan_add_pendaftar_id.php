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
        Schema::table('raport', function (Blueprint $table) {
            $table->foreignId('pendaftar_id')->nullable()->after('id')->constrained('pendaftar')->onDelete('cascade');
        });

        Schema::table('file_raport', function (Blueprint $table) {
            $table->dropIndex(['noujian']);
            $table->dropColumn('noujian');
            $table->foreignId('pendaftar_id')->nullable()->after('id')->constrained('pendaftar')->onDelete('cascade');
        });

        Schema::table('kesehatan', function (Blueprint $table) {
            $table->foreignId('pendaftar_id')->nullable()->after('id')->constrained('pendaftar')->onDelete('cascade');
        });

        Schema::table('file_kesehatan', function (Blueprint $table) {
            $table->dropIndex(['noujian']);
            $table->dropColumn('noujian');
            $table->foreignId('pendaftar_id')->nullable()->after('id')->constrained('pendaftar')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('file_kesehatan', function (Blueprint $table) {
            $table->dropForeign(['pendaftar_id']);
            $table->dropColumn('pendaftar_id');
            $table->string('noujian', 20)->after('id');
            $table->index('noujian');
        });

        Schema::table('kesehatan', function (Blueprint $table) {
            $table->dropForeign(['pendaftar_id']);
            $table->dropColumn('pendaftar_id');
        });

        Schema::table('file_raport', function (Blueprint $table) {
            $table->dropForeign(['pendaftar_id']);
            $table->dropColumn('pendaftar_id');
            $table->string('noujian', 20)->after('id');
            $table->index('noujian');
        });

        Schema::table('raport', function (Blueprint $table) {
            $table->dropForeign(['pendaftar_id']);
            $table->dropColumn('pendaftar_id');
        });
    }
};
