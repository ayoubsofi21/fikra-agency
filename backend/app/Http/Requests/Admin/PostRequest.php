<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Admin\Concerns\ValidatesTranslations;
use App\Models\Post;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PostRequest extends FormRequest
{
    use ValidatesTranslations;

    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $post = $this->route('post');

        return array_merge(
            $this->localizedRules(['title', 'excerpt'], true, 255),
            $this->localizedRules(['author_name', 'seo_title', 'seo_description'], false, 255),
            [
                // content is a localized array of blocks: { en: [{type,text}], ... }
                'content' => ['required', 'array'],
                'content.en' => ['required', 'array', 'min:1'],
                'content.fr' => ['nullable', 'array'],
                'content.ar' => ['nullable', 'array'],
                'content.en.*' => ['array'],
                'content.en.*.type' => ['required', 'string', 'in:p,h2,h3,ul,ol,quote,image'],
                'content.en.*.text' => ['nullable', 'string'],
                'content.en.*.items' => ['nullable', 'array'],

                'slug' => ['nullable', 'string', 'max:190', Rule::unique('posts', 'slug')->ignore($post)],
                'category_id' => ['nullable', 'integer', 'exists:post_categories,id'],
                'author_id' => ['nullable', 'integer', 'exists:users,id'],
                'cover' => ['nullable', 'string', 'max:255'],
                'reading_time' => ['nullable', 'integer', 'min:1', 'max:120'],
                'status' => ['required', Rule::in([Post::STATUS_DRAFT, Post::STATUS_PUBLISHED])],
                'published_at' => ['nullable', 'date'],
            ],
        );
    }
}
