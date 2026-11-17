<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SolutionFeatureRequest;
use App\Http\Resources\Admin\SolutionFeatureResource;
use App\Models\Solution;
use App\Models\SolutionFeature;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Nested solution features (/solutions/{solution}/features for index+store,
 * shallow /features/{feature} for the rest).
 */
class SolutionFeatureController extends Controller
{
    public function index(Solution $solution): JsonResponse
    {
        return $this->apiSuccess(
            SolutionFeatureResource::collection($solution->features()->get())
        );
    }

    public function store(Solution $solution): JsonResponse
    {
        $request = app(SolutionFeatureRequest::class);
        $data = $request->validated();
        $data['order'] ??= ((int) $solution->features()->max('order')) + 1;

        $feature = $solution->features()->create($data);

        return $this->apiCreated(new SolutionFeatureResource($feature));
    }

    public function show(SolutionFeature $feature): JsonResponse
    {
        return $this->apiSuccess(new SolutionFeatureResource($feature));
    }

    public function update(SolutionFeature $feature): JsonResponse
    {
        $request = app(SolutionFeatureRequest::class);

        $feature->update($request->validated());

        return $this->apiSuccess(new SolutionFeatureResource($feature->fresh()));
    }

    public function destroy(SolutionFeature $feature): JsonResponse
    {
        $feature->delete();

        return $this->apiSuccess(['message' => trans('forms.deleted')]);
    }

    public function reorder(Request $request, Solution $solution): JsonResponse
    {
        $payload = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'distinct'],
        ]);

        $features = $solution->features()->whereIn('id', $payload['ids'])->get()->keyBy('id');
        $position = 1;

        foreach ($payload['ids'] as $id) {
            $feature = $features->get($id);

            if ($feature !== null) {
                $feature->update(['order' => $position]);
                $position++;
            }
        }

        return $this->apiSuccess(['message' => trans('forms.reordered')]);
    }
}
