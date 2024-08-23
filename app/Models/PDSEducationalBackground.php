<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PDSEducationalBackground extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'education_type',
        'school',
        'course',
        'from',
        'to',
        'highest_earned',
        'year_graduated',
        'honors',
    ];

}
