<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, HasRoles, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'username',
        'password',
        'foto',
        'status',
        'ref_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function peserta()
    {
        return $this->hasOne(Peserta::class, 'user_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function createdNews()
    {
        return $this->hasMany(News::class, 'created_by');
    }

    public function isAdmin(): bool
    {
        return $this->hasRole(['superadmin', 'admin']);
    }

    public function isOperator(): bool
    {
        return $this->hasRole('operator');
    }

    public function isMahasiswa(): bool
    {
        return $this->hasRole('mahasiswa');
    }
}
