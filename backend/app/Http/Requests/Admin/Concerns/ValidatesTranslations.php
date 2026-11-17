<?php

namespace App\Http\Requests\Admin\Concerns;

use App\Enums\ProjectType;

/**
 * Shared rules for spatie/laravel-translatable columns.
 *
 * Admin payloads send the whole { en, fr, ar } bag. English is required
 * (slugs are generated from it and it is the fallback locale); French and
 * Arabic can be filled in progressively.
 */
trait ValidatesTranslations
{
    /**
     * @param  array<int, string>  $fields
     * @return array<string, mixed>
     */
    protected function localizedRules(array $fields, bool $required = true, int $max = 2000): array
    {
        $rules = [];

        foreach ($fields as $field) {
            $rules[$field] = [$required ? 'required' : 'nullable', 'array'];

            foreach (['en', 'fr', 'ar'] as $locale) {
                $rules["{$field}.{$locale}"] = [
                    $required && $locale === 'en' ? 'required' : 'nullable',
                    'string',
                    'max:'.$max,
                ];
            }
        }

        return $rules;
    }

    /**
     * Project category values (shared by projects and the quote form).
     *
     * @return array<int, string>
     */
    protected function projectTypes(): array
    {
        return ProjectType::values();
    }
}
