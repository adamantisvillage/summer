<?php
declare(strict_types=1);

require_once __DIR__ . '/auth.php';

if (utenteCorrente() !== null) {
    header('Location: area-riservata.php');
    exit;
}

$messaggio = '';
$tipoMessaggio = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $risultato = accediUtente((string) ($_POST['email'] ?? ''), (string) ($_POST['password'] ?? ''));

        if ($risultato['ok']) {
            header('Location: index.html');
            exit;
        }

        $messaggio = $risultato['messaggio'];
        $tipoMessaggio = 'message-error';
    } catch (Throwable $exception) {
        $messaggio = $exception->getMessage();
        $tipoMessaggio = 'message-error';
    }
} elseif (isset($_GET['messaggio']) && $_GET['messaggio'] === 'logout') {
    $messaggio = 'Sei uscito dal tuo account.';
    $tipoMessaggio = 'message-ok';
}
?>

<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <title>Accedi | Adamantis Village</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="account.css">
</head>
<body>
<header>
    <a href="index.html" class="logo">Adamantis Village</a>
    <nav>
        <a href="index.html">Home</a>
        <a href="strutture.html">Le Strutture</a>
        <a href="registrazione.php">Registrati</a>
    </nav>
</header>

<main class="page">
    <section class="auth-card">
        <h1>Accedi</h1>
        <p class="subtitle">Entra nel tuo account per ritrovare i tuoi dati e le richieste di preventivo fatte con la stessa email.</p>

        <?php if ($messaggio !== '') { ?>
            <div class="message <?php echo htmlspecialchars($tipoMessaggio, ENT_QUOTES, 'UTF-8'); ?>">
                <?php echo htmlspecialchars($messaggio, ENT_QUOTES, 'UTF-8'); ?>
            </div>
        <?php } ?>

        <form method="POST" action="login.php">
            <input type="email" name="email" placeholder="Email" autocomplete="email" required>
            <input type="password" name="password" placeholder="Password" autocomplete="current-password" required>
            <button type="submit" class="btn">Accedi</button>
        </form>

        <p class="links">
            Non hai ancora un account? <a href="registrazione.php">Crealo ora</a>.
            <br>
            <a href="dimentica-password.php">Hai dimenticato la password?</a>
        </p>
    </section>
</main>
</body>
</html>
