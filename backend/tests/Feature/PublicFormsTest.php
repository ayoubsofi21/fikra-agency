<?php

use App\Mail\NewContactMessage;
use App\Mail\NewQuoteRequest;
use App\Mail\NewSolutionRequest;
use App\Mail\QuoteReceived;
use App\Models\ContactMessage;
use App\Models\NewsletterSubscriber;
use App\Models\QuoteRequest;
use App\Models\Solution;
use App\Models\SolutionRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Mail::fake();
    Storage::fake('local');
});

it('stores a quote request with a private attachment and queues two emails', function () {
    $file = UploadedFile::fake()->create('brief.pdf', 120, 'application/pdf');

    $response = $this->post('/api/v1/contact', [
        'name' => 'Amina Idrissi',
        'email' => 'AMINA@example.com',
        'phone' => '+212600000000',
        'type' => 'ecommerce',
        'budget' => '2k-5k',
        'timeline' => 'asap',
        'description' => 'We need a bilingual storefront with Stripe checkout.',
        'files' => [$file],
    ]);

    $response->assertCreated()->assertJsonStructure(['data' => ['message']]);

    $quote = QuoteRequest::query()->firstOrFail();
    expect($quote->email)->toBe('amina@example.com')
        ->and($quote->project_type)->toBe('ecommerce')
        ->and($quote->budget_range)->toBe('2k-5k')
        ->and($quote->attachments)->toHaveCount(1);

    Storage::disk('local')->assertExists($quote->attachments[0]);
    expect($quote->attachments[0])->toEndWith('/brief.pdf');

    Mail::assertQueued(NewQuoteRequest::class);
    Mail::assertQueued(QuoteReceived::class, fn ($mail) => $mail->hasTo('amina@example.com'));
});

it('stores a plain contact message and queues one admin email', function () {
    $response = $this->postJson('/api/v1/contact', [
        'name' => 'Youssef',
        'email' => 'youssef@example.com',
        'subject' => 'Hello',
        'message' => 'I would like to discuss a small redesign project.',
    ]);

    $response->assertCreated();

    expect(ContactMessage::query()->count())->toBe(1)
        ->and(QuoteRequest::query()->count())->toBe(0);

    Mail::assertQueued(NewContactMessage::class);
});

it('rejects invalid contact payloads with the error envelope', function () {
    $this->postJson('/api/v1/contact', [])
        ->assertStatus(422)
        ->assertJsonStructure(['message', 'errors' => ['name', 'email']]);

    $this->postJson('/api/v1/contact', [
        'name' => 'Bad',
        'email' => 'not-an-email',
        'description' => 'short',
    ])->assertStatus(422)->assertJsonValidationErrors(['email', 'description']);
});

it('silently rejects honeypot submissions', function () {
    $this->postJson('/api/v1/contact', [
        'name' => 'Bot',
        'email' => 'bot@example.com',
        'description' => 'This should never reach the database.',
        'honeypot' => 'http://spam.example',
    ])->assertStatus(422);

    expect(QuoteRequest::query()->count())->toBe(0);
    Mail::assertNothingQueued();
});

it('throttles the public contact form at five requests per minute', function () {
    $payload = [
        'name' => 'Rate',
        'email' => 'rate@example.com',
        'message' => 'A perfectly valid contact message body.',
    ];

    foreach (range(1, 5) as $attempt) {
        $this->postJson('/api/v1/contact', $payload)->assertCreated();
    }

    $this->postJson('/api/v1/contact', $payload)
        ->assertStatus(429)
        ->assertJsonStructure(['message', 'errors']);
});

it('subscribes, deduplicates and unsubscribes newsletter emails', function () {
    $this->postJson('/api/v1/newsletter', ['email' => 'News@Example.com'])
        ->assertCreated()
        ->assertJsonPath('data.subscribed', true);

    $subscriber = NewsletterSubscriber::query()->firstOrFail();
    expect($subscriber->email)->toBe('news@example.com');

    $this->postJson('/api/v1/newsletter', ['email' => 'news@example.com'])
        ->assertOk()
        ->assertJsonPath('data.subscribed', true);

    expect(NewsletterSubscriber::query()->count())->toBe(1);

    $this->getJson('/api/v1/newsletter/unsubscribe/'.$subscriber->token)
        ->assertOk()
        ->assertJsonPath('data.subscribed', false);

    expect(NewsletterSubscriber::query()->count())->toBe(0);

    $this->getJson('/api/v1/newsletter/unsubscribe/'.$subscriber->token)->assertNotFound();
    $this->postJson('/api/v1/newsletter', ['email' => 'invalid'])->assertStatus(422);
});

it('creates solution requests from the detail page and queues an email', function () {
    $solution = Solution::factory()->create(['is_active' => true]);

    $this->postJson('/api/v1/solutions/'.$solution->slug.'/request', [
        'name' => 'Sara',
        'email' => 'sara@example.com',
        'message' => 'Can this solution be customized for our agency?',
    ])->assertCreated();

    $request = SolutionRequest::query()->firstOrFail();
    expect($request->solution_id)->toBe($solution->id)
        ->and($request->email)->toBe('sara@example.com');

    Mail::assertQueued(NewSolutionRequest::class);

    $this->postJson('/api/v1/solutions/unknown/request', [
        'name' => 'Sara',
        'email' => 'sara@example.com',
        'message' => 'No such solution here.',
    ])->assertStatus(422)->assertJsonValidationErrors(['solution_slug']);
});
