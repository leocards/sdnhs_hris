<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StatementOfAssetsLiabilityAndNetwork extends Model
{
    use HasFactory;

    protected $table = 'statement_of_assets_liability_and_networths';

    protected $fillable = [
        'user_id',
        'asof',
        'date',
        'isjoint',
        'isApproved',
    ];

    public function salnSpouse()
    {
        return $this->hasOne(SalnSpouse::class, 'saln_id', 'id');
    }

    public function salnChildren()
    {
        return $this->hasMany(SalnChildren::class, 'saln_id', 'id');
    }

    public function salnAssets()
    {
        return $this->hasMany(SalnAsset::class, 'saln_id', 'id');
    }

    public function salnLiability()
    {
        return $this->hasMany(SalnLiability::class, 'saln_id', 'id');
    }

    public function salnBiFc()
    {
        return $this->hasOne(SalnBiFc::class, 'saln_id', 'id');
    }

    public function salnRelative()
    {
        return $this->hasOne(SalnRelative::class, 'saln_id', 'id');
    }
}
