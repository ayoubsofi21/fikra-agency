<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Public\ProjectResource;
use App\Models\Project;
use App\Services\ContentCache;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function __construct(private readonly ContentCache $cache) {}

    public function index(Request $request): JsonResponse
    {
        [$page, $perPage] = $this->paginationParams($request);

        $category = $request->query('category');
        $category = is_string($category) && $category !== '' && $category !== 'all' ? $category : null;
        $search = trim((string) $request->query('search', ''));

        $projects = $this->cache->remember(
            'projects:index',
            ['category' => $category, 'search' => $search],
            function () use ($category, $search) {
                $query = Project::query()->active()->orderBy('order');

                if ($category !== null) {
                    $query->where('category', $category);
                }

                $items = $query->get();

                if ($search !== '') {
                    $needle = mb_strtolower($search);

                    $items = $items->filter(fn (Project $project) => mb_stripos((string) $project->translated('title'), $needle) !== false
                        || mb_stripos((string) $project->translated('summary'), $needle) !== false
                        || mb_stripos((string) $project->client_name, $needle) !== false
                    )->values();
                }

                return $items;
            },
        );

        return $this->apiPaginated($request, $projects, ProjectResource::class, $page, $perPage);
    }

    public function show(string $slug): JsonResponse
    {
        $project = $this->cache->remember('projects:show', ['slug' => $slug], fn () => Project::query()
            ->active()
            ->where('slug', $slug)
            ->first());

        if ($project === null) {
            return $this->apiNotFound();
        }

        return $this->apiSuccess(new ProjectResource($project));
    }
}
