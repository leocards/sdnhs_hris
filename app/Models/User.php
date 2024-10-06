<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

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
        'birth_place',
        'civil_status',
        'height',
        'weight',
        'address',
        'email',
        'phone_number',
        'personnel_id',
        'department',
        'role',
        'position',
        'date_hired',
        'leave_credits',
        'avatar',
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

    protected $appends = ['name', 'employee_list_name'];

    /**
     * Get the full name (first name and last name) of a user
     */
    public function name()
    {
        return $this->first_name. ' ' .$this->last_name;
    }

    public function completeName()
    {
        return $this->first_name. ' ' .($this->middle_name ? substr($this->middle_name, 0, 1).'. ' : ' ') . $this->last_name;
    }

    public function getNameAttribute()
    {
        return $this->first_name . ' ' . ($this->middle_name ? substr($this->middle_name, 0, 1) . '. ' : ' ') . $this->last_name;
    }

    public function employeeListName()
    {
        return Str::upper($this->last_name. ', '. $this->first_name. ' '. substr($this->middle_name, 0, 1).'. ');
    }

    protected function getEmployeeListNameAttribute()
    {
        return $this->employeeListName();
    }

    public function scopeSearchByFullName($query, $name)
    {
        return $query->where(DB::raw("LOWER(CONCAT(last_name, ', ', first_name, ' ', LEFT(middle_name, 1), '.'))"), 'LIKE', "%{$name}%");
    }

    public function scopeSearchByLastAndFirstName($query, $lname, $fname)
    {
        return $query->where(DB::raw("LOWER(last_name)"), 'LIKE', "%{$lname}%")
            ->where(DB::raw("LOWER(first_name)"), 'LIKE', "%{$fname}%");
    }

    public function getLeaveRendered()
    {
        return Leave::where('user_id', $this->id)->where('principal_status', 'Approved')->where('hr_status', 'Approved')->count();
    }

    public function certificates()
    {
        return $this->hasMany(ServiceRecord::class);
    }

    public function pdsPersonalInformation()
    {
        return $this->hasOne(PDSPersonalInformation::class);
    }

    public function pdsFamilyBackground()
    {
        return $this->hasMany(PDSFamilyBackground::class);
    }

    public function pdsEducationalBackground()
    {
        return $this->hasMany(PDSEducationalBackground::class);
    }

    public function pdsCivilServiceEligibility()
    {
        return $this->hasMany(PDSCivilServiceEligibility::class);
    }

    public function pdsWorkExperience()
    {
        return $this->hasMany(PDSWorkExperience::class);
    }

    public function pdsVoluntaryWork()
    {
        return $this->hasMany(PDSVoluntaryWork::class);
    }

    public function pdsLearningDevelopment()
    {
        return $this->hasMany(PDSLearningDevelopment::class);
    }

    public function pdsOtherInformation()
    {
        return $this->hasMany(PDSOtherInformation::class);
    }

    public function pdsCs4()
    {
        return $this->hasMany(PDSc4::class);
    }

    public function pdsReference()
    {
        return $this->hasMany(PDSReferences::class);
    }

    public function pdsGovernment()
    {
        return $this->hasOne(PDSGovernmentId::class);
    }
}
