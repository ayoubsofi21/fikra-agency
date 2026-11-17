<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Http\Resources\Admin\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Dashboard user management (admin-only). Applies to staff accounts that
 * sign in to the admin panel; the spatie role mirrors the `role` column.
 */
class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        [$page, $perPage] = $this->paginationParams($request);

        $query = User::query()->with('media');

        if ($request->filled('role')) {
            $query->where('role', $request->query('role'));
        }

        if (($search = trim((string) $request->query('search', ''))) !== '') {
            $query->where(function ($q) use ($search): void {
                $q->where('name', 'like', '%'.$search.'%')
                    ->orWhere('email', 'like', '%'.$search.'%');
            });
        }

        $users = $query->orderBy('name')->orderBy('id')->get();

        return $this->apiPaginated($request, $users, UserResource::class, $page, $perPage);
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = User::query()->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => $data['role'],
            'email_verified_at' => now(),
        ]);

        $user->syncRoles([$data['role']]);

        return $this->apiCreated(new UserResource($user->fresh()));
    }

    public function show(User $user): JsonResponse
    {
        return $this->apiSuccess(new UserResource($user->load('media')));
    }

    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $data = $request->validated();

        if (($data['password'] ?? null) === null || $data['password'] === '') {
            unset($data['password']);
        }

        if (isset($data['role']) && $data['role'] !== $user->role?->value) {
            abort_if(
                $request->user()->is($user) && $user->isAdmin(),
                422,
                trans('errors.cannot_change_own_role'),
            );

            $this->ensureNotLastAdmin($user);
        }

        $user->update($data);

        if (isset($data['role'])) {
            $user->syncRoles([$data['role']]);
        }

        return $this->apiSuccess(new UserResource($user->fresh()));
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        abort_if($request->user()->is($user), 422, trans('errors.cannot_delete_self'));

        $this->ensureNotLastAdmin($user);

        // Revoke tokens and drop the account; published content is untouched.
        $user->tokens()->delete();
        $user->delete();

        return $this->apiSuccess(['message' => trans('forms.deleted')]);
    }

    /**
     * Never allow the final administrator to be demoted or deleted, which
     * would leave the dashboard without a settings/users manager.
     */
    private function ensureNotLastAdmin(User $user): void
    {
        if (! $user->isAdmin()) {
            return;
        }

        $admins = User::query()->where('role', UserRole::Admin->value)->count();

        abort_if($admins <= 1, 422, trans('errors.cannot_remove_last_admin'));
    }
}
