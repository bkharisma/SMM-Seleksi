<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TahapSeleksi extends Model
{
    use HasFactory;

    protected $table = 'tahap_seleksi';

    protected $fillable = ['nama', 'urutan', 'active'];

    protected $casts = ['active' => 'boolean'];

    public function kriteriaKelulusan()
    {
        return $this->hasMany(KriteriaKelulusan::class);
    }

    public function scopeActive($query)
    {
        return $query->where('active', true)->orderBy('urutan');
    }
}
