<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prodi extends Model
{
    use HasFactory;

    protected $table = 'prodi';

    protected $fillable = [
        'kode_prodi', 'nama_prodi', 'singkatan_prodi', 'jenjang_prodi',
        'kapasitas', 'kuota_smm', 'deskripsi', 'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    public function pendaftarPil1()
    {
        return $this->hasMany(Pendaftar::class, 'pil1');
    }

    public function pendaftarPil2()
    {
        return $this->hasMany(Pendaftar::class, 'pil2');
    }

    public function pendaftarPil3()
    {
        return $this->hasMany(Pendaftar::class, 'pil3');
    }

    public function pendaftarLulus()
    {
        return $this->hasMany(Pendaftar::class, 'lulus');
    }

    public function pesertaPil1()
    {
        return $this->hasMany(Peserta::class, 'pil1');
    }

    public function pesertaLulus()
    {
        return $this->hasMany(Peserta::class, 'lulus');
    }

    public function peminatPil1()
    {
        return $this->hasMany(Peminat::class, 'pil1');
    }

    public function kriteriaKelulusan()
    {
        return $this->hasMany(KriteriaKelulusan::class);
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }
}
