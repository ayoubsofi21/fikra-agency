<?php

use App\Models\Project;
use App\Models\Service;

it('lists active services in the public envelope', function () {
    Service::factory()->count(3)->create(['is_active' => true]);
    Service::factory()->create(['is_active' => false]);

    $response = $this->getJson('/api/v1/services');

    $response->assertOk()
        ->assertJsonCount(3, 'data')
        ->assertJsonStructure([
            'data' => [[
                'id', 'slug', 'name', 'description', 'short',
                'price', 'deliverables', 'technologies', 'timeline',
            ]],
            'meta' => ['pagination' => [
                'current_page', 'per_page', 'total', 'last_page', 'from', 'to',
            ]],
            'links' => ['first', 'last', 'prev', 'next'],
        ]);

    expect($response->json('data.0.name'))->toHaveKeys(['en', 'fr', 'ar']);
    expect($response->json('data.0.timeline'))->toBeString();
});

it('resolves localized list fields from the requested locale', function () {
    Service::factory()->create([
        'timeline' => ['en' => 'Two weeks', 'fr' => 'Deux semaines', 'ar' => 'أسبوعان'],
        'deliverables' => ['en' => ['Report'], 'fr' => ['Rapport'], 'ar' => ['تقرير']],
    ]);

    $this->getJson('/api/v1/services?lang=fr')
        ->assertOk()
        ->assertJsonPath('data.0.timeline', 'Deux semaines')
        ->assertJsonPath('data.0.deliverables.0', 'Rapport');

    $this->getJson('/api/v1/services', ['Accept-Language' => 'ar'])
        ->assertOk()
        ->assertJsonPath('data.0.timeline', 'أسبوعان')
        ->assertJsonPath('data.0.deliverables.0', 'تقرير');
});

it('falls back to english for unknown languages', function () {
    Service::factory()->create(['timeline' => ['en' => 'Two weeks']]);

    $this->getJson('/api/v1/services?lang=de')
        ->assertOk()
        ->assertJsonPath('data.0.timeline', 'Two weeks');
});

it('shows a service by slug and returns a json 404 otherwise', function () {
    $service = Service::factory()->create(['is_active' => true]);

    $this->getJson('/api/v1/services/'.$service->slug)
        ->assertOk()
        ->assertJsonPath('data.slug', $service->slug);

    $this->getJson('/api/v1/services/does-not-exist')
        ->assertNotFound()
        ->assertJsonStructure(['message', 'errors']);
});

it('paginates with per_page, the limit alias and a 50 item cap', function () {
    Service::factory()->count(3)->create(['is_active' => true]);

    $response = $this->getJson('/api/v1/services?per_page=2&page=2');
    $response->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('meta.pagination.total', 3)
        ->assertJsonPath('meta.pagination.last_page', 2)
        ->assertJsonPath('meta.pagination.per_page', 2);
    expect($response->json('links.prev'))->not->toBeNull();
    expect($response->json('links.next'))->toBeNull();

    $this->getJson('/api/v1/services?limit=100')
        ->assertOk()
        ->assertJsonPath('meta.pagination.per_page', 50);
});

it('filters projects by category and searches translatable text', function () {
    Project::factory()->create(['category' => 'design', 'title' => ['en' => 'Brand Refresh']]);
    Project::factory()->create(['category' => 'development', 'title' => ['en' => 'Banking App']]);

    $this->getJson('/api/v1/projects?category=design')
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.category', 'design');

    $this->getJson('/api/v1/projects?search=banking')
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.title.en', 'Banking App');
});
