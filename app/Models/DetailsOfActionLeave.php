<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailsOfActionLeave extends Model
{
    use HasFactory;

    protected $fillable = [
        'leave_id',
        'as_of',
        'total_earned_vacation',
        'total_earned_sick',
        'less_application_vacation',
        'less_application_sick',
        'balanced_vacation',
        'balanced_sick',
        'is_for_approval',
        'is_for_disapproval',
        'is_for_disapproval_input',
        'approved_for_days_with_pay',
        'approved_for_days_with_out_pay',
        'approved_for_others',
        'disapproved'
    ];
}
