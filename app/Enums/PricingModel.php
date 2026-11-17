<?php

namespace App\Enums;

/**
 * How a ready-made solution is priced.
 */
enum PricingModel: string
{
    case OneTime = 'one_time';
    case Subscription = 'subscription';
    case Custom = 'custom';

    /**
     * @return array<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function label(): string
    {
        return match ($this) {
            self::OneTime => 'One-time',
            self::Subscription => 'Subscription',
            self::Custom => 'Custom',
        };
    }
}
