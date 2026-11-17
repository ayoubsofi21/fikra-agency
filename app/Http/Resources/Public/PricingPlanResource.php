<?php

namespace App\Http\Resources\Public;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Mock-compatible pricing plan:
 * { id, key, name{}, tagline{}, price{monthly,yearly,oneTime,currency},
 *   features[{en,fr,ar}], cta{}, popular }
 */
class PricingPlanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'key' => $this->key,
            'name' => $this->translationsOf('name'),
            'tagline' => $this->translationsOf('tagline'),
            'price' => [
                'monthly' => $this->price_monthly !== null ? (float) $this->price_monthly : null,
                'yearly' => $this->price_yearly !== null ? (float) $this->price_yearly : null,
                'oneTime' => $this->price_one_time !== null ? (float) $this->price_one_time : null,
                'currency' => $this->currency,
            ],
            'features' => $this->features ?? [],
            'cta' => $this->translationsOf('cta'),
            'popular' => $this->is_popular,
        ];
    }
}
