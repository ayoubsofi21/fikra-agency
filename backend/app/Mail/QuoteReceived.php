<?php

namespace App\Mail;

use App\Models\QuoteRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Confirmation sent to the person who submitted the quote form.
 */
class QuoteReceived extends Mailable implements ShouldQueue
{
    use Queueable;
    use SerializesModels;

    public int $tries = 3;

    public function __construct(public QuoteRequest $quote) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: trans('mail.quote_received.subject', ['app' => config('app.name')]),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.confirmation',
            with: [
                'intro' => trans('mail.quote_received.intro', [
                    'name' => $this->quote->name,
                    'app' => config('app.name'),
                ]),
                'closing' => trans('mail.quote_received.closing'),
                'rows' => array_filter([
                    trans('mail.fields.description') => $this->quote->description,
                    trans('mail.fields.project_type') => $this->quote->project_type,
                    trans('mail.fields.budget') => $this->quote->budget_range,
                    trans('mail.fields.timeline') => $this->quote->timeline,
                ], fn ($value) => $value !== null && $value !== ''),
            ],
        );
    }
}
