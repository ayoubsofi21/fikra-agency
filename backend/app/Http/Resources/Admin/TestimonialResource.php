<?php

namespace App\Http\Resources\Admin;

use App\Http\Resources\Admin\Concerns\PresentsMedia;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TestimonialResource extends JsonResource
{
    use PresentsMedia;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'author_name' => $this->translationsOf('author_name'),
            'author_role' => $this->translationsOf('author_role'),
            'company' => $this->translationsOf('company'),
            'project_type' => $this->translationsOf('project_type'),
            'content' => $this->translationsOf('content'),
            'avatar' => $this->avatar,
            'rating' => $this->rating,
            'is_active' => $this->is_active,
            'order' => $this->order,
            'media' => $this->mediaPayload(),
            'avatar_url' => $this->resource->getFirstMediaUrl('avatar') ?: null,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
