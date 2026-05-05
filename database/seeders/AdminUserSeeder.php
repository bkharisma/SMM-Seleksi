<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $superadmin = User::firstOrCreate(
            ['email' => 'admin@poltekparpalembang.ac.id'],
            [
                'name' => 'Super Administrator',
                'username' => 'admin',
                'password' => bcrypt('admin123'),
                'status' => 'active',
            ]
        );
        $superadmin->assignRole('superadmin');

        $admin = User::firstOrCreate(
            ['email' => 'ptp@poltekparpalembang.ac.id'],
            [
                'name' => 'Admin PTP',
                'username' => 'adminptp',
                'password' => bcrypt('adminptp123'),
                'status' => 'active',
            ]
        );
        $admin->assignRole('admin');

        $operator = User::firstOrCreate(
            ['email' => 'operator@poltekparpalembang.ac.id'],
            [
                'name' => 'Operator PTP',
                'username' => 'operator',
                'password' => bcrypt('operator123'),
                'status' => 'active',
            ]
        );
        $operator->assignRole('operator');
    }
}
