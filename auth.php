<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function utenteCorrente(): ?array
{
    if (empty($_SESSION['utente_id'])) {
        return null;
    }

    $stmt = getDb()->prepare('SELECT id, nome, email FROM utenti WHERE id = :id AND attivo = 1 LIMIT 1');
    $stmt->execute(['id' => (int) $_SESSION['utente_id']]);
    $utente = $stmt->fetch();

    if (!$utente) {
        unset($_SESSION['utente_id']);
        return null;
    }

    return $utente;
}

function registraUtente(string $nome, string $email, string $password, string $confermaPassword): array
{
    $nome = trim($nome);
    $email = strtolower(trim($email));

    if ($nome === '' || $email === '' || $password === '' || $confermaPassword === '') {
        return ['ok' => false, 'messaggio' => 'Compila tutti i campi.'];
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return ['ok' => false, 'messaggio' => 'Inserisci un indirizzo email valido.'];
    }

    if (strlen($password) < 6) {
        return ['ok' => false, 'messaggio' => 'La password deve contenere almeno 6 caratteri.'];
    }

    if ($password !== $confermaPassword) {
        return ['ok' => false, 'messaggio' => 'Le due password non coincidono.'];
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    try {
        $stmt = getDb()->prepare(
            'INSERT INTO utenti (nome, email, password_hash) VALUES (:nome, :email, :password_hash)'
        );
        $stmt->execute([
            'nome' => $nome,
            'email' => $email,
            'password_hash' => $passwordHash,
        ]);
    } catch (PDOException $exception) {
        if ($exception->getCode() === '23000') {
            return ['ok' => false, 'messaggio' => 'Esiste gia un account con questa email.'];
        }

        throw $exception;
    }

    session_regenerate_id(true);
    $_SESSION['utente_id'] = (int) getDb()->lastInsertId();

    return ['ok' => true, 'messaggio' => 'Account creato correttamente.'];
}

function accediUtente(string $email, string $password): array
{
    $email = strtolower(trim($email));

    if ($email === '' || $password === '') {
        return ['ok' => false, 'messaggio' => 'Inserisci email e password.'];
    }

    $stmt = getDb()->prepare(
        'SELECT id, password_hash FROM utenti WHERE email = :email AND attivo = 1 LIMIT 1'
    );
    $stmt->execute(['email' => $email]);
    $utente = $stmt->fetch();

    if (!$utente || !password_verify($password, $utente['password_hash'])) {
        return ['ok' => false, 'messaggio' => 'Email o password non corretti.'];
    }

    session_regenerate_id(true);
    $_SESSION['utente_id'] = (int) $utente['id'];

    $update = getDb()->prepare('UPDATE utenti SET last_login_at = CURRENT_TIMESTAMP WHERE id = :id');
    $update->execute(['id' => (int) $utente['id']]);

    return ['ok' => true, 'messaggio' => 'Accesso effettuato.'];
}

function urlAssoluto(string $path): string
{
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $directory = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/ProggettoEsame/index.html')), '/');

    if ($directory === '' || $directory === '.') {
        $directory = '';
    }

    return $scheme . '://' . $host . $directory . '/' . ltrim($path, '/');
}

function registraEmailInviata(string $destinatario, string $oggetto, string $corpo, bool $inviata, ?string $errore = null): void
{
    $stmt = getDb()->prepare(
        'INSERT INTO email_inviate (destinatario, oggetto, corpo, inviata, errore)
         VALUES (:destinatario, :oggetto, :corpo, :inviata, :errore)'
    );
    $stmt->execute([
        'destinatario' => $destinatario,
        'oggetto' => $oggetto,
        'corpo' => $corpo,
        'inviata' => $inviata ? 1 : 0,
        'errore' => $errore,
    ]);
}

function inviaEmailResetPassword(string $destinatario, string $link): bool
{
    $oggetto = 'Reset password Adamantis Village';
    $corpo = "Ciao,\n\n"
        . "abbiamo ricevuto una richiesta per reimpostare la password del tuo account Adamantis Village.\n\n"
        . "Apri questo link per scegliere una nuova password:\n{$link}\n\n"
        . "Il link scade tra 1 ora. Se non hai richiesto tu il reset, puoi ignorare questa email.";
    $headers = [
        'From: Adamantis Village <no-reply@localhost>',
        'Reply-To: no-reply@localhost',
        'Content-Type: text/plain; charset=UTF-8',
    ];

    $inviata = false;
    $errore = null;

    try {
        $inviata = @mail($destinatario, $oggetto, $corpo, implode("\r\n", $headers));
        if (!$inviata) {
            $errore = 'mail() non configurata o invio non riuscito su questo ambiente.';
        }
    } catch (Throwable $exception) {
        $errore = $exception->getMessage();
    }

    registraEmailInviata($destinatario, $oggetto, $corpo, $inviata, $errore);

    return $inviata;
}

function richiediResetPassword(string $email): array
{
    $email = strtolower(trim($email));

    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return ['ok' => false, 'messaggio' => 'Inserisci un indirizzo email valido.'];
    }

    $messaggio = 'Se questa email e registrata, riceverai un link per reimpostare la password.';

    $stmt = getDb()->prepare('SELECT id FROM utenti WHERE email = :email AND attivo = 1 LIMIT 1');
    $stmt->execute(['email' => $email]);
    $utente = $stmt->fetch();

    if (!$utente) {
        return ['ok' => true, 'messaggio' => $messaggio, 'email_inviata' => false];
    }

    $token = bin2hex(random_bytes(32));
    $tokenHash = hash('sha256', $token);
    $link = urlAssoluto('reset-password.php?token=' . urlencode($token));

    $db = getDb();
    $db->beginTransaction();

    try {
        $disattivaVecchi = $db->prepare(
            'UPDATE password_reset_tokens
             SET used_at = CURRENT_TIMESTAMP
             WHERE utente_id = :utente_id AND used_at IS NULL'
        );
        $disattivaVecchi->execute(['utente_id' => (int) $utente['id']]);

        $inserisci = $db->prepare(
            'INSERT INTO password_reset_tokens (utente_id, token_hash, expires_at)
             VALUES (:utente_id, :token_hash, DATE_ADD(NOW(), INTERVAL 1 HOUR))'
        );
        $inserisci->execute([
            'utente_id' => (int) $utente['id'],
            'token_hash' => $tokenHash,
        ]);

        $db->commit();
    } catch (Throwable $exception) {
        $db->rollBack();
        throw $exception;
    }

    $emailInviata = inviaEmailResetPassword($email, $link);

    return [
        'ok' => true,
        'messaggio' => $messaggio,
        'email_inviata' => $emailInviata,
    ];
}

