<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Password reset link. Sent synchronously so it works without a queue
 * worker; the link points at the frontend's reset screen, which then POSTs
 * the token back to /admin/auth/reset-password.
 */
class ResetPasswordMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(
        public User $user,
        public string $resetUrl,
        public int $expiresInMinutes = 60,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: trans('mail.reset_password.subject', ['app' => config('app.name')]),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.reset-password',
            with: [
                'name' => $this->user->name,
                'intro' => trans('mail.reset_password.intro'),
                'action' => trans('mail.reset_password.action'),
                'expires' => trans('mail.reset_password.expires', ['minutes' => $this->expiresInMinutes]),
                'ignore' => trans('mail.reset_password.ignore'),
                'url' => $this->resetUrl,
            ],
        );
    }
}
