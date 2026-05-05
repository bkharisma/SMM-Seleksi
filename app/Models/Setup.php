<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setup extends Model
{
    use HasFactory;

    protected $table = 'setup';

    protected $primaryKey = 'code';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['code', 'int_val', 'char_val'];

    public static function get(string $key, $default = null)
    {
        $setup = static::find($key);

        return $setup ? ($setup->char_val ?? $setup->int_val) : $default;
    }

    public static function set(string $key, $value): void
    {
        $asInt = is_numeric($value)
            && (int) $value <= 2147483647
            && (string) ((int) $value) === (string) $value;

        static::updateOrCreate(
            ['code' => $key],
            $asInt ? ['int_val' => (int) $value] : ['char_val' => (string) $value]
        );
    }
}
