<?php

use App\Http\Controllers\Api\V1\Admin\AuthController;
use App\Http\Controllers\Api\V1\Admin\ContactMessageController as AdminContactMessageController;
use App\Http\Controllers\Api\V1\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\V1\Admin\FaqController as AdminFaqController;
use App\Http\Controllers\Api\V1\Admin\MediaController as AdminMediaController;
use App\Http\Controllers\Api\V1\Admin\NewsletterController as AdminNewsletterController;
use App\Http\Controllers\Api\V1\Admin\PostCategoryController;
use App\Http\Controllers\Api\V1\Admin\PostController as AdminPostController;
use App\Http\Controllers\Api\V1\Admin\PricingController as AdminPricingController;
use App\Http\Controllers\Api\V1\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Api\V1\Admin\QuoteRequestController;
use App\Http\Controllers\Api\V1\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Api\V1\Admin\SettingsController as AdminSettingsController;
use App\Http\Controllers\Api\V1\Admin\SolutionCategoryController;
use App\Http\Controllers\Api\V1\Admin\SolutionController as AdminSolutionController;
use App\Http\Controllers\Api\V1\Admin\SolutionFeatureController;
use App\Http\Controllers\Api\V1\Admin\TeamController as AdminTeamController;
use App\Http\Controllers\Api\V1\Admin\TestimonialController as AdminTestimonialController;
use App\Http\Controllers\Api\V1\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\V1\Public\ContactController;
use App\Http\Controllers\Api\V1\Public\FaqController;
use App\Http\Controllers\Api\V1\Public\NewsletterController;
use App\Http\Controllers\Api\V1\Public\PostController;
use App\Http\Controllers\Api\V1\Public\PricingController;
use App\Http\Controllers\Api\V1\Public\ProjectController;
use App\Http\Controllers\Api\V1\Public\ServiceController;
use App\Http\Controllers\Api\V1\Public\SolutionController;
use App\Http\Controllers\Api\V1\Public\SolutionRequestController;
use App\Http\Controllers\Api\V1\Public\StatsController;
use App\Http\Controllers\Api\V1\Public\TeamController;
use App\Http\Controllers\Api\V1\Public\TestimonialController;
use App\Http\Middleware\FlushContentCache;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes (prefix: /api/v1, locale middleware applied by bootstrap/app.php)
|--------------------------------------------------------------------------
|
| Public catalogue endpoints (cached 10 minutes, flushed on admin writes).
| Admin routes and public form endpoints are added in later steps.
|
*/

// Lightweight availability probe for deployments and load balancers.
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'app' => config('app.name'),
        'locale' => app()->getLocale(),
        'time' => now()->toIso8601String(),
    ]);
});

// ---------------------------------------------------------------- public
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{slug}', [ServiceController::class, 'show']);

Route::get('/solutions', [SolutionController::class, 'index']);
Route::get('/solutions/{slug}', [SolutionController::class, 'show']);

Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/projects/{slug}', [ProjectController::class, 'show']);

Route::get('/team', [TeamController::class, 'index']);
Route::get('/testimonials', [TestimonialController::class, 'index']);

Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{slug}', [PostController::class, 'show']);

Route::get('/faqs', [FaqController::class, 'index']);
Route::get('/pricing', [PricingController::class, 'index']);
Route::get('/stats', [StatsController::class, 'index']);

// ------------------------------------------------------- public forms
// 5 submissions per minute per IP, honeypot-guarded.
Route::middleware(['honeypot', 'throttle:5,1'])->group(function () {
    Route::post('/contact', [ContactController::class, 'store']);
    Route::post('/solution-requests', [SolutionRequestController::class, 'store']);
    Route::post('/solutions/{slug}/request', [SolutionRequestController::class, 'store']);
    Route::post('/newsletter', [NewsletterController::class, 'store']);
});

Route::get('/newsletter/unsubscribe/{token}', [NewsletterController::class, 'unsubscribe']);

