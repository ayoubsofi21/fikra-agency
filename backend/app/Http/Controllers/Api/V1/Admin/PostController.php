<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Requests\Admin\PostRequest;
use App\Http\Resources\Admin\PostResource;
use App\Models\Post;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostController extends AdminResourceController
{
    protected array $relations = ['category', 'author'];

    protected array $searchColumns = ['title', 'slug'];

    protected string $orderBy = 'created_at';

    protected string $orderDirection = 'desc';

    protected bool $usesOrder = false;

    protected bool $softDeletes = true;

    protected function modelClass(): string
    {
        return Post::class;
    }

    protected function resourceClass(): string
    {
        return PostResource::class;
    }

    protected function requestClass(): string
    {
        return PostRequest::class;
    }

    protected function applyFilters(Builder $query, Request $request): void
    {
        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->query('category_id'));
        }
    }

    protected function prepare(array $data, ?Model $model = null): array
    {
        $data['author_id'] ??= auth()->id();

        if (($data['status'] ?? null) === Post::STATUS_PUBLISHED && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        return $data;
    }

    /**
     * Draft <-> published (publishing stamps published_at when missing).
     */
    public function toggle(int $id): JsonResponse
    {
        $post = $this->find($id);

        if ($post->status === Post::STATUS_PUBLISHED) {
            $post->update(['status' => Post::STATUS_DRAFT]);
        } else {
            $post->update([
                'status' => Post::STATUS_PUBLISHED,
                'published_at' => $post->published_at ?? now(),
            ]);
        }

        return $this->apiSuccess(new PostResource($post->fresh($this->relations)));
    }
}
