<?php

namespace App\Models;

use App\Enums\PricingModel;
use App\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Solution extends Model
{
    use HasFactory, HasSlug, HasTranslations, SoftDeletes;

    protected $fillable = [
        'slug',
        'category_id',
        'title',
        'short_description',
        'description',
        'technologies',
        'demo_url',
        'badge',
        'type',
        'license_type',
        'rating',
        'image',
        'pricing_model',
        'price',
        'currency',
        'is_featured',
        'is_active',
        'order',
    ];

    protected $casts = [
        'technologies' => 'array',
        'pricing_model' => PricingModel::class,
        'price' => 'decimal:2',
        'rating' => 'decimal:1',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    /** @var array<int, string> */
    protected $translatable = [
        'title',
        'short_description',
        'description',
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom(fn (Model $model) => $model->translated('title'))
            ->saveSlugsTo('slug')
            ->preventOverwrite()
            ->doNotGenerateSlugsOnUpdate();
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(SolutionCategory::class, 'category_id');
    }

    /** @return HasMany<SolutionFeature, $this> */
    public function features(): HasMany
    {
        return $this->hasMany(SolutionFeature::class)->orderBy('order');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function scopeCategory(Builder $query, string $slug): Builder
    {
        return $query->whereHas('category', fn (Builder $q) => $q->where('slug', $slug));
    }

    public function scopePricing(Builder $query, string $model): Builder
    {
        return $query->where('pricing_model', $model);
    }
}
