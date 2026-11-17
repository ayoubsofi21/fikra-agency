<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Admin\Concerns\ValidatesTranslations;
use Illuminate\Foundation\Http\FormRequest;

class SolutionFeatureRequest extends FormRequest
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
        return array_merge($this->localizedRules(['title'], true, 255), $this->localizedRules(['description'], false, 1000), [
            'order' => ['nullable', 'integer', 'min:0'],
        ]);
    }
}
