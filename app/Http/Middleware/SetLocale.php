<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Resolve the active locale for API requests.
 *
 * Source order: ?lang= query parameter, then Accept-Language header,
 * then config('app.locale'). Only locales listed in
 * config('app.supported_locales') are accepted; anything else
 * falls back to the default locale.
 */
class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        app()->setLocale($this->resolveLocale($request));

        return $next($request);
    }

    protected function resolveLocale(Request $request): string
    {
        $supported = config('app.supported_locales', ['en']);
        $default = config('app.locale', 'en');

        foreach ($this->candidates($request) as $candidate) {
            // Normalize "fr-FR", "fr_FR", "FR" -> "fr" (primary subtag).
            $primary = strtolower(explode('-', str_replace('_', '-', $candidate))[0]);

            if (in_array($primary, $supported, true)) {
                return $primary;
            }
        }

        return in_array($default, $supported, true) ? $default : 'en';
    }

    /**
     * @return array<string>
     */
    protected function candidates(Request $request): array
    {
        $candidates = [];

        $query = $request->query('lang');
        if (is_string($query) && $query !== '') {
            $candidates[] = $query;
        }

        $header = $request->header('Accept-Language');
        if (is_string($header) && $header !== '') {
            foreach (explode(',', $header) as $part) {
                $tag = trim(explode(';', $part)[0]);
                if ($tag !== '' && $tag !== '*') {
                    $candidates[] = $tag;
                }
            }
        }

        return $candidates;
    }
}
