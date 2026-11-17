<?php

namespace App\Http\Middleware;

use App\Services\ContentCache;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Invalidates the 10-minute public content cache after any successful
 * admin mutation (POST/PUT/PATCH/DELETE). Reads are untouched.
 */
class FlushContentCache
{
    public function __construct(private readonly ContentCache $cache) {}

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! $request->isMethod('GET') && $response->getStatusCode() < 400) {
            $this->cache->flush();
        }

        return $response;
    }
}
