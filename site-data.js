window.SUMMER_DATA = {
  trattamenti: [
    { codice: "mezza-pensione", nome: "Mezza pensione", supplemento_persona_notte: 0 },
    { codice: "pensione-completa", nome: "Pensione completa", supplemento_persona_notte: 15 },
    { codice: "all-inclusive", nome: "All inclusive", supplemento_persona_notte: 30 }
  ],

  alloggi: [
    { codice: "camera-hotel", nome: "Camera hotel / standard", supplemento_persona_notte: 0 },
    { codice: "bungalow", nome: "Bungalow", supplemento_persona_notte: 10 }
  ],

  eventi_low_cost: [
    { nome: "Young Summer Tropea", struttura_slug: "scogliere-nere", struttura_nome: "Scogliere Nere", data_arrivo: "2026-07-08", data_partenza: "2026-07-12", prezzo_persona_notte: 45 },
    { nome: "Favignana Young Party", struttura_slug: "partenza-penelope", struttura_nome: "Partenza di Penelope", data_arrivo: "2026-07-08", data_partenza: "2026-07-12", prezzo_persona_notte: 48 },
    { nome: "Calabria Low Cost", struttura_slug: "villaggio-anfitrite", struttura_nome: "Villaggio Anfitrite", data_arrivo: "2026-07-15", data_partenza: "2026-07-19", prezzo_persona_notte: 42 },
    { nome: "Sardegna Young Week", struttura_slug: "resort-palme", struttura_nome: "Resort delle Palme", data_arrivo: "2026-07-22", data_partenza: "2026-07-26", prezzo_persona_notte: 50 },
    { nome: "Tropea Young Agosto", struttura_slug: "scogliere-nere", struttura_nome: "Scogliere Nere", data_arrivo: "2026-08-05", data_partenza: "2026-08-09", prezzo_persona_notte: 55 },
    { nome: "Favignana Low Cost Agosto", struttura_slug: "partenza-penelope", struttura_nome: "Partenza di Penelope", data_arrivo: "2026-08-05", data_partenza: "2026-08-09", prezzo_persona_notte: 58 },
    { nome: "Resort Young Agosto", struttura_slug: "resort-palme", struttura_nome: "Resort delle Palme", data_arrivo: "2026-08-16", data_partenza: "2026-08-20", prezzo_persona_notte: 60 },
    { nome: "Lido Apeiron Young", struttura_slug: "lido-apeiron", struttura_nome: "Lido Apeiron", data_arrivo: "2026-08-25", data_partenza: "2026-08-29", prezzo_persona_notte: 52 }
  ],

  strutture: [
    {
      slug: "villaggio-anfitrite",
      nome: "Villaggio Anfitrite",
      tipologia: "Villaggio",
      capienza: 900,
      localita: "Sellia Marina, Calabria",
      target: "Famiglie/Eventi",
      prezzo_base: 65,
      immagine: "https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
      descrizione: "Struttura ideale per famiglie e grandi gruppi, con ampi spazi, piscine, animazione e servizi per bambini, ragazzi e genitori.",
      categoria: "villaggio mare",
      servizi: ["Animazione", "Piscina", "Ristorante", "Attivita per bambini", "Spazi per eventi"],
      alloggi_codici: ["camera-hotel", "bungalow"]
    },
    {
      slug: "resort-palme",
      nome: "Resort delle Palme",
      tipologia: "Villaggio",
      capienza: 800,
      localita: "Platamona, Sardegna",
      target: "Famiglie/Gruppi",
      prezzo_base: 75,
      immagine: "https://images.unsplash.com/photo-1582610116397-edb318620f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
      descrizione: "Resort immerso nella natura sarda, adatto a famiglie, gruppi organizzati e soggiorni orientati al comfort.",
      categoria: "villaggio mare",
      servizi: ["Ristorante", "Piscina", "Animazione", "Aree verdi", "Servizi per gruppi"],
      alloggi_codici: ["camera-hotel", "bungalow"]
    },
    {
      slug: "scogliere-nere",
      nome: "Scogliere Nere",
      tipologia: "Villaggio",
      capienza: 500,
      localita: "Tropea, Calabria",
      target: "Giovani 16-20",
      prezzo_base: 60,
      immagine: "https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
      descrizione: "Struttura pensata per giovani e gruppi, con eventi, serate, sport e atmosfera vivace vicino al mare.",
      categoria: "villaggio mare",
      servizi: ["Eventi serali", "Musica", "Sport", "Mare vicino", "Sconti comitive"],
      alloggi_codici: ["camera-hotel", "bungalow"]
    },
    {
      slug: "promontorio-anti-elios",
      nome: "Promontorio Anti-elios",
      tipologia: "Hotel",
      capienza: 300,
      localita: "Tropea, Calabria",
      target: "Relax/Coppie",
      prezzo_base: 90,
      immagine: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
      descrizione: "Hotel elegante in posizione panoramica, ideale per coppie e soggiorni tranquilli.",
      categoria: "hotel mare",
      servizi: ["Vista panoramica", "Ristorante", "Camere comfort", "Relax", "Servizio elegante"],
      alloggi_codici: ["camera-hotel", "bungalow"]
    },
    {
      slug: "hotel-baroni",
      nome: "Hotel Baroni d'Aragosta",
      tipologia: "Hotel",
      capienza: 300,
      localita: "Sestriere, Piemonte",
      target: "Neve/Settimane Bianche",
      prezzo_base: 85,
      immagine: "https://images.unsplash.com/photo-1551524164-687a55dd1126?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
      descrizione: "Hotel invernale ideale per settimane bianche, sport sulla neve e soggiorni in montagna.",
      categoria: "hotel montagna",
      servizi: ["Camere hotel", "Ristorante", "Neve", "Settimane bianche", "Comfort invernale"],
      alloggi_codici: ["camera-hotel"]
    },
    {
      slug: "etranger-glace",
      nome: "Etranger Glace & Tennis",
      tipologia: "Hotel",
      capienza: 250,
      localita: "Ischia, Campania",
      target: "Senior/Sportivi",
      prezzo_base: 80,
      immagine: "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
      descrizione: "Struttura dedicata a benessere, sport e relax, adatta a senior e amanti del tennis.",
      categoria: "hotel mare",
      servizi: ["Camere hotel", "Tennis", "Wellness", "Relax", "Servizi senior"],
      alloggi_codici: ["camera-hotel"]
    },
    {
      slug: "insenatura-ombrosa",
      nome: "Insenatura Ombrosa",
      tipologia: "Hotel",
      capienza: 200,
      localita: "Cilento, Salerno",
      target: "Relax/Famiglie",
      prezzo_base: 70,
      immagine: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
      descrizione: "Hotel tranquillo nel Cilento, ideale per mare, natura e relax.",
      categoria: "hotel mare",
      servizi: ["Camere hotel", "Mare", "Relax", "Ristorante", "Ambiente tranquillo"],
      alloggi_codici: ["camera-hotel"]
    },
    {
      slug: "contado-agro-pontino",
      nome: "Contado dell'Agro Pontino",
      tipologia: "Hotel",
      capienza: 250,
      localita: "Argentario, Grosseto / Orbetello",
      target: "Senior/Gruppi",
      prezzo_base: 78,
      immagine: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
      descrizione: "Struttura elegante tra mare e natura, adatta a soggiorni rilassanti, gruppi organizzati e terza eta.",
      categoria: "hotel mare",
      servizi: ["Ristorante", "Relax", "Gruppi organizzati", "Natura", "Servizi senior"],
      alloggi_codici: ["camera-hotel", "bungalow"]
    },
    {
      slug: "partenza-penelope",
      nome: "Partenza di Penelope",
      tipologia: "Villaggio",
      capienza: 400,
      localita: "Favignana, Sicilia",
      target: "Giovani/Famiglie",
      prezzo_base: 62,
      immagine: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
      descrizione: "Villaggio a Favignana per giovani, famiglie e gruppi, con mare, escursioni, divertimento e socialita.",
      categoria: "villaggio mare",
      servizi: ["Animazione", "Escursioni", "Mare", "Eventi", "Sconti comitive"],
      alloggi_codici: ["camera-hotel", "bungalow"]
    },
    {
      slug: "lido-apeiron",
      nome: "Lido Apeiron",
      tipologia: "Hotel",
      capienza: 300,
      localita: "Lido Riccio, Ortona",
      target: "Relax/Famiglie",
      prezzo_base: 72,
      immagine: "https://www.aurumhotels.it/public/photogallery/_d7a1791.jpg",
      descrizione: "Hotel sul mare adatto a famiglie, coppie e senior che cercano comfort e tranquillita.",
      categoria: "hotel mare",
      servizi: ["Mare vicino", "Camere comfort", "Ristorante", "Relax", "Servizi famiglia"],
      alloggi_codici: ["camera-hotel", "bungalow"]
    }
  ]
};

window.SUMMER_DATA.strutture = window.SUMMER_DATA.strutture.map(struttura => ({
  ...struttura,
  alloggi: struttura.alloggi_codici.map(codice =>
    window.SUMMER_DATA.alloggi.find(alloggio => alloggio.codice === codice)
  ).filter(Boolean)
}));
