<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PDSFamilyBackground extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'family_type',
        'surname',
        'first_name',
        'middle_name',
        'full_name',
        'birthdate',
        'extension_name',
        'occupation',
        'business_name',
        'business_address',
        'telephone',
    ];

}
