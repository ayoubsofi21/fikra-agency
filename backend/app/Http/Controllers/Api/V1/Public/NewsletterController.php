<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\NewsletterRequest;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;

class NewsletterController extends Controller
{
    public function store(NewsletterRequest $request): JsonResponse
    {
        $email = (string) $request->validated('email');

        $subscriber = NewsletterSubscriber::query()->where('email', $email)->first();

        if ($subscriber !== null) {
            return $this->apiSuccess([
                'subscribed' => true,
                'message' => trans('forms.newsletter_already_subscribed'),
            ]);
        }

        NewsletterSubscriber::create(['email' => $email]);

        return $this->apiCreated([
            'subscribed' => true,
            'message' => trans('forms.newsletter_subscribed'),
        ]);
    }

    public function unsubscribe(string $token): JsonResponse
    {
        $subscriber = NewsletterSubscriber::query()->where('token', $token)->first();

        if ($subscriber === null) {
            return $this->apiNotFound();
        }

        $subscriber->delete();

        return $this->apiSuccess([
            'subscribed' => false,
            'message' => trans('forms.newsletter_unsubscribed'),
        ]);
    }
}
