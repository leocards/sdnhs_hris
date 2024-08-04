<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'middle_name',
        'sex',
        'date_of_birth',
        'address',
        'email',
        'phone_number',
        'personnel_id',
        'department',
        'role',
        'position',
        'date_hired',
        'leave_credits',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the role of a user
     * 
     * @param string $role
     * @return Boolean
     */

    public function hasRole($role)
    {
        return $this->role == $role;
    }

    /**
     * Get the full name (first name and last name) of a user
     */
    public function name()
    {
        return $this->first_name. ' ' .$this->last_name;
    }

    public function scopeSearchByFullName($query, $name)
    {
        return $query->where(DB::raw("CONCAT(first_name, ' ', last_name)"), 'LIKE', "%{$name}%");
    }
}
