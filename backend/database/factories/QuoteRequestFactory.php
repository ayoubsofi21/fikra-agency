<?php

namespace Database\Factories;

use App\Enums\QuoteStatus;
use App\Models\QuoteRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<QuoteRequest>
 */
class QuoteRequestFactory extends Factory
{
    protected $model = QuoteRequest::class;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'company' => fake()->optional()->company(),
            'project_type' => fake()->randomElement(['custom-website', 'ecommerce', 'platform', 'solution', 'design', 'other']),
            'budget_range' => fake()->randomElement(['under-2k', '2k-5k', '5k-10k', '10k-20k', 'over-20k']),
            'timeline' => fake()->randomElement(['asap', '1-month', '3-months', 'flexible']),
            'description' => fake()->paragraph(),
            'attachment' => null,
            'status' => QuoteStatus::New,
            'internal_notes' => null,
            'ip_address' => fake()->ipv4(),
        ];
    }
}
