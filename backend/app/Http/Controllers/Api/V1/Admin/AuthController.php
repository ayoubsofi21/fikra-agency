<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ForgotPasswordRequest;
use App\Http\Requests\Admin\LoginRequest;
use App\Http\Requests\Admin\ResetPasswordRequest;
use App\Http\Resources\Admin\UserResource;
use App\Mail\ResetPasswordMail;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;

/**
 * Token-based admin authentication (Sanctum personal access tokens).
 *
 * Tokens carry abilities derived from the user's role (admin => ["*"],
 * editor => its permissions) and expire after SANCTUM_TOKEN_EXPIRATION.
 */
class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::query()->where('email', $request->string('email'))->first();

        if ($user === null || ! Hash::check((string) $request->input('password'), $user->password)) {
            return $this->apiError(trans('errors.invalid_credentials'), 401, [
                'email' => [trans('errors.invalid_credentials')],
            ]);
        }

        // Housekeeping: drop tokens that already expired.
        $user->tokens()->where('expires_at', '<', now())->delete();

        $abilities = $this->abilitiesFor($user);
        $expiresAt = now()->addMinutes((int) config('sanctum.expiration', 10080));

        $token = $user->createToken(
            $request->input('device_name', 'admin-dashboard'),
            $abilities,
            $expiresAt,
        );

        return $this->apiSuccess([
            'token' => $token->plainTextToken,
            'token_type' => 'Bearer',
            'expires_at' => $expiresAt->toIso8601String(),
            'abilities' => $abilities,
            'user' => new UserResource($user),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return $this->apiSuccess([
            'user' => new UserResource($user),
            'abilities' => $this->abilitiesFor($user),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return $this->apiSuccess(['message' => trans('forms.logged_out')]);
    }

    /**
     * Always answers with the same message so accounts cannot be enumerated.
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $user = User::query()->where('email', $request->string('email'))->first();

        if ($user !== null) {
            $token = Password::broker()->createToken($user);
            $expires = (int) config('auth.passwords.users.expire', 60);

            $url = rtrim((string) config('app.frontend_url'), '/').'/reset-password?'.http_build_query([
                'token' => $token,
                'email' => $user->email,
            ]);

            Mail::to($user->email)
                ->locale(app()->getLocale())
                ->send(new ResetPasswordMail($user, $url, $expires));
        }

        return $this->apiSuccess(['message' => trans('forms.password_reset_sent')]);
    }

    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $status = Password::broker()->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password): void {
                $user->forceFill(['password' => $password])->save();

                // All existing sessions are invalidated after a reset.
                $user->tokens()->delete();
            },
        );

        if ($status !== Password::PASSWORD_RESET) {
            return $this->apiError(trans('errors.invalid_reset_token'), 422, [
                'email' => [trans('errors.invalid_reset_token')],
            ]);
        }

        return $this->apiSuccess(['message' => trans('forms.password_reset_done')]);
    }

    /**
     * Token abilities: full access for admins, explicit permissions for editors.
     *
     * @return array<int, string>
     */
    private function abilitiesFor(User $user): array
    {
        if ($user->isAdmin()) {
            return ['*'];
        }

        return $user->getAllPermissions()->pluck('name')->values()->all();
    }
}
