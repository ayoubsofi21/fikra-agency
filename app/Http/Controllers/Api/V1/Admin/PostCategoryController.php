<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Requests\Admin\PostCategoryRequest;
use App\Http\Resources\Admin\PostCategoryResource;
use App\Models\PostCategory;

class PostCategoryController extends AdminResourceController
{
    protected array $searchColumns = ['name', 'slug'];

    protected string $orderBy = 'id';

    protected bool $usesOrder = false;

    protected function modelClass(): string
    {
        return PostCategory::class;
    }

    protected function resourceClass(): string
    {
        return PostCategoryResource::class;
    }

    protected function requestClass(): string
    {
        return PostCategoryRequest::class;
    }
}
