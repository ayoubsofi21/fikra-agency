<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Rejects bot submissions that fill the hidden form field.
 *
 * `honeypot` is the field name rendered by the React contact form; `_hp` and
 * `website_url` are accepted aliases for other clients. `website` is NOT used
 * because the contact form exposes it as a legitimate optional field.
 */
class Honeypot
{
    private const FIELDS = ['honeypot', '_hp', 'website_url'];

    public function handle(Request $request, Closure $next): Response
    {
        foreach (self::FIELDS as $field) {
            if (filled($request->input($field))) {
                return response()->json([
                    'message' => trans('errors.spam_detected'),
                    'errors' => (object) [],
                ], 422);
            }
        }

        return $next($request);
    }
}
