<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Enums\QuoteStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\ContactMessageResource;
use App\Http\Resources\Admin\QuoteRequestResource;
use App\Models\ContactMessage;
use App\Models\Faq;
use App\Models\NewsletterSubscriber;
use App\Models\Post;
use App\Models\PricingPlan;
use App\Models\Project;
use App\Models\QuoteRequest;
use App\Models\Service;
use App\Models\Solution;
use App\Models\TeamMember;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Landing payload for the dashboard: inbox counters, content totals and a
 * short recent-activity list.
 */
class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $canSeeInbox = $user->can('manage-inbox');

        $byStatus = QuoteRequest::query()
            ->selectRaw('status, count(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        $quotesByStatus = [];

        foreach (QuoteStatus::cases() as $status) {
            $quotesByStatus[$status->value] = (int) ($byStatus[$status->value] ?? 0);
        }

        $payload = [
            'quotes' => [
                'total' => array_sum($quotesByStatus),
                'by_status' => $quotesByStatus,
            ],
            'messages' => [
                'total' => ContactMessage::query()->count(),
                'unread' => ContactMessage::query()->where('is_read', false)->count(),
            ],
            'subscribers' => [
                'total' => NewsletterSubscriber::query()->count(),
                'this_month' => NewsletterSubscriber::query()
                    ->where('created_at', '>=', now()->startOfMonth())
                    ->count(),
            ],
            'content' => [
                'services' => Service::query()->count(),
                'solutions' => Solution::query()->count(),
                'projects' => Project::query()->count(),
                'posts' => Post::query()->count(),
                'team' => TeamMember::query()->count(),
                'testimonials' => Testimonial::query()->count(),
                'faqs' => Faq::query()->count(),
                'pricing_plans' => PricingPlan::query()->count(),
            ],
            'users' => [
                'total' => User::query()->count(),
                'admins' => User::query()->where('role', UserRole::Admin->value)->count(),
                'editors' => User::query()->where('role', UserRole::Editor->value)->count(),
            ],
            'recent_quotes' => $canSeeInbox
                ? QuoteRequestResource::collection(
                    QuoteRequest::query()->orderByDesc('created_at')->limit(5)->get()
                )->resolve($request)
                : [],
            'recent_messages' => $canSeeInbox
                ? ContactMessageResource::collection(
                    ContactMessage::query()->orderByDesc('created_at')->limit(5)->get()
                )->resolve($request)
                : [],
        ];

        return $this->apiSuccess($payload);
    }
}
