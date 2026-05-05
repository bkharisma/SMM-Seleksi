<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jadwal extends Model
{
    use HasFactory;

    protected $table = 'jadwal';

    protected $fillable = [
        'nama_jadwal', 'keterangan', 'tgl_awal', 'tgl_akhir',
        'jam_awal', 'jam_akhir', 'jenis', 'active',
    ];

    protected $casts = [
        'tgl_awal' => 'date',
        'tgl_akhir' => 'date',
        'active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }
}
