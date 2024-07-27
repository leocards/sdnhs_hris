<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailsOfLeave extends Model
{
    use HasFactory;

    protected $fillable = [
        'leave_id',
        'is_philippines',
        'is_philippines_input',
        'is_abroad',
        'is_abroad_input',
        'is_in_hospital',
        'is_in_hospital_input',
        'is_out_patient',
        'is_out_patient_input',
        'special_leave_women',
        'is_master_degree',
        'is_review',
        'is_monetization',
        'is_terminal_leave'
    ];
}
