<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\Admin\Concerns\ExportsCsv;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateQuoteRequest;
use App\Http\Resources\Admin\QuoteRequestResource;
use App\Models\QuoteRequest;
use App\Services\QuoteService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class QuoteRequestController extends Controller
{
    use ExportsCsv;

    public function __construct(private readonly QuoteService $quotes) {}

    public function index(Request $request): JsonResponse
    {
        [$page, $perPage] = $this->paginationParams($request);

        $items = $this->filtered($request)->orderByDesc('created_at')->get();

        return $this->apiPaginated($request, $items, QuoteRequestResource::class, $page, $perPage);
    }

    public function show(QuoteRequest $quote): JsonResponse
    {
        return $this->apiSuccess(new QuoteRequestResource($quote));
    }

    public function update(UpdateQuoteRequest $request, QuoteRequest $quote): JsonResponse
    {
        $quote->update($request->validated());

        return $this->apiSuccess(new QuoteRequestResource($quote->fresh()));
    }

    public function destroy(QuoteRequest $quote): JsonResponse
    {
        $this->quotes->deleteAttachments($quote);
        $quote->delete();

        return $this->apiSuccess(['message' => trans('forms.deleted')]);
    }

    public function export(Request $request): StreamedResponse
    {
        $rows = $this->filtered($request)
            ->orderByDesc('created_at')
            ->cursor()
            ->map(fn (QuoteRequest $quote) => [
                $quote->id,
                $quote->name,
                $quote->email,
                $quote->phone,
                $quote->company,
                $quote->project_type,
                $quote->budget_range,
                $quote->timeline,
                $quote->description,
                $quote->status?->value,
                count($quote->attachments ?? []),
                $quote->created_at?->toIso8601String(),
            ]);

        return $this->csvDownload(
            'quote-requests-'.now()->format('Y-m-d').'.csv',
            ['ID', 'Name', 'Email', 'Phone', 'Company', 'Project type', 'Budget', 'Timeline', 'Description', 'Status', 'Attachments', 'Created at'],
            $rows,
        );
    }

    /**
     * Serve a private quote attachment (0-based index within `attachments`).
     */
    public function attachment(QuoteRequest $quote, int $index): StreamedResponse
    {
        $path = ($quote->attachments ?? [])[$index] ?? null;
        $disk = Storage::disk((string) config('agency.attachments.disk', 'local'));

        abort_if($path === null || ! $disk->exists($path), 404);

        return $disk->download($path, basename($path));
    }

    /**
     * @return Builder<QuoteRequest>
     */
    private function filtered(Request $request): Builder
    {
        return QuoteRequest::query()
            ->when(
                $request->filled('status'),
                fn (Builder $query) => $query->where('status', $request->query('status')),
            )
            ->when(
                ($search = trim((string) $request->query('search', ''))) !== '',
                fn (Builder $query) => $query->where(function (Builder $q) use ($search): void {
                    $q->where('name', 'like', '%'.$search.'%')
                        ->orWhere('email', 'like', '%'.$search.'%')
                        ->orWhere('company', 'like', '%'.$search.'%');
                }),
            );
    }
}
