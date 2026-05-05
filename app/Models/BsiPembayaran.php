<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BsiPembayaran extends Model
{
    use HasFactory;

    protected $table = 'bsi_pembayaran';

    protected $primaryKey = 'trx_id';

    public $incrementing = false;

    protected $keyType = 'int';

    protected $fillable = [
        'trx_id', 'peminat_id', 'trx_amount', 'virtual_account',
        'description', 'datetime_expired', 'payment_amount',
        'cumulative_payment_amount', 'datetime_payment',
        'datetime_payment_iso8601',
    ];

    protected $casts = [
        'datetime_expired' => 'datetime',
        'datetime_payment' => 'datetime',
        'datetime_payment_iso8601' => 'datetime',
    ];

    public function peminat()
    {
        return $this->belongsTo(Peminat::class);
    }

    public function isPaid(): bool
    {
        return $this->payment_amount !== null;
    }

    public function isExpired(): bool
    {
        return $this->datetime_expired < now();
    }
}
