<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PDSWorkExperience extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'from',
        'to',
        'position_title',
        'company',
        'monthly_salary',
        'salary_grade',
        'status',
        'is_government_service',
    ];

}
