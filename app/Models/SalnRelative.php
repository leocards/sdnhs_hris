<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalnRelative extends Model
{
    use HasFactory;

    protected $table = 'saln_relatives';

    protected $fillable = [
        'saln_id',
        'has_relative'
    ];

    public function relatives()
    {
        return $this->hasMany(SalnRelativesData::class, 'saln_relative_id', 'id');
    }
}
