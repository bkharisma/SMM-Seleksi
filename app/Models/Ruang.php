<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ruang extends Model
{
    use HasFactory;

    protected $table = 'ruang';

    protected $fillable = ['nomor_ruang', 'nama_gedung', 'kapasitas', 'urutan', 'active'];

    protected $casts = ['active' => 'boolean'];

    public function peserta()
    {
        return $this->hasMany(Peserta::class);
    }

    public function absensi()
    {
        return $this->hasMany(Absensi::class);
    }

    public function dataAbsensi()
    {
        return $this->hasMany(DataAbsensi::class);
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }
}
