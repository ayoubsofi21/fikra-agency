<?php

namespace App\Http\Requests\Public;

use App\Enums\ProjectType;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Single entry point for the frontend's `POST /contact`.
 *
 * The contact page sends the multi-step quote payload (type/budget/timeline/
 * description/files); a generic contact form can send subject/message instead.
 * Either `description` or `message` is required, which is how the controller
 * decides whether to create a quote request or a contact message.
 */
class ContactRequest extends FormRequest
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
        $maxFiles = config('agency.attachments.max_files', 3);
        $maxKb = config('agency.attachments.max_kb', 5120);
        $mimes = implode(',', config('agency.attachments.mimes', ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg']));

        return [
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'string', 'email', 'max:190'],
            'phone' => ['nullable', 'string', 'max:40'],
            'company' => ['nullable', 'string', 'max:190'],
            'website' => ['nullable', 'string', 'url', 'max:255'],

            // Quote payload (frontend field names + spec aliases).
            'type' => ['nullable', 'string', 'in:'.implode(',', ProjectType::values())],
            'project_type' => ['nullable', 'string', 'in:'.implode(',', ProjectType::values())],
            'budget' => ['nullable', 'string', 'max:30'],
            'budget_range' => ['nullable', 'string', 'max:30'],
            'timeline' => ['nullable', 'string', 'max:30'],

            // One of the two bodies is required.
            'description' => ['nullable', 'required_without:message', 'string', 'min:10', 'max:5000'],
            'message' => ['nullable', 'required_without:description', 'string', 'min:10', 'max:5000'],
            'subject' => ['nullable', 'string', 'max:190'],

            // Attachments: `files[]` (frontend) or a single `attachment`.
            'files' => ['nullable', 'array', 'max:'.$maxFiles],
            'files.*' => ['file', 'mimes:'.$mimes, 'max:'.$maxKb],
            'attachment' => ['nullable', 'file', 'mimes:'.$mimes, 'max:'.$maxKb],
        ];
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->email)) {
            $this->merge(['email' => mb_strtolower(trim($this->email))]);
        }

        // Frontend field names -> canonical columns.
        if ($this->filled('type') && ! $this->filled('project_type')) {
            $this->merge(['project_type' => $this->input('type')]);
        }

        if ($this->filled('budget') && ! $this->filled('budget_range')) {
            $this->merge(['budget_range' => $this->input('budget')]);
        }
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'description.required_without' => trans('validation.required_without', [
                'attribute' => trans('validation.attributes.description'),
                'values' => trans('validation.attributes.message'),
            ]),
            'message.required_without' => trans('validation.required_without', [
                'attribute' => trans('validation.attributes.message'),
                'values' => trans('validation.attributes.description'),
            ]),
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'type' => trans('validation.attributes.project_type'),
            'project_type' => trans('validation.attributes.project_type'),
            'budget' => trans('validation.attributes.budget'),
            'budget_range' => trans('validation.attributes.budget_range'),
        ];
    }

    /**
     * True when the payload is the multi-step quote form.
     */
    public function isQuote(): bool
    {
        return filled($this->input('description'));
    }
}
