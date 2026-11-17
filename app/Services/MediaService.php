<?php

namespace App\Services;

use Illuminate\Support\Collection;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * Serializes media-library records for the admin API. Kept in one place so
 * resource payloads and upload responses stay identical.
 */
class MediaService
{
    /**
     * @return array<string, mixed>
     */
    public function present(Media $media): array
    {
        return [
            'id' => $media->id,
            'uuid' => $media->uuid,
            'model_type' => $media->model_type,
            'model_id' => $media->model_id,
            'collection' => $media->collection_name,
            'name' => $media->name,
            'file_name' => $media->file_name,
            'mime_type' => $media->mime_type,
            'size' => $media->size,
            'url' => $media->getUrl(),
            'thumb' => $media->hasGeneratedConversion('thumb') ? $media->getUrl('thumb') : null,
            'webp' => $media->hasGeneratedConversion('webp') ? $media->getUrl('webp') : null,
            'custom_properties' => $media->custom_properties ?? [],
            'created_at' => $media->created_at?->toIso8601String(),
        ];
    }

    /**
     * @param  Collection<int, Media>  $media
     * @return array<int, array<string, mixed>>
     */
    public function presentMany(Collection $media): array
    {
        return $media->map(fn (Media $item) => $this->present($item))->values()->all();
    }
}
