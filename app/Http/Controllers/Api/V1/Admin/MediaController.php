<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMediaRequest;
use App\Http\Requests\Admin\UpdateMediaRequest;
use App\Models\Post;
use App\Models\Project;
use App\Models\TeamMember;
use App\Models\Testimonial;
use App\Models\User;
use App\Services\MediaService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * Generic media endpoints: /admin/media/{type}/{id} for a model's collection,
 * /admin/media/{media} for a single file.
 */
class MediaController extends Controller
{
    private const TYPES = [
        'projects' => Project::class,
        'posts' => Post::class,
        'team' => TeamMember::class,
        'testimonials' => Testimonial::class,
        'users' => User::class,
    ];

    private const COLLECTIONS = [
        'projects' => ['cover', 'gallery'],
        'posts' => ['cover'],
        'team' => ['photo'],
        'testimonials' => ['avatar'],
        'users' => ['avatar'],
    ];

    public function __construct(private readonly MediaService $media) {}

    public function index(string $type, int $id): JsonResponse
    {
        $model = $this->resolveModel($type, $id);

        return $this->apiSuccess([
            'media' => $this->media->presentMany($model->getMedia('*')),
        ]);
    }

    public function store(StoreMediaRequest $request, string $type, int $id): JsonResponse
    {
        $model = $this->resolveModel($type, $id);

        $collection = (string) $request->input('collection');
        abort_unless(
            in_array($collection, self::COLLECTIONS[$type] ?? [], true),
            422,
            'Unknown media collection for this resource.'
        );

        $created = [];

        foreach ($request->file('files', []) as $file) {
            $created[] = $model->addMedia($file)->toMediaCollection($collection);
        }

        return $this->apiCreated([
            'media' => $this->media->presentMany(collect($created)),
            'message' => trans('forms.media_uploaded'),
        ]);
    }

    public function update(UpdateMediaRequest $request, Media $media): JsonResponse
    {
        $payload = $request->validated();

        if (array_key_exists('name', $payload)) {
            $media->name = $payload['name'];
        }

        if (array_key_exists('alt', $payload)) {
            $media->setCustomProperty('alt', $payload['alt']);
        }

        $media->save();

        return $this->apiSuccess($this->media->present($media->fresh()));
    }

    public function destroy(Media $media): JsonResponse
    {
        $media->delete();

        return $this->apiSuccess(['message' => trans('forms.deleted')]);
    }

    private function resolveModel(string $type, int $id): Model&HasMedia
    {
        abort_unless(isset(self::TYPES[$type]), 404);

        $class = self::TYPES[$type];
        $model = $class::query()->findOrFail($id);

        abort_unless($model instanceof HasMedia, 422, 'This resource does not support media.');

        return $model;
    }
}
