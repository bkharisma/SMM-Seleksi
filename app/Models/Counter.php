<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Counter extends Model
{
    use HasFactory;

    protected $table = 'counter';

    protected $primaryKey = 'data';

    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = ['data', 'counter'];

    public static function incrementCounter(string $key = 'visitors'): int
    {
        $counter = static::firstOrCreate(['data' => $key], ['counter' => 0]);
        $counter->increment('counter');

        return $counter->counter;
    }

    public static function getCounter(string $key = 'visitors'): int
    {
        return static::where('data', $key)->value('counter') ?? 0;
    }
}
