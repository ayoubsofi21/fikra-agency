<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * The single administrator from .env (ADMIN_EMAIL / ADMIN_PASSWORD),
     * plus the editor role's demo account used by local development.
     */
    public function run(): void
    {
        $adminEmail = env('ADMIN_EMAIL', 'admin@fikra.agency');
        $adminPassword = env('ADMIN_PASSWORD', 'password');

        $admin = User::updateOrCreate(
            ['email' => $adminEmail],
            [
                'name' => 'Fikra Admin',
                'password' => $adminPassword,
                'role' => UserRole::Admin,
                'email_verified_at' => now(),
            ],
        );
        $admin->syncRoles(['admin']);

        $editorEmail = env('EDITOR_EMAIL', 'editor@fikra.agency');

        $editor = User::updateOrCreate(
            ['email' => $editorEmail],
            [
                'name' => 'Fikra Editor',
                'password' => env('EDITOR_PASSWORD', $adminPassword),
                'role' => UserRole::Editor,
                'email_verified_at' => now(),
            ],
        );
        $editor->syncRoles(['editor']);
    }
}
