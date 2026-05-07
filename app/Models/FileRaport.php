<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FileRaport extends Model
{
    use HasFactory;

    protected $table = 'file_raport';

    protected $fillable = ['pendaftar_id', 'file_loc'];

    public function pendaftar()
    {
        return $this->belongsTo(Pendaftar::class);
    }
}
