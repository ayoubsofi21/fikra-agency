<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Public\PricingPlanResource;
use App\Models\PricingPlan;
use App\Services\ContentCache;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PricingController extends Controller
{
    public function __construct(private readonly ContentCache $cache) {}

    public function index(Request $request): JsonResponse
    {
        [$page, $perPage] = $this->paginationParams($request);

        $plans = $this->cache->remember('pricing:index', [], fn () => PricingPlan::query()
            ->active()
            ->orderBy('order')
            ->get());

        return $this->apiPaginated($request, $plans, PricingPlanResource::class, $page, $perPage);
    }
}
