<?php

namespace Database\Factories;

use App\Models\PricingPlan;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<PricingPlan>
 */
class PricingPlanFactory extends Factory
{
    protected $model = PricingPlan::class;

    public function definition(): array
    {
        $en = ucfirst(fake()->unique()->words(2, true));

        return [
            'key' => Str::slug($en).'-'.fake()->unique()->numberBetween(1, 9999),
            'name' => ['en' => $en, 'fr' => 'Forfait '.$en, 'ar' => 'باقة '.$en],
            'description' => null,
            'tagline' => [
                'en' => 'Tagline describing who '.$en.' is for.',
                'fr' => 'Accroche décrivant à qui s\'adresse '.$en.'.',
                'ar' => 'وصف مختصر لمن توجه باقة '.$en.'.',
            ],
            'cta' => ['en' => 'Start a project', 'fr' => 'Démarrer un projet', 'ar' => 'ابدأ مشروعاً'],
            'price_monthly' => fake()->randomElement([499, 999, 1499]),
            'price_yearly' => fake()->randomElement([399, 799, 1199]),
            'price_one_time' => fake()->randomElement([799, 1799, 2299]),
            'currency' => 'USD',
            'features' => [
                ['en' => 'Up to 5 pages', 'fr' => 'Jusqu\'à 5 pages', 'ar' => 'حتى 5 صفحات'],
                ['en' => '30-day support', 'fr' => 'Support 30 jours', 'ar' => 'دعم 30 يوماً'],
            ],
            'is_popular' => false,
            'order' => fake()->numberBetween(1, 20),
            'is_active' => true,
        ];
    }
}
