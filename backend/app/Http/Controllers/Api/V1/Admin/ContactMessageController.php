<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\Admin\Concerns\ExportsCsv;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateContactMessageRequest;
use App\Http\Resources\Admin\ContactMessageResource;
use App\Models\ContactMessage;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ContactMessageController extends Controller
{
    use ExportsCsv;

    public function index(Request $request): JsonResponse
    {
        [$page, $perPage] = $this->paginationParams($request);

        $items = $this->filtered($request)->orderByDesc('created_at')->get();

        return $this->apiPaginated($request, $items, ContactMessageResource::class, $page, $perPage);
    }

    public function show(ContactMessage $message): JsonResponse
    {
        return $this->apiSuccess(new ContactMessageResource($message));
    }

    public function update(UpdateContactMessageRequest $request, ContactMessage $message): JsonResponse
    {
        $message->update($request->validated());

        return $this->apiSuccess(new ContactMessageResource($message->fresh()));
    }

    public function destroy(ContactMessage $message): JsonResponse
    {
        $message->delete();

        return $this->apiSuccess(['message' => trans('forms.deleted')]);
    }

    public function export(Request $request): StreamedResponse
    {
        $rows = $this->filtered($request)
            ->orderByDesc('created_at')
            ->cursor()
            ->map(fn (ContactMessage $message) => [
                $message->id,
                $message->name,
                $message->email,
                $message->subject,
                $message->message,
                $message->is_read ? 'read' : 'unread',
                $message->created_at?->toIso8601String(),
            ]);

        return $this->csvDownload(
            'contact-messages-'.now()->format('Y-m-d').'.csv',
            ['ID', 'Name', 'Email', 'Subject', 'Message', 'Status', 'Created at'],
            $rows,
        );
    }

    /**
     * @return Builder<ContactMessage>
     */
    private function filtered(Request $request): Builder
    {
        return ContactMessage::query()
            ->when($request->has('is_read'), fn (Builder $query) => $query->where('is_read', $request->boolean('is_read')))
            ->when(
                ($search = trim((string) $request->query('search', ''))) !== '',
                fn (Builder $query) => $query->where(function (Builder $q) use ($search): void {
                    $q->where('name', 'like', '%'.$search.'%')
                        ->orWhere('email', 'like', '%'.$search.'%')
                        ->orWhere('subject', 'like', '%'.$search.'%')
                        ->orWhere('message', 'like', '%'.$search.'%');
                }),
            );
    }
}
