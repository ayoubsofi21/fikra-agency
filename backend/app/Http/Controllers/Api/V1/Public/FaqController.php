<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Public\FaqResource;
use App\Models\Faq;
use App\Services\ContentCache;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function __construct(private readonly ContentCache $cache) {}

    public function index(Request $request): JsonResponse
    {
        [$page, $perPage] = $this->paginationParams($request);

        $group = $request->query('group');
        $group = is_string($group) && $group !== '' ? $group : null;

        $faqs = $this->cache->remember('faqs:index', ['group' => $group], function () use ($group) {
            $query = Faq::query()->active()->orderBy('order');

            if ($group !== null) {
                $query->where('group', $group);
            }

            return $query->get();
        });

        return $this->apiPaginated($request, $faqs, FaqResource::class, $page, $perPage);
    }
}
