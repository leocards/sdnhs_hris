<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PDSLearningDevelopment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'from',
        'to',
        'num_hours',
        'type_of_ld',
        'conducted_by',
    ];

}
