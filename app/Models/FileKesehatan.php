<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FileKesehatan extends Model
{
    use HasFactory;

    protected $table = 'file_kesehatan';

    protected $fillable = ['pendaftar_id', 'file_lockes', 'is_revisi', 'revisi_dari_id'];

    protected $casts = [
        'is_revisi' => 'boolean',
    ];

    public function pendaftar()
    {
        return $this->belongsTo(Pendaftar::class);
    }

    public function revisiDari()
    {
        return $this->belongsTo(FileKesehatan::class, 'revisi_dari_id');
    }
}
