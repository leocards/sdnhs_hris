<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PDSCivilServiceEligibility extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'career_service',
        'rating',
        'examination',
        'place_examination',
        'license_number',
        'license_date_validity',
    ];

}
