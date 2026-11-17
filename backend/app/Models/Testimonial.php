<?php

namespace App\Models;

use App\Traits\ConvertsImages;
use App\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Testimonial extends Model implements HasMedia
{
    use ConvertsImages, HasFactory, HasTranslations, InteractsWithMedia {
        ConvertsImages::registerMediaConversions insteadof InteractsWithMedia;
    }

    protected $fillable = [
        'author_name',
        'author_role',
        'company',
        'avatar',
        'project_type',
        'content',
        'rating',
        'order',
        'is_active',
    ];

    protected $casts = [
        'rating' => 'integer',
        'order' => 'integer',
        'is_active' => 'boolean',
    ];

    /** @var array<int, string> */
    protected $translatable = ['author_name', 'author_role', 'company', 'content', 'project_type'];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('avatar')->singleFile();
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
