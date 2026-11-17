<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Admin\Concerns\ValidatesTranslations;
use Illuminate\Foundation\Http\FormRequest;

class TestimonialRequest extends FormRequest
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
            $this->localizedRules(['author_name', 'author_role', 'company'], true, 255),
            $this->localizedRules(['project_type'], false, 100),
            $this->localizedRules(['content'], true, 5000),
            [
                'avatar' => ['nullable', 'string', 'max:255'],
                'rating' => ['nullable', 'integer', 'between:1,5'],
                'order' => ['nullable', 'integer', 'min:0'],
                'is_active' => ['sometimes', 'boolean'],
            ],
        );
    }
}
