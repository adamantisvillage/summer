const nomiAlloggiFallback = {
  "camera-hotel": "Camera hotel / standard",
  "bungalow": "Bungalow"
};

const params = new URLSearchParams(window.location.search);
const id = params.get("id") || "";
const pacchettoPreselezionato = params.get("pacchetto") || "standard";
const arrivoPreselezionato = params.get("arrivo") || "";
const partenzaPreselezionata = params.get("partenza") || "";

caricaDettaglioStruttura();

async function caricaDettaglioStruttura() {
  const contenuto = document.getElementById("contenutoStruttura");

  try {
    const response = await fetch(`api-struttura.php?id=${encodeURIComponent(id)}`, {
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Backend PHP non disponibile.");
    }

    const data = await response.json();

    if (!data.ok) {
      throw new Error(data.messaggio || "Struttura non trovata.");
    }

    renderStruttura(data.struttura, data.trattamenti || []);
  } catch (error) {
    const strutturaStatica = (window.SUMMER_DATA?.strutture || []).find(struttura => struttura.slug === id);

    if (strutturaStatica) {
      renderStruttura(strutturaStatica, window.SUMMER_DATA?.trattamenti || []);
      return;
    }

    contenuto.innerHTML = `
      <div class="errore">${escapeHtml(error.message)}</div>
      <a href="strutture.html" class="btn">Torna alle strutture</a>
    `;
  }
}

function renderStruttura(struttura, trattamenti) {
  document.title = `${struttura.nome} | Adamantis Village`;

  document.getElementById("titoloStruttura").textContent = struttura.nome;
  document.getElementById("sottotitoloStruttura").textContent = `${struttura.localita} | ${struttura.tipologia}`;
  document.getElementById("heroDettaglio").style.backgroundImage =
    `linear-gradient(rgba(26, 54, 93, 0.55), rgba(26, 54, 93, 0.75)), url('${struttura.immagine}')`;

  const alloggi = struttura.alloggi || [];
  const servizi = struttura.servizi || [];

  document.getElementById("contenutoStruttura").innerHTML = `
    <div class="layout">
      <div>
        <div class="box">
          <h2>Descrizione struttura</h2>
          <p>${escapeHtml(struttura.descrizione)}</p>

          <div class="info-grid">
            <div class="info-card"><strong>Tipologia</strong><br>${escapeHtml(struttura.tipologia)}</div>
            <div class="info-card"><strong>Capienza</strong><br>${parseInt(struttura.capienza, 10)} persone</div>
            <div class="info-card"><strong>Localita</strong><br>${escapeHtml(struttura.localita)}</div>
            <div class="info-card"><strong>Target</strong><br>${escapeHtml(struttura.target)}</div>
            <div class="info-card"><strong>Prezzo base</strong><br>Da ${formatEuro(struttura.prezzo_base)} a persona/notte</div>
            <div class="info-card"><strong>Capienza stanza</strong><br>Max 4 persone per stanza</div>
          </div>
        </div>

        <div class="box">
          <h2>Servizi disponibili</h2>
          <div class="servizi">
            ${servizi.map(servizio => `<span>${escapeHtml(servizio)}</span>`).join("")}
          </div>
        </div>

        <div class="box">
          <h2>Soluzioni disponibili</h2>
          ${alloggi.map(alloggio => `
            <div class="soluzione">
              <h3>${escapeHtml(alloggio.nome || nomiAlloggiFallback[alloggio.codice] || alloggio.codice)}</h3>
              ${
                alloggio.codice === "camera-hotel"
                  ? "<p>Soluzione standard in camera hotel, ideale per coppie, famiglie e gruppi. Ogni stanza puo ospitare massimo 4 persone.</p>"
                  : "<p>Soluzione indipendente in bungalow, consigliata per famiglie e gruppi che desiderano maggiore autonomia e spazi piu riservati.</p>"
              }
            </div>
          `).join("")}
        </div>

        <div id="risultatoPreventivo"></div>
      </div>

      <aside>
        <div class="box">
          <h2>Prenota questa struttura</h2>

          <form id="formPreventivo">
            <input type="hidden" id="destinazione" name="destinazione" value="${escapeAttribute(struttura.slug)}">
            <input type="text" id="nome" name="nome" placeholder="Nome e cognome" required>
            <input type="email" id="email" name="email" placeholder="Email" required>
            <input type="tel" id="telefono" name="telefono" placeholder="Telefono">

            <label>Tipo di alloggio</label>
            <select id="tipo_alloggio" name="tipo_alloggio" required>
              <option value="">Scegli il tipo di alloggio</option>
              ${alloggi.map(alloggio => `
                <option value="${escapeAttribute(alloggio.codice)}">${escapeHtml(alloggio.nome)}</option>
              `).join("")}
            </select>

            <input
              type="number"
              id="numero_persone"
              name="numero_persone"
              placeholder="Numero di persone"
              min="1"
              max="${parseInt(struttura.capienza, 10)}"
              required
            >

            <label>Data di arrivo</label>
            <input type="date" id="data_arrivo" name="data_arrivo" value="${escapeAttribute(arrivoPreselezionato)}" required>

            <label>Data di partenza</label>
            <input type="date" id="data_partenza" name="data_partenza" value="${escapeAttribute(partenzaPreselezionata)}" required>

            <select id="trattamento" name="trattamento" required>
              <option value="">Tipo di trattamento</option>
              ${trattamenti.map(trattamento => `
                <option value="${escapeAttribute(trattamento.codice)}">${escapeHtml(trattamento.nome)}</option>
              `).join("")}
            </select>

            <select id="tipo_pacchetto" name="tipo_pacchetto" required>
              <option value="standard" ${pacchettoPreselezionato === "standard" ? "selected" : ""}>Vacanza standard</option>
              <option value="giovani-low-cost" ${pacchettoPreselezionato === "giovani-low-cost" ? "selected" : ""}>Evento Giovani Low Cost</option>
            </select>

            <textarea id="messaggio" name="messaggio" placeholder="Scrivi eventuali richieste specifiche..."></textarea>
            <button type="submit" class="btn">Calcola preventivo</button>
          </form>
        </div>

        <a href="strutture.html" class="btn btn-secondary">Torna alle strutture</a>
      </aside>
    </div>
  `;

  if (window.inizializzaPreventivo) {
    window.inizializzaPreventivo();
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

function escapeAttribute(value) {
  return escapeHtml(value);
}
