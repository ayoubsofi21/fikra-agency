<?php

/*
|--------------------------------------------------------------------------
| Notification emails (public forms)
|--------------------------------------------------------------------------
*/

return [

    'new_quote' => [
        'subject' => 'New quote request from :name',
        'intro' => 'A new quote request was submitted on the website.',
        'closing' => 'Reply directly to this email to contact the sender.',
    ],

    'quote_received' => [
        'subject' => 'We received your request — :app',
        'intro' => 'Hi :name, thanks for contacting :app. We have received your quote request and will get back to you within one business day.',
        'closing' => 'If you need to add anything, simply reply to this email.',
    ],

    'new_solution' => [
        'subject' => 'New solution request from :name',
        'intro' => 'A visitor requested a ready-made solution.',
        'closing' => 'Follow up with the sender from the admin dashboard.',
    ],

    'new_contact' => [
        'subject' => 'New contact message from :name',
        'intro' => 'A new message was submitted through the contact form.',
        'closing' => 'Reply directly to this email to contact the sender.',
    ],

    'reset_password' => [
        'subject' => 'Reset your password — :app',
        'intro' => 'You are receiving this email because a password reset was requested for your account.',
        'action' => 'Reset password',
        'expires' => 'This link expires in :minutes minutes.',
        'ignore' => 'If you did not request a reset, no further action is required.',
    ],

    'fields' => [
        'name' => 'Name',
        'email' => 'Email',
        'phone' => 'Phone',
        'company' => 'Company',
        'website' => 'Website',
        'project_type' => 'Project type',
        'budget' => 'Budget',
        'timeline' => 'Timeline',
        'description' => 'Project description',
        'subject' => 'Subject',
        'message' => 'Message',
        'solution' => 'Solution',
        'attachments' => 'Attachments',
        'submitted_at' => 'Submitted at',
    ],

];
