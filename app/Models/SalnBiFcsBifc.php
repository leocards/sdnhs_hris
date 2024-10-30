<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalnBiFcsBifc extends Model
{
    use HasFactory;

    protected $table = 'saln_bi_fcs_bifcs';

    protected $fillable = [
        'saln_bi_fc_id',
        'name',
        'address',
        'nature',
        'date',
    ];
}
