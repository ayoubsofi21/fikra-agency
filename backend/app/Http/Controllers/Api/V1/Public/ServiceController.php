<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Public\ServiceResource;
use App\Models\Service;
use App\Services\ContentCache;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function __construct(private readonly ContentCache $cache) {}

    public function index(Request $request): JsonResponse
    {
        [$page, $perPage] = $this->paginationParams($request);

        $services = $this->cache->remember('services:index', [], fn () => Service::query()
            ->active()
            ->orderBy('order')
            ->get());

        return $this->apiPaginated($request, $services, ServiceResource::class, $page, $perPage);
    }

    public function show(string $slug): JsonResponse
    {
        $service = $this->cache->remember('services:show', ['slug' => $slug], fn () => Service::query()
            ->active()
            ->where('slug', $slug)
            ->first());

        if ($service === null) {
            return $this->apiNotFound();
        }

        return $this->apiSuccess(new ServiceResource($service));
    }
}
