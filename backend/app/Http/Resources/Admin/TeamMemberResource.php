<?php

namespace App\Http\Resources\Admin;

use App\Http\Resources\Admin\Concerns\PresentsMedia;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeamMemberResource extends JsonResource
{
    use PresentsMedia;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->translationsOf('name'),
            'role' => $this->translationsOf('role'),
            'bio' => $this->translationsOf('bio'),
            'skills' => $this->skills ?? [],
            'github_url' => $this->github_url,
            'linkedin_url' => $this->linkedin_url,
            'twitter' => $this->twitter,
            'email' => $this->email,
            'avatar' => $this->avatar,
            'featured' => $this->featured,
            'is_active' => $this->is_active,
            'order' => $this->order,
            'media' => $this->mediaPayload(),
            'photo_url' => $this->resource->getFirstMediaUrl('photo') ?: null,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
