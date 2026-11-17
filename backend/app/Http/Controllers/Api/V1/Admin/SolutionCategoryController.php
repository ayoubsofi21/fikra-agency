<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Requests\Admin\SolutionCategoryRequest;
use App\Http\Resources\Admin\SolutionCategoryResource;
use App\Models\SolutionCategory;

class SolutionCategoryController extends AdminResourceController
{
    protected array $searchColumns = ['name', 'slug'];

    protected string $orderBy = 'id';

    protected bool $usesOrder = false;

    protected function modelClass(): string
    {
        return SolutionCategory::class;
    }

    protected function resourceClass(): string
    {
        return SolutionCategoryResource::class;
    }

    protected function requestClass(): string
    {
        return SolutionCategoryRequest::class;
    }
}
