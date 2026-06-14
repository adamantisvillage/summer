<?php
declare(strict_types=1);

require_once __DIR__ . '/auth.php';

if (utenteCorrente() !== null) {
    header('Location: area-riservata.php');
    exit;
}

$messaggio = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $risultato = registraUtente(
            (string) ($_POST['nome'] ?? ''),
            (string) ($_POST['email'] ?? ''),
            (string) ($_POST['password'] ?? ''),
            (string) ($_POST['conferma_password'] ?? '')
        );

        if ($risultato['ok']) {
            header('Location: index.html');
            exit;
        }

        $messaggio = $risultato['messaggio'];
    } catch (Throwable $exception) {
        $messaggio = $exception->getMessage();
    }
}
?>

<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <title>Crea account | Adamantis Village</title>
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
        <h1>Crea account</h1>
        <p class="subtitle">Registrati con email e password. La password viene salvata in modo protetto.</p>

        <?php if ($messaggio !== '') { ?>
            <div class="message message-error">
                <?php echo htmlspecialchars($messaggio, ENT_QUOTES, 'UTF-8'); ?>
            </div>
        <?php } ?>

        <form method="POST" action="registrazione.php">
            <input type="text" name="nome" placeholder="Nome e cognome" autocomplete="name" required>
            <input type="email" name="email" placeholder="Email" autocomplete="email" required>
            <input type="password" name="password" placeholder="Password" autocomplete="new-password" minlength="6" required>
            <input type="password" name="conferma_password" placeholder="Conferma password" autocomplete="new-password" minlength="6" required>
            <button type="submit" class="btn">Crea account</button>
        </form>

        <p class="links">
            Hai gia un account? <a href="login.php">Accedi</a>.
        </p>
    </section>
</main>
</body>
</html>
