<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('kesehatan', function (Blueprint $table) {
            $table->json('param_kesehatan')->nullable()->after('sco');
        });
    }

    public function down(): void
    {
        Schema::table('kesehatan', function (Blueprint $table) {
            $table->dropColumn('param_kesehatan');
        });
    }
};
