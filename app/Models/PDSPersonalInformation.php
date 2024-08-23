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
        'address_id',
        'telephone',
        'mobile',
    ];

}
