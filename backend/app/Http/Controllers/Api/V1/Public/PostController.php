<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Public\PostResource;
use App\Models\Post;
use App\Services\ContentCache;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function __construct(private readonly ContentCache $cache) {}

    public function index(Request $request): JsonResponse
    {
        [$page, $perPage] = $this->paginationParams($request);

        $category = $request->query('category');
        $category = is_string($category) && $category !== '' && $category !== 'all' ? $category : null;
        $search = trim((string) $request->query('search', ''));

        $posts = $this->cache->remember(
            'posts:index',
            ['category' => $category, 'search' => $search],
            function () use ($category, $search) {
                $query = Post::query()
                    ->published()
                    ->with(['category', 'author'])
                    ->orderByDesc('published_at');

                if ($category !== null) {
                    $query->whereHas('category', fn ($q) => $q->where('slug', $category));
                }

                $items = $query->get();

                if ($search !== '') {
                    $needle = mb_strtolower($search);

                    $items = $items->filter(fn (Post $post) => mb_stripos((string) $post->translated('title'), $needle) !== false
                        || mb_stripos((string) $post->translated('excerpt'), $needle) !== false
                    )->values();
                }

                return $items;
            },
        );

        return $this->apiPaginated($request, $posts, PostResource::class, $page, $perPage);
    }

    public function show(string $slug): JsonResponse
    {
        $post = $this->cache->remember('posts:show', ['slug' => $slug], fn () => Post::query()
            ->published()
            ->with(['category', 'author'])
            ->where('slug', $slug)
            ->first());

        if ($post === null) {
            return $this->apiNotFound();
        }

        return $this->apiSuccess(new PostResource($post));
    }
}
