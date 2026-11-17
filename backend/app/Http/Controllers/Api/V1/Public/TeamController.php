<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Public\TeamMemberResource;
use App\Models\TeamMember;
use App\Services\ContentCache;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function __construct(private readonly ContentCache $cache) {}

    public function index(Request $request): JsonResponse
    {
        [$page, $perPage] = $this->paginationParams($request);

        $team = $this->cache->remember('team:index', [], fn () => TeamMember::query()
            ->active()
            ->orderBy('order')
            ->get());

        return $this->apiPaginated($request, $team, TeamMemberResource::class, $page, $perPage);
    }
}
