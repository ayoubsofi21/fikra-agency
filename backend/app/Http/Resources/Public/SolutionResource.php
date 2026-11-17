<?php

namespace App\Http\Resources\Public;

use App\Enums\PricingModel;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Mock-compatible solution:
 * { id, slug, name{}, description{}, category, type, badge, image,
 *   priceModel, price{amount,currency}, licenseType, rating,
 *   features[], technologies[], demo, updatedAt }
 */
class SolutionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->translationsOf('title'),
            'description' => $this->translationsOf('description'),
            'category' => $this->category?->slug,
            'type' => $this->type,
            'badge' => $this->badge,
            'image' => $this->image,
            'priceModel' => match ($this->pricing_model) {
                PricingModel::OneTime => 'license',
                PricingModel::Subscription => 'subscription',
                PricingModel::Custom => 'custom',
            },
            'price' => [
                'amount' => $this->price !== null ? (float) $this->price : null,
                'currency' => $this->currency,
            ],
            'licenseType' => $this->license_type,
            'rating' => $this->rating !== null ? (float) $this->rating : null,
            'features' => $this->features->map(fn ($feature) => $feature->translated('title'))->values()->all(),
            'technologies' => $this->technologies ?? [],
            'demo' => $this->demo_url,
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
