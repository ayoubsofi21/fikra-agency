<?php

namespace Database\Factories;

use App\Enums\PricingModel;
use App\Models\Solution;
use App\Models\SolutionCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Solution>
 */
class SolutionFactory extends Factory
{
    protected $model = Solution::class;

    public function definition(): array
    {
        $en = ucfirst(fake()->unique()->words(3, true));

        return [
            'category_id' => SolutionCategory::factory(),
            'title' => ['en' => $en, 'fr' => 'Solution — '.$en, 'ar' => 'حل '.$en],
            'short_description' => [
                'en' => 'Ready-made pitch for '.$en,
                'fr' => 'Accroche pour '.$en,
                'ar' => 'وصف مختصر لـ'.$en,
            ],
            'description' => [
                'en' => 'Full description of '.$en.' including workflows, integrations, and who it is for.',
                'fr' => 'Description complète de '.$en.' avec les flux de travail et les intégrations.',
                'ar' => 'وصف كامل لـ'.$en.' يشمل سير العمل والتكاملات والجمهور المستهدف.',
            ],
            'technologies' => ['Laravel', 'Vue.js', 'MySQL'],
            'demo_url' => null,
            'pricing_model' => fake()->randomElement(PricingModel::values()),
            'price' => fake()->randomElement([null, 299, 499, 899]),
            'currency' => 'USD',
            'badge' => null,
            'type' => fake()->randomElement(['template', 'custom']),
            'license_type' => fake()->randomElement(['single-domain', 'multi-domain', null]),
            'rating' => fake()->randomFloat(1, 4.0, 5.0),
            'image' => null,
            'is_featured' => false,
            'is_active' => true,
            'order' => fake()->numberBetween(1, 100),
        ];
    }
}
