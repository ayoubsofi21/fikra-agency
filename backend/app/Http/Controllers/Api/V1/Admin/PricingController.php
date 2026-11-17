<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Requests\Admin\PricingPlanRequest;
use App\Http\Resources\Admin\PricingPlanResource;
use App\Models\PricingPlan;

class PricingController extends AdminResourceController
{
    protected array $searchColumns = ['name', 'key'];

    protected function modelClass(): string
    {
        return PricingPlan::class;
    }

    protected function resourceClass(): string
    {
        return PricingPlanResource::class;
    }

    protected function requestClass(): string
    {
        return PricingPlanRequest::class;
    }
}
