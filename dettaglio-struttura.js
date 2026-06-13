const strutture = {
  "villaggio-anfitrite": {
    nome: "Villaggio Anfitrite",
    tipologia: "Villaggio",
    capienza: 900,
    localita: "Sellia Marina, Calabria",
    target: "Famiglie/Eventi",
    prezzo: 65,
    immagine: "https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
    descrizione: "Il Villaggio Anfitrite è una struttura ideale per famiglie e grandi gruppi. Offre ampi spazi, piscine, attività di animazione e servizi pensati per bambini, ragazzi e genitori.",
    servizi: ["Animazione", "Piscina", "Ristorante", "Attività per bambini", "Spazi per eventi"],
    alloggi: ["camera-hotel", "bungalow"]
  },

  "resort-palme": {
    nome: "Resort delle Palme",
    tipologia: "Villaggio",
    capienza: 800,
    localita: "Platamona, Sardegna",
    target: "Famiglie/Gruppi",
    prezzo: 75,
    immagine: "https://images.unsplash.com/photo-1582610116397-edb318620f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
    descrizione: "Il Resort delle Palme è immerso nella natura sarda e offre un ambiente elegante e rilassante. È adatto a famiglie, gruppi organizzati e soggiorni all'insegna del comfort.",
    servizi: ["Ristorante", "Piscina", "Animazione", "Aree verdi", "Servizi per gruppi"],
    alloggi: ["camera-hotel", "bungalow"]
  },

  "scogliere-nere": {
    nome: "Scogliere Nere",
    tipologia: "Villaggio",
    capienza: 500,
    localita: "Tropea, Calabria",
    target: "Giovani 16-20",
    prezzo: 60,
    immagine: "https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
    descrizione: "Scogliere Nere è una struttura pensata per i giovani e per chi cerca divertimento. Offre eventi, serate, sport e un'atmosfera vivace vicino al mare.",
    servizi: ["Eventi serali", "Musica", "Sport", "Mare vicino", "Sconti comitive"],
    alloggi: ["camera-hotel", "bungalow"]
  },

  "promontorio-anti-elios": {
    nome: "Promontorio Anti-elios",
    tipologia: "Hotel",
    capienza: 300,
    localita: "Tropea, Calabria",
    target: "Relax/Coppie",
    prezzo: 90,
    immagine: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
    descrizione: "Promontorio Anti-elios è un hotel elegante situato in una posizione panoramica. È ideale per coppie e per chi cerca un soggiorno tranquillo e raffinato.",
    servizi: ["Vista panoramica", "Ristorante", "Camere comfort", "Relax", "Servizio elegante"],
    alloggi: ["camera-hotel", "bungalow"]
  },

  "hotel-baroni": {
    nome: "Hotel Baroni d'Aragosta",
    tipologia: "Hotel",
    capienza: 300,
    localita: "Sestriere, Piemonte",
    target: "Neve/Settimane Bianche",
    prezzo: 85,
    immagine: "https://images.unsplash.com/photo-1551524164-687a55dd1126?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
    descrizione: "Hotel Baroni d'Aragosta è una struttura invernale ideale per settimane bianche, sport sulla neve e soggiorni in montagna. Offre comfort e accesso comodo alle attività sciistiche.",
    servizi: ["Camere hotel", "Ristorante", "Neve", "Settimane bianche", "Comfort invernale"],
    alloggi: ["camera-hotel"]
  },

  "etranger-glace": {
    nome: "Étranger Glace & Tennis",
    tipologia: "Hotel",
    capienza: 250,
    localita: "Ischia, Campania",
    target: "Senior/Sportivi",
    prezzo: 80,
    immagine: "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
    descrizione: "Étranger Glace & Tennis unisce benessere, sport e relax in una cornice elegante. È adatto soprattutto alla terza età e agli amanti del wellness e del tennis.",
    servizi: ["Camere hotel", "Tennis", "Wellness", "Relax", "Servizi senior"],
    alloggi: ["camera-hotel"]
  },

  "insenatura-ombrosa": {
    nome: "Insenatura Ombrosa",
    tipologia: "Hotel",
    capienza: 200,
    localita: "Cilento, Salerno",
    target: "Relax/Famiglie",
    prezzo: 70,
    immagine: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
    descrizione: "Insenatura Ombrosa è un hotel immerso nella tranquillità del Cilento, ideale per chi cerca mare, natura e relax in un ambiente riservato e accogliente.",
    servizi: ["Camere hotel", "Mare", "Relax", "Ristorante", "Ambiente tranquillo"],
    alloggi: ["camera-hotel"]
  },

  "contado-agro-pontino": {
    nome: "Contado dell'Agro Pontino",
    tipologia: "Hotel",
    capienza: 250,
    localita: "Argentario, Grosseto / Orbetello",
    target: "Senior/Gruppi",
    prezzo: 78,
    immagine: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
    descrizione: "Contado dell'Agro Pontino è una struttura elegante situata tra mare e natura. È adatta a soggiorni rilassanti, gruppi organizzati e viaggi per la terza età.",
    servizi: ["Ristorante", "Relax", "Gruppi organizzati", "Natura", "Servizi senior"],
    alloggi: ["camera-hotel", "bungalow"]
  },

  "partenza-penelope": {
    nome: "Partenza di Penelope",
    tipologia: "Villaggio",
    capienza: 400,
    localita: "Favignana, Sicilia",
    target: "Giovani/Famiglie",
    prezzo: 62,
    immagine: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
    descrizione: "Partenza di Penelope è un villaggio situato a Favignana, perfetto per giovani, famiglie e gruppi. Offre mare cristallino, escursioni, divertimento e momenti di socialità.",
    servizi: ["Animazione", "Escursioni", "Mare", "Eventi", "Sconti comitive"],
    alloggi: ["camera-hotel", "bungalow"]
  },

  "lido-apeiron": {
    nome: "Lido Apeiron",
    tipologia: "Hotel",
    capienza: 300,
    localita: "Lido Riccio, Ortona",
    target: "Relax/Famiglie",
    prezzo: 72,
    immagine: "https://images.unsplash.com/photo-1501117716987-c8e1ecb21079?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
    descrizione: "Lido Apeiron è un hotel sul mare situato nella zona di Lido Riccio, a Ortona. È adatto a famiglie, coppie e terza età che cercano tranquillità e comfort.",
    servizi: ["Mare vicino", "Camere comfort", "Ristorante", "Relax", "Servizi famiglia"],
    alloggi: ["camera-hotel", "bungalow"]
  }
};

