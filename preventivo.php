<?php
// Controllo: la pagina deve ricevere dati dal form
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: index.html#preventivo");
    exit;
}
$eventiGiovaniLowCost = [
    [
        "nome" => "Young Summer Tropea",
        "struttura" => "scogliere-nere",
        "arrivo" => "2026-07-08",
        "partenza" => "2026-07-12",
        "prezzo" => 45
    ],
    [
        "nome" => "Favignana Young Party",
        "struttura" => "partenza-penelope",
        "arrivo" => "2026-07-08",
        "partenza" => "2026-07-12",
        "prezzo" => 48
    ],
    [
        "nome" => "Calabria Low Cost",
        "struttura" => "villaggio-anfitrite",
        "arrivo" => "2026-07-15",
        "partenza" => "2026-07-19",
        "prezzo" => 42
    ],
    [
        "nome" => "Sardegna Young Week",
        "struttura" => "resort-palme",
        "arrivo" => "2026-07-22",
        "partenza" => "2026-07-26",
        "prezzo" => 50
    ],

    [
        "nome" => "Tropea Young Agosto",
        "struttura" => "scogliere-nere",
        "arrivo" => "2026-08-05",
        "partenza" => "2026-08-09",
        "prezzo" => 55
    ],
    [
        "nome" => "Favignana Low Cost Agosto",
        "struttura" => "partenza-penelope",
        "arrivo" => "2026-08-05",
        "partenza" => "2026-08-09",
        "prezzo" => 58
    ],
    [
        "nome" => "Resort Young Agosto",
        "struttura" => "resort-palme",
        "arrivo" => "2026-08-16",
        "partenza" => "2026-08-20",
        "prezzo" => 60
    ],
    [
        "nome" => "Lido Apeiron Young",
        "struttura" => "lido-apeiron",
        "arrivo" => "2026-08-25",
        "partenza" => "2026-08-29",
        "prezzo" => 52
    ]
];

function trovaEventoLowCost($eventi, $destinazione, $arrivo, $partenza) {
    foreach ($eventi as $evento) {
        if (
            $evento["struttura"] === $destinazione &&
            $evento["arrivo"] === $arrivo &&
            $evento["partenza"] === $partenza
        ) {
            return $evento;
        }
    }

    return null;
}

function validaRegoleEventiLowCost($eventi) {
    $errori = [];
    $eventiPerMese = [];
    $strutturaPerMese = [];
    $eventiPerGiorno = [];

    foreach ($eventi as $evento) {
        $mese = date("Y-m", strtotime($evento["arrivo"]));

        if (!isset($eventiPerMese[$mese])) {
            $eventiPerMese[$mese] = 0;
        }

        $eventiPerMese[$mese]++;

        $chiaveStruttura = $mese . "-" . $evento["struttura"];

        if (!isset($strutturaPerMese[$chiaveStruttura])) {
            $strutturaPerMese[$chiaveStruttura] = 0;
        }

        $strutturaPerMese[$chiaveStruttura]++;

        $inizio = new DateTime($evento["arrivo"]);
        $fine = new DateTime($evento["partenza"]);

        while ($inizio < $fine) {
            $giorno = $inizio->format("Y-m-d");

            if (!isset($eventiPerGiorno[$giorno])) {
                $eventiPerGiorno[$giorno] = 0;
            }

            $eventiPerGiorno[$giorno]++;
            $inizio->modify("+1 day");
        }
    }

    foreach ($eventiPerMese as $mese => $numeroEventi) {
        if ($numeroEventi > 4) {
            $errori[] = "Nel mese $mese ci sono più di 4 eventi low cost.";
        }
    }

    foreach ($strutturaPerMese as $chiave => $numeroEventi) {
        if ($numeroEventi > 1) {
            $errori[] = "Una struttura ha più di un evento low cost nello stesso mese.";
        }
    }

    foreach ($eventiPerGiorno as $giorno => $numeroEventi) {
        if ($numeroEventi > 2) {
            $errori[] = "Nel giorno $giorno ci sono più di 2 eventi accavallati.";
        }
    }

    return $errori;
}

