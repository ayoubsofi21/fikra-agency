<?php

namespace App\Models;

use App\Traits\ConvertsImages;
use App\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Post extends Model implements HasMedia
{
    use ConvertsImages, HasFactory, HasSlug, HasTranslations, InteractsWithMedia, SoftDeletes {
        ConvertsImages::registerMediaConversions insteadof InteractsWithMedia;
    }

    public const STATUS_DRAFT = 'draft';

    public const STATUS_PUBLISHED = 'published';

    protected $fillable = [
        'slug',
        'category_id',
        'author_id',
        'author_name',
        'title',
        'excerpt',
        'content',
        'cover',
        'reading_time',
        'seo_title',
        'seo_description',
        'status',
        'published_at',
    ];

    protected $casts = [
        'reading_time' => 'integer',
        'published_at' => 'datetime',
    ];

    /** @var array<int, string> */
    protected $translatable = [
        'title',
        'author_name',
        'excerpt',
        'content',
        'seo_title',
        'seo_description',
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
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(PostCategory::class, 'category_id');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query
            ->where('status', self::STATUS_PUBLISHED)
            ->where(function (Builder $q) {
                $q->whereNull('published_at')->orWhere('published_at', '<=', now());
            });
    }
}
