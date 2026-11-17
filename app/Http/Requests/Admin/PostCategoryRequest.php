<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Admin\Concerns\ValidatesTranslations;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PostCategoryRequest extends FormRequest
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
        return array_merge($this->localizedRules(['name'], true, 190), [
            'slug' => ['nullable', 'string', 'max:190', Rule::unique('post_categories', 'slug')->ignore($this->route('post_category'))],
        ]);
    }
}
