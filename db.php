<?php
declare(strict_types=1);

function getDb(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $host = getenv('DB_HOST') ?: 'localhost';
    $database = getenv('DB_NAME') ?: 'adamantis_village';
    $user = getenv('DB_USER') ?: 'root';
    $password = getenv('DB_PASS') ?: '';
    $charset = 'utf8mb4';
    $dsn = "mysql:host={$host};dbname={$database};charset={$charset}";

    try {
        $pdo = new PDO($dsn, $user, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    } catch (PDOException $exception) {
        throw new RuntimeException(
            'Connessione al database non riuscita. Importa database.sql e controlla utente/password in db.php.',
            0,
            $exception
        );
    }

    return $pdo;
}
