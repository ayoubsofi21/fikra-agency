<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\SolutionRequestRequest;
use App\Mail\NewSolutionRequest;
use App\Models\Solution;
use App\Models\SolutionRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;

class SolutionRequestController extends Controller
{
    /**
     * POST /solution-requests and POST /solutions/{slug}/request.
     */
    public function store(SolutionRequestRequest $request, ?string $slug = null): JsonResponse
    {
        $data = $request->validated();

        $solution = Solution::query()
            ->active()
            ->when(
                $slug !== null,
                fn ($query) => $query->where('slug', $slug),
                fn ($query) => $query->when(
                    isset($data['solution_id']),
                    fn ($q) => $q->whereKey($data['solution_id']),
                    fn ($q) => $q->where('slug', $data['solution_slug']),
                ),
            )
            ->first();

        if ($solution === null) {
            return $this->apiNotFound();
        }

        $solutionRequest = SolutionRequest::create([
            'solution_id' => $solution->id,
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'company' => $data['company'] ?? null,
            'message' => $data['message'],
        ]);

        Mail::to(config('agency.admin_email'))
            ->locale((string) config('agency.default_locale', 'en'))
            ->queue(new NewSolutionRequest($solutionRequest->setRelation('solution', $solution)));

        return $this->apiCreated(['message' => trans('forms.solution_request_sent')]);
    }
}
