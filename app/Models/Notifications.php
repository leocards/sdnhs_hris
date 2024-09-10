<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Notifications extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'from_user_id',
        'message',
        'type',
        'go_to_link',
        'viewed',
    ];

    public function sender()
    {
        return $this->belongsTo(User::class, 'from_user_id', 'id')->select(['id', 'first_name', 'last_name', 'middle_name', 'avatar']);
    }

}
