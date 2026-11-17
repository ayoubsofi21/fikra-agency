<?php

/*
|--------------------------------------------------------------------------
| E-mails de notification (formulaires publics)
|--------------------------------------------------------------------------
*/

return [

    'new_quote' => [
        'subject' => 'Nouvelle demande de devis de :name',
        'intro' => 'Une nouvelle demande de devis a été envoyée depuis le site.',
        'closing' => 'Répondez directement à cet e-mail pour contacter l\'expéditeur.',
    ],

    'quote_received' => [
        'subject' => 'Nous avons reçu votre demande — :app',
        'intro' => 'Bonjour :name, merci d\'avoir contacté :app. Nous avons bien reçu votre demande de devis et reviendrons vers vous sous un jour ouvré.',
        'closing' => 'Pour ajouter une information, répondez simplement à cet e-mail.',
    ],

    'new_solution' => [
        'subject' => 'Nouvelle demande de solution de :name',
        'intro' => 'Un visiteur a demandé une solution prête à l\'emploi.',
        'closing' => 'Suivez l\'échange depuis le tableau de bord d\'administration.',
    ],

    'new_contact' => [
        'subject' => 'Nouveau message de contact de :name',
        'intro' => 'Un nouveau message a été envoyé via le formulaire de contact.',
        'closing' => 'Répondez directement à cet e-mail pour contacter l\'expéditeur.',
    ],

    'reset_password' => [
        'subject' => 'Réinitialisez votre mot de passe — :app',
        'intro' => 'Vous recevez cet e-mail car une réinitialisation de mot de passe a été demandée pour votre compte.',
        'action' => 'Réinitialiser le mot de passe',
        'expires' => 'Ce lien expire dans :minutes minutes.',
        'ignore' => 'Si vous n\'êtes pas à l\'origine de cette demande, aucune action n\'est nécessaire.',
    ],

    'fields' => [
        'name' => 'Nom',
        'email' => 'E-mail',
        'phone' => 'Téléphone',
        'company' => 'Entreprise',
        'website' => 'Site web',
        'project_type' => 'Type de projet',
        'budget' => 'Budget',
        'timeline' => 'Délai',
        'description' => 'Description du projet',
        'subject' => 'Sujet',
        'message' => 'Message',
        'solution' => 'Solution',
        'attachments' => 'Pièces jointes',
        'submitted_at' => 'Envoyé le',
    ],

];
