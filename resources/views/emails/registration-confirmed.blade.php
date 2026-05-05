@component('mail::message')
# Konfirmasi Pendaftaran SMMPTP

Halo **{{ $peminat->nama }}**,

Terima kasih telah mendaftar di Seleksi Mandiri Masuk Politeknik Pariwisata Palembang.

## Data Pendaftaran Anda

| Item | Keterangan |
|------|-----------|
| **NUP** | {{ $peminat->nup }} |
| **Nama** | {{ $peminat->nama }} |
| **Email** | {{ $peminat->email }} |
| **Password** | {{ $password }} |

## Informasi Pembayaran

Silakan lakukan pembayaran melalui Virtual Account BSI:

| Item | Keterangan |
|------|-----------|
@isset($vaData['is_sandbox'])
@if($vaData['is_sandbox'])
| **VA Number (Sandbox)** | {{ $vaData['virtual_account'] }} |
@else
| **VA Number** | {{ $vaData['virtual_account'] }} |
@endif
@endisset
@empty($vaData['is_sandbox'])
| **VA Number** | {{ $vaData['virtual_account'] }} |
@endempty
| **Jumlah** | Rp {{ number_format($vaData['amount'], 0, ',', '.') }} |
| **Batas Bayar** | {{ $vaData['expired_at'] }} |

## Langkah Selanjutnya

1. Simpan NUP dan Password Anda untuk login
2. Lakukan pembayaran melalui VA BSI sebelum batas waktu
3. Setelah pembayaran dikonfirmasi, Anda akan menjadi peserta terdaftar
4. Login ke dashboard untuk melengkapi profil dan upload dokumen

@component('mail::button', ['url' => config('app.url') . '/login-member', 'color' => 'blue'])
Login Member
@endcomponent

Jika Anda memiliki pertanyaan, silakan hubungi kami.

Salam,<br>
**Panitia SMMPTP Poltekpar Palembang**
@endcomponent
