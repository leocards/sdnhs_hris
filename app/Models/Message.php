<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'sender_id', 'receiver_id'
    ];

    public function messageWith($column)
    {
        return $this->belongsTo(User::class, $column, 'id')
            ->select(['id', 'first_name', 'last_name', 'middle_name', 'avatar']);
    }

    public function userSender()
    {
        return $this->belongsTo(User::class, 'sender_id', 'id')
            ->select(['id', 'first_name', 'last_name', 'middle_name', 'avatar']);
    }

    public function userReceiver()
    {
        return $this->belongsTo(User::class, 'receiver_id', 'id')
            ->select(['id', 'first_name', 'last_name', 'middle_name', 'avatar']);
    }

    public function conversations()
    {
        return $this->hasMany(Conversation::class, 'message_id')->select(['id', 'message_id', 'sender', 'message', 'seen_at', 'created_at']);
    }
}
