<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition(): array
    {
        $en = ucfirst(fake()->unique()->words(3, true));

        return [
            'category' => fake()->randomElement(['saas', 'ecommerce', 'mobile', 'web', 'platform', 'design']),
            'title' => ['en' => $en, 'fr' => 'Projet — '.$en, 'ar' => 'مشروع '.$en],
            'client_name' => fake()->company(),
            'summary' => [
                'en' => 'Summary of '.$en.' describing the product and its impact.',
                'fr' => 'Résumé de '.$en.' décrivant le produit et son impact.',
                'ar' => 'ملخص لـ'.$en.' يصف المنتج وأثره.',
            ],
            'problem' => [
                'en' => 'The client faced a bottleneck that '.$en.' had to remove.',
                'fr' => 'Le client faisait face à un goulot d\'étranglement que '.$en.' devait lever.',
                'ar' => 'كان العميل يواجه عنق زجاجة كان على '.$en.' إزالته.',
            ],
            'solution' => [
                'en' => 'We delivered '.$en.' with a modular architecture and automated tests.',
                'fr' => 'Nous avons livré '.$en.' avec une architecture modulaire et des tests automatisés.',
                'ar' => 'سلمنا '.$en.' بهيكلية معيارية واختبارات آلية.',
            ],
            'result' => [
                'en' => ' measurable improvement in speed and conversions after launch.',
                'fr' => ' Amélioration mesurable de la vitesse et des conversions après le lancement.',
                'ar' => ' تحسن قابل للقياس في السرعة والتحويلات بعد الإطلاق.',
            ],
            'technologies' => ['Laravel', 'React', 'MySQL'],
            'live_url' => null,
            'completed_at' => fake()->date('Y-m-d', '-1 year'),
            'image' => null,
            'cover' => null,
            'gallery' => null,
            'is_featured' => false,
            'is_active' => true,
            'order' => fake()->numberBetween(1, 100),
        ];
    }
}
