<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Agency contact details used by form notifications
    |--------------------------------------------------------------------------
    |
    | The admin inbox receives every new quote, solution and contact request.
    | Fall back to the seeded site settings when ADMIN_EMAIL is not set.
    |
    */

    'admin_email' => env('ADMIN_EMAIL', 'contact@fikra.agency'),

    'admin_name' => env('ADMIN_NAME', 'FIKRA Agency'),

    /*
    |--------------------------------------------------------------------------
    | Quote attachments
    |--------------------------------------------------------------------------
    |
    | Uploads from the public quote form are stored on a private disk and are
    | only reachable through authenticated admin endpoints (Step 6+).
    |
    */

    'attachments' => [
        'disk' => env('QUOTE_ATTACHMENTS_DISK', 'local'),
        'path' => 'quote-attachments',
        'max_files' => 3,
        'max_kb' => 5120,
        'mimes' => ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg'],
    ],

    /*
    |--------------------------------------------------------------------------
    | Locales
    |--------------------------------------------------------------------------
    */

    'locales' => ['en', 'fr', 'ar'],

    'default_locale' => 'en',

];
