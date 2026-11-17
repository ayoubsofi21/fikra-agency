<?php

namespace Database\Factories;

use App\Models\Solution;
use App\Models\SolutionFeature;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SolutionFeature>
 */
class SolutionFeatureFactory extends Factory
{
    protected $model = SolutionFeature::class;

    public function definition(): array
    {
        $en = ucfirst(fake()->words(3, true));

        return [
            'solution_id' => Solution::factory(),
            'title' => ['en' => $en, 'fr' => 'Fonctionnalité — '.$en, 'ar' => 'ميزة '.$en],
            'description' => null,
            'order' => fake()->numberBetween(1, 20),
        ];
    }
}