function getResetTokenValido(string $token): ?array
{
    if ($token === '' || strlen($token) < 32) {
        return null;
    }

    $stmt = getDb()->prepare(
        'SELECT prt.id AS token_id, prt.utente_id, u.email
         FROM password_reset_tokens prt
         INNER JOIN utenti u ON u.id = prt.utente_id
         WHERE prt.token_hash = :token_hash
           AND prt.used_at IS NULL
           AND prt.expires_at > NOW()
           AND u.attivo = 1
         LIMIT 1'
    );
    $stmt->execute(['token_hash' => hash('sha256', $token)]);
    $reset = $stmt->fetch();

    return $reset ?: null;
}

function resettaPasswordConToken(string $token, string $password, string $confermaPassword): array
{
    if ($password === '' || $confermaPassword === '') {
        return ['ok' => false, 'messaggio' => 'Compila tutti i campi.'];
    }

    if (strlen($password) < 6) {
        return ['ok' => false, 'messaggio' => 'La password deve contenere almeno 6 caratteri.'];
    }

    if ($password !== $confermaPassword) {
        return ['ok' => false, 'messaggio' => 'Le due password non coincidono.'];
    }

    $reset = getResetTokenValido($token);

    if ($reset === null) {
        return ['ok' => false, 'messaggio' => 'Link non valido o scaduto. Richiedi un nuovo reset password.'];
    }

    $db = getDb();
    $db->beginTransaction();

    try {
        $updatePassword = $db->prepare('UPDATE utenti SET password_hash = :password_hash WHERE id = :utente_id');
        $updatePassword->execute([
            'password_hash' => password_hash($password, PASSWORD_DEFAULT),
            'utente_id' => (int) $reset['utente_id'],
        ]);

        $usaToken = $db->prepare('UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = :token_id');
        $usaToken->execute(['token_id' => (int) $reset['token_id']]);

        $disattivaAltri = $db->prepare(
            'UPDATE password_reset_tokens
             SET used_at = CURRENT_TIMESTAMP
             WHERE utente_id = :utente_id AND used_at IS NULL'
        );
        $disattivaAltri->execute(['utente_id' => (int) $reset['utente_id']]);

        $db->commit();
    } catch (Throwable $exception) {
        $db->rollBack();
        throw $exception;
    }

    return ['ok' => true, 'messaggio' => 'Password aggiornata. Ora puoi accedere con la nuova password.'];
}

function esciUtente(): void
{
    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params['path'],
            $params['domain'],
            $params['secure'],
            $params['httponly']
        );
    }

    session_destroy();
}

function richiediAccesso(): array
{
    $utente = utenteCorrente();

    if ($utente === null) {
        header('Location: login.php');
        exit;
    }

    return $utente;
}
