<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\ContactRequest;
use App\Mail\NewContactMessage;
use App\Models\ContactMessage;
use App\Services\QuoteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;

/**
 * POST /contact — single entry point used by the frontend's quote form.
 *
 * Payloads with `description` are treated as quote requests (persisted on
 * `quote_requests` + two queued emails); payloads with only `message` become
 * contact messages (persisted on `contact_messages` + one admin email).
 */
class ContactController extends Controller
{
    public function __construct(private readonly QuoteService $quotes) {}

    public function store(ContactRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->isQuote()) {
            $files = array_values(array_filter(array_merge(
                $request->file('files', []),
                [$request->file('attachment')],
            )));

            $quote = $this->quotes->create($data, $files, $request->ip());
            $this->quotes->notify($quote, app()->getLocale());

            return $this->apiCreated(['message' => trans('forms.quote_sent')]);
        }

        $message = ContactMessage::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'subject' => $data['subject'] ?? null,
            'message' => $data['message'],
        ]);

        Mail::to(config('agency.admin_email'))
            ->locale((string) config('agency.default_locale', 'en'))
            ->queue(new NewContactMessage($message));

        return $this->apiCreated(['message' => trans('forms.message_sent')]);
    }
}
