<?php

namespace App\Enums;

/**
 * Application roles (spatie/laravel-permission mirrors these in the roles table).
 */
enum UserRole: string
{
    case Admin = 'admin';
    case Editor = 'editor';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Administrator',
            self::Editor => 'Editor',
        };
    }
}
