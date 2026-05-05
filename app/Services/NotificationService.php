<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Collection;

class NotificationService
{
    public function createNotification(int $userId, string $subject, string $description, ?string $type = null, ?int $refId = null): Notification
    {
        return Notification::create([
            'user_id' => $userId,
            'type' => $type,
            'subject' => $subject,
            'description' => $description,
            'status' => 'unread',
            'ref_id' => $refId,
        ]);
    }

    public function notifyAllAdmins(string $subject, string $description, ?string $type = null, ?int $refId = null): void
    {
        $admins = User::role(['superadmin', 'admin'])->get();

        foreach ($admins as $admin) {
            $this->createNotification($admin->id, $subject, $description, $type, $refId);
        }
    }

    public function getUserNotifications(int $userId, ?string $status = null, int $limit = 20): Collection
    {
        $query = Notification::where('user_id', $userId)
            ->latest();

        if ($status) {
            $query->where('status', $status);
        }

        return $query->limit($limit)->get();
    }

    public function getUnreadCount(int $userId): int
    {
        return Notification::where('user_id', $userId)
            ->where('status', 'unread')
            ->count();
    }

    public function markAsRead(int $notificationId, int $userId): bool
    {
        $notification = Notification::where('id', $notificationId)
            ->where('user_id', $userId)
            ->first();

        if ($notification) {
            $notification->markAsRead();

            return true;
        }

        return false;
    }

    public function markAllAsRead(int $userId): int
    {
        return Notification::where('user_id', $userId)
            ->where('status', 'unread')
            ->update(['status' => 'read']);
    }

    public function notifyOnRegistration(string $nup, string $nama): void
    {
        $this->notifyAllAdmins(
            'Pendaftaran Baru',
            "Peminat baru terdaftar: {$nama} (NUP: {$nup})",
            'registration'
        );
    }

    public function notifyOnPayment(string $nup, string $nama, string $vaNumber): void
    {
        $this->notifyAllAdmins(
            'Pembayaran Diterima',
            "Pembayaran dari {$nama} (NUP: {$nup}, VA: {$vaNumber}) telah dikonfirmasi.",
            'payment'
        );
    }

    public function notifyOnSelection(string $tahap, string $prodi, int $count): void
    {
        $this->notifyAllAdmins(
            'Seleksi Selesai',
            "Seleksi tahap {$tahap} untuk prodi {$prodi} selesai. {$count} peserta dinyatakan lulus.",
            'selection'
        );
    }
}
