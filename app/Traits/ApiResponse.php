<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

/**
 * Consistent JSON envelopes for the whole API.
 *
 * Success (single):  { "data": {...} }
 * Success (list):    { "data": [...], "meta": {...}, "links": {...} }  (via ResourceCollection)
 * Error:             { "message": "...", "errors": {...} }
 */
trait ApiResponse
{
    /**
     * Single resource or plain payload envelope: { "data": ... }.
     */
    protected function apiSuccess(mixed $data, int $code = 200): JsonResponse
    {
        return response()->json(['data' => $data], $code);
    }

    /**
     * 201 Created envelope: { "data": ... }.
     */
    protected function apiCreated(mixed $data): JsonResponse
    {
        return $this->apiSuccess($data, 201);
    }

    /**
     * Error envelope: { "message": "...", "errors": {...} }.
     */
    protected function apiError(string $message, int $code = 400, ?array $errors = null): JsonResponse
    {
        return response()->json([
            'message' => $message,
            'errors' => $errors ?? (object) [],
        ], $code);
    }

    protected function apiNotFound(?string $message = null): JsonResponse
    {
        return $this->apiError($message ?? trans('errors.not_found'), 404);
    }

    protected function apiUnauthorized(?string $message = null): JsonResponse
    {
        return $this->apiError($message ?? trans('errors.unauthenticated'), 401);
    }

    protected function apiForbidden(?string $message = null): JsonResponse
    {
        return $this->apiError($message ?? trans('errors.forbidden'), 403);
    }

    protected function apiTooMany(?string $message = null): JsonResponse
    {
        return $this->apiError($message ?? trans('errors.too_many_requests'), 429);
    }

    /**
     * Validation failure envelope, message localized through lang files.
     *
     * @param  ValidationException|array<string, array<string>>  $errors
     */
    protected function apiValidationErrors(ValidationException|array $errors, ?string $message = null): JsonResponse
    {
        $bag = $errors instanceof ValidationException
            ? $errors->errors()
            : $errors;

        return $this->apiError(
            $message ?? trans('errors.validation_failed'),
            422,
            $bag,
        );
    }

    /**
     * Normalized pagination input: ?page= (>=1) and ?per_page= (1..50,
     * `limit` accepted as an alias for the frontend's axios layer).
     *
     * @return array{0: int, 1: int} [page, perPage]
     */
    protected function paginationParams(Request $request): array
    {
        $perPage = $request->query('per_page', $request->query('limit', 15));
        $perPage = max(1, min(50, (int) $perPage));
        $page = max(1, (int) $request->query('page', 1));

        return [$page, $perPage];
    }

    /**
     * List envelope required by the spec:
     *   { data, meta: { pagination: {...} }, links: { first, last, prev, next } }
     *
     * Slices the given collection in memory (public lists are small and are
     * served from ContentCache anyway).
     *
     * @param  class-string<JsonResource>  $resourceClass
     * @param  Collection<int, mixed>  $items
     */
    protected function apiPaginated(Request $request, Collection $items, string $resourceClass, int $page, int $perPage): JsonResponse
    {
        $total = $items->count();
        $lastPage = max(1, (int) ceil($total / $perPage));
        $page = min($page, $lastPage);
        $slice = $items->forPage($page, $perPage)->values();

        $urlFor = fn (int $target): string => $request->fullUrlWithQuery([
            'page' => $target,
            'per_page' => $perPage,
        ]);

        return response()->json([
            'data' => $resourceClass::collection($slice),
            'meta' => [
                'pagination' => [
                    'current_page' => $page,
                    'per_page' => $perPage,
                    'total' => $total,
                    'last_page' => $lastPage,
                    'from' => $total > 0 ? ($page - 1) * $perPage + 1 : null,
                    'to' => min($total, $page * $perPage),
                ],
            ],
            'links' => [
                'first' => $urlFor(1),
                'last' => $urlFor($lastPage),
                'prev' => $page > 1 ? $urlFor($page - 1) : null,
                'next' => $page < $lastPage ? $urlFor($page + 1) : null,
            ],
        ]);
    }
}
