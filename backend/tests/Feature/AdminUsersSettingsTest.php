<?php

use App\Models\ContactMessage;
use App\Models\QuoteRequest;
use App\Models\Service;
use App\Models\Setting;
use App\Models\User;

beforeEach(function () {
    seedRoles();
});

it('reads and partially updates settings without dropping untouched fields', function () {
    actingAsRole('admin');

    Setting::putValue('site', [
        'name' => 'FIKRA Agency',
        'tagline' => 'From idea to digital reality',
        'email' => 'contact@fikra.agency',
    ]);
    Setting::putValue('whatsapp', '212600000000');
    Setting::putValue('stats', [
        ['value' => 87, 'suffix' => ['en' => '+', 'fr' => '+', 'ar' => '+'], 'label' => 'projects_completed'],
    ]);

    $this->getJson('/api/v1/admin/settings')
        ->assertOk()
        ->assertJsonPath('data.site.name', 'FIKRA Agency')
        ->assertJsonPath('data.whatsapp', '212600000000');

    $this->putJson('/api/v1/admin/settings', ['site' => ['name' => 'FIKRA Studio']])
        ->assertOk()
        ->assertJsonPath('data.site.name', 'FIKRA Studio')
        ->assertJsonPath('data.site.tagline', 'From idea to digital reality')
        ->assertJsonPath('data.site.email', 'contact@fikra.agency');

    $this->putJson('/api/v1/admin/settings', ['stats' => [
        ['value' => 99, 'suffix' => ['en' => '+'], 'label' => 'projects_completed'],
    ]])->assertOk()->assertJsonPath('data.stats.0.value', 99);

    $this->putJson('/api/v1/admin/settings', ['social' => [['name' => 'Bad', 'url' => 'nope']]])
        ->assertStatus(422);
});

it('invalidates the cached public stats after a settings update', function () {
    Setting::putValue('stats', [
        ['value' => 87, 'suffix' => ['en' => '+', 'fr' => '+', 'ar' => '+'], 'label' => 'projects_completed'],
    ]);

    $this->getJson('/api/v1/stats')->assertJsonPath('data.0.value', 87);

    actingAsRole('admin');
    $this->putJson('/api/v1/admin/settings', ['stats' => [
        ['value' => 120, 'suffix' => ['en' => '+'], 'label' => 'projects_completed'],
    ]])->assertOk();

    $this->getJson('/api/v1/stats')->assertJsonPath('data.0.value', 120);
});

it('restricts settings and users to administrators', function () {
    actingAsRole('editor');

    $this->getJson('/api/v1/admin/settings')->assertStatus(403);
    $this->putJson('/api/v1/admin/settings', ['whatsapp' => '1'])->assertStatus(403);
    $this->getJson('/api/v1/admin/users')->assertStatus(403);
});

it('creates users, syncs their role and lets them sign in', function () {
    actingAsRole('admin');

    $response = $this->postJson('/api/v1/admin/users', [
        'name' => 'New Editor',
        'email' => 'new-editor@example.com',
        'password' => 'secret-password',
        'role' => 'editor',
    ]);

    $response->assertCreated()
        ->assertJsonPath('data.role', 'editor')
        ->assertJsonPath('data.roles', ['editor'])
        ->assertJsonMissingPath('data.password');

    $user = User::query()->where('email', 'new-editor@example.com')->firstOrFail();
    expect($user->hasRole('editor'))->toBeTrue()
        ->and($user->getAllPermissions()->pluck('name'))->toContain('manage-content');

    $this->postJson('/api/v1/admin/auth/login', [
        'email' => 'new-editor@example.com',
        'password' => 'secret-password',
    ])->assertOk();

    $this->putJson("/api/v1/admin/users/{$user->id}", ['role' => 'admin'])
        ->assertOk()
        ->assertJsonPath('data.role', 'admin')
        ->assertJsonPath('data.roles', ['admin']);

    expect($user->fresh()->hasRole('admin'))->toBeTrue()
        ->and($user->fresh()->hasRole('editor'))->toBeFalse();
});

it('validates user payloads', function () {
    actingAsRole('admin');

    $this->postJson('/api/v1/admin/users', [
        'name' => 'X',
        'email' => 'not-an-email',
        'password' => 'short',
        'role' => 'owner',
    ])->assertStatus(422)->assertJsonValidationErrors(['email', 'password', 'role']);
});

it('prevents self deletion and removing the last administrator', function () {
    $admin = actingAsRole('admin');

    $this->deleteJson("/api/v1/admin/users/{$admin->id}")->assertStatus(422);
    $this->putJson("/api/v1/admin/users/{$admin->id}", ['role' => 'editor'])->assertStatus(422);

    $editor = makeUser('editor');
    $this->putJson("/api/v1/admin/users/{$editor->id}", ['role' => 'admin'])->assertOk();

    // Two admins now: one can be demoted, then the last one is protected.
    $this->putJson("/api/v1/admin/users/{$editor->id}", ['role' => 'editor'])->assertOk();
    $this->putJson("/api/v1/admin/users/{$admin->id}", ['role' => 'editor'])->assertStatus(422);

    expect(User::query()->where('role', 'admin')->count())->toBe(1);
});

it('returns dashboard counters and recent inbox activity', function () {
    actingAsRole('admin');

    QuoteRequest::factory()->count(2)->create(['status' => 'new']);
    QuoteRequest::factory()->create(['status' => 'won']);
    ContactMessage::factory()->create(['is_read' => false]);
    ContactMessage::factory()->create(['is_read' => true]);
    Service::factory()->count(2)->create();

    $this->getJson('/api/v1/admin/dashboard')
        ->assertOk()
        ->assertJsonPath('data.quotes.total', 3)
        ->assertJsonPath('data.quotes.by_status.new', 2)
        ->assertJsonPath('data.quotes.by_status.won', 1)
        ->assertJsonPath('data.messages.total', 2)
        ->assertJsonPath('data.messages.unread', 1)
        ->assertJsonPath('data.content.services', 2)
        ->assertJsonPath('data.users.admins', 1)
        ->assertJsonCount(3, 'data.recent_quotes');
});

it('allows editors to open the dashboard but not user management', function () {
    actingAsRole('editor');

    $this->getJson('/api/v1/admin/dashboard')->assertOk();
    $this->getJson('/api/v1/admin/users')->assertStatus(403);
});
