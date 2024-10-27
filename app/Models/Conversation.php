<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'message_id', 'message', 'sender', 'seen_at'
    ];

    public function messageSender()
    {
        return $this->belongsTo(User::class, 'sender', 'id')->select(['id', 'first_name', 'middle_name', 'last_name', 'avatar']);
    }
}
