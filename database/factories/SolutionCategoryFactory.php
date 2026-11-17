<?php

namespace Database\Factories;

use App\Models\SolutionCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SolutionCategory>
 */
class SolutionCategoryFactory extends Factory
{
    protected $model = SolutionCategory::class;

    public function definition(): array
    {
        $en = ucfirst(fake()->unique()->words(2, true));

        return [
            'name' => ['en' => $en, 'fr' => $en.' (fr)', 'ar' => $en.' (ar)'],
        ];
    }
}
