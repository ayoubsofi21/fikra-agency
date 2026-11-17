<?php

namespace App\Mail;

use App\Models\QuoteRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Admin notification for a new quote request.
 */
class NewQuoteRequest extends Mailable implements ShouldQueue
{
    use Queueable;
    use SerializesModels;

    public int $tries = 3;

    public function __construct(public QuoteRequest $quote) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: trans('mail.new_quote.subject', ['name' => $this->quote->name]),
            replyTo: [new Address($this->quote->email, $this->quote->name)],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.admin-notification',
            with: [
                'title' => trans('mail.new_quote.subject', ['name' => $this->quote->name]),
                'intro' => trans('mail.new_quote.intro'),
                'closing' => trans('mail.new_quote.closing'),
                'rows' => $this->rows(),
            ],
        );
    }

    /**
     * @return array<string, string|null>
     */
    private function rows(): array
    {
        $quote = $this->quote;

        return array_filter([
            trans('mail.fields.name') => $quote->name,
            trans('mail.fields.email') => $quote->email,
            trans('mail.fields.phone') => $quote->phone,
            trans('mail.fields.company') => $quote->company,
            trans('mail.fields.project_type') => $quote->project_type,
            trans('mail.fields.budget') => $quote->budget_range,
            trans('mail.fields.timeline') => $quote->timeline,
            trans('mail.fields.description') => $quote->description,
            trans('mail.fields.attachments') => $quote->attachments !== null
                ? implode(', ', array_map('basename', $quote->attachments))
                : null,
            trans('mail.fields.submitted_at') => $quote->created_at?->toDayDateTimeString(),
        ], fn ($value) => $value !== null && $value !== '');
    }
}
