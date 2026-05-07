<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Pendaftar;
use App\Models\Prodi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'total_pendaftar' => Pendaftar::count(),
            'total_pengunjung' => 0,
            'total_lulus' => Pendaftar::whereNotNull('lulus')->count(),
            'total_belum_lulus' => Pendaftar::whereNull('lulus')->count(),
            'total_dengan_noujian' => Pendaftar::whereNotNull('noujian')->count(),
            'total_tanpa_noujian' => Pendaftar::whereNull('noujian')->count(),
        ];

        $prodiDistribution = Prodi::active()
            ->withCount(['pendaftarPil1'])
            ->get()
            ->map(function ($prodi) {
                return [
                    'name' => $prodi->singkatan_prodi ?? $prodi->nama_prodi,
                    'value' => $prodi->pendaftar_pil1_count,
                ];
            });

        $monthlyRegistration = Pendaftar::select(
            DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"),
            DB::raw('COUNT(*) as count')
        )
            ->whereNotNull('created_at')
            ->groupBy('month')
            ->orderBy('month')
            ->limit(12)
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $item->month,
                    'count' => $item->count,
                ];
            });

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'prodi_distribution' => $prodiDistribution,
            'monthly_registration' => $monthlyRegistration,
        ]);
    }

    public function chartData(string $jenis)
    {
        return match ($jenis) {
            'prodi' => Prodi::active()
                ->withCount(['pendaftarPil1'])
                ->get()
                ->map(function ($prodi) {
                    return [
                        'name' => $prodi->singkatan_prodi ?? $prodi->nama_prodi,
                        'value' => $prodi->pendaftar_pil1_count,
                    ];
                }),
            'monthly' => Pendaftar::select(
                DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"),
                DB::raw('COUNT(*) as count')
            )
                ->whereNotNull('created_at')
                ->groupBy('month')
                ->orderBy('month')
                ->limit(12)
                ->get()
                ->map(function ($item) {
                    return [
                        'month' => $item->month,
                        'count' => $item->count,
                    ];
                }),
            default => response()->json(['error' => 'Invalid chart type'], 400),
        };
    }

    public function getNotifications(Request $request)
    {
        $user = $request->user();
        $limit = $request->query('limit', 10);

        $notifications = Notification::where('user_id', $user->id)
            ->latest()
            ->limit($limit)
            ->get();

        $unreadCount = Notification::where('user_id', $user->id)
            ->where('status', 'unread')
            ->count();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
        ]);
    }

    public function markNotificationRead(Request $request, int $id)
    {
        $user = $request->user();

        $notification = Notification::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if ($notification) {
            $notification->markAsRead();

            return response()->json(['success' => true]);
        }

        return response()->json(['error' => 'Notification not found'], 404);
    }
}
