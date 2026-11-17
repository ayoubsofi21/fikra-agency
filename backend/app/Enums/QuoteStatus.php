<?php

namespace App\Enums;

/**
 * Lifecycle of a quote (project) request.
 */
enum QuoteStatus: string
{
    case New = 'new';
    case InProgress = 'in_progress';
    case Won = 'won';
    case Lost = 'lost';

    public function label(): string
    {
        return match ($this) {
            self::New => 'New',
            self::InProgress => 'In progress',
            self::Won => 'Won',
            self::Lost => 'Lost',
        };
    }
}
