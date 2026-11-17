<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSettingsRequest;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;

/**
 * Site-wide settings managed from the dashboard: site identity, social
 * links, WhatsApp number and homepage counters. Public endpoints consume
 * the same rows through App\Services\ContentCache.
 */
class SettingsController extends Controller
{
    public function show(): JsonResponse
    {
        return $this->apiSuccess($this->all());
    }

    public function update(UpdateSettingsRequest $request): JsonResponse
    {
        foreach ($request->validated() as $key => $value) {
            $existing = Setting::getValue($key);

            // Object-like groups (site) merge so a partial PUT keeps the
            // untouched fields; lists (social, stats) are replaced wholesale.
            $isMergeableObject = is_array($value)
                && is_array($existing)
                && ! array_is_list($value)
                && ! array_is_list($existing);

            Setting::putValue(
                $key,
                $isMergeableObject ? array_replace_recursive($existing, $value) : $value,
            );
        }

        return $this->apiSuccess($this->all());
    }

    /**
     * Every setting as a key => value map (jsonb/array casts applied).
     *
     * @return array<string, mixed>
     */
    private function all(): array
    {
        return Setting::query()
            ->orderBy('key')
            ->get()
            ->mapWithKeys(fn (Setting $setting) => [$setting->key => $setting->value])
            ->all();
    }
}