// Prezzi base a persona per notte
$prezziBase = [
    "villaggio-anfitrite" => 65,
    "resort-palme" => 75,
    "scogliere-nere" => 60,
    "promontorio-anti-elios" => 90,
    "hotel-baroni" => 85,
    "etranger-glace" => 80,

    "insenatura-ombrosa" => 70,
    "contado-agro-pontino" => 78,
    "partenza-penelope" => 62,
    "lido-apeiron" => 72
];

// Nomi completi delle strutture
$nomiStrutture = [
    "villaggio-anfitrite" => "Villaggio Anfitrite",
    "resort-palme" => "Resort delle Palme",
    "scogliere-nere" => "Scogliere Nere",
    "promontorio-anti-elios" => "Promontorio Anti-elios",
    "hotel-baroni" => "Hotel Baroni d'Aragosta",
    "etranger-glace" => "Étranger Glace & Tennis",

    "insenatura-ombrosa" => "Insenatura Ombrosa",
    "contado-agro-pontino" => "Contado dell'Agro Pontino",
    "partenza-penelope" => "Partenza di Penelope",
    "lido-apeiron" => "Lido Apeiron"
];

// Tipologia delle strutture
$tipologieStrutture = [
    "villaggio-anfitrite" => "Villaggio",
    "resort-palme" => "Villaggio",
    "scogliere-nere" => "Villaggio",
    "promontorio-anti-elios" => "Hotel",
    "hotel-baroni" => "Hotel",
    "etranger-glace" => "Hotel",

    "insenatura-ombrosa" => "Hotel",
    "contado-agro-pontino" => "Hotel",
    "partenza-penelope" => "Villaggio",
    "lido-apeiron" => "Hotel"
];

// Capienza massima delle strutture
$capienze = [
    "villaggio-anfitrite" => 900,
    "resort-palme" => 800,
    "scogliere-nere" => 500,
    "promontorio-anti-elios" => 300,
    "hotel-baroni" => 300,
    "etranger-glace" => 250,

    "insenatura-ombrosa" => 200,
    "contado-agro-pontino" => 250,
    "partenza-penelope" => 400,
    "lido-apeiron" => 300
];

// Località delle strutture
$localita = [
    "villaggio-anfitrite" => "Sellia Marina, Calabria",
    "resort-palme" => "Platamona, Sardegna",
    "scogliere-nere" => "Tropea, Calabria",
    "promontorio-anti-elios" => "Tropea, Calabria",
    "hotel-baroni" => "Sestriere, Piemonte",
    "etranger-glace" => "Ischia, Campania",

    "insenatura-ombrosa" => "Cilento, Salerno",
    "contado-agro-pontino" => "Argentario, Grosseto / Orbetello",
    "partenza-penelope" => "Favignana, Sicilia",
    "lido-apeiron" => "Lido Riccio, Ortona"
];

// Supplemento trattamento a persona per notte
$supplementi = [
    "mezza-pensione" => 0,
    "pensione-completa" => 15,
    "all-inclusive" => 30
];

// Nomi trattamenti
$nomiTrattamenti = [
    "mezza-pensione" => "Mezza pensione",
    "pensione-completa" => "Pensione completa",
    "all-inclusive" => "All inclusive"
];

// Recupero dati dal form
$nome = $_POST["nome"] ?? "";
$email = $_POST["email"] ?? "";
$telefono = $_POST["telefono"] ?? "";
$destinazione = $_POST["destinazione"] ?? "";
$tipoAlloggio = $_POST["tipo_alloggio"] ?? "";
$tipoPacchetto = $_POST["tipo_pacchetto"] ?? "standard";
$numeroPersone = intval($_POST["numero_persone"] ?? 0);
$dataArrivo = $_POST["data_arrivo"] ?? "";
$dataPartenza = $_POST["data_partenza"] ?? "";
$trattamento = $_POST["trattamento"] ?? "";
$messaggio = $_POST["messaggio"] ?? "";

