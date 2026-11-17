<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;
use RuntimeException;

/**
 * Site-wide settings from the frontend constants:
 *   site     — name, tagline, contact details, working hours
 *   social   — GitHub / LinkedIn / Instagram / Facebook links
 *   whatsapp — floating WhatsApp number
 *   stats    — homepage counters (value + translated suffix + i18n label key)
 */
class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        if (Setting::query()->exists()) {
            return;
        }

        $path = database_path('seed_data/settings.json');

        if (! is_file($path)) {
            throw new RuntimeException(
                'Missing seed data [settings.json]. Run: node scripts/generate-seed-data.mjs'
            );
        }

        $data = json_decode(file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);

        foreach ($data as $key => $value) {
            Setting::putValue($key, $value);
        }
    }
}
