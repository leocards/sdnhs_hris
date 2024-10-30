<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalnRelativesData extends Model
{
    use HasFactory;

    protected $table = 'saln_relatives_datas';

    protected $fillable = [
        'saln_relative_id',
        'name',
        'relationship',
        'position',
        'agency_address',
    ];

    
}
