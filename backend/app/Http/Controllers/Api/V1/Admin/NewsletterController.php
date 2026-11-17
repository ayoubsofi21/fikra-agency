<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\Admin\Concerns\ExportsCsv;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\NewsletterSubscriberResource;
use App\Models\NewsletterSubscriber;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class NewsletterController extends Controller
{
    use ExportsCsv;

    public function index(Request $request): JsonResponse
    {
        [$page, $perPage] = $this->paginationParams($request);

        $items = $this->filtered($request)->orderByDesc('created_at')->get();

        return $this->apiPaginated($request, $items, NewsletterSubscriberResource::class, $page, $perPage);
    }

    public function destroy(NewsletterSubscriber $subscriber): JsonResponse
    {
        $subscriber->delete();

        return $this->apiSuccess(['message' => trans('forms.deleted')]);
    }

    public function export(Request $request): StreamedResponse
    {
        $rows = $this->filtered($request)
            ->orderByDesc('created_at')
            ->cursor()
            ->map(fn (NewsletterSubscriber $subscriber) => [
                $subscriber->id,
                $subscriber->email,
                $subscriber->subscribed_at?->toIso8601String(),
                $subscriber->created_at?->toIso8601String(),
            ]);

        return $this->csvDownload(
            'newsletter-subscribers-'.now()->format('Y-m-d').'.csv',
            ['ID', 'Email', 'Subscribed at', 'Created at'],
            $rows,
        );
    }

    /**
     * @return Builder<NewsletterSubscriber>
     */
    private function filtered(Request $request): Builder
    {
        return NewsletterSubscriber::query()->when(
            ($search = trim((string) $request->query('search', ''))) !== '',
            fn (Builder $query) => $query->where('email', 'like', '%'.$search.'%'),
        );
    }
}
