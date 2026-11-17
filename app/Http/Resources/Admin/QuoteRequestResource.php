<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuoteRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $attachments = $this->attachments ?? array_values(array_filter([$this->attachment]));

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'company' => $this->company,
            'project_type' => $this->project_type,
            'budget_range' => $this->budget_range,
            'timeline' => $this->timeline,
            'description' => $this->description,
            'status' => $this->status?->value,
            'internal_notes' => $this->internal_notes,
            'attachment' => $this->attachment,
            'attachments' => $attachments,
            'attachments_meta' => collect($attachments)->values()->map(fn (string $path, int $index) => [
                'index' => $index,
                'name' => basename($path),
                'path' => $path,
            ])->all(),
            'ip_address' => $this->ip_address,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
