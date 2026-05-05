<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'manage-users', 'manage-prodi', 'manage-periode', 'manage-ruang',
            'manage-jadwal', 'manage-ujian-types', 'manage-kriteria',
            'manage-news', 'view-peminat', 'view-peserta', 'edit-peserta',
            'manage-absensi', 'input-nilai', 'manage-seleksi',
            'manage-pembayaran', 'view-dashboard', 'export-data',
            'manage-settings', 'own-profile', 'upload-dokumen', 'cek-kelulusan',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $superadmin = Role::firstOrCreate(['name' => 'superadmin']);
        $superadmin->givePermissionTo(Permission::all());

        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->givePermissionTo([
            'manage-users', 'manage-prodi', 'manage-periode', 'manage-ruang',
            'manage-jadwal', 'manage-kriteria', 'manage-news', 'view-peminat',
            'view-peserta', 'edit-peserta', 'manage-absensi', 'input-nilai',
            'manage-seleksi', 'manage-pembayaran', 'view-dashboard', 'export-data',
            'own-profile',
        ]);

        $operator = Role::firstOrCreate(['name' => 'operator']);
        $operator->givePermissionTo([
            'manage-ruang', 'manage-jadwal', 'manage-kriteria', 'manage-news',
            'view-peminat', 'view-peserta', 'edit-peserta', 'manage-absensi',
            'input-nilai', 'view-dashboard', 'export-data', 'own-profile',
        ]);

        $mahasiswa = Role::firstOrCreate(['name' => 'mahasiswa']);
        $mahasiswa->givePermissionTo([
            'own-profile', 'upload-dokumen', 'cek-kelulusan',
        ]);
    }
}
