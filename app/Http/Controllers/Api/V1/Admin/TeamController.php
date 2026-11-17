<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Requests\Admin\TeamMemberRequest;
use App\Http\Resources\Admin\TeamMemberResource;
use App\Models\TeamMember;

class TeamController extends AdminResourceController
{
    protected array $searchColumns = ['name', 'role', 'email'];

    protected function modelClass(): string
    {
        return TeamMember::class;
    }

    protected function resourceClass(): string
    {
        return TeamMemberResource::class;
    }

    protected function requestClass(): string
    {
        return TeamMemberRequest::class;
    }
}
