<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalnSpouse extends Model
{
    use HasFactory;

    protected $table = 'saln_spouses';

    protected $fillable = [
        'saln_id',
        'family_name',
        'first_name',
        'middle_name',
        'position',
        'office',
        'office_address',
        'government_id',
        'government_id_no',
        'date_issued',
    ];
}
