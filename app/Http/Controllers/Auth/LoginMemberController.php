<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Peserta;
use App\Models\User;
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

        $peserta = Peserta::where('nup', $credentials['nup'])->first();

        if (! $peserta) {
            return back()->withErrors([
                'nup' => 'NUP tidak ditemukan.',
            ])->onlyInput('nup');
        }

        $user = User::where('username', $credentials['nup'])->first();

        if (! $user) {
            return back()->withErrors([
                'nup' => 'Akun belum aktif. Silakan hubungi admin.',
            ])->onlyInput('nup');
        }

        if (! Hash::check($credentials['password'], $user->password)) {
            return back()->withErrors([
                'password' => 'Password salah.',
            ])->onlyInput('nup');
        }

        Auth::login($user, $request->boolean('remember'));
        $request->session()->regenerate();

        return redirect()->intended(route('member.dashboard'));
    }
}
