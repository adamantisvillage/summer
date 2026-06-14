<?php
declare(strict_types=1);

require_once __DIR__ . '/auth.php';

$utente = richiediAccesso();

$stmt = getDb()->prepare(
    'SELECT r.id, r.created_at, r.numero_persone, r.data_arrivo, r.data_partenza,
            r.totale_scontato, s.nome AS struttura
     FROM richieste_preventivo r
     INNER JOIN strutture s ON s.id = r.struttura_id
     WHERE r.email = :email
     ORDER BY r.created_at DESC'
);
$stmt->execute(['email' => $utente['email']]);
$richieste = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <title>Area account | Adamantis Village</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="account.css">
</head>
<body>
<header>
    <a href="index.html" class="logo">Adamantis Village</a>
    <nav>
        <a href="index.html">Home</a>
        <a href="strutture.html">Le Strutture</a>
        <a href="logout.php">Esci</a>
    </nav>
</header>

<main class="page">
    <section class="account-card">
        <h1>Ciao, <?php echo htmlspecialchars($utente['nome'], ENT_QUOTES, 'UTF-8'); ?></h1>
        <p class="subtitle">Email account: <?php echo htmlspecialchars($utente['email'], ENT_QUOTES, 'UTF-8'); ?></p>

        <div class="account-actions">
            <a href="index.html#preventivo" class="btn">Richiedi un preventivo</a>
            <a href="strutture.html" class="btn btn-secondary">Vedi strutture</a>
        </div>

        <h2>Le tue richieste di preventivo</h2>

        <?php if (empty($richieste)) { ?>
            <div class="empty">
                Non ci sono ancora preventivi collegati a questa email.
            </div>
        <?php } else { ?>
            <table class="request-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Struttura</th>
                        <th>Persone</th>
                        <th>Date</th>
                        <th>Totale</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($richieste as $richiesta) { ?>
                        <tr>
                            <td>#<?php echo (int) $richiesta['id']; ?></td>
                            <td><?php echo htmlspecialchars($richiesta['struttura'], ENT_QUOTES, 'UTF-8'); ?></td>
                            <td><?php echo (int) $richiesta['numero_persone']; ?></td>
                            <td>
                                <?php echo htmlspecialchars($richiesta['data_arrivo'], ENT_QUOTES, 'UTF-8'); ?>
                                -
                                <?php echo htmlspecialchars($richiesta['data_partenza'], ENT_QUOTES, 'UTF-8'); ?>
                            </td>
                            <td><?php echo number_format((float) $richiesta['totale_scontato'], 2, ',', '.'); ?>&euro;</td>
                        </tr>
                    <?php } ?>
                </tbody>
            </table>
        <?php } ?>
    </section>
</main>
</body>
</html>
