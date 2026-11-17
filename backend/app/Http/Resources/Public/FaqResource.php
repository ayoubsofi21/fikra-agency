<?php

namespace App\Http\Resources\Public;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Mock-compatible FAQ: { id, question{}, answer{}, group }
 */
class FaqResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'question' => $this->translationsOf('question'),
            'answer' => $this->translationsOf('answer'),
            'group' => $this->group,
        ];
    }
}
