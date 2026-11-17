<?php

use App\Models\Service;
use App\Models\Solution;
use App\Models\SolutionCategory;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    seedRoles();
});

function servicePayload(array $overrides = []): array
{
    return array_merge([
        'title' => ['en' => 'SEO Audit', 'fr' => 'Audit SEO', 'ar' => 'تدقيق SEO'],
        'short_description' => ['en' => 'Short pitch', 'fr' => 'Accroche', 'ar' => 'وصف'],
        'description' => ['en' => 'A complete technical and content SEO audit.', 'fr' => 'Audit complet.', 'ar' => 'تدقيق كامل.'],
        'timeline' => ['en' => 'Two weeks', 'fr' => 'Deux semaines'],
        'deliverables' => ['en' => ['Report'], 'fr' => ['Rapport']],
        'technologies' => ['Lighthouse', 'Screaming Frog'],
        'price_model' => 'custom',
    ], $overrides);
}

it('blocks guests and role-less accounts from admin content', function () {
    $this->getJson('/api/v1/admin/services')->assertStatus(401);

    $user = User::factory()->create(['role' => 'editor']);
    Sanctum::actingAs($user, ['*']);

    $this->getJson('/api/v1/admin/services')->assertStatus(403);
});

it('lets editors create, update, toggle, reorder and delete services', function () {
    actingAsRole('editor');

    $this->postJson('/api/v1/admin/services', servicePayload())
        ->assertCreated()
        ->assertJsonPath('data.slug', 'seo-audit')
        ->assertJsonPath('data.title.en', 'SEO Audit');

    $service = Service::query()->firstOrFail();
    expect($service->getTranslation('title', 'fr'))->toBe('Audit SEO');

    $this->putJson('/api/v1/admin/services/'.$service->id, servicePayload([
        'title' => ['en' => 'SEO Audit Pro', 'fr' => 'Audit SEO Pro', 'ar' => 'تدقيق'],
    ]))->assertOk()->assertJsonPath('data.title.en', 'SEO Audit Pro');

    $this->patchJson('/api/v1/admin/services/'.$service->id.'/toggle')
        ->assertOk()
        ->assertJsonPath('data.is_active', false);

    $first = Service::factory()->create(['order' => 2]);
    $second = Service::factory()->create(['order' => 3]);

    $this->patchJson('/api/v1/admin/services/reorder', ['ids' => [$second->id, $first->id]])
        ->assertOk();

    expect($first->fresh()->order)->toBe(2)
        ->and($second->fresh()->order)->toBe(1);

    $this->deleteJson('/api/v1/admin/services/'.$service->id)->assertOk();
    expect(Service::query()->count())->toBe(2);
});

it('validates localized content payloads', function () {
    actingAsRole('admin');

    $this->postJson('/api/v1/admin/services', [
        'title' => ['fr' => 'Sans anglais'],
        'description' => ['en' => 'x'],
    ])->assertStatus(422)->assertJsonValidationErrors(['title.en', 'short_description', 'timeline']);
});

it('creates nested solution features and reorders them', function () {
    actingAsRole('editor');

    $category = SolutionCategory::factory()->create();
    $solution = Solution::factory()->create(['category_id' => $category->id]);

    $this->postJson("/api/v1/admin/solutions/{$solution->id}/features", [
        'title' => ['en' => 'Dashboard', 'fr' => 'Tableau de bord'],
        'description' => ['en' => 'Realtime metrics'],
    ])->assertCreated()->assertJsonPath('data.title.en', 'Dashboard');

    $this->postJson("/api/v1/admin/solutions/{$solution->id}/features", [
        'title' => ['en' => 'Reports'],
    ])->assertCreated();

    expect($solution->features()->count())->toBe(2);

    $ids = $solution->features()->orderByDesc('id')->pluck('id')->all();

    $this->patchJson("/api/v1/admin/solutions/{$solution->id}/features/reorder", ['ids' => $ids])
        ->assertOk();

    expect($solution->features()->whereKey($ids[0])->value('order'))->toBe(1);
});

it('invalidates the public cache after an admin write', function () {
    Service::factory()->create(['is_active' => true]);

    $this->getJson('/api/v1/services')->assertJsonCount(1, 'data');

    actingAsRole('editor');
    $this->postJson('/api/v1/admin/services', servicePayload())->assertCreated();

    $this->getJson('/api/v1/services')->assertJsonCount(2, 'data');
});

it('hides unpublished content from the public api', function () {
    $service = Service::factory()->create(['is_active' => true]);

    $this->getJson('/api/v1/services')->assertJsonCount(1, 'data');

    actingAsRole('admin');
    $this->patchJson('/api/v1/admin/services/'.$service->id.'/toggle')->assertOk();

    $this->getJson('/api/v1/services')->assertJsonCount(0, 'data');
});

it('supports soft delete and restore on projects', function () {
    actingAsRole('admin');

    $payload = [
        'title' => ['en' => 'New Project'],
        'summary' => ['en' => 'Summary'],
        'problem' => ['en' => 'Problem'],
        'solution' => ['en' => 'Solution'],
        'result' => ['en' => 'Result'],
        'category' => 'design',
        'client_name' => 'Acme Corp',
    ];

    $this->postJson('/api/v1/admin/projects', $payload)
        ->assertCreated()
        ->assertJsonPath('data.title.en', 'New Project');

    $id = $this->getJson('/api/v1/admin/projects')->json('data.0.id');

    $this->deleteJson('/api/v1/admin/projects/'.$id)->assertOk();
    $this->getJson('/api/v1/admin/projects?trashed=only')->assertJsonCount(1, 'data');

    $this->postJson('/api/v1/admin/projects/'.$id.'/restore')->assertOk();
    $this->getJson('/api/v1/admin/projects')->assertJsonCount(1, 'data');
});
