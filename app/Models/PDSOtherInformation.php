<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PDSOtherInformation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'info_type',
        'detail',
    ];

}