$tipiAlloggioConsentiti = [
    "villaggio-anfitrite" => ["camera-hotel", "bungalow"],
    "resort-palme" => ["camera-hotel", "bungalow"],
    "scogliere-nere" => ["camera-hotel", "bungalow"],
    "promontorio-anti-elios" => ["camera-hotel", "bungalow"],
    "hotel-baroni" => ["camera-hotel"],
    "etranger-glace" => ["camera-hotel"],

    "insenatura-ombrosa" => ["camera-hotel"],
    "contado-agro-pontino" => ["camera-hotel", "bungalow"],
    "partenza-penelope" => ["camera-hotel", "bungalow"],
    "lido-apeiron" => ["camera-hotel", "bungalow"]
];

$nomiTipiAlloggio = [
    "camera-hotel" => "Camera hotel / standard",
    "bungalow" => "Bungalow"
];

// Supplemento a persona per notte
$supplementiAlloggio = [
    "camera-hotel" => 0,
    "bungalow" => 10
];

// Controllo dati obbligatori
$errore = "";

if (
    empty($nome) ||
    empty($email) ||
    empty($destinazione) ||
    empty($numeroPersone) ||
    empty($dataArrivo) ||
    empty($dataPartenza) ||
    empty($trattamento)
) {
    $errore = "Errore: compila tutti i campi obbligatori.";
}

if (!isset($prezziBase[$destinazione])) {
    $errore = "Errore: struttura non valida.";
}

if (!isset($supplementi[$trattamento])) {
    $errore = "Errore: trattamento non valido.";
}

if ($numeroPersone <= 0) {
    $errore = "Errore: il numero di persone deve essere maggiore di zero.";
}

if (!isset($nomiTipiAlloggio[$tipoAlloggio])) {
    $errore = "Errore: tipo di alloggio non valido.";
}

if (
    empty($errore) &&
    isset($tipiAlloggioConsentiti[$destinazione]) &&
    !in_array($tipoAlloggio, $tipiAlloggioConsentiti[$destinazione])
) {
    $errore = "Errore: per questa struttura è disponibile solo la camera hotel / standard.";
}

// Calcolo notti
$notti = 0;

if (empty($errore)) {
    $data1 = new DateTime($dataArrivo);
    $data2 = new DateTime($dataPartenza);
    $differenza = $data1->diff($data2);
    $notti = $differenza->days;

    if ($data2 <= $data1) {
        $errore = "Errore: la data di partenza deve essere successiva alla data di arrivo.";
    }
}

// Controllo capienza
if (empty($errore)) {
    $capienzaMassima = $capienze[$destinazione];

    if ($numeroPersone > $capienzaMassima) {
        $errore = "Errore: il numero di persone supera la capienza massima della struttura.";
    }
}

$numeroStanze = 0;

if (empty($errore)) {
    $numeroStanze = ceil($numeroPersone / 4);
}

$eventoLowCostSelezionato = null;

$erroriCalendario = validaRegoleEventiLowCost($eventiGiovaniLowCost);

if (!empty($erroriCalendario)) {
    $errore = "Errore nella configurazione degli eventi low cost: " . implode(" ", $erroriCalendario);
}

if (empty($errore) && $tipoPacchetto === "giovani-low-cost") {
    $eventoLowCostSelezionato = trovaEventoLowCost(
        $eventiGiovaniLowCost,
        $destinazione,
        $dataArrivo,
        $dataPartenza
    );

    if ($eventoLowCostSelezionato === null) {
        $errore = "Errore: l'evento Giovani Low Cost è disponibile solo in date e strutture prestabilite.";
    }
}

// Calcolo prezzo
$prezzoBase = 0;
$supplemento = 0;
$prezzoPersonaNotte = 0;
$totale = 0;
$sconto = 0;
$totaleScontato = 0;

if (empty($errore)) {
    if ($tipoPacchetto === "giovani-low-cost") {
        $prezzoBase = $eventoLowCostSelezionato["prezzo"];
    } else {
        $prezzoBase = $prezziBase[$destinazione];
    }

    $supplemento = $supplementi[$trattamento];
    $supplementoAlloggio = $supplementiAlloggio[$tipoAlloggio];

    $prezzoPersonaNotte = $prezzoBase + $supplemento + $supplementoAlloggio;

    $totale = $prezzoPersonaNotte * $numeroPersone * $notti;

    $sconto = 0;

    if ($tipoPacchetto !== "giovani-low-cost") {
        if ($numeroPersone >= 10 && $numeroPersone < 25) {
            $sconto = 5;
        } elseif ($numeroPersone >= 25) {
            $sconto = 10;
        }
    }

    $totaleScontato = $totale - ($totale * $sconto / 100);
}
?>

