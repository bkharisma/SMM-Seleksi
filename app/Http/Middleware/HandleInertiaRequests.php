<?php

namespace App\Http\Middleware;

use App\Models\Setup;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $logoPath = \App\Models\Setup::get('logo_path');
        $logoUrl = $logoPath ? asset('storage/' . $logoPath) : null;

        $faviconPath = \App\Models\Setup::get('favicon_path');
        $faviconUrl = $faviconPath ? asset('storage/' . $faviconPath) : null;

        $customRegistrationEnabled = \App\Models\Setup::get('custom_registration_enabled', 0);
        $customRegistrationUrl = \App\Models\Setup::get('custom_registration_url', '');

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'roles' => $request->user()->roles->pluck('name')->values()->toArray(),
                    'foto' => $request->user()->foto,
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'app' => [
                'name' => config('app.name'),
                'logo_url' => $logoUrl,
                'favicon_url' => $faviconUrl,
                'custom_registration_enabled' => $customRegistrationEnabled,
                'custom_registration_url' => $customRegistrationUrl,
            ],
        ];
    }
}
