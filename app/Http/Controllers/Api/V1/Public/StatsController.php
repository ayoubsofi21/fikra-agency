<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Public\StatResource;
use App\Models\Setting;
use App\Services\ContentCache;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StatsController extends Controller
{
    public function __construct(private readonly ContentCache $cache) {}

    public function index(Request $request): JsonResponse
    {
        [$page, $perPage] = $this->paginationParams($request);

        $stats = $this->cache->remember('stats:index', [], function () {
            $raw = Setting::getValue('stats', []);

            return collect($raw)->values()->map(fn (array $stat, int $index) => [
                'id' => $stat['id'] ?? $index + 1,
                'value' => $stat['value'] ?? 0,
                'suffix' => $stat['suffix'] ?? ['en' => '', 'fr' => '', 'ar' => ''],
                'label' => $stat['label'] ?? '',
            ]);
        });

        return $this->apiPaginated($request, $stats, StatResource::class, $page, $perPage);
    }
}
