<?php

namespace App\Http\Resources\Public;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Mock-compatible blog post:
 * { id, slug, title{}, excerpt{}, content{}, category{}, author{}, cover,
 *   date, readTime, published }
 */
class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $author = $this->translationsOf('author_name');

        if (blank($author['en'] ?? null) && $this->author !== null) {
            $name = $this->author->name;
            $author = ['en' => $name, 'fr' => $name, 'ar' => $name];
        }

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->translationsOf('title'),
            'excerpt' => $this->translationsOf('excerpt'),
            'content' => $this->translationsOf('content'),
            'category' => $this->category?->translationsOf('name'),
            'author' => $author,
            'cover' => $this->resource->getFirstMediaUrl('cover') ?: $this->cover,
            'date' => $this->published_at?->format('Y-m-d'),
            'readTime' => $this->reading_time,
            'published' => $this->status === Post::STATUS_PUBLISHED,
        ];
    }
}
