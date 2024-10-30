<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalnChildren extends Model
{
    use HasFactory;

    protected $table = 'saln_childrens';

    protected $fillable = [
        'saln_id',
        'name',
        'date_of_birth',
        'age',
    ];
}
