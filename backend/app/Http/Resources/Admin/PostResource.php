<?php

namespace App\Http\Resources\Admin;

use App\Http\Resources\Admin\Concerns\PresentsMedia;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    use PresentsMedia;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'category_id' => $this->category_id,
            'category' => $this->whenLoaded('category', fn () => $this->category === null ? null : [
                'id' => $this->category->id,
                'slug' => $this->category->slug,
                'name' => $this->category->translationsOf('name'),
            ]),
            'author_id' => $this->author_id,
            'author' => $this->whenLoaded('author', fn () => $this->author === null ? null : [
                'id' => $this->author->id,
                'name' => $this->author->name,
                'email' => $this->author->email,
            ]),
            'author_name' => $this->translationsOf('author_name'),
            'title' => $this->translationsOf('title'),
            'excerpt' => $this->translationsOf('excerpt'),
            'content' => $this->translationsOf('content'),
            'cover' => $this->cover,
            'reading_time' => $this->reading_time,
            'seo_title' => $this->translationsOf('seo_title'),
            'seo_description' => $this->translationsOf('seo_description'),
            'status' => $this->status,
            'published_at' => $this->published_at?->toIso8601String(),
            'media' => $this->mediaPayload(),
            'cover_url' => $this->resource->getFirstMediaUrl('cover') ?: null,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'deleted_at' => $this->deleted_at?->toIso8601String(),
        ];
    }
}
