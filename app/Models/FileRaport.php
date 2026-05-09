<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FileRaport extends Model
{
    use HasFactory;

    protected $table = 'file_raport';

    protected $fillable = ['pendaftar_id', 'file_loc', 'is_revisi', 'revisi_dari_id'];

    protected $casts = [
        'is_revisi' => 'boolean',
    ];

    public function pendaftar()
    {
        return $this->belongsTo(Pendaftar::class);
    }

    public function revisiDari()
    {
        return $this->belongsTo(FileRaport::class, 'revisi_dari_id');
    }
}
