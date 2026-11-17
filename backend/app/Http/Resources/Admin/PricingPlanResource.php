<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PricingPlanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'key' => $this->key,
            'name' => $this->translationsOf('name'),
            'tagline' => $this->translationsOf('tagline'),
            'description' => $this->translationsOf('description'),
            'cta' => $this->translationsOf('cta'),
            'price_monthly' => $this->price_monthly !== null ? (float) $this->price_monthly : null,
            'price_yearly' => $this->price_yearly !== null ? (float) $this->price_yearly : null,
            'price_one_time' => $this->price_one_time !== null ? (float) $this->price_one_time : null,
            'currency' => $this->currency,
            'features' => $this->features ?? [],
            'is_popular' => $this->is_popular,
            'is_active' => $this->is_active,
            'order' => $this->order,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
