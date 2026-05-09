<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('kesehatan', function (Blueprint $table) {
            $table->boolean('finalized')->default(false)->after('catatan');
            $table->timestamp('finalized_at')->nullable()->after('finalized');
        });
    }

    public function down(): void
    {
        Schema::table('kesehatan', function (Blueprint $table) {
            $table->dropColumn(['finalized', 'finalized_at']);
        });
    }
};
