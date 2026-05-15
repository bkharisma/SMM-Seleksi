<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Pendaftar;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class LoginMemberController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/login-member');
    }

    public function store(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'nup' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $peserta = Pendaftar::where('kode_pendaftar', $credentials['nup'])->first();

        if (! $peserta || ! $peserta->user) {
            return back()->withErrors([
                'nup' => 'NUP atau password salah.',
            ])->onlyInput('nup');
        }

        $user = $peserta->user;

        if (! Hash::check($credentials['password'], $user->password)) {
            return back()->withErrors([
                'nup' => 'NUP atau password salah.',
            ])->onlyInput('nup');
        }

        Auth::login($user, $request->boolean('remember'));
        $request->session()->regenerate();

        return redirect()->intended(route('member.dashboard'));
    }
}
