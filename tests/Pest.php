<?php

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class)->in('Feature');

/**
 * Create a staff user (column + spatie role kept in sync).
 */
function makeUser(string $role = 'admin', array $attributes = []): User
{
    $user = User::factory()->create(array_merge(['role' => $role], $attributes));
    $user->syncRoles([$role]);

    return $user;
}

/**
 * Authenticate the test client as a seeded admin/editor user.
 */
function actingAsRole(string $role = 'admin', array $attributes = []): User
{
    $user = makeUser($role, $attributes);
    Sanctum::actingAs($user, ['*']);

    return $user;
}

function seedRoles(): void
{
    test()->seed(RolePermissionSeeder::class);
}