<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <title>Preventivo | Orizzonti Turistici</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <style>
        :root {
            --blu-navy: #1A365D;
            --oro: #D4AF37;
            --oro-hover: #b5952f;
            --sfondo-chiaro: #F7FAFC;
            --testo-scuro: #333333;
            --grigio-testo: #666666;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: var(--sfondo-chiaro);
            color: var(--testo-scuro);
            line-height: 1.6;
        }

        header {
            background-color: var(--blu-navy);
            padding: 1.2rem 5%;
            text-align: center;
            color: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

        header h2 {
            color: white;
        }

        .container {
            max-width: 900px;
            margin: 50px auto;
            background: white;
            padding: 40px;
            border-radius: 18px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.12);
        }

        h1 {
            color: var(--blu-navy);
            text-align: center;
            margin-bottom: 10px;
            font-size: 2.4rem;
        }

        .subtitle {
            text-align: center;
            color: var(--grigio-testo);
            margin-bottom: 35px;
        }

        .box {
            background-color: #f8efd0;
            border: 2px solid var(--oro);
            padding: 25px;
            border-radius: 15px;
            margin-bottom: 25px;
        }

        .box p {
            font-size: 1.05rem;
            margin: 10px 0;
        }

        .dettagli {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 25px;
        }

        .info-card {
            background-color: var(--sfondo-chiaro);
            padding: 18px;
            border-radius: 12px;
            border-left: 5px solid var(--oro);
        }

        .info-card strong {
            color: var(--blu-navy);
        }

        .totale {
            text-align: center;
            background-color: var(--blu-navy);
            color: white;
            padding: 25px;
            border-radius: 15px;
            margin-top: 25px;
        }

        .totale p {
            font-size: 1.1rem;
            margin-bottom: 10px;
        }

        .totale span {
            color: var(--oro);
            font-size: 2.3rem;
            font-weight: bold;
        }

        .errore {
            background-color: #ffe0e0;
            border: 2px solid #cc0000;
            color: #8b0000;
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            font-weight: bold;
            margin-bottom: 25px;
        }

        .note {
            margin-top: 25px;
            color: var(--grigio-testo);
            font-size: 0.95rem;
            text-align: center;
        }

        .btn {
            display: inline-block;
            background-color: var(--oro);
            color: var(--blu-navy);
            padding: 14px 30px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            margin: 10px;
            transition: 0.3s;
        }

        .btn:hover {
            background-color: var(--oro-hover);
            transform: translateY(-2px);
        }

        .btn-outline {
            background-color: transparent;
            border: 2px solid var(--blu-navy);
            color: var(--blu-navy);
        }

        .btn-outline:hover {
            background-color: var(--blu-navy);
            color: white;
        }

        .center {
            text-align: center;
            margin-top: 30px;
        }

        footer {
            background-color: #0d1e36;
            color: #aaa;
            text-align: center;
            padding: 2rem;
            font-size: 0.9rem;
            margin-top: 60px;
        }

        @media (max-width: 768px) {
            .container {
                margin: 25px 15px;
                padding: 25px;
            }

            h1 {
                font-size: 2rem;
            }

            .dettagli {
                grid-template-columns: 1fr;
            }

            .totale span {
                font-size: 1.9rem;
            }
        }
    </style>
</head>

<body>

<header>
    <h2>Orizzonti Turistici</h2>
</header>

