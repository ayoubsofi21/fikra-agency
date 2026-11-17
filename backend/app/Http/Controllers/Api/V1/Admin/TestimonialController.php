<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Requests\Admin\TestimonialRequest;
use App\Http\Resources\Admin\TestimonialResource;
use App\Models\Testimonial;

class TestimonialController extends AdminResourceController
{
    protected array $searchColumns = ['author_name', 'company'];

    protected function modelClass(): string
    {
        return Testimonial::class;
    }

    protected function resourceClass(): string
    {
        return TestimonialResource::class;
    }

    protected function requestClass(): string
    {
        return TestimonialRequest::class;
    }
}
