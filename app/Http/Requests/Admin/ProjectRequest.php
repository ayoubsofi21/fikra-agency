<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Admin\Concerns\ValidatesTranslations;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProjectRequest extends FormRequest
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
        $project = $this->route('project');

        return array_merge(
            $this->localizedRules(['title', 'summary', 'problem', 'solution', 'result'], true, 5000),
            [
                'slug' => ['nullable', 'string', 'max:190', Rule::unique('projects', 'slug')->ignore($project)],
                'category' => ['required', Rule::in($this->projectTypes())],
                'client_name' => ['required', 'string', 'max:190'],
                'technologies' => ['nullable', 'array'],
                'technologies.*' => ['string', 'max:60'],
                'live_url' => ['nullable', 'url', 'max:255'],
                'image' => ['nullable', 'string', 'max:255'],
                'cover' => ['nullable', 'string', 'max:255'],
                'gallery' => ['nullable', 'array'],
                'gallery.*' => ['string', 'max:255'],
                'completed_at' => ['nullable', 'date'],
                'is_featured' => ['sometimes', 'boolean'],
                'is_active' => ['sometimes', 'boolean'],
                'order' => ['nullable', 'integer', 'min:0'],
            ],
        );
    }
}
