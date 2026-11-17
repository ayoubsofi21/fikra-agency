<?php

namespace App\Models;

use App\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SolutionFeature extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = [
        'solution_id',
        'title',
        'description',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    /** @var array<int, string> */
    protected $translatable = ['title', 'description'];

    public function solution(): BelongsTo
    {
        return $this->belongsTo(Solution::class);
    }
}
