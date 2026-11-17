<?php

namespace App\Models;

use App\Enums\QuoteStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuoteRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'company',
        'project_type',
        'budget_range',
        'timeline',
        'description',
        'attachment',
        'attachments',
        'status',
        'internal_notes',
        'ip_address',
    ];

    protected $casts = [
        'status' => QuoteStatus::class,
        'attachments' => 'array',
    ];

    /** Never serialized (public or admin) — read explicitly when needed. */
    protected $hidden = [
        'ip_address',
    ];
}
