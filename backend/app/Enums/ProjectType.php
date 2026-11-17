<?php

namespace App\Enums;

/**
 * Project type choices on the multi-step quote form.
 * Values must stay identical to the React frontend's Contact page.
 */
enum ProjectType: string
{
    case CustomWebsite = 'custom-website';
    case Ecommerce = 'ecommerce';
    case Platform = 'platform';
    case Solution = 'solution';
    case Design = 'design';
    case Other = 'other';

    /**
     * @return array<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