// ---------------------------------------------------------------- admin auth
Route::prefix('admin/auth')->group(function () {
    Route::middleware('throttle:5,1')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

// ---------------------------------------------------------------- admin CRUD
Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    Route::middleware(['permission:manage-content', FlushContentCache::class])->group(function () {
        // Services
        Route::patch('services/reorder', [AdminServiceController::class, 'reorder']);
        Route::patch('services/{service}/toggle', [AdminServiceController::class, 'toggle']);
        Route::apiResource('services', AdminServiceController::class);

        // Solutions + nested features
        Route::patch('solutions/reorder', [AdminSolutionController::class, 'reorder']);
        Route::patch('solutions/{solution}/toggle', [AdminSolutionController::class, 'toggle']);
        Route::post('solutions/{solution}/restore', [AdminSolutionController::class, 'restore']);
        Route::patch('solutions/{solution}/features/reorder', [SolutionFeatureController::class, 'reorder']);
        Route::apiResource('solutions', AdminSolutionController::class);
        Route::apiResource('solutions.features', SolutionFeatureController::class)->shallow();

        Route::apiResource('solution-categories', SolutionCategoryController::class);

        // Projects
        Route::patch('projects/reorder', [AdminProjectController::class, 'reorder']);
        Route::patch('projects/{project}/toggle', [AdminProjectController::class, 'toggle']);
        Route::post('projects/{project}/restore', [AdminProjectController::class, 'restore']);
        Route::apiResource('projects', AdminProjectController::class);

        // Team
        Route::patch('team/reorder', [AdminTeamController::class, 'reorder']);
        Route::patch('team/{team}/toggle', [AdminTeamController::class, 'toggle']);
        Route::apiResource('team', AdminTeamController::class);

        // Testimonials
        Route::patch('testimonials/reorder', [AdminTestimonialController::class, 'reorder']);
        Route::patch('testimonials/{testimonial}/toggle', [AdminTestimonialController::class, 'toggle']);
        Route::apiResource('testimonials', AdminTestimonialController::class);

        // Posts + categories
        Route::patch('posts/{post}/toggle', [AdminPostController::class, 'toggle']);
        Route::post('posts/{post}/restore', [AdminPostController::class, 'restore']);
        Route::apiResource('posts', AdminPostController::class);
        Route::apiResource('post-categories', PostCategoryController::class);

        // FAQs + pricing
        Route::patch('faqs/reorder', [AdminFaqController::class, 'reorder']);
        Route::patch('faqs/{faq}/toggle', [AdminFaqController::class, 'toggle']);
        Route::apiResource('faqs', AdminFaqController::class);

        Route::patch('pricing/reorder', [AdminPricingController::class, 'reorder']);
        Route::patch('pricing/{pricing}/toggle', [AdminPricingController::class, 'toggle']);
        Route::apiResource('pricing', AdminPricingController::class);
    });

    // ------------------------------------------------------------- media
    Route::middleware('permission:manage-media')->group(function () {
        Route::get('media/{type}/{id}', [AdminMediaController::class, 'index']);
        Route::post('media/{type}/{id}', [AdminMediaController::class, 'store']);
        Route::patch('media/{media}', [AdminMediaController::class, 'update']);
        Route::delete('media/{media}', [AdminMediaController::class, 'destroy']);
    });

    // ------------------------------------------------------------- inbox
    Route::middleware('permission:manage-inbox')->group(function () {
        Route::get('quotes/export', [QuoteRequestController::class, 'export']);
        Route::get('quotes', [QuoteRequestController::class, 'index']);
        Route::get('quotes/{quote}/attachments/{index}', [QuoteRequestController::class, 'attachment'])
            ->whereNumber('index');
        Route::get('quotes/{quote}', [QuoteRequestController::class, 'show']);
        Route::match(['put', 'patch'], 'quotes/{quote}', [QuoteRequestController::class, 'update']);
        Route::delete('quotes/{quote}', [QuoteRequestController::class, 'destroy']);

        Route::get('contact-messages/export', [AdminContactMessageController::class, 'export']);
        Route::get('contact-messages', [AdminContactMessageController::class, 'index']);
        Route::get('contact-messages/{message}', [AdminContactMessageController::class, 'show']);
        Route::match(['put', 'patch'], 'contact-messages/{message}', [AdminContactMessageController::class, 'update']);
        Route::delete('contact-messages/{message}', [AdminContactMessageController::class, 'destroy']);

        Route::get('newsletter/export', [AdminNewsletterController::class, 'export']);
        Route::get('newsletter', [AdminNewsletterController::class, 'index']);
        Route::delete('newsletter/{subscriber}', [AdminNewsletterController::class, 'destroy']);
    });

    // ------------------------------------------------------------- dashboard
    // Any staff member with at least one management permission.
    Route::get('dashboard', [AdminDashboardController::class, 'index'])
        ->middleware('permission:manage-content|manage-media|manage-inbox|manage-users|manage-settings');

    // ------------------------------------------------------------- settings
    Route::middleware(['permission:manage-settings', FlushContentCache::class])->group(function () {
        Route::get('settings', [AdminSettingsController::class, 'show']);
        Route::match(['put', 'patch'], 'settings', [AdminSettingsController::class, 'update']);
    });

    // ------------------------------------------------------------- users
    Route::middleware('permission:manage-users')->group(function () {
        Route::apiResource('users', AdminUserController::class);
    });
});
