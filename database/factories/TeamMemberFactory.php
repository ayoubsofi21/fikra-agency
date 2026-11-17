<?php

namespace Database\Factories;

use App\Models\TeamMember;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TeamMember>
 */
class TeamMemberFactory extends Factory
{
    protected $model = TeamMember::class;

    public function definition(): array
    {
        $name = fake()->name();

        return [
            'name' => ['en' => $name, 'fr' => $name, 'ar' => $name],
            'role' => [
                'en' => fake()->jobTitle(),
                'fr' => 'Développeur',
                'ar' => 'مطور',
            ],
            'bio' => [
                'en' => 'Short bio highlighting strengths and how they work.',
                'fr' => 'Courte biographie mettant en avant les forces.',
                'ar' => 'سيرة مختصرة تبرز نقاط القوة.',
            ],
            'skills' => ['Laravel', 'React', 'TypeScript'],
            'github_url' => null,
            'linkedin_url' => null,
            'twitter' => null,
            'avatar' => null,
            'email' => fake()->unique()->safeEmail(),
            'featured' => false,
            'order' => fake()->numberBetween(1, 100),
            'is_active' => true,
        ];
    }
}
