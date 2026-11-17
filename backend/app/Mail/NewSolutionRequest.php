<?php

namespace App\Mail;

use App\Models\SolutionRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Admin notification for a "request this solution" submission.
 */
class NewSolutionRequest extends Mailable implements ShouldQueue
{
    use Queueable;
    use SerializesModels;

    public int $tries = 3;

    public function __construct(public SolutionRequest $solutionRequest) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: trans('mail.new_solution.subject', ['name' => $this->solutionRequest->name]),
            replyTo: [new Address($this->solutionRequest->email, $this->solutionRequest->name)],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.admin-notification',
            with: [
                'title' => trans('mail.new_solution.subject', ['name' => $this->solutionRequest->name]),
                'intro' => trans('mail.new_solution.intro'),
                'closing' => trans('mail.new_solution.closing'),
                'rows' => array_filter([
                    trans('mail.fields.name') => $this->solutionRequest->name,
                    trans('mail.fields.email') => $this->solutionRequest->email,
                    trans('mail.fields.phone') => $this->solutionRequest->phone,
                    trans('mail.fields.company') => $this->solutionRequest->company,
                    trans('mail.fields.solution') => $this->solutionRequest->solution?->translated('title'),
                    trans('mail.fields.message') => $this->solutionRequest->message,
                    trans('mail.fields.submitted_at') => $this->solutionRequest->created_at?->toDayDateTimeString(),
                ], fn ($value) => $value !== null && $value !== ''),
            ],
        );
    }
}
