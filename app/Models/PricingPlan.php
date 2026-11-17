<?php

namespace App\Models;

use App\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PricingPlan extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = [
        'key',
        'name',
        'description',
        'tagline',
        'cta',
        'price_monthly',
        'price_yearly',
        'price_one_time',
        'currency',
        'features',
        'is_popular',
        'order',
        'is_active',
    ];

    protected $casts = [
        'price_monthly' => 'decimal:2',
        'price_yearly' => 'decimal:2',
        'price_one_time' => 'decimal:2',
        'features' => 'array',
        'is_popular' => 'boolean',
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    /** @var array<int, string> */
    protected $translatable = ['name', 'description', 'tagline', 'cta'];

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
