<?php

namespace App\Http\Resources\Public;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Mock-compatible project:
 * { id, slug, title{}, description{}, category, client, year, challenge{},
 *   solution{}, result{}, technologies[], liveLink, image, cover, gallery[], done }
 */
class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $mediaGallery = $this->resource->getMedia('gallery')
            ->map(fn ($media) => $media->getUrl())
            ->all();

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->translationsOf('title'),
            'description' => $this->translationsOf('summary'),
            'category' => $this->category,
            'client' => $this->client_name,
            'year' => $this->completed_at?->year,
            'challenge' => $this->translationsOf('problem'),
            'solution' => $this->translationsOf('solution'),
            'result' => $this->translationsOf('result'),
            'technologies' => $this->technologies ?? [],
            'liveLink' => $this->live_url,
            'image' => $this->image,
            'cover' => $this->resource->getFirstMediaUrl('cover') ?: $this->cover,
            'gallery' => $mediaGallery !== [] ? $mediaGallery : ($this->gallery ?? []),
            'done' => (bool) $this->completed_at,
        ];
    }
}
