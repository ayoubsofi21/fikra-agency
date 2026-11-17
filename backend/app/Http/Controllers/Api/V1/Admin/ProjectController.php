<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Requests\Admin\ProjectRequest;
use App\Http\Resources\Admin\ProjectResource;
use App\Models\Project;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class ProjectController extends AdminResourceController
{
    protected array $searchColumns = ['title', 'slug', 'client_name', 'category'];

    protected bool $softDeletes = true;

    protected function modelClass(): string
    {
        return Project::class;
    }

    protected function resourceClass(): string
    {
        return ProjectResource::class;
    }

    protected function requestClass(): string
    {
        return ProjectRequest::class;
    }

    protected function applyFilters(Builder $query, Request $request): void
    {
        if ($request->filled('category')) {
            $query->where('category', $request->query('category'));
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }
    }
}
