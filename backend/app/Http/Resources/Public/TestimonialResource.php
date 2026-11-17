<?php

namespace App\Http\Resources\Public;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Mock-compatible testimonial:
 * { id, name{}, role{}, company{}, content{}, avatar, rating, projectType{} }
 */
class TestimonialResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->translationsOf('author_name'),
            'role' => $this->translationsOf('author_role'),
            'company' => $this->translationsOf('company'),
            'content' => $this->translationsOf('content'),
            'avatar' => $this->resource->getFirstMediaUrl('avatar') ?: $this->avatar,
            'rating' => $this->rating,
            'projectType' => $this->translationsOf('project_type'),
        ];
    }
}
