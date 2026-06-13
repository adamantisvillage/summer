const eventiGiovaniLowCost = [
  {
    nome: "Young Summer Tropea",
    struttura: "scogliere-nere",
    arrivo: "2026-07-08",
    partenza: "2026-07-12",
    prezzo: 45
  },
  {
    nome: "Favignana Young Party",
    struttura: "partenza-penelope",
    arrivo: "2026-07-08",
    partenza: "2026-07-12",
    prezzo: 48
  },
  {
    nome: "Calabria Low Cost",
    struttura: "villaggio-anfitrite",
    arrivo: "2026-07-15",
    partenza: "2026-07-19",
    prezzo: 42
  },
  {
    nome: "Sardegna Young Week",
    struttura: "resort-palme",
    arrivo: "2026-07-22",
    partenza: "2026-07-26",
    prezzo: 50
  },
  {
    nome: "Tropea Young Agosto",
    struttura: "scogliere-nere",
    arrivo: "2026-08-05",
    partenza: "2026-08-09",
    prezzo: 55
  },
  {
    nome: "Favignana Low Cost Agosto",
    struttura: "partenza-penelope",
    arrivo: "2026-08-05",
    partenza: "2026-08-09",
    prezzo: 58
  },
  {
    nome: "Resort Young Agosto",
    struttura: "resort-palme",
    arrivo: "2026-08-16",
    partenza: "2026-08-20",
    prezzo: 60
  },
  {
    nome: "Lido Apeiron Young",
    struttura: "lido-apeiron",
    arrivo: "2026-08-25",
    partenza: "2026-08-29",
    prezzo: 52
  }
];

const prezziBase = {
  "villaggio-anfitrite": 65,
  "resort-palme": 75,
  "scogliere-nere": 60,
  "promontorio-anti-elios": 90,
  "hotel-baroni": 85,
  "etranger-glace": 80,
  "insenatura-ombrosa": 70,
  "contado-agro-pontino": 78,
  "partenza-penelope": 62,
  "lido-apeiron": 72
};

const nomiStrutture = {
  "villaggio-anfitrite": "Villaggio Anfitrite",
  "resort-palme": "Resort delle Palme",
  "scogliere-nere": "Scogliere Nere",
  "promontorio-anti-elios": "Promontorio Anti-elios",
  "hotel-baroni": "Hotel Baroni d'Aragosta",
  "etranger-glace": "Étranger Glace & Tennis",
  "insenatura-ombrosa": "Insenatura Ombrosa",
  "contado-agro-pontino": "Contado dell'Agro Pontino",
  "partenza-penelope": "Partenza di Penelope",
  "lido-apeiron": "Lido Apeiron"
};

const tipologieStrutture = {
  "villaggio-anfitrite": "Villaggio",
  "resort-palme": "Villaggio",
  "scogliere-nere": "Villaggio",
  "promontorio-anti-elios": "Hotel",
  "hotel-baroni": "Hotel",
  "etranger-glace": "Hotel",
  "insenatura-ombrosa": "Hotel",
  "contado-agro-pontino": "Hotel",
  "partenza-penelope": "Villaggio",
  "lido-apeiron": "Hotel"
};

const capienze = {
  "villaggio-anfitrite": 900,
  "resort-palme": 800,
  "scogliere-nere": 500,
  "promontorio-anti-elios": 300,
  "hotel-baroni": 300,
  "etranger-glace": 250,
  "insenatura-ombrosa": 200,
  "contado-agro-pontino": 250,
  "partenza-penelope": 400,
  "lido-apeiron": 300
};

const localita = {
  "villaggio-anfitrite": "Sellia Marina, Calabria",
  "resort-palme": "Platamona, Sardegna",
  "scogliere-nere": "Tropea, Calabria",
  "promontorio-anti-elios": "Tropea, Calabria",
  "hotel-baroni": "Sestriere, Piemonte",
  "etranger-glace": "Ischia, Campania",
  "insenatura-ombrosa": "Cilento, Salerno",
  "contado-agro-pontino": "Argentario, Grosseto / Orbetello",
  "partenza-penelope": "Favignana, Sicilia",
  "lido-apeiron": "Lido Riccio, Ortona"
};

const supplementi = {
  "mezza-pensione": 0,
  "pensione-completa": 15,
  "all-inclusive": 30
};

const nomiTrattamenti = {
  "mezza-pensione": "Mezza pensione",
  "pensione-completa": "Pensione completa",
  "all-inclusive": "All inclusive"
};

