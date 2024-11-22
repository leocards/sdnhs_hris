<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class SchoolYear extends Model
{
    protected $fillable = [
        'start',
        'end',
        'resumption',
    ];

    protected $appends = ['sy'];

    public function getSyAttribute()
    {
        $start = Carbon::parse($this->start)->format('Y');
        $end = Carbon::parse($this->end)->format('Y');

        return "$start-$end";
    }
}
