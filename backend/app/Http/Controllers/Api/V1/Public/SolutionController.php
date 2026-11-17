<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Public\SolutionResource;
use App\Models\Solution;
use App\Services\ContentCache;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SolutionController extends Controller
{
    public function __construct(private readonly ContentCache $cache) {}

    public function index(Request $request): JsonResponse
    {
        [$page, $perPage] = $this->paginationParams($request);

        $category = $request->query('category');
        $category = is_string($category) && $category !== '' && $category !== 'all' ? $category : null;
        $search = trim((string) $request->query('search', ''));

        $solutions = $this->cache->remember(
            'solutions:index',
            ['category' => $category, 'search' => $search],
            function () use ($category, $search) {
                $query = Solution::query()
                    ->active()
                    ->with(['category', 'features'])
                    ->orderBy('order');

                if ($category !== null) {
                    $query->whereHas('category', fn ($q) => $q->where('slug', $category));
                }

                $items = $query->get();

                if ($search !== '') {
                    $needle = mb_strtolower($search);

                    $items = $items->filter(fn (Solution $solution) => mb_stripos((string) $solution->translated('title'), $needle) !== false
                        || mb_stripos((string) $solution->translated('description'), $needle) !== false
                    )->values();
                }

                return $items;
            },
        );

        return $this->apiPaginated($request, $solutions, SolutionResource::class, $page, $perPage);
    }

    public function show(string $slug): JsonResponse
    {
        $solution = $this->cache->remember('solutions:show', ['slug' => $slug], fn () => Solution::query()
            ->active()
            ->with(['category', 'features'])
            ->where('slug', $slug)
            ->first());

        if ($solution === null) {
            return $this->apiNotFound();
        }

        return $this->apiSuccess(new SolutionResource($solution));
    }
}
