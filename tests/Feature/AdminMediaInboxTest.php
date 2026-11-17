<?php

use App\Models\ContactMessage;
use App\Models\NewsletterSubscriber;
use App\Models\Project;
use App\Models\QuoteRequest;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    seedRoles();
    Storage::fake('public');
    Storage::fake('local');
    Queue::fake();
});

it('uploads, lists, renames and deletes project media', function () {
    actingAsRole('admin');
    $project = Project::factory()->create();

    $response = $this->post("/api/v1/admin/media/projects/{$project->id}", [
        'collection' => 'gallery',
        'files' => [
            UploadedFile::fake()->create('one.png', 20, 'image/png'),
            UploadedFile::fake()->create('two.png', 20, 'image/png'),
        ],
    ]);

    $response->assertCreated()->assertJsonCount(2, 'data.media');

    $mediaIds = collect($response->json('data.media'))->pluck('id');
    expect($project->getMedia('gallery'))->toHaveCount(2);

    $this->getJson("/api/v1/admin/media/projects/{$project->id}")
        ->assertOk()
        ->assertJsonCount(2, 'data.media');

    $mediaId = $mediaIds->first();

    $this->patchJson("/api/v1/admin/media/{$mediaId}", [
        'name' => 'Hero shot',
        'alt' => 'Project hero',
    ])->assertOk()
        ->assertJsonPath('data.name', 'Hero shot')
        ->assertJsonPath('data.custom_properties.alt', 'Project hero');

    $this->deleteJson("/api/v1/admin/media/{$mediaId}")->assertOk();
    expect($project->refresh()->getMedia('gallery'))->toHaveCount(1);
});

it('rejects unknown media collections, types and file kinds', function () {
    actingAsRole('admin');
    $project = Project::factory()->create();
    $file = UploadedFile::fake()->create('notes.txt', 5, 'text/plain');

    $this->post("/api/v1/admin/media/projects/{$project->id}", [
        'collection' => 'nope',
        'files' => [$file],
    ])->assertStatus(422);

    $this->post('/api/v1/admin/media/widgets/1', [
        'collection' => 'cover',
        'files' => [UploadedFile::fake()->create('cover.png', 10, 'image/png')],
    ])->assertNotFound();

    $this->post("/api/v1/admin/media/projects/{$project->id}", [
        'collection' => 'cover',
        'files' => [$file],
    ])->assertStatus(422);
});

it('lets editors upload a user avatar', function () {
    $editor = actingAsRole('editor');

    $this->post("/api/v1/admin/media/users/{$editor->id}", [
        'collection' => 'avatar',
        'files' => [UploadedFile::fake()->create('me.png', 10, 'image/png')],
    ])->assertCreated();

    $this->getJson('/api/v1/admin/auth/me')
        ->assertOk()
        ->assertJsonPath('data.user.avatar', fn ($url) => is_string($url) && $url !== '');
});

it('lists, filters, updates, exports and deletes quote requests', function () {
    actingAsRole('admin');

    Storage::disk('local')->put('quote-attachments/uuid/brief.pdf', '%PDF-1.4 test');

    $quote = QuoteRequest::factory()->create([
        'name' => 'Inbox Lead',
        'email' => 'lead@example.com',
        'status' => 'new',
        'attachment' => 'quote-attachments/uuid/brief.pdf',
        'attachments' => ['quote-attachments/uuid/brief.pdf'],
    ]);

    $this->getJson('/api/v1/admin/quotes')
        ->assertOk()
        ->assertJsonPath('meta.pagination.total', 1)
        ->assertJsonStructure(['data' => [[
            'id', 'name', 'email', 'status', 'attachments', 'attachments_meta',
        ]]]);

    $this->getJson('/api/v1/admin/quotes?status=won')->assertJsonPath('meta.pagination.total', 0);
    $this->getJson('/api/v1/admin/quotes?search=lead@example.com')->assertJsonPath('meta.pagination.total', 1);

    $this->putJson("/api/v1/admin/quotes/{$quote->id}", [
        'status' => 'won',
        'internal_notes' => 'Signed contract.',
    ])->assertOk()->assertJsonPath('data.status', 'won');

    $this->putJson("/api/v1/admin/quotes/{$quote->id}", ['status' => 'bogus'])
        ->assertStatus(422);

    $download = $this->get("/api/v1/admin/quotes/{$quote->id}/attachments/0");
    $download->assertOk();
    expect($download->headers->get('content-disposition'))->toContain('brief.pdf');

    $csv = $this->get('/api/v1/admin/quotes/export');
    $csv->assertOk();
    expect($csv->headers->get('content-type'))->toContain('text/csv');
    expect($csv->streamedContent())->toContain('Inbox Lead')->toContain('ID,Name,Email');

    $this->deleteJson("/api/v1/admin/quotes/{$quote->id}")->assertOk();
    Storage::disk('local')->assertMissing('quote-attachments/uuid/brief.pdf');
    expect(QuoteRequest::query()->count())->toBe(0);
});

it('manages contact messages and exports subscribers', function () {
    actingAsRole('editor');

    $message = ContactMessage::factory()->create(['is_read' => false, 'name' => 'Msg Sender']);

    $this->getJson('/api/v1/admin/contact-messages?is_read=0')
        ->assertOk()
        ->assertJsonPath('meta.pagination.total', 1);

    $this->patchJson("/api/v1/admin/contact-messages/{$message->id}", ['is_read' => true])
        ->assertOk()
        ->assertJsonPath('data.is_read', true);

    $this->getJson('/api/v1/admin/contact-messages?is_read=1')->assertJsonPath('meta.pagination.total', 1);

    $export = $this->get('/api/v1/admin/contact-messages/export');
    expect($export->streamedContent())->toContain('Msg Sender');

    $subscriber = NewsletterSubscriber::factory()->create(['email' => 'sub@example.com']);
    $newsletter = $this->get('/api/v1/admin/newsletter/export');
    expect($newsletter->streamedContent())->toContain('sub@example.com');

    $this->deleteJson("/api/v1/admin/newsletter/{$subscriber->id}")->assertOk();
    $this->deleteJson("/api/v1/admin/contact-messages/{$message->id}")->assertOk();

    expect(NewsletterSubscriber::query()->count())->toBe(0)
        ->and(ContactMessage::query()->count())->toBe(0);
});

it('applies media and inbox permissions to role-less staff', function () {
    $project = Project::factory()->create();

    $user = User::factory()->create(['role' => 'editor']);
    Sanctum::actingAs($user, ['*']);

    $this->getJson("/api/v1/admin/media/projects/{$project->id}")->assertStatus(403);
    $this->getJson('/api/v1/admin/quotes')->assertStatus(403);
    $this->getJson('/api/v1/admin/contact-messages')->assertStatus(403);
    $this->getJson('/api/v1/admin/newsletter')->assertStatus(403);
});
