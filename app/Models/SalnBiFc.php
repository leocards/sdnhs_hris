<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalnBiFc extends Model
{
    use HasFactory;

    protected $table = 'saln_bi_fcs';

    protected $fillable = [
        'saln_id',
        'has_bi_fc'
    ];

    public function bifc()
    {
        return $this->hasMany(SalnBiFcsBifc::class, 'saln_bi_fc_id', 'id');
    }
}
