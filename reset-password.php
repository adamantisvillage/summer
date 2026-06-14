<?php
declare(strict_types=1);

require_once __DIR__ . '/auth.php';

if (utenteCorrente() !== null) {
    header('Location: area-riservata.php');
    exit;
}

$token = (string) ($_GET['token'] ?? $_POST['token'] ?? '');
$messaggio = '';
$tipoMessaggio = '';
$resetValido = getResetTokenValido($token);
$passwordAggiornata = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $risultato = resettaPasswordConToken(
            $token,
            (string) ($_POST['password'] ?? ''),
            (string) ($_POST['conferma_password'] ?? '')
        );
        $messaggio = $risultato['messaggio'];
        $tipoMessaggio = $risultato['ok'] ? 'message-ok' : 'message-error';
        $passwordAggiornata = $risultato['ok'];
        $resetValido = $passwordAggiornata ? null : getResetTokenValido($token);
    } catch (Throwable $exception) {
        $messaggio = $exception->getMessage();
        $tipoMessaggio = 'message-error';
        $resetValido = getResetTokenValido($token);
    }
} elseif ($resetValido === null) {
    $messaggio = 'Link non valido o scaduto. Richiedi un nuovo reset password.';
    $tipoMessaggio = 'message-error';
}
?>

<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <title>Reset password | Adamantis Village</title>
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
        <h1>Reset password</h1>
        <p class="subtitle">Scegli una nuova password per il tuo account.</p>

        <?php if ($messaggio !== '') { ?>
            <div class="message <?php echo htmlspecialchars($tipoMessaggio, ENT_QUOTES, 'UTF-8'); ?>">
                <?php echo htmlspecialchars($messaggio, ENT_QUOTES, 'UTF-8'); ?>
            </div>
        <?php } ?>

        <?php if ($passwordAggiornata) { ?>
            <a href="login.php" class="btn">Vai al login</a>
        <?php } elseif ($resetValido !== null) { ?>
            <form method="POST" action="reset-password.php">
                <input type="hidden" name="token" value="<?php echo htmlspecialchars($token, ENT_QUOTES, 'UTF-8'); ?>">
                <input type="password" name="password" placeholder="Nuova password" autocomplete="new-password" minlength="6" required>
                <input type="password" name="conferma_password" placeholder="Conferma nuova password" autocomplete="new-password" minlength="6" required>
                <button type="submit" class="btn">Aggiorna password</button>
            </form>
        <?php } else { ?>
            <a href="dimentica-password.php" class="btn">Richiedi nuovo link</a>
        <?php } ?>
    </section>
</main>
</body>
</html>
