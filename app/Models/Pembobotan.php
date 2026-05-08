<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pembobotan extends Model
{
    protected $table = 'pembobotan';

    protected $fillable = ['tahap_seleksi_id', 'bobot_config'];

    protected $casts = [
        'bobot_config' => 'array',
    ];

    public function tahapSeleksi(): BelongsTo
    {
        return $this->belongsTo(TahapSeleksi::class);
    }
}
