<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
    ];

    protected $casts = [
        'value' => 'array',
    ];

    /**
     * Fetch a setting value by key, with a default when missing.
     */
    public static function getValue(string $key, mixed $default = null): mixed
    {
        $setting = static::query()->where('key', $key)->first();

        return $setting?->value ?? $default;
    }

    /**
     * Upsert a setting value by key.
     */
    public static function putValue(string $key, mixed $value): self
    {
        return static::query()->updateOrCreate(['key' => $key], ['value' => $value]);
    }
}
