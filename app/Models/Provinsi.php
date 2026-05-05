<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Provinsi extends Model
{
    use HasFactory;

    protected $table = 'provinsi';

    protected $primaryKey = 'kode_prop';

    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = ['kode_prop', 'nama_prop', 'kode_pulau', 'map_lat', 'map_lng'];

    public function kabupaten()
    {
        return $this->hasMany(Kabupaten::class, 'kode_prop', 'kode_prop');
    }

    public function peserta()
    {
        return $this->hasMany(Peserta::class, 'kode_prop', 'kode_prop');
    }
}
