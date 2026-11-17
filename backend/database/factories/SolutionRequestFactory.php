<?php

namespace Database\Factories;

use App\Enums\QuoteStatus;
use App\Models\Solution;
use App\Models\SolutionRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SolutionRequest>
 */
class SolutionRequestFactory extends Factory
{
    protected $model = SolutionRequest::class;

    public function definition(): array
    {
        return [
            'solution_id' => Solution::factory(),
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'company' => fake()->optional()->company(),
            'message' => fake()->paragraph(),
            'status' => QuoteStatus::New,
        ];
    }
}