const nomiAlloggi = {
  "camera-hotel": "Camera hotel / standard",
  "bungalow": "Bungalow"
};

const params = new URLSearchParams(window.location.search);
const id = params.get("id") || "";
const pacchettoPreselezionato = params.get("pacchetto") || "standard";
const arrivoPreselezionato = params.get("arrivo") || "";
const partenzaPreselezionata = params.get("partenza") || "";

const struttura = strutture[id];

if (!struttura) {
  document.getElementById("contenutoStruttura").innerHTML = `
    <div class="errore">Struttura non trovata.</div>
    <a href="strutture.html" class="btn">Torna alle strutture</a>
  `;
} else {
  document.title = `${struttura.nome} | Adamantis Village`;

  document.getElementById("titoloStruttura").textContent = struttura.nome;
  document.getElementById("sottotitoloStruttura").textContent = `${struttura.localita} | ${struttura.tipologia}`;
  document.getElementById("heroDettaglio").style.backgroundImage =
    `linear-gradient(rgba(26, 54, 93, 0.55), rgba(26, 54, 93, 0.75)), url('${struttura.immagine}')`;

  document.getElementById("contenutoStruttura").innerHTML = `
    <div class="layout">
      <div>
        <div class="box">
          <h2>Descrizione struttura</h2>
          <p>${struttura.descrizione}</p>

          <div class="info-grid">
            <div class="info-card">
              <strong>Tipologia</strong><br>
              ${struttura.tipologia}
            </div>

            <div class="info-card">
              <strong>Capienza</strong><br>
              ${struttura.capienza} persone
            </div>

            <div class="info-card">
              <strong>Località</strong><br>
              ${struttura.localita}
            </div>

            <div class="info-card">
              <strong>Target</strong><br>
              ${struttura.target}
            </div>

            <div class="info-card">
              <strong>Prezzo base</strong><br>
              Da ${struttura.prezzo}€ a persona/notte
            </div>

            <div class="info-card">
              <strong>Capienza stanza</strong><br>
              Max 4 persone per stanza
            </div>
          </div>
        </div>

        <div class="box">
          <h2>Servizi disponibili</h2>
          <div class="servizi">
            ${struttura.servizi.map(servizio => `<span>${servizio}</span>`).join("")}
          </div>
        </div>

        <div class="box">
          <h2>Soluzioni disponibili</h2>
          ${struttura.alloggi.map(alloggio => `
            <div class="soluzione">
              <h3>${nomiAlloggi[alloggio]}</h3>
              ${
                alloggio === "camera-hotel"
                  ? "<p>Soluzione standard in camera hotel, ideale per coppie, famiglie e gruppi. Ogni stanza può ospitare massimo 4 persone.</p>"
                  : "<p>Soluzione indipendente in bungalow, consigliata per famiglie e gruppi che desiderano maggiore autonomia e spazi più riservati.</p>"
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
            <input type="hidden" id="destinazione" name="destinazione" value="${id}">

            <input type="text" id="nome" name="nome" placeholder="Nome e cognome" required>

            <input type="email" id="email" name="email" placeholder="Email" required>

            <input type="tel" id="telefono" name="telefono" placeholder="Telefono">

            <label>Tipo di alloggio</label>
            <select id="tipo_alloggio" name="tipo_alloggio" required>
              <option value="">Scegli il tipo di alloggio</option>
              ${struttura.alloggi.map(alloggio => `
                <option value="${alloggio}">${nomiAlloggi[alloggio]}</option>
              `).join("")}
            </select>

            <input
              type="number"
              id="numero_persone"
              name="numero_persone"
              placeholder="Numero di persone"
              min="1"
              max="${struttura.capienza}"
              required
            >

            <label>Data di arrivo</label>
            <input
              type="date"
              id="data_arrivo"
              name="data_arrivo"
              value="${arrivoPreselezionato}"
              required
            >

            <label>Data di partenza</label>
            <input
              type="date"
              id="data_partenza"
              name="data_partenza"
              value="${partenzaPreselezionata}"
              required
            >

            <select id="trattamento" name="trattamento" required>
              <option value="">Tipo di trattamento</option>
              <option value="mezza-pensione">Mezza pensione</option>
              <option value="pensione-completa">Pensione completa</option>
              <option value="all-inclusive">All inclusive</option>
            </select>

            <select id="tipo_pacchetto" name="tipo_pacchetto" required>
              <option value="standard" ${pacchettoPreselezionato === "standard" ? "selected" : ""}>
                Vacanza standard
              </option>
              <option value="giovani-low-cost" ${pacchettoPreselezionato === "giovani-low-cost" ? "selected" : ""}>
                Evento Giovani Low Cost
              </option>
            </select>

            <textarea id="messaggio" name="messaggio" placeholder="Scrivi eventuali richieste specifiche..."></textarea>

            <button type="submit" class="btn">Calcola preventivo</button>
          </form>
        </div>

        <a href="strutture.html" class="btn btn-secondary">Torna alle strutture</a>
      </aside>
    </div>
  `;
}
