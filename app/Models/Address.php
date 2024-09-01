<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'address_type',
        'same',
        'house_no',
        'street',
        'subdivision',
        'barangay',
        'municipality',
        'province',
        'zip_code',
    ];

}
