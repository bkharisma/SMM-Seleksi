<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ujian extends Model
{
    use HasFactory;

    protected $table = 'ujian';

    protected $fillable = ['nama', 'kode', 'tahap_seleksi_id', 'deskripsi', 'fields_config', 'active'];

    protected $casts = [
        'active' => 'boolean',
        'fields_config' => 'array',
    ];

    public function pesertaNilai()
    {
        return $this->hasMany(PesertaNilai::class);
    }

    public function tahapSeleksi()
    {
        return $this->belongsTo(TahapSeleksi::class);
    }

    public function kriteriaUjian()
    {
        return $this->hasMany(KriteriaUjian::class);
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }
}
