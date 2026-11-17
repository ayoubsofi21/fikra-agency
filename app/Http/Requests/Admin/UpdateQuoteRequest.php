<?php

namespace App\Http\Requests\Admin;

use App\Enums\QuoteStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateQuoteRequest extends FormRequest
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
            'status' => ['required', Rule::enum(QuoteStatus::class)],
            'internal_notes' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
