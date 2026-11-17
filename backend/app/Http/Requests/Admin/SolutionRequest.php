<?php

namespace App\Http\Requests\Admin;

use App\Enums\PricingModel;
use App\Http\Requests\Admin\Concerns\ValidatesTranslations;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SolutionRequest extends FormRequest
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
        $solution = $this->route('solution');

        return array_merge($this->localizedRules(['title', 'short_description', 'description'], true, 5000), [
            'slug' => ['nullable', 'string', 'max:190', Rule::unique('solutions', 'slug')->ignore($solution)],
            'category_id' => ['nullable', 'integer', 'exists:solution_categories,id'],
            'category_slug' => ['nullable', 'string', 'exists:solution_categories,slug'],
            'technologies' => ['nullable', 'array'],
            'technologies.*' => ['string', 'max:60'],
            'demo_url' => ['nullable', 'url', 'max:255'],
            'badge' => ['nullable', 'string', 'max:30'],
            'type' => ['nullable', 'string', 'max:20'],
            'license_type' => ['nullable', 'string', 'max:30'],
            'rating' => ['nullable', 'numeric', 'between:0,5'],
            'image' => ['nullable', 'string', 'max:255'],
            'pricing_model' => ['required', Rule::in(PricingModel::values())],
            'price' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:10'],
            'is_featured' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
            'order' => ['nullable', 'integer', 'min:0'],
        ]);
    }
}
