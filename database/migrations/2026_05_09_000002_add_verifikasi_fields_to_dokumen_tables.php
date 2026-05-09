<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('raport', function (Blueprint $table) {
            $table->timestamp('verifikasi_terakhir')->nullable()->after('catatan');
            $table->foreignId('diverifikasi_oleh_id')->nullable()->after('verifikasi_terakhir')->constrained('users')->nullOnDelete();
        });

        Schema::table('kesehatan', function (Blueprint $table) {
            $table->timestamp('verifikasi_terakhir')->nullable()->after('catatan');
            $table->foreignId('diverifikasi_oleh_id')->nullable()->after('verifikasi_terakhir')->constrained('users')->nullOnDelete();
        });

        Schema::table('file_raport', function (Blueprint $table) {
            $table->boolean('is_revisi')->default(false)->after('file_loc');
            $table->foreignId('revisi_dari_id')->nullable()->after('is_revisi')->constrained('file_raport')->nullOnDelete();
        });

        Schema::table('file_kesehatan', function (Blueprint $table) {
            $table->boolean('is_revisi')->default(false)->after('file_lockes');
            $table->foreignId('revisi_dari_id')->nullable()->after('is_revisi')->constrained('file_kesehatan')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('raport', function (Blueprint $table) {
            $table->dropForeign(['diverifikasi_oleh_id']);
            $table->dropColumn(['verifikasi_terakhir', 'diverifikasi_oleh_id']);
        });

        Schema::table('kesehatan', function (Blueprint $table) {
            $table->dropForeign(['diverifikasi_oleh_id']);
            $table->dropColumn(['verifikasi_terakhir', 'diverifikasi_oleh_id']);
        });

        Schema::table('file_raport', function (Blueprint $table) {
            $table->dropForeign(['revisi_dari_id']);
            $table->dropColumn(['is_revisi', 'revisi_dari_id']);
        });

        Schema::table('file_kesehatan', function (Blueprint $table) {
            $table->dropForeign(['revisi_dari_id']);
            $table->dropColumn(['is_revisi', 'revisi_dari_id']);
        });
    }
};
