<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ServiceRecord extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'file_name',
        'venue',
        'organizer',
        'file_path',
        'date_from',
        'date_to',
        'credits',
        'approved'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
