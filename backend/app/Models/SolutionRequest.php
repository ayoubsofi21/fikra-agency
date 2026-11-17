<?php

namespace App\Models;

use App\Enums\QuoteStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SolutionRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'solution_id',
        'name',
        'email',
        'phone',
        'company',
        'message',
        'status',
    ];

    protected $casts = [
        'status' => QuoteStatus::class,
    ];

    public function solution(): BelongsTo
    {
        return $this->belongsTo(Solution::class);
    }
}