<div class="container">
    <h1>Preventivo stimato</h1>
    <p class="subtitle">Ecco il riepilogo della tua richiesta di viaggio.</p>

    <?php if (!empty($errore)) { ?>

        <div class="errore">
            <?php echo htmlspecialchars($errore); ?>
        </div>

        <div class="center">
            <a href="index.html#preventivo" class="btn">Torna al modulo</a>
        </div>

    <?php } else { ?>

        <div class="box">
            <p><strong>Nome:</strong> <?php echo htmlspecialchars($nome); ?></p>
            <p><strong>Email:</strong> <?php echo htmlspecialchars($email); ?></p>
            <p><strong>Telefono:</strong> <?php echo htmlspecialchars($telefono); ?></p>
        </div>

        <div class="dettagli">
            <div class="info-card">
                <p><strong>Struttura scelta:</strong><br>
                <?php echo $nomiStrutture[$destinazione]; ?></p>
            </div>

            <div class="info-card">
                <p><strong>Tipologia:</strong><br>
                <?php echo $tipologieStrutture[$destinazione]; ?></p>
            </div>

            <div class="info-card">
                <p><strong>Località:</strong><br>
                <?php echo $localita[$destinazione]; ?></p>
            </div>

            <div class="info-card">
                <p><strong>Capienza massima:</strong><br>
                <?php echo $capienze[$destinazione]; ?> persone</p>
            </div>

            <div class="info-card">
                <p><strong>Numero persone:</strong><br>
                <?php echo $numeroPersone; ?></p>
            </div>

            <div class="info-card">
                <p><strong>Trattamento:</strong><br>
                <?php echo $nomiTrattamenti[$trattamento]; ?></p>
            </div>

            <div class="info-card">
                <p><strong>Data arrivo:</strong><br>
                <?php echo htmlspecialchars($dataArrivo); ?></p>
            </div>

            <div class="info-card">
                <p><strong>Data partenza:</strong><br>
                <?php echo htmlspecialchars($dataPartenza); ?></p>
            </div>

            <div class="info-card">
                <p><strong>Notti:</strong><br>
                <?php echo $notti; ?></p>
            </div>

            <div class="info-card">
                <p><strong>Prezzo a persona per notte:</strong><br>
                <?php echo number_format($prezzoPersonaNotte, 2, ',', '.'); ?>€</p>
            </div>

            <div class="info-card">
    <p><strong>Tipo di alloggio:</strong><br>
    <?php echo $nomiTipiAlloggio[$tipoAlloggio]; ?></p>
</div>

<div class="info-card">
    <p><strong>Stanze necessarie:</strong><br>
    <?php echo $numeroStanze; ?> stanza/e</p>
</div>
        </div>

        <div class="box">
            <p><strong>Prezzo base struttura:</strong> <?php echo number_format($prezzoBase, 2, ',', '.'); ?>€ a persona/notte</p>
            <p><strong>Supplemento trattamento:</strong> <?php echo number_format($supplemento, 2, ',', '.'); ?>€ a persona/notte</p>
            <p><strong>Totale prima dello sconto:</strong> <?php echo number_format($totale, 2, ',', '.'); ?>€</p>

            <?php if ($sconto > 0) { ?>
                <p><strong>Sconto gruppo applicato:</strong> <?php echo $sconto; ?>%</p>
            <?php } else { ?>
                <p><strong>Sconto gruppo applicato:</strong> Nessuno</p>
            <?php } ?>
        </div>

        <div class="totale">
            <p>Totale stimato del preventivo</p>
            <span><?php echo number_format($totaleScontato, 2, ',', '.'); ?>€</span>
        </div>

        <div class="info-card">
    <p><strong>Tipo pacchetto:</strong><br>
    <?php echo $tipoPacchetto === "giovani-low-cost" ? "Evento Giovani Low Cost" : "Vacanza standard"; ?></p>
</div>

        <?php if (!empty($messaggio)) { ?>
            <div class="box" style="margin-top: 25px;">
                <p><strong>Richieste aggiuntive:</strong></p>
                <p><?php echo nl2br(htmlspecialchars($messaggio)); ?></p>
            </div>
        <?php } ?>

        <p><strong>Supplemento alloggio:</strong> <?php echo number_format($supplementoAlloggio, 2, ',', '.'); ?>€ a persona/notte</p>

        <p class="note">
            Il prezzo mostrato è una stima automatica basata su struttura, numero di persone, notti e trattamento scelto.
        </p>

        <div class="center">
            <a href="index.html#preventivo" class="btn">Nuovo preventivo</a>
            <a href="strutture.html" class="btn btn-outline">Torna alle strutture</a>
        </div>

    <?php } ?>
</div>

<footer>
    <p>&copy; 2026 Orizzonti Turistici. Tutti i diritti riservati.</p>
</footer>

</body>
</html>