<?php

namespace App\Http\Resources\Public;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Mock-compatible team member:
 * { id, name{}, role{}, bio{}, skills[], avatar, github, linkedin, twitter,
 *   email, featured }
 */
class TeamMemberResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->translationsOf('name'),
            'role' => $this->translationsOf('role'),
            'bio' => $this->translationsOf('bio'),
            'skills' => $this->skills ?? [],
            'avatar' => $this->resource->getFirstMediaUrl('photo') ?: $this->avatar,
            'github' => $this->github_url,
            'linkedin' => $this->linkedin_url,
            'twitter' => $this->twitter,
            'email' => $this->email,
            'featured' => $this->featured,
        ];
    }
}
