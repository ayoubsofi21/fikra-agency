<?php

namespace Database\Factories;

use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Testimonial>
 */
class TestimonialFactory extends Factory
{
    protected $model = Testimonial::class;

    public function definition(): array
    {
        $name = fake()->name();
        $company = fake()->company();

        return [
            'author_name' => ['en' => $name, 'fr' => $name, 'ar' => $name],
            'author_role' => [
                'en' => fake()->jobTitle(),
                'fr' => 'Directeur',
                'ar' => 'مدير',
            ],
            'company' => ['en' => $company, 'fr' => $company, 'ar' => $company],
            'content' => [
                'en' => 'Working with the team was smooth from kickoff to launch. Recommended.',
                'fr' => 'Travailler avec l\'équipe a été fluide du lancement à la mise en ligne. Recommandé.',
                'ar' => 'كان العمل مع الفريق سلسًا من البداية حتى الإطلاق. أنصح به.',
            ],
            'avatar' => null,
            'project_type' => [
                'en' => fake()->randomElement(['Custom website', 'Web app', 'E-commerce']),
                'fr' => 'Site sur mesure',
                'ar' => 'موقع مخصص',
            ],
            'rating' => fake()->numberBetween(4, 5),
            'order' => fake()->numberBetween(1, 100),
            'is_active' => true,
        ];
    }
}
