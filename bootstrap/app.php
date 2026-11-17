<?php

use App\Http\Middleware\Honeypot;
use App\Http\Middleware\SetLocale;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        apiPrefix: 'api/v1',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Locale negotiation (?lang= / Accept-Language) for every API request.
        $middleware->alias([
            'locale' => SetLocale::class,
            'honeypot' => Honeypot::class,
            'role' => RoleMiddleware::class,
            'permission' => PermissionMiddleware::class,
            'role_or_permission' => RoleOrPermissionMiddleware::class,
        ]);
        $middleware->appendToGroup('api', SetLocale::class);

        // API guests must get a 401 JSON envelope, never a redirect to a
        // (non-existent) login route.
        $middleware->redirectGuestsTo(
            fn (Request $request) => $request->is('api/*') ? null : '/'
        );
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // API routes always answer with the { message, errors } JSON envelope.
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request, Throwable $e) => $request->is('api/*') || $request->expectsJson()
        );

        // 401 / 403 / 404 / 429 (incl. throttling) -> localized { message, errors }.
        $exceptions->render(function (HttpExceptionInterface $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            $status = $e->getStatusCode();
            $message = trim($e->getMessage());

            $fallback = match ($status) {
                401 => trans('errors.unauthenticated'),
                403 => trans('errors.forbidden'),
                404 => trans('errors.not_found'),
                429 => trans('errors.too_many_requests'),
                default => $message,
            };

            // Never leak Eloquent class names from route-model-binding 404s.
            $resolved = ($message !== '' && ! str_contains($message, 'Model [')) ? $message : $fallback;

            if ($resolved === '') {
                $resolved = trans('errors.server_error');
            }

            return response()->json([
                'message' => $resolved,
                'errors' => (object) [],
            ], $status);
        });

        // Missing records (findOrFail / implicit binding) -> localized 404.
        $exceptions->render(function (ModelNotFoundException $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return response()->json([
                'message' => trans('errors.not_found'),
                'errors' => (object) [],
            ], 404);
        });

        // 401 from auth:sanctum (missing/expired/revoked token).
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return response()->json([
                'message' => trans('errors.unauthenticated'),
                'errors' => (object) [],
            ], 401);
        });

        // 422 -> localized top-level message + per-field errors.
        $exceptions->render(function (ValidationException $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return response()->json([
                'message' => trans('errors.validation_failed'),
                'errors' => $e->errors(),
            ], 422);
        });

        // 403 from policies / gates.
        $exceptions->render(function (AuthorizationException $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            $message = trim($e->getMessage());

            return response()->json([
                'message' => $message !== '' ? $message : trans('errors.forbidden'),
                'errors' => (object) [],
            ], 403);
        });

        // Unexpected errors: never leak internals to API clients.
        $exceptions->render(function (Throwable $e, Request $request) {
            if (! $request->is('api/*') || config('app.debug')) {
                return null;
            }

            if ($e instanceof ValidationException
                || $e instanceof AuthorizationException
                || $e instanceof HttpExceptionInterface) {
                return null; // handled by the renderers above
            }

            report($e);

            return response()->json([
                'message' => trans('errors.server_error'),
                'errors' => (object) [],
            ], 500);
        });
    })->create();
