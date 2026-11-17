<?php

namespace App\Mail;

use App\Models\ContactMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Admin notification for a plain contact message.
 */
class NewContactMessage extends Mailable implements ShouldQueue
{
    use Queueable;
    use SerializesModels;

    public int $tries = 3;

    public function __construct(public ContactMessage $contactMessage) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: trans('mail.new_contact.subject', ['name' => $this->contactMessage->name]),
            replyTo: [new Address($this->contactMessage->email, $this->contactMessage->name)],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.admin-notification',
            with: [
                'title' => trans('mail.new_contact.subject', ['name' => $this->contactMessage->name]),
                'intro' => trans('mail.new_contact.intro'),
                'closing' => trans('mail.new_contact.closing'),
                'rows' => array_filter([
                    trans('mail.fields.name') => $this->contactMessage->name,
                    trans('mail.fields.email') => $this->contactMessage->email,
                    trans('mail.fields.subject') => $this->contactMessage->subject,
                    trans('mail.fields.message') => $this->contactMessage->message,
                    trans('mail.fields.submitted_at') => $this->contactMessage->created_at?->toDayDateTimeString(),
                ], fn ($value) => $value !== null && $value !== ''),
            ],
        );
    }
}
