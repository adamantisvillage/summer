<?php
declare(strict_types=1);

require_once __DIR__ . '/auth.php';

if (utenteCorrente() !== null) {
    header('Location: area-riservata.php');
    exit;
}

$messaggio = '';
$tipoMessaggio = '';
$notaLocale = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $risultato = richiediResetPassword((string) ($_POST['email'] ?? ''));
        $messaggio = $risultato['messaggio'];
        $tipoMessaggio = $risultato['ok'] ? 'message-ok' : 'message-error';
        $notaLocale = $risultato['ok'] && empty($risultato['email_inviata']);
    } catch (Throwable $exception) {
        $messaggio = $exception->getMessage();
        $tipoMessaggio = 'message-error';
    }
}
?>

<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <title>Password dimenticata | Adamantis Village</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="account.css">
</head>
<body>
<header>
    <a href="index.html" class="logo">Adamantis Village</a>
    <nav>
        <a href="index.html">Home</a>
        <a href="strutture.html">Le Strutture</a>
        <a href="login.php">Accedi</a>
    </nav>
</header>

<main class="page">
    <section class="auth-card">
        <h1>Password dimenticata</h1>
        <p class="subtitle">Inserisci l'email del tuo account. Ti invieremo un link valido per 1 ora.</p>

        <?php if ($messaggio !== '') { ?>
            <div class="message <?php echo htmlspecialchars($tipoMessaggio, ENT_QUOTES, 'UTF-8'); ?>">
                <?php echo htmlspecialchars($messaggio, ENT_QUOTES, 'UTF-8'); ?>
            </div>
        <?php } ?>

        <?php if ($notaLocale) { ?>
            <div class="message message-info">
                Se stai lavorando in locale con XAMPP e l'email non arriva, controlla la tabella <strong>email_inviate</strong>: li trovi il link di reset generato.
            </div>
        <?php } ?>

        <form method="POST" action="dimentica-password.php">
            <input type="email" name="email" placeholder="Email account" autocomplete="email" required>
            <button type="submit" class="btn">Invia link di reset</button>
        </form>

        <p class="links">
            Ti e tornata in mente? <a href="login.php">Accedi</a>.
        </p>
    </section>
</main>
</body>
</html>
