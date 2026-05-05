<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BsiPembayaran;
use App\Models\Counter;
use App\Models\Peminat;
use App\Models\Peserta;
use App\Models\Prodi;
use App\Models\Survey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'total_peminat' => Peminat::count(),
            'total_peserta' => Peserta::count(),
            'total_pembayaran' => BsiPembayaran::whereNotNull('payment_amount')->count(),
            'total_pengunjung' => Counter::getCounter('visitors'),
            'total_lulus' => Peserta::whereNotNull('lulus')->count(),
            'total_belum_lulus' => Peserta::whereNull('lulus')->count(),
        ];

        $prodiDistribution = Prodi::active()
            ->withCount(['pesertaPil1'])
            ->get()
            ->map(function ($prodi) {
                return [
                    'name' => $prodi->singkatan_prodi ?? $prodi->nama_prodi,
                    'value' => $prodi->peserta_pil1_count,
                ];
            });

        $surveyData = Survey::withCount(['peminat'])
            ->orderByDesc('peminat_count')
            ->get()
            ->map(function ($survey) {
                return [
                    'name' => $survey->keterangan,
                    'value' => $survey->peminat_count,
                ];
            });

        $monthlyRegistration = Peminat::select(
            DB::raw('DATE_FORMAT(tgldaftar, "%Y-%m") as month'),
            DB::raw('COUNT(*) as count')
        )
            ->whereNotNull('tgldaftar')
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
            'survey_data' => $surveyData,
            'monthly_registration' => $monthlyRegistration,
        ]);
    }

    public function chartData(string $jenis)
    {
        return match ($jenis) {
            'prodi' => Prodi::active()
                ->withCount(['pesertaPil1'])
                ->get()
                ->map(function ($prodi) {
                    return [
                        'name' => $prodi->singkatan_prodi ?? $prodi->nama_prodi,
                        'value' => $prodi->peserta_pil1_count,
                    ];
                }),
            'survey' => Survey::withCount(['peminat'])
                ->orderByDesc('peminat_count')
                ->get()
                ->map(function ($survey) {
                    return [
                        'name' => $survey->keterangan,
                        'value' => $survey->peminat_count,
                    ];
                }),
            'monthly' => Peminat::select(
                DB::raw('DATE_FORMAT(tgldaftar, "%Y-%m") as month'),
                DB::raw('COUNT(*) as count')
            )
                ->whereNotNull('tgldaftar')
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
