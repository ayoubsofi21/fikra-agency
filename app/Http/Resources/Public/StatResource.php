<?php

namespace App\Http\Resources\Public;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Homepage counter stored in settings.stats.
 * Mock shape: { id, value, suffix{}, label }
 */
class StatResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource['id'],
            'value' => $this->resource['value'],
            'suffix' => $this->resource['suffix'],
            'label' => $this->resource['label'],
        ];
    }
}
