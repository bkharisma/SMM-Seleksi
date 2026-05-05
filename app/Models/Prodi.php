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

    public function peminatPil1()
    {
        return $this->hasMany(Peminat::class, 'pil1');
    }

    public function pesertaPil1()
    {
        return $this->hasMany(Peserta::class, 'pil1');
    }

    public function pesertaLulus()
    {
        return $this->hasMany(Peserta::class, 'lulus');
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
