<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JalurPendaftaran extends Model
{
    use HasFactory;

    protected $table = 'jalur_pendaftaran';

    protected $fillable = [
        'kode_jalur', 'nama_jalur', 'deskripsi', 'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    public function pendaftar()
    {
        return $this->hasMany(Pendaftar::class, 'jalur_id');
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }
}
