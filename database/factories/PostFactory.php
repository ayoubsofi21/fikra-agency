<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\PostCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
{
    protected $model = Post::class;

    public function definition(): array
    {
        $en = ucfirst(fake()->unique()->words(4, true));
        $blocks = [
            ['type' => 'p', 'text' => 'Opening paragraph of '.$en.'.'],
            ['type' => 'h2', 'text' => 'A practical section'],
            ['type' => 'ul', 'items' => ['First takeaway', 'Second takeaway', 'Third takeaway']],
            ['type' => 'p', 'text' => 'Closing paragraph with a call to action.'],
        ];

        return [
            'category_id' => PostCategory::factory(),
            'author_id' => User::factory(),
            'author_name' => ['en' => 'Ayoub Sofi', 'fr' => 'Ayoub Sofi', 'ar' => 'أيوب صوفي'],
            'title' => ['en' => $en, 'fr' => 'Article — '.$en, 'ar' => 'مقال '.$en],
            'excerpt' => [
                'en' => 'Excerpt summarising '.$en.' in one sentence.',
                'fr' => 'Extrait résumant '.$en.' en une phrase.',
                'ar' => 'مقتطف يلخص '.$en.' في جملة واحدة.',
            ],
            'content' => ['en' => $blocks, 'fr' => $blocks, 'ar' => $blocks],
            'cover' => null,
            'reading_time' => fake()->numberBetween(3, 10),
            'status' => Post::STATUS_PUBLISHED,
            'published_at' => now()->subDays(fake()->numberBetween(1, 90)),
            'seo_title' => null,
            'seo_description' => null,
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => Post::STATUS_DRAFT,
            'published_at' => null,
        ]);
    }
}
