<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

function h(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function jsonResponse(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function getAlloggi(): array
{
    return getDb()->query('SELECT * FROM alloggi ORDER BY id')->fetchAll();
}

function getTrattamenti(): array
{
    return getDb()->query('SELECT * FROM trattamenti ORDER BY id')->fetchAll();
}

function getStrutture(): array
{
    $strutture = getDb()->query('SELECT * FROM strutture WHERE attiva = 1 ORDER BY id')->fetchAll();

    foreach ($strutture as &$struttura) {
        $struttura = completaStruttura($struttura);
    }

    return $strutture;
}

function getStrutturaBySlug(string $slug): ?array
{
    $stmt = getDb()->prepare('SELECT * FROM strutture WHERE slug = :slug AND attiva = 1 LIMIT 1');
    $stmt->execute(['slug' => $slug]);
    $struttura = $stmt->fetch();

    return $struttura ? completaStruttura($struttura) : null;
}

function completaStruttura(array $struttura): array
{
    $serviziStmt = getDb()->prepare(
        'SELECT v.nome
         FROM servizi v
         INNER JOIN struttura_servizi sv ON sv.servizio_id = v.id
         WHERE sv.struttura_id = :struttura_id
         ORDER BY v.nome'
    );
    $serviziStmt->execute(['struttura_id' => $struttura['id']]);
    $struttura['servizi'] = array_column($serviziStmt->fetchAll(), 'nome');

    $alloggiStmt = getDb()->prepare(
        'SELECT a.*
         FROM alloggi a
         INNER JOIN struttura_alloggi sa ON sa.alloggio_id = a.id
         WHERE sa.struttura_id = :struttura_id
         ORDER BY a.id'
    );
    $alloggiStmt->execute(['struttura_id' => $struttura['id']]);
    $struttura['alloggi'] = $alloggiStmt->fetchAll();

    return $struttura;
}

function getTrattamentoByCodice(string $codice): ?array
{
    $stmt = getDb()->prepare('SELECT * FROM trattamenti WHERE codice = :codice LIMIT 1');
    $stmt->execute(['codice' => $codice]);
    $trattamento = $stmt->fetch();

    return $trattamento ?: null;
}

function trovaAlloggioInStruttura(array $struttura, string $codice): ?array
{
    foreach ($struttura['alloggi'] as $alloggio) {
        if ($alloggio['codice'] === $codice) {
            return $alloggio;
        }
    }

    return null;
}

function getEventiLowCost(): array
{
    $sql = 'SELECT e.*, s.slug AS struttura_slug, s.nome AS struttura_nome
            FROM eventi_low_cost e
            INNER JOIN strutture s ON s.id = e.struttura_id
            WHERE e.attivo = 1
            ORDER BY e.data_arrivo, e.nome';

    return getDb()->query($sql)->fetchAll();
}

function trovaEventoLowCost(string $destinazione, string $arrivo, string $partenza): ?array
{
    $stmt = getDb()->prepare(
        'SELECT e.*, s.slug AS struttura_slug
         FROM eventi_low_cost e
         INNER JOIN strutture s ON s.id = e.struttura_id
         WHERE e.attivo = 1
           AND s.slug = :destinazione
           AND e.data_arrivo = :arrivo
           AND e.data_partenza = :partenza
         LIMIT 1'
    );
    $stmt->execute([
        'destinazione' => $destinazione,
        'arrivo' => $arrivo,
        'partenza' => $partenza,
    ]);

    $evento = $stmt->fetch();

    return $evento ?: null;
}

function validaRegoleEventiLowCost(array $eventi): array
{
    $errori = [];
    $eventiPerMese = [];
    $strutturaPerMese = [];
    $eventiPerGiorno = [];

    foreach ($eventi as $evento) {
        $mese = date('Y-m', strtotime($evento['data_arrivo']));
        $eventiPerMese[$mese] = ($eventiPerMese[$mese] ?? 0) + 1;

        $chiaveStruttura = $mese . '-' . $evento['struttura_slug'];
        $strutturaPerMese[$chiaveStruttura] = ($strutturaPerMese[$chiaveStruttura] ?? 0) + 1;

        $inizio = new DateTime($evento['data_arrivo']);
        $fine = new DateTime($evento['data_partenza']);

        while ($inizio < $fine) {
            $giorno = $inizio->format('Y-m-d');
            $eventiPerGiorno[$giorno] = ($eventiPerGiorno[$giorno] ?? 0) + 1;
            $inizio->modify('+1 day');
        }
    }

    foreach ($eventiPerMese as $mese => $numeroEventi) {
        if ($numeroEventi > 4) {
            $errori[] = "Nel mese {$mese} ci sono piu di 4 eventi low cost.";
        }
    }

    foreach ($strutturaPerMese as $numeroEventi) {
        if ($numeroEventi > 1) {
            $errori[] = 'Una struttura ha piu di un evento low cost nello stesso mese.';
        }
    }

    foreach ($eventiPerGiorno as $giorno => $numeroEventi) {
        if ($numeroEventi > 2) {
            $errori[] = "Nel giorno {$giorno} ci sono piu di 2 eventi accavallati.";
        }
    }

    return $errori;
}

function salvaRichiestaPreventivo(array $dati): int
{
    $sql = 'INSERT INTO richieste_preventivo
        (nome_cliente, email, telefono, struttura_id, alloggio_id, trattamento_id, evento_id,
         tipo_pacchetto, numero_persone, numero_stanze, data_arrivo, data_partenza, notti,
         prezzo_base_persona_notte, supplemento_trattamento, supplemento_alloggio,
         prezzo_persona_notte, totale, sconto_percentuale, totale_scontato, messaggio)
        VALUES
        (:nome_cliente, :email, :telefono, :struttura_id, :alloggio_id, :trattamento_id, :evento_id,
         :tipo_pacchetto, :numero_persone, :numero_stanze, :data_arrivo, :data_partenza, :notti,
         :prezzo_base_persona_notte, :supplemento_trattamento, :supplemento_alloggio,
         :prezzo_persona_notte, :totale, :sconto_percentuale, :totale_scontato, :messaggio)';

    $stmt = getDb()->prepare($sql);
    $stmt->execute($dati);

    return (int) getDb()->lastInsertId();
}
