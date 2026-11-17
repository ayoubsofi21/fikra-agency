<?php

namespace App\Services;

use Closure;
use Illuminate\Support\Facades\Cache;

/**
 * 10-minute content cache for public GET endpoints.
 *
 * Every cached key embeds a version number; admin mutations call flush()
 * which bumps the version, instantly invalidating all stale entries
 * (they expire naturally within TTL). Keys are also scoped per locale
 * because list-of-strings fields resolve to the active language.
 */
class ContentCache
{
    public const TTL_MINUTES = 10;

    private const VERSION_KEY = 'api:content_version';

    /**
     * @param  array<string, mixed>  $params  filter inputs that change the result
     */
    public function remember(string $group, array $params, Closure $callback): mixed
    {
        // Start at 0 so the first flush (which writes 1) always invalidates
        // entries cached before any flush happened on a cold cache.
        $version = (int) Cache::get(self::VERSION_KEY, 0);

        $key = sprintf(
            'api:v1:%s:v%d:%s',
            $group,
            $version,
            sha1(serialize([app()->getLocale(), $params])),
        );

        return Cache::remember($key, now()->addMinutes(self::TTL_MINUTES), $callback);
    }

    /**
     * Invalidate every public content cache (call after admin writes).
     */
    public function flush(): void
    {
        // `increment` fails silently when the key does not exist yet (e.g.
        // after `cache:clear`), which would leave stale entries alive for
        // the full TTL — so bump the version explicitly.
        $version = (int) Cache::get(self::VERSION_KEY, 0);

        Cache::forever(self::VERSION_KEY, $version + 1);
    }
}
