<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Roles (admin, editor) and the permission matrix.
     *
     * admin   — everything (users, settings, content, media, inbox)
     * editor  — content, media, inbox only (never users/settings)
     */
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $permissions = [
            'manage-users',
            'manage-settings',
            'manage-content',
            'manage-media',
            'manage-inbox',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        $admin = Role::findOrCreate('admin', 'web');
        $admin->syncPermissions($permissions);

        $editor = Role::findOrCreate('editor', 'web');
        $editor->syncPermissions([
            'manage-content',
            'manage-media',
            'manage-inbox',
        ]);
    }
}
