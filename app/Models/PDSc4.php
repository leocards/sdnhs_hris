<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PDSc4 extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'question',
        'sets',
        'choices',
        'details',
        'date_filed',
        'case_status',
    ];

}
