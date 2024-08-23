<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PDSGovernmentId extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'government_id',
        'id_number',
        'issued',
    ];

}
