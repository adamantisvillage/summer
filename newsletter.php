<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

function rispostaNewsletter(bool $ok, string $messaggio, int $status = 200): void
{
    http_response_code($status);

    $accettaJson = str_contains((string) ($_SERVER['HTTP_ACCEPT'] ?? ''), 'application/json')
        || (($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') === 'XMLHttpRequest');

    if ($accettaJson) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'messaggio' => $messaggio]);
        exit;
    }

    $classe = $ok ? 'message-ok' : 'message-error';
    ?>
    <!DOCTYPE html>
    <html lang="it">
    <head>
        <meta charset="UTF-8">
        <title>Sconto newsletter | Adamantis Village</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="account.css">
    </head>
    <body>
    <header>
        <a href="index.html" class="logo">Adamantis Village</a>
        <nav>
            <a href="index.html">Home</a>
            <a href="strutture.html">Le Strutture</a>
        </nav>
    </header>
    <main class="page">
        <section class="auth-card">
            <h1>Richiesta sconto</h1>
            <div class="message <?php echo $classe; ?>">
                <?php echo htmlspecialchars($messaggio, ENT_QUOTES, 'UTF-8'); ?>
            </div>
            <a href="index.html#contatti" class="btn">Torna al sito</a>
        </section>
    </main>
    </body>
    </html>
    <?php
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    rispostaNewsletter(false, 'Invia la tua email dal modulo sconto.', 405);
}

$email = strtolower(trim((string) ($_POST['email'] ?? '')));

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    rispostaNewsletter(false, 'Inserisci un indirizzo email valido.', 422);
}

try {
    $stmt = getDb()->prepare('INSERT INTO newsletter_iscrizioni (email) VALUES (:email)');
    $stmt->execute(['email' => $email]);

    rispostaNewsletter(true, 'Perfetto: email registrata. Ti abbiamo riservato il 10% di sconto.');
} catch (PDOException $exception) {
    if ($exception->getCode() === '23000') {
        rispostaNewsletter(true, 'Questa email era gia iscritta: lo sconto del 10% resta valido.');
    }

    throw $exception;
}
