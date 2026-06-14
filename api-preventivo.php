<?php
declare(strict_types=1);

require_once __DIR__ . '/catalogo.php';

function postValue(string $key): string
{
    return trim((string) ($_POST[$key] ?? ''));
}

function dateFromInput(string $value): ?DateTimeImmutable
{
    $date = DateTimeImmutable::createFromFormat('!Y-m-d', $value);
    $errors = DateTimeImmutable::getLastErrors();

    if ($date === false) {
        return null;
    }

    if (is_array($errors) && ($errors['warning_count'] > 0 || $errors['error_count'] > 0)) {
        return null;
    }

    return $date->format('Y-m-d') === $value ? $date : null;
}

function errorePreventivo(string $messaggio, int $status = 422): void
{
    jsonResponse([
        'ok' => false,
        'messaggio' => $messaggio,
        'html' => '<div class="errore">' . h($messaggio) . '</div>',
    ], $status);
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        errorePreventivo('Metodo non consentito.', 405);
    }

    $nome = postValue('nome');
    $email = postValue('email');
    $telefono = postValue('telefono');
    $destinazione = postValue('destinazione');
    $tipoAlloggio = postValue('tipo_alloggio');
    $tipoPacchetto = postValue('tipo_pacchetto') ?: 'standard';
    $numeroPersone = (int) ($_POST['numero_persone'] ?? 0);
    $dataArrivo = postValue('data_arrivo');
    $dataPartenza = postValue('data_partenza');
    $trattamento = postValue('trattamento');
    $messaggio = postValue('messaggio');

    if (
        $nome === '' ||
        $email === '' ||
        $destinazione === '' ||
        $tipoAlloggio === '' ||
        $numeroPersone <= 0 ||
        $dataArrivo === '' ||
        $dataPartenza === '' ||
        $trattamento === ''
    ) {
        errorePreventivo('Errore: compila tutti i campi obbligatori.');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        errorePreventivo('Errore: inserisci un indirizzo email valido.');
    }

    if (!in_array($tipoPacchetto, ['standard', 'giovani-low-cost'], true)) {
        errorePreventivo('Errore: tipo di pacchetto non valido.');
    }

    $struttura = getStrutturaBySlug($destinazione);

    if ($struttura === null) {
        errorePreventivo('Errore: struttura non valida.');
    }

    $trattamentoDati = getTrattamentoByCodice($trattamento);

    if ($trattamentoDati === null) {
        errorePreventivo('Errore: trattamento non valido.');
    }

    $alloggioSelezionato = trovaAlloggioInStruttura($struttura, $tipoAlloggio);

    if ($alloggioSelezionato === null) {
        errorePreventivo('Errore: tipo di alloggio non disponibile per questa struttura.');
    }

    $arrivo = dateFromInput($dataArrivo);
    $partenza = dateFromInput($dataPartenza);

    if ($arrivo === null || $partenza === null) {
        errorePreventivo('Errore: inserisci date valide.');
    }

    if ($partenza <= $arrivo) {
        errorePreventivo('Errore: la data di partenza deve essere successiva alla data di arrivo.');
    }

    if ($numeroPersone > (int) $struttura['capienza']) {
        errorePreventivo('Errore: il numero di persone supera la capienza massima della struttura.');
    }

    $erroriCalendario = validaRegoleEventiLowCost(getEventiLowCost());

    if (!empty($erroriCalendario)) {
        errorePreventivo('Errore nella configurazione degli eventi low cost: ' . implode(' ', $erroriCalendario), 500);
    }

    $eventoLowCostSelezionato = null;

    if ($tipoPacchetto === 'giovani-low-cost') {
        $eventoLowCostSelezionato = trovaEventoLowCost($destinazione, $dataArrivo, $dataPartenza);

        if ($eventoLowCostSelezionato === null) {
            errorePreventivo('Errore: l evento Giovani Low Cost e disponibile solo in date e strutture prestabilite.');
        }
    }

    $notti = (int) $arrivo->diff($partenza)->days;
    $numeroStanze = (int) ceil($numeroPersone / 4);
    $prezzoBase = $tipoPacchetto === 'giovani-low-cost'
        ? (float) $eventoLowCostSelezionato['prezzo_persona_notte']
        : (float) $struttura['prezzo_base'];
    $supplemento = (float) $trattamentoDati['supplemento_persona_notte'];
    $supplementoAlloggio = (float) $alloggioSelezionato['supplemento_persona_notte'];
    $prezzoPersonaNotte = $prezzoBase + $supplemento + $supplementoAlloggio;
    $totale = $prezzoPersonaNotte * $numeroPersone * $notti;
    $sconto = 0.0;

    if ($tipoPacchetto !== 'giovani-low-cost') {
        if ($numeroPersone >= 10 && $numeroPersone < 25) {
            $sconto = 5;
        } elseif ($numeroPersone >= 25) {
            $sconto = 10;
        }
    }

    $totaleScontato = $totale - ($totale * $sconto / 100);

    $richiestaId = salvaRichiestaPreventivo([
        'nome_cliente' => $nome,
        'email' => $email,
        'telefono' => $telefono !== '' ? $telefono : null,
        'struttura_id' => (int) $struttura['id'],
        'alloggio_id' => (int) $alloggioSelezionato['id'],
        'trattamento_id' => (int) $trattamentoDati['id'],
        'evento_id' => $eventoLowCostSelezionato !== null ? (int) $eventoLowCostSelezionato['id'] : null,
        'tipo_pacchetto' => $tipoPacchetto,
        'numero_persone' => $numeroPersone,
        'numero_stanze' => $numeroStanze,
        'data_arrivo' => $dataArrivo,
        'data_partenza' => $dataPartenza,
        'notti' => $notti,
        'prezzo_base_persona_notte' => $prezzoBase,
        'supplemento_trattamento' => $supplemento,
        'supplemento_alloggio' => $supplementoAlloggio,
        'prezzo_persona_notte' => $prezzoPersonaNotte,
        'totale' => $totale,
        'sconto_percentuale' => $sconto,
        'totale_scontato' => $totaleScontato,
        'messaggio' => $messaggio !== '' ? $messaggio : null,
    ]);

    ob_start();
    ?>
    <div class="container">
      <h1>Preventivo stimato</h1>
      <p class="subtitle">Ecco il riepilogo della tua richiesta di viaggio.</p>

      <div class="box">
        <p><strong>Richiesta salvata:</strong> #<?php echo (int) $richiestaId; ?></p>
        <p><strong>Nome:</strong> <?php echo h($nome); ?></p>
        <p><strong>Email:</strong> <?php echo h($email); ?></p>
        <p><strong>Telefono:</strong> <?php echo h($telefono); ?></p>
      </div>

      <div class="dettagli">
        <div class="info-card"><p><strong>Struttura scelta:</strong><br><?php echo h($struttura['nome']); ?></p></div>
        <div class="info-card"><p><strong>Tipologia:</strong><br><?php echo h($struttura['tipologia']); ?></p></div>
        <div class="info-card"><p><strong>Localita:</strong><br><?php echo h($struttura['localita']); ?></p></div>
        <div class="info-card"><p><strong>Capienza massima:</strong><br><?php echo (int) $struttura['capienza']; ?> persone</p></div>
        <div class="info-card"><p><strong>Numero persone:</strong><br><?php echo $numeroPersone; ?></p></div>
        <div class="info-card"><p><strong>Trattamento:</strong><br><?php echo h($trattamentoDati['nome']); ?></p></div>
        <div class="info-card"><p><strong>Data arrivo:</strong><br><?php echo h($dataArrivo); ?></p></div>
        <div class="info-card"><p><strong>Data partenza:</strong><br><?php echo h($dataPartenza); ?></p></div>
        <div class="info-card"><p><strong>Notti:</strong><br><?php echo $notti; ?></p></div>
        <div class="info-card"><p><strong>Prezzo a persona per notte:</strong><br><?php echo number_format($prezzoPersonaNotte, 2, ',', '.'); ?>&euro;</p></div>
        <div class="info-card"><p><strong>Tipo di alloggio:</strong><br><?php echo h($alloggioSelezionato['nome']); ?></p></div>
        <div class="info-card"><p><strong>Stanze necessarie:</strong><br><?php echo $numeroStanze; ?> stanza/e</p></div>
      </div>

      <div class="box">
        <p><strong>Prezzo base struttura:</strong> <?php echo number_format($prezzoBase, 2, ',', '.'); ?>&euro; a persona/notte</p>
        <p><strong>Supplemento trattamento:</strong> <?php echo number_format($supplemento, 2, ',', '.'); ?>&euro; a persona/notte</p>
        <p><strong>Supplemento alloggio:</strong> <?php echo number_format($supplementoAlloggio, 2, ',', '.'); ?>&euro; a persona/notte</p>
        <p><strong>Totale prima dello sconto:</strong> <?php echo number_format($totale, 2, ',', '.'); ?>&euro;</p>
        <p><strong>Sconto gruppo applicato:</strong> <?php echo $sconto > 0 ? number_format($sconto, 0) . '%' : 'Nessuno'; ?></p>
      </div>

      <div class="totale">
        <p>Totale stimato del preventivo</p>
        <span><?php echo number_format($totaleScontato, 2, ',', '.'); ?>&euro;</span>
      </div>

      <div class="info-card">
        <p><strong>Tipo pacchetto:</strong><br><?php echo $tipoPacchetto === 'giovani-low-cost' ? 'Evento Giovani Low Cost' : 'Vacanza standard'; ?></p>
      </div>

      <?php if ($messaggio !== '') { ?>
        <div class="box" style="margin-top: 25px;">
          <p><strong>Richieste aggiuntive:</strong></p>
          <p><?php echo nl2br(h($messaggio)); ?></p>
        </div>
      <?php } ?>

      <p class="note">Il prezzo mostrato e una stima automatica. La richiesta e stata salvata nel database.</p>
    </div>
    <?php
    $html = ob_get_clean();

    jsonResponse([
        'ok' => true,
        'richiesta_id' => $richiestaId,
        'html' => $html,
    ]);
} catch (Throwable $exception) {
    errorePreventivo($exception->getMessage(), 500);
}
