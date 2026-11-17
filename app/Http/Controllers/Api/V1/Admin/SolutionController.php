<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Requests\Admin\SolutionRequest;
use App\Http\Resources\Admin\SolutionResource;
use App\Models\Solution;
use App\Models\SolutionCategory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class SolutionController extends AdminResourceController
{
    protected array $relations = ['category', 'features'];

    protected array $searchColumns = ['title', 'slug'];

    protected bool $softDeletes = true;

    protected function modelClass(): string
    {
        return Solution::class;
    }

    protected function resourceClass(): string
    {
        return SolutionResource::class;
    }

    protected function requestClass(): string
    {
        return SolutionRequest::class;
    }

    protected function applyFilters(Builder $query, Request $request): void
    {
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->query('category_id'));
        }

        if ($request->filled('category')) {
            $query->whereHas('category', fn (Builder $q) => $q->where('slug', $request->query('category')));
        }
    }

    protected function prepare(array $data, ?Model $model = null): array
    {
        if (! isset($data['category_id']) && isset($data['category_slug'])) {
            $data['category_id'] = SolutionCategory::query()
                ->where('slug', $data['category_slug'])
                ->value('id');
        }

        unset($data['category_slug']);

        return parent::prepare($data, $model);
    }
}
