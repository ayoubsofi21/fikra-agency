<?php

namespace Database\Factories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
{
    protected $model = Service::class;

    public function definition(): array
    {
        $en = ucfirst(fake()->unique()->words(3, true));

        return [
            'icon' => fake()->randomElement(['Code2', 'Palette', 'ShoppingCart', 'Server', 'LifeBuoy', 'Megaphone', 'Monitor']),
            'category' => fake()->randomElement(['development', 'commerce', 'platform', 'design', 'backend', 'support', 'marketing']),
            'title' => ['en' => $en, 'fr' => 'Service — '.$en, 'ar' => 'خدمة '.$en],
            'short_description' => [
                'en' => 'Short pitch for '.$en,
                'fr' => 'Accroche courte pour '.$en,
                'ar' => 'وصف مختصر لـ'.$en,
            ],
            'description' => [
                'en' => 'Long description of '.$en.' covering scope, process, and measurable outcomes.',
                'fr' => 'Description détaillée de '.$en.' couvrant le périmètre, le processus et les résultats.',
                'ar' => 'وصف تفصيلي لـ'.$en.' يغطي النطاق والعملية والنتائج القابلة للقياس.',
            ],
            'deliverables' => ['en' => ['Responsive design', 'Documented source code']],
            'technologies' => ['Laravel', 'React'],
            'timeline' => ['en' => fake()->randomElement(['2–4 weeks', '4–8 weeks', '6–16 weeks'])],
            'price_model' => fake()->randomElement(['custom', 'license', 'subscription']),
            'price_from' => fake()->numberBetween(500, 5000),
            'price_currency' => 'USD',
            'price_period' => null,
            'is_featured' => false,
            'order' => fake()->numberBetween(1, 100),
            'is_active' => true,
        ];
    }
}
