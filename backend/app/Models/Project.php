<?php

namespace App\Models;

use App\Traits\ConvertsImages;
use App\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Project extends Model implements HasMedia
{
    use ConvertsImages, HasFactory, HasSlug, HasTranslations, InteractsWithMedia, SoftDeletes {
        ConvertsImages::registerMediaConversions insteadof InteractsWithMedia;
    }

    protected $fillable = [
        'slug',
        'category',
        'title',
        'client_name',
        'summary',
        'problem',
        'solution',
        'result',
        'technologies',
        'live_url',
        'image',
        'cover',
        'gallery',
        'completed_at',
        'is_featured',
        'is_active',
        'order',
    ];

    protected $casts = [
        'technologies' => 'array',
        'gallery' => 'array',
        'completed_at' => 'date',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    /** @var array<int, string> */
    protected $translatable = [
        'title',
        'summary',
        'problem',
        'solution',
        'result',
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom(fn (Model $model) => $model->translated('title'))
            ->saveSlugsTo('slug')
            ->preventOverwrite()
            ->doNotGenerateSlugsOnUpdate();
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('cover')->singleFile();
        $this->addMediaCollection('gallery');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function scopeCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }
}
