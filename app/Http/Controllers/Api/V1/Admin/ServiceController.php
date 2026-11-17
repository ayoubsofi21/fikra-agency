<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Requests\Admin\ServiceRequest;
use App\Http\Resources\Admin\ServiceResource;
use App\Models\Service;

class ServiceController extends AdminResourceController
{
    protected array $searchColumns = ['title', 'slug', 'category'];

    protected function modelClass(): string
    {
        return Service::class;
    }

    protected function resourceClass(): string
    {
        return ServiceResource::class;
    }

    protected function requestClass(): string
    {
        return ServiceRequest::class;
    }
}
