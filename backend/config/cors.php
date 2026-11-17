<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | The FRONTEND_URL origin (the React + Vite app) is allowed to call this
    | API. Accept-Language is explicitly allowed so locale switching works
    | from the browser.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_filter(array_map(
        'rtrim',
        explode(',', env('FRONTEND_URL', 'http://localhost:3000')),
    )),

    'allowed_origins_patterns' => [],

    'allowed_headers' => [
        'Accept',
        'Authorization',
        'Content-Type',
        'Content-Disposition',
        'X-Requested-With',
        'Accept-Language',
        'X-XSRF-TOKEN',
    ],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
