<?php

namespace App\Http\Resources\Admin\Concerns;

use App\Services\MediaService;

/**
 * Media-library payload for admin screens (full URLs + generated variants).
 */
trait PresentsMedia
{
    /**
     * @return array<int, array<string, mixed>>
     */
    protected function mediaPayload(?string $collection = null): array
    {
        $media = $collection === null
            ? $this->resource->getMedia('*')
            : $this->resource->getMedia($collection);

        return app(MediaService::class)->presentMany($media);
    }
}
