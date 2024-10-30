<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Leave extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'date_of_filing_from',
        'date_of_filing_to',
        'salary',
        'leave_type',
        'leave_type_others',
        'num_days_applied',
        'inclusive_date_from',
        'inclusive_date_to',
        'is_not_requested',
        'is_requested',
        'principal_status',
        'hr_status',
        'reject_msg',
        'leave_credits',
        'leave_rendered',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function details_of_leave()
    {
        return $this->hasOne(DetailsOfLeave::class);
    }

    public function details_of_action_leave()
    {
        return $this->hasOne(DetailsOfActionLeave::class);
    }

    public function medical_certificate()
    {
        return $this->hasOne(Medical::class)->whereNull("is_old_version");
    }

}
