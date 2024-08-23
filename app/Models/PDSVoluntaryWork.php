<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PDSVoluntaryWork extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'organization',
        'from',
        'to',
        'num_hours',
        'position',
    ];

}
