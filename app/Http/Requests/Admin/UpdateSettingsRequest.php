<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Accepts partial updates of the four setting groups; unknown keys are
 * ignored because only validated keys are persisted.
 */
class UpdateSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'site' => ['sometimes', 'array'],
            'site.name' => ['sometimes', 'string', 'max:120'],
            'site.tagline' => ['sometimes', 'nullable', 'string', 'max:190'],
            'site.description' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'site.email' => ['sometimes', 'nullable', 'email', 'max:190'],
            'site.phone' => ['sometimes', 'nullable', 'string', 'max:60'],
            'site.location' => ['sometimes', 'nullable', 'string', 'max:190'],
            'site.workingHours' => ['sometimes', 'nullable', 'string', 'max:190'],
            'site.locale' => ['sometimes', 'nullable', 'string', 'max:20'],

            'social' => ['sometimes', 'array', 'max:20'],
            'social.*' => ['array'],
            'social.*.name' => ['required_with:social', 'string', 'max:60'],
            'social.*.url' => ['required_with:social', 'url', 'max:255'],
            'social.*.icon' => ['nullable', 'string', 'max:60'],

            'whatsapp' => ['sometimes', 'nullable', 'string', 'max:32'],

            'stats' => ['sometimes', 'array', 'max:12'],
            'stats.*' => ['array'],
            'stats.*.value' => ['required_with:stats', 'numeric'],
            'stats.*.suffix' => ['nullable', 'array'],
            'stats.*.suffix.en' => ['nullable', 'string', 'max:10'],
            'stats.*.suffix.fr' => ['nullable', 'string', 'max:10'],
            'stats.*.suffix.ar' => ['nullable', 'string', 'max:10'],
            'stats.*.label' => ['required_with:stats', 'string', 'max:120'],
        ];
    }
}
