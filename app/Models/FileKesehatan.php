<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FileKesehatan extends Model
{
    use HasFactory;

    protected $table = 'file_kesehatan';

    protected $fillable = ['pendaftar_id', 'file_lockes'];

    public function pendaftar()
    {
        return $this->belongsTo(Pendaftar::class);
    }
}
