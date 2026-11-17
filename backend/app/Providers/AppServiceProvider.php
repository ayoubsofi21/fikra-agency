<?php

namespace App\Providers;

use Dedoc\Scramble\Scramble;
use Illuminate\Routing\Router;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Serve the generated OpenAPI UI at /docs (Scramble defaults to /docs/api).
        Scramble::configure()->expose(
            ui: fn (Router $router, $action) => $router->get('docs', $action)->name('scramble.docs.ui'),
            document: fn (Router $router, $action) => $router->get('docs.json', $action)->name('scramble.docs.document'),
        );
    }
}
