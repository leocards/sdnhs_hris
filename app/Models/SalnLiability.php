<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalnLiability extends Model
{
    use HasFactory;

    protected $table = 'saln_liabilities';

    protected $fillable = [
        'saln_id',
        'nature',
        'creditors',
        'balances',
    ];
}
