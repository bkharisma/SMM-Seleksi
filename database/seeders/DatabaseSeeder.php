<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
            SetupSeeder::class,
            ProvinsiKabupatenSeeder::class,
            EducationLevelSeeder::class,
            SurveySeeder::class,
            ProdiSeeder::class,
            JalurPendaftaranSeeder::class,
            UjianTypeSeeder::class,
            TahapSeleksiSeeder::class,
            AdminUserSeeder::class,
        ]);
    }
}