const tipiAlloggioConsentiti = {
  "villaggio-anfitrite": ["camera-hotel", "bungalow"],
  "resort-palme": ["camera-hotel", "bungalow"],
  "scogliere-nere": ["camera-hotel", "bungalow"],
  "promontorio-anti-elios": ["camera-hotel", "bungalow"],
  "hotel-baroni": ["camera-hotel"],
  "etranger-glace": ["camera-hotel"],
  "insenatura-ombrosa": ["camera-hotel"],
  "contado-agro-pontino": ["camera-hotel", "bungalow"],
  "partenza-penelope": ["camera-hotel", "bungalow"],
  "lido-apeiron": ["camera-hotel", "bungalow"]
};

const nomiTipiAlloggio = {
  "camera-hotel": "Camera hotel / standard",
  "bungalow": "Bungalow"
};

const supplementiAlloggio = {
  "camera-hotel": 0,
  "bungalow": 10
};

function trovaEventoLowCost(destinazione, arrivo, partenza) {
  return eventiGiovaniLowCost.find(evento =>
    evento.struttura === destinazione &&
    evento.arrivo === arrivo &&
    evento.partenza === partenza
  );
}

document.getElementById("formPreventivo").addEventListener("submit", function(e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const telefono = document.getElementById("telefono").value;
  const destinazione = document.getElementById("destinazione").value;
  const tipoAlloggio = document.getElementById("tipo_alloggio").value;
  const tipoPacchetto = (document.getElementById("tipo_pacchetto") && document.getElementById("tipo_pacchetto").value) || "standard";
  const numeroPersone = parseInt(document.getElementById("numero_persone").value);
  const dataArrivo = document.getElementById("data_arrivo").value;
  const dataPartenza = document.getElementById("data_partenza").value;
  const trattamento = document.getElementById("trattamento").value;
  const messaggio = document.getElementById("messaggio")?.value || "";

  let errore = "";

  if (!nome || !email || !destinazione || !numeroPersone || !dataArrivo || !dataPartenza || !trattamento) {
    errore = "Errore: compila tutti i campi obbligatori.";
  }

  if (!prezziBase[destinazione]) {
    errore = "Errore: struttura non valida.";
  }

  if (!supplementi.hasOwnProperty(trattamento)) {
    errore = "Errore: trattamento non valido.";
  }

  if (numeroPersone <= 0) {
    errore = "Errore: il numero di persone deve essere maggiore di zero.";
  }

  if (!nomiTipiAlloggio[tipoAlloggio]) {
    errore = "Errore: tipo di alloggio non valido.";
  }

  if (
    !errore &&
    tipiAlloggioConsentiti[destinazione] &&
    !tipiAlloggioConsentiti[destinazione].includes(tipoAlloggio)
  ) {
    errore = "Errore: per questa struttura è disponibile solo la camera hotel / standard.";
  }

  const arrivo = new Date(dataArrivo);
  const partenza = new Date(dataPartenza);

  if (!errore && partenza <= arrivo) {
    errore = "Errore: la data di partenza deve essere successiva alla data di arrivo.";
  }

  const notti = Math.round((partenza - arrivo) / (1000 * 60 * 60 * 24));

  if (!errore && numeroPersone > capienze[destinazione]) {
    errore = "Errore: il numero di persone supera la capienza massima della struttura.";
  }

  const numeroStanze = Math.ceil(numeroPersone / 4);

  let eventoLowCostSelezionato = null;

  if (!errore && tipoPacchetto === "giovani-low-cost") {
    eventoLowCostSelezionato = trovaEventoLowCost(destinazione, dataArrivo, dataPartenza);

    if (!eventoLowCostSelezionato) {
      errore = "Errore: l'evento Giovani Low Cost è disponibile solo in date e strutture prestabilite.";
    }
  }

  if (errore) {
    showPreventivoModal(`<div class="errore">${errore}</div>`);
    return;
  }

  let prezzoBase = prezziBase[destinazione];

  if (tipoPacchetto === "giovani-low-cost") {
    prezzoBase = eventoLowCostSelezionato.prezzo;
  }

  const supplemento = supplementi[trattamento];
  const supplementoAlloggio = supplementiAlloggio[tipoAlloggio];

  const prezzoPersonaNotte = prezzoBase + supplemento + supplementoAlloggio;
  const totale = prezzoPersonaNotte * numeroPersone * notti;

  let sconto = 0;

  if (tipoPacchetto !== "giovani-low-cost") {
    if (numeroPersone >= 10 && numeroPersone < 25) {
      sconto = 5;
    } else if (numeroPersone >= 25) {
      sconto = 10;
    }
  }

  const totaleScontato = totale - (totale * sconto / 100);

  const html = `
    <div class="container">
      <h1>Preventivo stimato</h1>
      <p class="subtitle">Ecco il riepilogo della tua richiesta di viaggio.</p>

      <div class="box">
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefono:</strong> ${telefono}</p>
      </div>

      <div class="dettagli">
        <div class="info-card">
          <p><strong>Struttura scelta:</strong><br>${nomiStrutture[destinazione]}</p>
        </div>

        <div class="info-card">
          <p><strong>Tipologia:</strong><br>${tipologieStrutture[destinazione]}</p>
        </div>

        <div class="info-card">
          <p><strong>Località:</strong><br>${localita[destinazione]}</p>
        </div>

        <div class="info-card">
          <p><strong>Capienza massima:</strong><br>${capienze[destinazione]} persone</p>
        </div>

        <div class="info-card">
          <p><strong>Numero persone:</strong><br>${numeroPersone}</p>
        </div>

        <div class="info-card">
          <p><strong>Trattamento:</strong><br>${nomiTrattamenti[trattamento]}</p>
        </div>

        <div class="info-card">
          <p><strong>Data arrivo:</strong><br>${dataArrivo}</p>
        </div>

        <div class="info-card">
          <p><strong>Data partenza:</strong><br>${dataPartenza}</p>
        </div>

        <div class="info-card">
          <p><strong>Notti:</strong><br>${notti}</p>
        </div>

        <div class="info-card">
          <p><strong>Prezzo a persona per notte:</strong><br>${prezzoPersonaNotte.toFixed(2)}€</p>
        </div>

        <div class="info-card">
          <p><strong>Tipo di alloggio:</strong><br>${nomiTipiAlloggio[tipoAlloggio]}</p>
        </div>

        <div class="info-card">
          <p><strong>Stanze necessarie:</strong><br>${numeroStanze} stanza/e</p>
        </div>
      </div>

      <div class="box">
        <p><strong>Prezzo base struttura:</strong> ${prezzoBase.toFixed(2)}€ a persona/notte</p>
        <p><strong>Supplemento trattamento:</strong> ${supplemento.toFixed(2)}€ a persona/notte</p>
        <p><strong>Supplemento alloggio:</strong> ${supplementoAlloggio.toFixed(2)}€ a persona/notte</p>
        <p><strong>Totale prima dello sconto:</strong> ${totale.toFixed(2)}€</p>
        <p><strong>Sconto gruppo applicato:</strong> ${sconto > 0 ? sconto + "%" : "Nessuno"}</p>
      </div>

      <div class="totale">
        <p>Totale stimato del preventivo</p>
        <span>${totaleScontato.toFixed(2)}€</span>
      </div>

      <div class="info-card">
        <p><strong>Tipo pacchetto:</strong><br>
        ${tipoPacchetto === "giovani-low-cost" ? "Evento Giovani Low Cost" : "Vacanza standard"}</p>
      </div>

      ${
        messaggio
        ? `<div class="box" style="margin-top: 25px;">
            <p><strong>Richieste aggiuntive:</strong></p>
            <p>${messaggio}</p>
          </div>`
        : ""
      }

      <p class="note">
        Il prezzo mostrato è una stima automatica basata su struttura, numero di persone, notti e trattamento scelto.
      </p>
    </div>
  `;

  showPreventivoModal(html);
});

