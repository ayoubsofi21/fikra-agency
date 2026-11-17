<?php

namespace App\Traits;

use Spatie\Image\Enums\CropPosition;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * Shared media-library conversions for photographic content:
 * a 400x300 center-cropped thumb and a full-size webp variant.
 * Models using this trait must define registerMediaCollections().
 */
trait ConvertsImages
{
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->crop(CropPosition::Center, 400, 300)
            ->sharpen();

        $this->addMediaConversion('webp')
            ->format('webp')
            ->quality(80);
    }
}
