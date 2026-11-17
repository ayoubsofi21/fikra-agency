<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Admin\Concerns\ValidatesTranslations;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PricingPlanRequest extends FormRequest
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
        return array_merge(
            $this->localizedRules(['name', 'tagline'], true, 500),
            $this->localizedRules(['description', 'cta'], false, 500),
            [
                'key' => ['required', 'string', 'max:40', Rule::unique('pricing_plans', 'key')->ignore($this->route('pricing'))],
                'price_monthly' => ['nullable', 'numeric', 'min:0'],
                'price_yearly' => ['nullable', 'numeric', 'min:0'],
                'price_one_time' => ['nullable', 'numeric', 'min:0'],
                'currency' => ['nullable', 'string', 'max:10'],

                // Comparison rows are localized objects: [{en,fr,ar}, ...]
                'features' => ['nullable', 'array'],
                'features.*' => ['array'],
                'features.*.en' => ['nullable', 'string', 'max:190'],
                'features.*.fr' => ['nullable', 'string', 'max:190'],
                'features.*.ar' => ['nullable', 'string', 'max:190'],

                'is_popular' => ['sometimes', 'boolean'],
                'is_active' => ['sometimes', 'boolean'],
                'order' => ['nullable', 'integer', 'min:0'],
            ],
        );
    }
}
