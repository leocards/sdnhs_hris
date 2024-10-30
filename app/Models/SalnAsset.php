<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalnAsset extends Model
{
    use HasFactory;

    protected $table = 'saln_assets';

    protected $fillable = [
        'saln_id',
        'asset_type',
        'description',
        'kind',
        'location',
        'assessed_value',
        'current_market_value',
        'year',
        'mode',
        'cost',
    ];
}
