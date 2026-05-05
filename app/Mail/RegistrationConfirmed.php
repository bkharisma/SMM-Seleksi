<?php

namespace App\Mail;

use App\Models\Peminat;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RegistrationConfirmed extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Peminat $peminat,
        public string $password,
        public array $vaData
    ) {}

    public function build(): static
    {
        return $this->subject('Konfirmasi Pendaftaran SMMPTP Poltekpar Palembang')
            ->markdown('emails.registration-confirmed');
    }
}
