<?php

use App\Mail\ResetPasswordMail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;

beforeEach(function () {
    seedRoles();
});

it('logs in with valid credentials and returns a bearer token', function () {
    $admin = makeUser('admin', ['email' => 'admin@example.com']);

    $response = $this->postJson('/api/v1/admin/auth/login', [
        'email' => 'admin@example.com',
        'password' => 'password',
    ]);

    $response->assertOk()
        ->assertJsonStructure(['data' => [
            'token', 'token_type', 'expires_at', 'abilities', 'user' => ['id', 'email', 'roles', 'permissions'],
        ]])
        ->assertJsonPath('data.token_type', 'Bearer')
        ->assertJsonPath('data.user.email', 'admin@example.com');

    $abilities = $response->json('data.abilities');
    expect($abilities)->toContain('*');
});

it('rejects bad credentials without leaking whether the account exists', function () {
    makeUser('admin', ['email' => 'admin@example.com']);

    $this->postJson('/api/v1/admin/auth/login', [
        'email' => 'admin@example.com',
        'password' => 'wrong-password',
    ])->assertStatus(401)->assertJsonStructure(['message', 'errors']);

    $this->postJson('/api/v1/admin/auth/login', [
        'email' => 'ghost@example.com',
        'password' => 'wrong-password',
    ])->assertStatus(401);
});

it('returns the current user and lets them log out', function () {
    $admin = makeUser('admin', ['email' => 'admin@example.com']);
    $token = $admin->createToken('test', ['*'])->plainTextToken;

    $this->withHeader('Authorization', 'Bearer '.$token)
        ->getJson('/api/v1/admin/auth/me')
        ->assertOk()
        ->assertJsonPath('data.user.email', 'admin@example.com');

    $this->withHeader('Authorization', 'Bearer '.$token)
        ->postJson('/api/v1/admin/auth/logout')
        ->assertOk();

    expect($admin->tokens()->count())->toBe(0);

    // Emulate a fresh request: the test app keeps resolved guards between
    // calls, which real requests never do.
    $this->app['auth']->forgetGuards();

    $this->withHeader('Authorization', 'Bearer '.$token)
        ->getJson('/api/v1/admin/auth/me')
        ->assertStatus(401);
});

it('throttles the login endpoint at five attempts per minute', function () {
    makeUser('admin', ['email' => 'admin@example.com']);

    foreach (range(1, 5) as $attempt) {
        $this->postJson('/api/v1/admin/auth/login', [
            'email' => 'admin@example.com',
            'password' => 'wrong',
        ])->assertStatus(401);
    }

    $this->postJson('/api/v1/admin/auth/login', [
        'email' => 'admin@example.com',
        'password' => 'wrong',
    ])->assertStatus(429);
});

it('sends a generic response for forgot password', function () {
    Mail::fake();
    $admin = makeUser('admin', ['email' => 'admin@example.com']);

    $this->postJson('/api/v1/admin/auth/forgot-password', ['email' => 'admin@example.com'])
        ->assertOk()
        ->assertJsonStructure(['data' => ['message']]);

    Mail::assertSent(ResetPasswordMail::class);

    $this->postJson('/api/v1/admin/auth/forgot-password', ['email' => 'ghost@example.com'])
        ->assertOk()
        ->assertJsonStructure(['data' => ['message']]);
});

it('resets the password with a valid token and revokes tokens', function () {
    $admin = makeUser('admin', ['email' => 'admin@example.com']);
    $admin->createToken('existing', ['*']);
    $token = Password::createToken($admin);

    $this->postJson('/api/v1/admin/auth/reset-password', [
        'token' => $token,
        'email' => 'admin@example.com',
        'password' => 'new-password-123',
        'password_confirmation' => 'new-password-123',
    ])->assertOk();

    expect(Hash::check('new-password-123', $admin->fresh()->password))->toBeTrue();
    expect($admin->tokens()->count())->toBe(0);
});

it('rejects an invalid password reset token', function () {
    makeUser('admin', ['email' => 'admin@example.com']);

    $this->postJson('/api/v1/admin/auth/reset-password', [
        'token' => 'not-a-real-token',
        'email' => 'admin@example.com',
        'password' => 'new-password-123',
        'password_confirmation' => 'new-password-123',
    ])->assertStatus(422);
});
