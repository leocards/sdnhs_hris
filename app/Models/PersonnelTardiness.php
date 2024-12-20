<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PersonnelTardiness extends Model
{
    use HasFactory;

    protected $fillable = [
        "user_id",
        "name",
        "present",
        "absent",
        "sy",
    ];

    public function users()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
