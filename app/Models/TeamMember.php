<?php

namespace App\Models;

use App\Traits\ConvertsImages;
use App\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class TeamMember extends Model implements HasMedia
{
    use ConvertsImages, HasFactory, HasTranslations, InteractsWithMedia {
        ConvertsImages::registerMediaConversions insteadof InteractsWithMedia;
    }

    protected $fillable = [
        'name',
        'role',
        'bio',
        'skills',
        'github_url',
        'linkedin_url',
        'email',
        'avatar',
        'twitter',
        'featured',
        'order',
        'is_active',
    ];

    protected $casts = [
        'skills' => 'array',
        'featured' => 'boolean',
        'order' => 'integer',
        'is_active' => 'boolean',
    ];

    /** @var array<int, string> */
    protected $translatable = ['name', 'role', 'bio'];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('photo')->singleFile();
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
