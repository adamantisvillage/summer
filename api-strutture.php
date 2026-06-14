<?php
declare(strict_types=1);

require_once __DIR__ . '/catalogo.php';

try {
    jsonResponse([
        'ok' => true,
        'strutture' => getStrutture(),
        'eventi_low_cost' => getEventiLowCost(),
    ]);
} catch (Throwable $exception) {
    jsonResponse(['ok' => false, 'messaggio' => $exception->getMessage()], 500);
}
