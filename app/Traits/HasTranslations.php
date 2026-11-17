<?php

namespace App\Traits;

use Spatie\Translatable\HasTranslations as SpatieHasTranslations;

/**
 * Adds locale helpers on top of spatie/laravel-translatable.
 *
 * Public API resources call translated() to get a plain string for the
 * active locale; admin resources call translationsOf() to get the whole
 * { en, fr, ar } bag for editing.
 */
trait HasTranslations
{
    use SpatieHasTranslations;

    /**
     * Translation for $attribute in $locale (or the active locale),
     * falling back to the fallback locale, then to any non-empty locale.
     * Works for string and array translations (e.g. deliverables).
     */
    public function translated(string $attribute, ?string $locale = null, bool $useFallback = true): mixed
    {
        $locale ??= app()->getLocale();

        $value = $this->getTranslation($attribute, $locale, $useFallback);

        if ($this->translationFilled($value)) {
            return $value;
        }

        if ($useFallback) {
            foreach (config('app.supported_locales', ['en']) as $supported) {
                $candidate = $this->getTranslation($attribute, $supported, false);
                if ($this->translationFilled($candidate)) {
                    return $candidate;
                }
            }
        }

        return $value;
    }

    /**
     * Every supported locale => value (admin editing).
     *
     * @return array<string, mixed>
     */
    public function translationsOf(string $attribute): array
    {
        $out = [];

        foreach (config('app.supported_locales', ['en']) as $locale) {
            $out[$locale] = $this->getTranslation($attribute, $locale, false);
        }

        return $out;
    }

    protected function translationFilled(mixed $value): bool
    {
        if (is_string($value)) {
            return $value !== '';
        }

        if (is_array($value)) {
            return $value !== [];
        }

        return $value !== null;
    }
}
