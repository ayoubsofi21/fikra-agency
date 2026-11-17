<?php

namespace App\Models;

use App\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class SolutionCategory extends Model
{
    use HasFactory, HasSlug, HasTranslations;

    protected $fillable = [
        'slug',
        'name',
    ];

    /** @var array<int, string> */
    protected $translatable = ['name'];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom(fn (Model $model) => $model->translated('name'))
            ->saveSlugsTo('slug')
            ->preventOverwrite()
            ->doNotGenerateSlugsOnUpdate();
    }

    /** @return HasMany<Solution, $this> */
    public function solutions(): HasMany
    {
        return $this->hasMany(Solution::class, 'category_id');
    }
}
