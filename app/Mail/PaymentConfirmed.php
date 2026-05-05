<?php

namespace App\Mail;

use App\Models\Peserta;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PaymentConfirmed extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Peserta $peserta
    ) {}

    public function build(): static
    {
        return $this->subject('Pembayaran Terkonfirmasi - SMMPTP Poltekpar Palembang')
            ->markdown('emails.payment-confirmed');
    }
}
