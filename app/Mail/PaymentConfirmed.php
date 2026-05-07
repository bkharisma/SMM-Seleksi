<?php

namespace App\Mail;

use App\Models\Pendaftar;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PaymentConfirmed extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Pendaftar $peserta
    ) {}

    public function build(): static
    {
        return $this->subject('Pembayaran Terkonfirmasi - SMMPTP Poltekpar Palembang')
            ->markdown('emails.payment-confirmed');
    }
}
