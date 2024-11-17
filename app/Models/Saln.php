<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Saln extends Model
{
    use HasFactory;

    protected $fillable = [
        "user_id",
        "networth",
        "spouse",
        "joint",
        "year",
    ];

    public function user()
    {
        return $this->belongsTo(User::class)->with(['pdsPersonalInformation:tin']);
    }
}
