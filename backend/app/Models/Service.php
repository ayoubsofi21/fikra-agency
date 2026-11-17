<?php

namespace App\Models;

use App\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Service extends Model
{
    use HasFactory, HasSlug, HasTranslations;

    protected $fillable = [
        'slug',
        'icon',
        'category',
        'title',
        'short_description',
        'description',
        'deliverables',
        'technologies',
        'timeline',
        'price_model',
        'price_from',
        'price_currency',
        'price_period',
        'is_featured',
        'order',
        'is_active',
    ];

    protected $casts = [
        'technologies' => 'array',
        'price_from' => 'integer',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    /** @var array<int, string> */
    protected $translatable = [
        'title',
        'short_description',
        'description',
        'deliverables',
        'timeline',
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom(fn (Model $model) => $model->translated('title'))
            ->saveSlugsTo('slug')
            ->preventOverwrite()
            ->doNotGenerateSlugsOnUpdate();
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }
}
