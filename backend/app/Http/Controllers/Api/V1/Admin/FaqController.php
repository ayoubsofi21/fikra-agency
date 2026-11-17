<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Requests\Admin\FaqRequest;
use App\Http\Resources\Admin\FaqResource;
use App\Models\Faq;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class FaqController extends AdminResourceController
{
    protected array $searchColumns = ['question'];

    protected function modelClass(): string
    {
        return Faq::class;
    }

    protected function resourceClass(): string
    {
        return FaqResource::class;
    }

    protected function requestClass(): string
    {
        return FaqRequest::class;
    }

    protected function applyFilters(Builder $query, Request $request): void
    {
        if ($request->filled('group')) {
            $query->where('group', $request->query('group'));
        }
    }
}
