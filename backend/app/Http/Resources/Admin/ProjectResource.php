<?php

namespace App\Http\Resources\Admin;

use App\Http\Resources\Admin\Concerns\PresentsMedia;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    use PresentsMedia;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'category' => $this->category,
            'title' => $this->translationsOf('title'),
            'client_name' => $this->client_name,
            'summary' => $this->translationsOf('summary'),
            'problem' => $this->translationsOf('problem'),
            'solution' => $this->translationsOf('solution'),
            'result' => $this->translationsOf('result'),
            'technologies' => $this->technologies ?? [],
            'live_url' => $this->live_url,
            'image' => $this->image,
            'cover' => $this->cover,
            'gallery' => $this->gallery ?? [],
            'completed_at' => $this->completed_at?->format('Y-m-d'),
            'is_featured' => $this->is_featured,
            'is_active' => $this->is_active,
            'order' => $this->order,
            'media' => $this->mediaPayload(),
            'cover_url' => $this->resource->getFirstMediaUrl('cover') ?: null,
            'gallery_urls' => $this->resource->getMedia('gallery')->map(fn ($m) => $m->getUrl())->values()->all(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'deleted_at' => $this->deleted_at?->toIso8601String(),
        ];
    }
}
