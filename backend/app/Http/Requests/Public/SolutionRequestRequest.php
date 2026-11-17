<?php

namespace App\Http\Requests\Public;

use Illuminate\Foundation\Http\FormRequest;

/**
 * "Request this solution" form on the solution detail page.
 *
 * The solution can be referenced by id or slug; the controller resolves one
 * of them to an active solution.
 */
class SolutionRequestRequest extends FormRequest
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
            'solution_id' => ['nullable', 'integer', 'exists:solutions,id', 'required_without:solution_slug'],
            'solution_slug' => ['nullable', 'string', 'max:190', 'exists:solutions,slug', 'required_without:solution_id'],
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'string', 'email', 'max:190'],
            'phone' => ['nullable', 'string', 'max:40'],
            'company' => ['nullable', 'string', 'max:190'],
            'message' => ['required', 'string', 'min:5', 'max:3000'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->email)) {
            $this->merge(['email' => mb_strtolower(trim($this->email))]);
        }

        // POST /solutions/{slug}/request carries the slug in the URL.
        if (($slug = $this->route('slug')) !== null && ! $this->filled('solution_slug')) {
            $this->merge(['solution_slug' => $slug]);
        }
    }
}
