<?php

namespace Database\Factories;

use App\Models\Faq;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Faq>
 */
class FaqFactory extends Factory
{
    protected $model = Faq::class;

    public function definition(): array
    {
        $question = ucfirst(fake()->sentence(6)).'?';

        return [
            'group' => fake()->randomElement(['general', 'pricing', 'services']),
            'question' => ['en' => $question, 'fr' => 'Question — '.$question, 'ar' => 'سؤال: '.$question],
            'answer' => [
                'en' => fake()->paragraph(),
                'fr' => fake()->paragraph(),
                'ar' => 'إجابة تجريبية لل اختبار.',
            ],
            'order' => fake()->numberBetween(1, 50),
            'is_active' => true,
        ];
    }
}
