<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PDSPersonalInformation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'blood_type',
        'gsis',
        'pag_ibig',
        'philhealth',
        'sss',
        'tin',
        'agency',
        'telephone',
        'mobile',
        'email',
        'citizenship',
        'dual_by',
        'citizenship_country',
        'is_approved'
    ];

    protected $appends = ['address'];

    public function getAddressAttribute()
    {
        return Address::where('pds_pi_id', $this->id)->get();
    }

    public function addresses()
    {
        return $this->hasMany(Address::class, 'pds_pi_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
