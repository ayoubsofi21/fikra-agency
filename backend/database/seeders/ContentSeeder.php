<?php

namespace Database\Seeders;

use App\Models\Faq;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\PricingPlan;
use App\Models\Project;
use App\Models\Service;
use App\Models\Solution;
use App\Models\SolutionCategory;
use App\Models\SolutionFeature;
use App\Models\TeamMember;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Seeder;
use RuntimeException;

/**
 * Seeds the real EN/FR/AR catalogue that mirrors the frontend mock store.
 *
 * The JSON files under database/seed_data/ are generated from the React
 * frontend's src/data/mock.js by scripts/generate-seed-data.mjs — re-run it
 * if the frontend mock changes, then re-seed.
 *
 * Counts: 7 services, 7 solutions + 6 categories + features, 6 projects
 * (4 generated + 2 authored), 4 team, 6 testimonials, 6 posts (4 + 2),
 * 6 FAQs, 3 pricing plans.
 */
class ContentSeeder extends Seeder
{
    public function run(): void
    {
        $load = function (string $file): array {
            $path = database_path('seed_data/'.$file);

            if (! is_file($path)) {
                throw new RuntimeException(
                    "Missing seed data [{$file}]. Run: node scripts/generate-seed-data.mjs"
                );
            }

            return json_decode(file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);
        };

        // ---------------------------------------------------------- categories
        if (! SolutionCategory::query()->exists()) {
            foreach ($load('solution_categories.json') as $row) {
                SolutionCategory::create(['slug' => $row['slug'], 'name' => $row['name']]);
            }
        }

        if (! PostCategory::query()->exists()) {
            foreach ($load('post_categories.json') as $row) {
                PostCategory::create(['slug' => $row['slug'], 'name' => $row['name']]);
            }
        }

        // ------------------------------------------------------------ solutions
        if (! Solution::query()->exists()) {
            $categoryIds = SolutionCategory::query()->pluck('id', 'slug');

            foreach ($load('solutions.json') as $row) {
                $row['category_id'] = $categoryIds[$row['category_slug']] ?? null;
                unset($row['category_slug']);

                Solution::create($row);
            }
        }

        if (! SolutionFeature::query()->exists()) {
            $solutionIds = Solution::query()->pluck('id', 'slug');

            foreach ($load('solution_features.json') as $row) {
                $solutionId = $solutionIds[$row['solution_slug']] ?? null;

                if ($solutionId === null) {
                    continue;
                }

                SolutionFeature::create([
                    'solution_id' => $solutionId,
                    'title' => $row['title'],
                    'description' => $row['description'],
                    'order' => $row['order'],
                ]);
            }
        }

        // ------------------------------------------------------------- services
        if (! Service::query()->exists()) {
            foreach ($load('services.json') as $row) {
                Service::create($row);
            }
        }

        // ------------------------------------------------------------- projects
        if (! Project::query()->exists()) {
            foreach (array_merge($load('projects.json'), $load('extra_projects.json')) as $row) {
                Project::create($row);
            }
        }

        // ---------------------------------------------------------------- team
        if (! TeamMember::query()->exists()) {
            foreach ($load('team_members.json') as $row) {
                TeamMember::create($row);
            }
        }

        // -------------------------------------------------------- testimonials
        if (! Testimonial::query()->exists()) {
            foreach ($load('testimonials.json') as $row) {
                Testimonial::create($row);
            }
        }

        // --------------------------------------------------------------- posts
        if (! Post::query()->exists()) {
            $authorId = User::query()->orderBy('id')->value('id');
            $categoryIds = PostCategory::query()->pluck('id', 'slug');

            foreach (array_merge($load('posts.json'), $load('extra_posts.json')) as $row) {
                Post::create([
                    'slug' => $row['slug'],
                    'category_id' => $categoryIds[$row['category_slug']] ?? null,
                    'author_id' => $authorId,
                    'author_name' => $row['author_name'],
                    'title' => $row['title'],
                    'excerpt' => $row['excerpt'],
                    'content' => $row['content'],
                    'cover' => $row['cover'],
                    'reading_time' => $row['reading_time'],
                    'status' => $row['status'],
                    'published_at' => $row['published_at'],
                    'seo_title' => $row['seo_title'],
                    'seo_description' => $row['seo_description'],
                ]);
            }
        }

        // ---------------------------------------------------------------- faqs
        if (! Faq::query()->exists()) {
            foreach ($load('faqs.json') as $row) {
                Faq::create($row);
            }
        }

        // ----------------------------------------------------------- pricing
        if (! PricingPlan::query()->exists()) {
            foreach ($load('pricing_plans.json') as $row) {
                PricingPlan::create($row);
            }
        }
    }
}
