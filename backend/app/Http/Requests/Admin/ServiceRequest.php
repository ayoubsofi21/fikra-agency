<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Admin\Concerns\ValidatesTranslations;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ServiceRequest extends FormRequest
{
    use ValidatesTranslations;

    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $service = $this->route('service');

        return array_merge($this->localizedRules(['title', 'short_description', 'description'], true, 5000), [
            'timeline' => ['required', 'array'],
            'timeline.en' => ['required', 'string', 'max:120'],
            'timeline.fr' => ['nullable', 'string', 'max:120'],
            'timeline.ar' => ['nullable', 'string', 'max:120'],

            'deliverables' => ['nullable', 'array'],
            'deliverables.en' => ['nullable', 'array'],
            'deliverables.en.*' => ['string', 'max:255'],
            'deliverables.fr' => ['nullable', 'array'],
            'deliverables.fr.*' => ['string', 'max:255'],
            'deliverables.ar' => ['nullable', 'array'],
            'deliverables.ar.*' => ['string', 'max:255'],

            'slug' => ['nullable', 'string', 'max:190', Rule::unique('services', 'slug')->ignore($service)],
            'icon' => ['nullable', 'string', 'max:60'],
            'category' => ['nullable', 'string', 'in:development,commerce,platform,design,backend,support,marketing'],
            'technologies' => ['nullable', 'array'],
            'technologies.*' => ['string', 'max:60'],
            'price_model' => ['nullable', 'string', 'max:20'],
            'price_from' => ['nullable', 'integer', 'min:0'],
            'price_currency' => ['nullable', 'string', 'max:10'],
            'price_period' => ['nullable', 'string', 'max:20'],
            'is_featured' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
            'order' => ['nullable', 'integer', 'min:0'],
        ]);
    }
}
