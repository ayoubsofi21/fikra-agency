<?php

namespace App\Http\Resources\Public;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Mock-compatible service:
 * { id, slug, name{}, description{}, short{}, icon, category,
 *   price{model,from,currency,period?}, deliverables[], technologies[], timeline }
 */
class ServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->translationsOf('title'),
            'description' => $this->translationsOf('description'),
            'short' => $this->translationsOf('short_description'),
            'icon' => $this->icon,
            'category' => $this->category,
            'price' => array_filter([
                'model' => $this->price_model,
                'from' => $this->price_from,
                'currency' => $this->price_currency,
                'period' => $this->price_period,
            ], fn ($value) => $value !== null),
            'deliverables' => $this->translated('deliverables') ?? [],
            'technologies' => $this->technologies ?? [],
            'timeline' => $this->translated('timeline'),
        ];
    }
}
