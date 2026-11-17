<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Public\TestimonialResource;
use App\Models\Testimonial;
use App\Services\ContentCache;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function __construct(private readonly ContentCache $cache) {}

    public function index(Request $request): JsonResponse
    {
        [$page, $perPage] = $this->paginationParams($request);

        $testimonials = $this->cache->remember('testimonials:index', [], fn () => Testimonial::query()
            ->active()
            ->orderBy('order')
            ->get());

        return $this->apiPaginated($request, $testimonials, TestimonialResource::class, $page, $perPage);
    }
}
