<?php
declare(strict_types=1);

require_once __DIR__ . '/catalogo.php';

try {
    $slug = trim((string) ($_GET['id'] ?? ''));
    $struttura = getStrutturaBySlug($slug);

    if ($struttura === null) {
        jsonResponse(['ok' => false, 'messaggio' => 'Struttura non trovata.'], 404);
    }

    jsonResponse([
        'ok' => true,
        'struttura' => $struttura,
        'trattamenti' => getTrattamenti(),
    ]);
} catch (Throwable $exception) {
    jsonResponse(['ok' => false, 'messaggio' => $exception->getMessage()], 500);
}
