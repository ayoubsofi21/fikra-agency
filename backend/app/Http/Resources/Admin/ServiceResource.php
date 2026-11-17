<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'icon' => $this->icon,
            'category' => $this->category,
            'title' => $this->translationsOf('title'),
            'short_description' => $this->translationsOf('short_description'),
            'description' => $this->translationsOf('description'),
            'deliverables' => $this->translationsOf('deliverables') ?? [],
            'technologies' => $this->technologies ?? [],
            'timeline' => $this->translationsOf('timeline'),
            'price_model' => $this->price_model,
            'price_from' => $this->price_from,
            'price_currency' => $this->price_currency,
            'price_period' => $this->price_period,
            'is_featured' => $this->is_featured,
            'is_active' => $this->is_active,
            'order' => $this->order,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