/* Modal helper: crea e mostra un overlay con il contenuto del preventivo */
function ensureModalStyles() {
  if (document.getElementById('preventivo-modal-styles')) return;
  const s = document.createElement('style');
  s.id = 'preventivo-modal-styles';
  s.textContent = `
    .preventivo-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:2000;padding:20px;}
    .preventivo-modal{background:white;border-radius:12px;max-width:1100px;width:100%;max-height:90vh;overflow:auto;box-shadow:0 20px 50px rgba(0,0,0,0.4);position:relative;padding:20px}
    .preventivo-close{position:absolute;top:10px;right:12px;background:transparent;border:none;font-size:1.8rem;cursor:pointer;color:#333}
    @media(max-width:600px){.preventivo-modal{padding:12px}}
  `;
  document.head.appendChild(s);
}

function showPreventivoModal(htmlContent){
  ensureModalStyles();
  // rimuovi se esiste
  const existing = document.getElementById('preventivoOverlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'preventivoOverlay';
  overlay.className = 'preventivo-overlay';

  const modal = document.createElement('div');
  modal.className = 'preventivo-modal';
  modal.innerHTML = `<button class="preventivo-close" aria-label="Chiudi">×</button><div class="preventivo-modal-body">${htmlContent}</div>`;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  // blocca scroll
  const prevOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  function close(){
    overlay.remove();
    document.body.style.overflow = prevOverflow || '';
  }

  // chiudi al click sul bottone
  modal.querySelector('.preventivo-close').addEventListener('click', close);
  // chiudi cliccando fuori
  overlay.addEventListener('click', function(e){ if(e.target===overlay) close(); });
}