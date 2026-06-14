function inizializzaPreventivo() {
  const formPreventivo = document.getElementById("formPreventivo");

  if (!formPreventivo || formPreventivo.dataset.preventivoBound === "true") {
    return;
  }

  formPreventivo.dataset.preventivoBound = "true";

  formPreventivo.addEventListener("submit", async function(e) {
    e.preventDefault();

    showPreventivoModal('<div class="container"><p class="subtitle">Sto calcolando e salvando il preventivo...</p></div>');

    try {
      const response = await fetch("api-preventivo.php", {
        method: "POST",
        body: new FormData(formPreventivo),
        headers: {
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Backend PHP non disponibile.");
      }

      const data = await response.json();
      showPreventivoModal(data.html || `<div class="errore">${data.messaggio || "Errore durante il calcolo del preventivo."}</div>`);

      if (data.ok) {
        formPreventivo.reset();
        const tipoPacchetto = document.getElementById("tipo_pacchetto");
        if (tipoPacchetto) {
          tipoPacchetto.value = "standard";
        }
      }
    } catch (error) {
      const locale = calcolaPreventivoLocale(formPreventivo);
      showPreventivoModal(locale.html);

      if (locale.ok) {
        salvaPreventivoLocale(locale.dati);
        formPreventivo.reset();
        const tipoPacchetto = document.getElementById("tipo_pacchetto");
        if (tipoPacchetto) {
          tipoPacchetto.value = "standard";
        }
      }
    }
  });
}

inizializzaPreventivo();
window.inizializzaPreventivo = inizializzaPreventivo;

function ensureModalStyles() {
  if (document.getElementById("preventivo-modal-styles")) return;

  const s = document.createElement("style");
  s.id = "preventivo-modal-styles";
  s.textContent = `
    .preventivo-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:2000;padding:20px;}
    .preventivo-modal{background:white;border-radius:12px;max-width:1100px;width:100%;max-height:90vh;overflow:auto;box-shadow:0 20px 50px rgba(0,0,0,0.4);position:relative;padding:20px}
    .preventivo-close{position:absolute;top:10px;right:12px;background:transparent;border:none;font-size:1.8rem;cursor:pointer;color:#333}
    @media(max-width:600px){.preventivo-modal{padding:12px}}
  `;
  document.head.appendChild(s);
}

function showPreventivoModal(htmlContent) {
  ensureModalStyles();

  const existing = document.getElementById("preventivoOverlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "preventivoOverlay";
  overlay.className = "preventivo-overlay";

  const modal = document.createElement("div");
  modal.className = "preventivo-modal";
  modal.innerHTML = `<button class="preventivo-close" aria-label="Chiudi">&times;</button><div class="preventivo-modal-body">${htmlContent}</div>`;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const prevOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  function close() {
    overlay.remove();
    document.body.style.overflow = prevOverflow || "";
  }

  modal.querySelector(".preventivo-close").addEventListener("click", close);
  overlay.addEventListener("click", function(e) {
    if (e.target === overlay) close();
  });
}

function calcolaPreventivoLocale(form) {
  const data = new FormData(form);
  const nome = String(data.get("nome") || "").trim();
  const email = String(data.get("email") || "").trim();
  const telefono = String(data.get("telefono") || "").trim();
  const destinazione = String(data.get("destinazione") || "").trim();
  const tipoAlloggio = String(data.get("tipo_alloggio") || "").trim();
  const tipoPacchetto = String(data.get("tipo_pacchetto") || "standard").trim();
  const numeroPersone = parseInt(String(data.get("numero_persone") || "0"), 10);
  const dataArrivo = String(data.get("data_arrivo") || "").trim();
  const dataPartenza = String(data.get("data_partenza") || "").trim();
  const trattamentoCodice = String(data.get("trattamento") || "").trim();
  const messaggio = String(data.get("messaggio") || "").trim();

  const struttura = (window.SUMMER_DATA?.strutture || []).find(item => item.slug === destinazione);
  const trattamento = (window.SUMMER_DATA?.trattamenti || []).find(item => item.codice === trattamentoCodice);
  const alloggio = struttura?.alloggi?.find(item => item.codice === tipoAlloggio);

  let errore = "";

  if (!nome || !email || !destinazione || !tipoAlloggio || !numeroPersone || !dataArrivo || !dataPartenza || !trattamentoCodice) {
    errore = "Errore: compila tutti i campi obbligatori.";
  } else if (!struttura) {
    errore = "Errore: struttura non valida.";
  } else if (!trattamento) {
    errore = "Errore: trattamento non valido.";
  } else if (!alloggio) {
    errore = "Errore: tipo di alloggio non disponibile per questa struttura.";
  } else if (numeroPersone <= 0) {
    errore = "Errore: il numero di persone deve essere maggiore di zero.";
  } else if (numeroPersone > parseInt(struttura.capienza, 10)) {
    errore = "Errore: il numero di persone supera la capienza massima della struttura.";
  }

  const arrivo = new Date(`${dataArrivo}T00:00:00`);
  const partenza = new Date(`${dataPartenza}T00:00:00`);

  if (!errore && (!dataArrivo || !dataPartenza || Number.isNaN(arrivo.getTime()) || Number.isNaN(partenza.getTime()))) {
    errore = "Errore: inserisci date valide.";
  }

  if (!errore && partenza <= arrivo) {
    errore = "Errore: la data di partenza deve essere successiva alla data di arrivo.";
  }

  let eventoLowCost = null;

  if (!errore && tipoPacchetto === "giovani-low-cost") {
    eventoLowCost = (window.SUMMER_DATA?.eventi_low_cost || []).find(evento =>
      evento.struttura_slug === destinazione &&
      evento.data_arrivo === dataArrivo &&
      evento.data_partenza === dataPartenza
    );

    if (!eventoLowCost) {
      errore = "Errore: l'evento Giovani Low Cost e disponibile solo in date e strutture prestabilite.";
    }
  }

  if (errore) {
    return {
      ok: false,
      html: `<div class="errore">${escapeHtml(errore)}</div>`,
      dati: null
    };
  }

  const notti = Math.round((partenza - arrivo) / (1000 * 60 * 60 * 24));
  const numeroStanze = Math.ceil(numeroPersone / 4);
  const prezzoBase = tipoPacchetto === "giovani-low-cost"
    ? Number(eventoLowCost.prezzo_persona_notte)
    : Number(struttura.prezzo_base);
  const supplemento = Number(trattamento.supplemento_persona_notte);
  const supplementoAlloggio = Number(alloggio.supplemento_persona_notte);
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
  const richiestaId = `LOCAL-${Date.now()}`;
  const dati = {
    richiestaId,
    nome,
    email,
    telefono,
    struttura: struttura.nome,
    destinazione,
    tipoAlloggio: alloggio.nome,
    trattamento: trattamento.nome,
    tipoPacchetto,
    numeroPersone,
    numeroStanze,
    dataArrivo,
    dataPartenza,
    notti,
    prezzoBase,
    supplemento,
    supplementoAlloggio,
    prezzoPersonaNotte,
    totale,
    sconto,
    totaleScontato,
    messaggio,
    createdAt: new Date().toISOString()
  };

  return {
    ok: true,
    dati,
    html: renderPreventivoLocale(dati, struttura)
  };
}

function renderPreventivoLocale(dati, struttura) {
  return `
    <div class="container">
      <h1>Preventivo stimato</h1>
      <p class="subtitle">Ecco il riepilogo della tua richiesta di viaggio.</p>

      <div class="box">
        <p><strong>Richiesta locale:</strong> #${escapeHtml(dati.richiestaId)}</p>
        <p><strong>Nome:</strong> ${escapeHtml(dati.nome)}</p>
        <p><strong>Email:</strong> ${escapeHtml(dati.email)}</p>
        <p><strong>Telefono:</strong> ${escapeHtml(dati.telefono)}</p>
      </div>

      <div class="dettagli">
        <div class="info-card"><p><strong>Struttura scelta:</strong><br>${escapeHtml(dati.struttura)}</p></div>
        <div class="info-card"><p><strong>Tipologia:</strong><br>${escapeHtml(struttura.tipologia)}</p></div>
        <div class="info-card"><p><strong>Localita:</strong><br>${escapeHtml(struttura.localita)}</p></div>
        <div class="info-card"><p><strong>Capienza massima:</strong><br>${parseInt(struttura.capienza, 10)} persone</p></div>
        <div class="info-card"><p><strong>Numero persone:</strong><br>${dati.numeroPersone}</p></div>
        <div class="info-card"><p><strong>Trattamento:</strong><br>${escapeHtml(dati.trattamento)}</p></div>
        <div class="info-card"><p><strong>Data arrivo:</strong><br>${escapeHtml(dati.dataArrivo)}</p></div>
        <div class="info-card"><p><strong>Data partenza:</strong><br>${escapeHtml(dati.dataPartenza)}</p></div>
        <div class="info-card"><p><strong>Notti:</strong><br>${dati.notti}</p></div>
        <div class="info-card"><p><strong>Prezzo a persona per notte:</strong><br>${formatEuro(dati.prezzoPersonaNotte)}</p></div>
        <div class="info-card"><p><strong>Tipo di alloggio:</strong><br>${escapeHtml(dati.tipoAlloggio)}</p></div>
        <div class="info-card"><p><strong>Stanze necessarie:</strong><br>${dati.numeroStanze} stanza/e</p></div>
      </div>

      <div class="box">
        <p><strong>Prezzo base struttura:</strong> ${formatEuro(dati.prezzoBase)} a persona/notte</p>
        <p><strong>Supplemento trattamento:</strong> ${formatEuro(dati.supplemento)} a persona/notte</p>
        <p><strong>Supplemento alloggio:</strong> ${formatEuro(dati.supplementoAlloggio)} a persona/notte</p>
        <p><strong>Totale prima dello sconto:</strong> ${formatEuro(dati.totale)}</p>
        <p><strong>Sconto gruppo applicato:</strong> ${dati.sconto > 0 ? `${dati.sconto}%` : "Nessuno"}</p>
      </div>

      <div class="totale">
        <p>Totale stimato del preventivo</p>
        <span>${formatEuro(dati.totaleScontato)}</span>
      </div>

      <div class="info-card">
        <p><strong>Tipo pacchetto:</strong><br>${dati.tipoPacchetto === "giovani-low-cost" ? "Evento Giovani Low Cost" : "Vacanza standard"}</p>
      </div>

      ${dati.messaggio ? `
        <div class="box" style="margin-top: 25px;">
          <p><strong>Richieste aggiuntive:</strong></p>
          <p>${escapeHtml(dati.messaggio)}</p>
        </div>
      ` : ""}

      <p class="note">
        GitHub Pages non supporta PHP/MySQL: questo preventivo e stato calcolato e salvato solo nel browser.
      </p>
    </div>
  `;
}

function salvaPreventivoLocale(dati) {
  try {
    const key = "adamantis_preventivi_locali";
    const preventivi = JSON.parse(localStorage.getItem(key) || "[]");
    preventivi.unshift(dati);
    localStorage.setItem(key, JSON.stringify(preventivi.slice(0, 20)));
  } catch (error) {
    // Il preventivo resta visibile nel modal anche se il browser blocca localStorage.
  }
}

function formatEuro(value) {
  return `${Number(value).toFixed(2).replace(".", ",")}&euro;`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
