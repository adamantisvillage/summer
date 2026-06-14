<?php
declare(strict_types=1);

require_once __DIR__ . '/auth.php';

header('Content-Type: application/json; charset=utf-8');

$utente = utenteCorrente();

if ($utente === null) {
    echo json_encode([
        'loggedIn' => false,
    ]);
    exit;
}

echo json_encode([
    'loggedIn' => true,
    'utente' => [
        'nome' => $utente['nome'],
        'email' => $utente['email'],
        'iniziale' => strtoupper(substr($utente['nome'], 0, 1)),
    ],
]);
