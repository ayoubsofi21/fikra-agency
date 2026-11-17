<?php

namespace Database\Factories;

use App\Models\PostCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PostCategory>
 */
class PostCategoryFactory extends Factory
{
    protected $model = PostCategory::class;

    public function definition(): array
    {
        $en = ucfirst(fake()->unique()->words(2, true));

        return [
            'name' => ['en' => $en, 'fr' => $en.' (fr)', 'ar' => $en.' (ar)'],
        ];
    }
}
