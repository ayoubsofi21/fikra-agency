<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Shared CRUD behaviour for admin content endpoints.
 *
 * Concrete controllers declare their model, resource and request classes,
 * eager-loaded relations and searchable columns; everything else (list
 * envelope, pagination, ordering, soft deletes, toggle, reorder) is handled
 * here. Cache invalidation happens in the FlushContentCache middleware.
 */
abstract class AdminResourceController extends Controller
{
    /** @return class-string<Model> */
    abstract protected function modelClass(): string;

    /** @return class-string<JsonResource> */
    abstract protected function resourceClass(): string;

    /** @return class-string<FormRequest> */
    abstract protected function requestClass(): string;

    /** @var array<int, string> */
    protected array $relations = [];

    /** @var array<int, string> */
    protected array $searchColumns = [];

    protected string $orderBy = 'order';

    protected string $orderDirection = 'asc';

    protected bool $usesOrder = true;

    protected bool $softDeletes = false;

    public function index(Request $request): JsonResponse
    {
        [$page, $perPage] = $this->paginationParams($request);

        $query = $this->modelClass()::query()->with($this->relations);

        if ($this->softDeletes && $request->query('trashed') === 'only') {
            $query->onlyTrashed();
        } elseif ($this->softDeletes && $request->query('trashed') === 'with') {
            $query->withTrashed();
        }

        if ($this->searchColumns !== []) {
            $search = trim((string) $request->query('search', ''));

            if ($search !== '') {
                $query->where(function (Builder $q) use ($search): void {
                    foreach ($this->searchColumns as $column) {
                        $q->orWhere($column, 'like', '%'.$search.'%');
                    }
                });
            }
        }

        $this->applyFilters($query, $request);

        $items = $query
            ->orderBy($this->orderBy, $this->orderDirection)
            ->orderBy('id')
            ->get();

        return $this->apiPaginated($request, $items, $this->resourceClass(), $page, $perPage);
    }

    public function show(int $id): JsonResponse
    {
        return $this->apiSuccess(
            new ($this->resourceClass())($this->find($id)->load($this->relations))
        );
    }

    public function store(): JsonResponse
    {
        $request = app($this->requestClass());
        $data = $this->prepare($request->validated());

        $model = $this->modelClass()::create($data);

        return $this->apiCreated(
            new ($this->resourceClass())($model->fresh($this->relations))
        );
    }

    public function update(int $id): JsonResponse
    {
        $model = $this->find($id);
        $request = app($this->requestClass());

        $model->update($this->prepare($request->validated(), $model));

        return $this->apiSuccess(
            new ($this->resourceClass())($model->fresh($this->relations))
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $this->find($id)->delete();

        return $this->apiSuccess(['message' => trans('forms.deleted')]);
    }

    public function restore(int $id): JsonResponse
    {
        abort_unless($this->softDeletes, 404);

        $model = $this->modelClass()::query()->withTrashed()->findOrFail($id);
        $model->restore();

        return $this->apiSuccess(
            new ($this->resourceClass())($model->fresh($this->relations))
        );
    }

    public function toggle(int $id): JsonResponse
    {
        $model = $this->find($id);
        $column = $this->toggleColumn();

        $model->update([$column => ! $model->{$column}]);

        return $this->apiSuccess(
            new ($this->resourceClass())($model->fresh($this->relations))
        );
    }

    public function reorder(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'distinct'],
        ]);

        abort_unless($this->usesOrder, 404);

        $models = $this->modelClass()::query()
            ->whereIn('id', $payload['ids'])
            ->get()
            ->keyBy('id');

        $position = 1;

        foreach ($payload['ids'] as $id) {
            $model = $models->get($id);

            if ($model !== null) {
                $model->update(['order' => $position]);
                $position++;
            }
        }

        return $this->apiSuccess(['message' => trans('forms.reordered')]);
    }

    protected function toggleColumn(): string
    {
        return 'is_active';
    }

    /**
     * Massage validated input before writing (resolve aliases, defaults).
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    protected function prepare(array $data, ?Model $model = null): array
    {
        if ($this->usesOrder && ! isset($data['order']) && $model === null) {
            $data['order'] = ((int) $this->modelClass()::max('order')) + 1;
        }

        return $data;
    }

    /**
     * Extra query filters (status, category, group, ...).
     */
    protected function applyFilters(Builder $query, Request $request): void {}

    protected function find(int $id): Model
    {
        return $this->modelClass()::query()->findOrFail($id);
    }
}
