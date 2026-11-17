<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SolutionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'category_id' => $this->category_id,
            'category' => $this->whenLoaded('category', fn () => [
                'id' => $this->category->id,
                'slug' => $this->category->slug,
                'name' => $this->category->translationsOf('name'),
            ]),
            'title' => $this->translationsOf('title'),
            'short_description' => $this->translationsOf('short_description'),
            'description' => $this->translationsOf('description'),
            'technologies' => $this->technologies ?? [],
            'demo_url' => $this->demo_url,
            'badge' => $this->badge,
            'type' => $this->type,
            'license_type' => $this->license_type,
            'rating' => $this->rating !== null ? (float) $this->rating : null,
            'image' => $this->image,
            'pricing_model' => $this->pricing_model?->value,
            'price' => $this->price !== null ? (float) $this->price : null,
            'currency' => $this->currency,
            'is_featured' => $this->is_featured,
            'is_active' => $this->is_active,
            'order' => $this->order,
            'features' => SolutionFeatureResource::collection($this->whenLoaded('features')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'deleted_at' => $this->deleted_at?->toIso8601String(),
        ];
    }
}
