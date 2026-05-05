<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mnoujian extends Model
{
    use HasFactory;

    protected $table = 'mnoujian';

    protected $primaryKey = 'noujian';

    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = ['noujian', 'nup'];
}
