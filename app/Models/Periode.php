<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Periode extends Model
{
    use HasFactory;

    protected $table = 'periode';

    protected $fillable = ['spmb', 'tgl_awal', 'tgl_akhir', 'active'];

    protected $casts = [
        'tgl_awal' => 'date',
        'tgl_akhir' => 'date',
        'active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    public function scopeCurrent($query)
    {
        return $query->where('active', true)
            ->where('tgl_awal', '<=', now())
            ->where('tgl_akhir', '>=', now());
    }
}
