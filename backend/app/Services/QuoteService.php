<?php

namespace App\Services;

use App\Mail\NewQuoteRequest;
use App\Mail\QuoteReceived;
use App\Models\QuoteRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Quote request lifecycle: private attachment storage + notification emails.
 *
 * Emails are queued (database queue in dev) so the public form responds
 * immediately. Both messages are rendered in their own locale: the admin
 * copy in the app default locale, the confirmation in the sender's locale.
 */
class QuoteService
{
    /**
     * Persist a quote request coming from the public form.
     *
     * @param  array<string, mixed>  $data  validated payload
     * @param  array<int, UploadedFile>  $files
     */
    public function create(array $data, array $files = [], ?string $ip = null): QuoteRequest
    {
        $paths = $this->storeAttachments($files);

        return QuoteRequest::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'company' => $data['company'] ?? null,
            'project_type' => $data['project_type'] ?? $data['type'] ?? null,
            'budget_range' => $data['budget_range'] ?? $data['budget'] ?? null,
            'timeline' => $data['timeline'] ?? null,
            'description' => $data['description'],
            'attachment' => $paths[0] ?? null,
            'attachments' => $paths !== [] ? $paths : null,
            'ip_address' => $ip,
        ]);
    }

    /**
     * Queue the two localized emails for a new quote request.
     */
    public function notify(QuoteRequest $quote, string $locale): void
    {
        $adminLocale = (string) config('agency.default_locale', 'en');

        Mail::to(config('agency.admin_email'))
            ->locale($adminLocale)
            ->queue(new NewQuoteRequest($quote));

        Mail::to($quote->email)
            ->locale($locale)
            ->queue(new QuoteReceived($quote));
    }

    /**
     * Store uploads on the private disk and return their relative paths.
     *
     * @param  array<int, UploadedFile>  $files
     * @return array<int, string>
     */
    public function storeAttachments(array $files): array
    {
        $disk = Storage::disk(config('agency.attachments.disk', 'local'));
        $directory = trim((string) config('agency.attachments.path', 'quote-attachments'), '/');
        $paths = [];

        foreach ($files as $file) {
            if (! $file instanceof UploadedFile) {
                continue;
            }

            // Unique folder keeps collisions impossible while the stored
            // basename stays the client's original file name (used when the
            // admin downloads the attachment).
            $folder = Str::uuid()->toString();
            $name = preg_replace('/[^A-Za-z0-9._-]+/', '-', $file->getClientOriginalName()) ?: 'attachment.'.$file->extension();

            $disk->putFileAs($directory.'/'.$folder, $file, $name);
            $paths[] = $directory.'/'.$folder.'/'.$name;
        }

        return $paths;
    }

    /**
     * Remove stored attachments (used when an admin deletes a quote).
     */
    public function deleteAttachments(QuoteRequest $quote): void
    {
        $paths = $quote->attachments ?? array_filter([$quote->attachment]);

        if ($paths === []) {
            return;
        }

        $disk = Storage::disk(config('agency.attachments.disk', 'local'));

        foreach ($paths as $path) {
            $disk->delete($path);
        }
    }
}
