CREATE DATABASE IF NOT EXISTS adamantis_village
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE adamantis_village;

CREATE TABLE IF NOT EXISTS strutture (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(80) NOT NULL UNIQUE,
    nome VARCHAR(120) NOT NULL,
    tipologia ENUM('Hotel', 'Villaggio') NOT NULL,
    capienza INT UNSIGNED NOT NULL,
    localita VARCHAR(160) NOT NULL,
    target VARCHAR(120) NOT NULL,
    prezzo_base DECIMAL(8,2) NOT NULL,
    immagine TEXT NOT NULL,
    descrizione TEXT NOT NULL,
    categoria VARCHAR(120) NOT NULL,
    attiva TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS alloggi (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    codice VARCHAR(60) NOT NULL UNIQUE,
    nome VARCHAR(120) NOT NULL,
    supplemento_persona_notte DECIMAL(8,2) NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS struttura_alloggi (
    struttura_id INT UNSIGNED NOT NULL,
    alloggio_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (struttura_id, alloggio_id),
    CONSTRAINT fk_struttura_alloggi_struttura
        FOREIGN KEY (struttura_id) REFERENCES strutture(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_struttura_alloggi_alloggio
        FOREIGN KEY (alloggio_id) REFERENCES alloggi(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS servizi (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS struttura_servizi (
    struttura_id INT UNSIGNED NOT NULL,
    servizio_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (struttura_id, servizio_id),
    CONSTRAINT fk_struttura_servizi_struttura
        FOREIGN KEY (struttura_id) REFERENCES strutture(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_struttura_servizi_servizio
        FOREIGN KEY (servizio_id) REFERENCES servizi(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS trattamenti (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    codice VARCHAR(60) NOT NULL UNIQUE,
    nome VARCHAR(120) NOT NULL,
    supplemento_persona_notte DECIMAL(8,2) NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS eventi_low_cost (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(140) NOT NULL,
    struttura_id INT UNSIGNED NOT NULL,
    data_arrivo DATE NOT NULL,
    data_partenza DATE NOT NULL,
    prezzo_persona_notte DECIMAL(8,2) NOT NULL,
    attivo TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_evento_low_cost (nome, struttura_id, data_arrivo, data_partenza),
    CONSTRAINT fk_eventi_struttura
        FOREIGN KEY (struttura_id) REFERENCES strutture(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS richieste_preventivo (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome_cliente VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL,
    telefono VARCHAR(40) NULL,
    struttura_id INT UNSIGNED NOT NULL,
    alloggio_id INT UNSIGNED NOT NULL,
    trattamento_id INT UNSIGNED NOT NULL,
    evento_id INT UNSIGNED NULL,
    tipo_pacchetto ENUM('standard', 'giovani-low-cost') NOT NULL DEFAULT 'standard',
    numero_persone INT UNSIGNED NOT NULL,
    numero_stanze INT UNSIGNED NOT NULL,
    data_arrivo DATE NOT NULL,
    data_partenza DATE NOT NULL,
    notti INT UNSIGNED NOT NULL,
    prezzo_base_persona_notte DECIMAL(8,2) NOT NULL,
    supplemento_trattamento DECIMAL(8,2) NOT NULL,
    supplemento_alloggio DECIMAL(8,2) NOT NULL,
    prezzo_persona_notte DECIMAL(8,2) NOT NULL,
    totale DECIMAL(10,2) NOT NULL,
    sconto_percentuale DECIMAL(5,2) NOT NULL DEFAULT 0,
    totale_scontato DECIMAL(10,2) NOT NULL,
    messaggio TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_richieste_email (email),
    INDEX idx_richieste_date (data_arrivo, data_partenza),
    CONSTRAINT fk_richieste_struttura
        FOREIGN KEY (struttura_id) REFERENCES strutture(id),
    CONSTRAINT fk_richieste_alloggio
        FOREIGN KEY (alloggio_id) REFERENCES alloggi(id),
    CONSTRAINT fk_richieste_trattamento
        FOREIGN KEY (trattamento_id) REFERENCES trattamenti(id),
    CONSTRAINT fk_richieste_evento
        FOREIGN KEY (evento_id) REFERENCES eventi_low_cost(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS newsletter_iscrizioni (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(160) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS utenti (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    attivo TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    utente_id INT UNSIGNED NOT NULL,
    token_hash CHAR(64) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    used_at DATETIME NULL DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_reset_token_hash (token_hash),
    INDEX idx_reset_expires (expires_at),
    CONSTRAINT fk_reset_utente
        FOREIGN KEY (utente_id) REFERENCES utenti(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS email_inviate (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    destinatario VARCHAR(160) NOT NULL,
    oggetto VARCHAR(190) NOT NULL,
    corpo TEXT NOT NULL,
    inviata TINYINT(1) NOT NULL DEFAULT 0,
    errore VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email_destinatario (destinatario)
) ENGINE=InnoDB;

INSERT INTO alloggi (codice, nome, supplemento_persona_notte) VALUES
('camera-hotel', 'Camera hotel / standard', 0),
('bungalow', 'Bungalow', 10)
ON DUPLICATE KEY UPDATE
    nome = VALUES(nome),
    supplemento_persona_notte = VALUES(supplemento_persona_notte);

INSERT INTO trattamenti (codice, nome, supplemento_persona_notte) VALUES
('mezza-pensione', 'Mezza pensione', 0),
('pensione-completa', 'Pensione completa', 15),
('all-inclusive', 'All inclusive', 30)
ON DUPLICATE KEY UPDATE
    nome = VALUES(nome),
    supplemento_persona_notte = VALUES(supplemento_persona_notte);

INSERT INTO servizi (nome) VALUES
('Animazione'),
('Piscina'),
('Ristorante'),
('Attivita per bambini'),
('Spazi per eventi'),
('Aree verdi'),
('Servizi per gruppi'),
('Eventi serali'),
('Musica'),
('Sport'),
('Mare vicino'),
('Sconti comitive'),
('Vista panoramica'),
('Camere comfort'),
('Relax'),
('Servizio elegante'),
('Camere hotel'),
('Neve'),
('Settimane bianche'),
('Comfort invernale'),
('Tennis'),
('Wellness'),
('Servizi senior'),
('Mare'),
('Ambiente tranquillo'),
('Gruppi organizzati'),
('Natura'),
('Escursioni'),
('Eventi'),
('Servizi famiglia')
ON DUPLICATE KEY UPDATE nome = VALUES(nome);

INSERT INTO strutture
(slug, nome, tipologia, capienza, localita, target, prezzo_base, immagine, descrizione, categoria)
VALUES
('villaggio-anfitrite', 'Villaggio Anfitrite', 'Villaggio', 900, 'Sellia Marina, Calabria', 'Famiglie/Eventi', 65,
 'https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
 'Struttura ideale per famiglie e grandi gruppi, con ampi spazi, piscine, animazione e servizi per bambini, ragazzi e genitori.',
 'villaggio mare'),
('resort-palme', 'Resort delle Palme', 'Villaggio', 800, 'Platamona, Sardegna', 'Famiglie/Gruppi', 75,
 'https://images.unsplash.com/photo-1582610116397-edb318620f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
 'Resort immerso nella natura sarda, adatto a famiglie, gruppi organizzati e soggiorni orientati al comfort.',
 'villaggio mare'),
('scogliere-nere', 'Scogliere Nere', 'Villaggio', 500, 'Tropea, Calabria', 'Giovani 16-20', 60,
 'https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
 'Struttura pensata per giovani e gruppi, con eventi, serate, sport e atmosfera vivace vicino al mare.',
 'villaggio mare'),
('promontorio-anti-elios', 'Promontorio Anti-elios', 'Hotel', 300, 'Tropea, Calabria', 'Relax/Coppie', 90,
 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
 'Hotel elegante in posizione panoramica, ideale per coppie e soggiorni tranquilli.',
 'hotel mare'),
('hotel-baroni', 'Hotel Baroni d''Aragosta', 'Hotel', 300, 'Sestriere, Piemonte', 'Neve/Settimane Bianche', 85,
 'https://images.unsplash.com/photo-1551524164-687a55dd1126?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
 'Hotel invernale ideale per settimane bianche, sport sulla neve e soggiorni in montagna.',
 'hotel montagna'),
('etranger-glace', 'Etranger Glace & Tennis', 'Hotel', 250, 'Ischia, Campania', 'Senior/Sportivi', 80,
 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
 'Struttura dedicata a benessere, sport e relax, adatta a senior e amanti del tennis.',
 'hotel mare'),
('insenatura-ombrosa', 'Insenatura Ombrosa', 'Hotel', 200, 'Cilento, Salerno', 'Relax/Famiglie', 70,
 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
 'Hotel tranquillo nel Cilento, ideale per mare, natura e relax.',
 'hotel mare'),
('contado-agro-pontino', 'Contado dell''Agro Pontino', 'Hotel', 250, 'Argentario, Grosseto / Orbetello', 'Senior/Gruppi', 78,
 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
 'Struttura elegante tra mare e natura, adatta a soggiorni rilassanti, gruppi organizzati e terza eta.',
 'hotel mare'),
('partenza-penelope', 'Partenza di Penelope', 'Villaggio', 400, 'Favignana, Sicilia', 'Giovani/Famiglie', 62,
 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
 'Villaggio a Favignana per giovani, famiglie e gruppi, con mare, escursioni, divertimento e socialita.',
 'villaggio mare'),
('lido-apeiron', 'Lido Apeiron', 'Hotel', 300, 'Lido Riccio, Ortona', 'Relax/Famiglie', 72,
 'https://www.aurumhotels.it/public/photogallery/_d7a1791.jpg',
 'Hotel sul mare adatto a famiglie, coppie e senior che cercano comfort e tranquillita.',
 'hotel mare')
ON DUPLICATE KEY UPDATE
    nome = VALUES(nome),
    tipologia = VALUES(tipologia),
    capienza = VALUES(capienza),
    localita = VALUES(localita),
    target = VALUES(target),
    prezzo_base = VALUES(prezzo_base),
    immagine = VALUES(immagine),
    descrizione = VALUES(descrizione),
    categoria = VALUES(categoria),
    attiva = 1;

INSERT IGNORE INTO struttura_alloggi (struttura_id, alloggio_id)
SELECT s.id, a.id FROM strutture s JOIN alloggi a
WHERE s.slug IN ('villaggio-anfitrite', 'resort-palme', 'scogliere-nere', 'promontorio-anti-elios', 'contado-agro-pontino', 'partenza-penelope', 'lido-apeiron')
  AND a.codice IN ('camera-hotel', 'bungalow');

INSERT IGNORE INTO struttura_alloggi (struttura_id, alloggio_id)
SELECT s.id, a.id FROM strutture s JOIN alloggi a
WHERE s.slug IN ('hotel-baroni', 'etranger-glace', 'insenatura-ombrosa')
  AND a.codice = 'camera-hotel';

INSERT IGNORE INTO struttura_servizi (struttura_id, servizio_id)
SELECT s.id, v.id FROM strutture s JOIN servizi v ON v.nome IN ('Animazione', 'Piscina', 'Ristorante', 'Attivita per bambini', 'Spazi per eventi')
WHERE s.slug = 'villaggio-anfitrite';

INSERT IGNORE INTO struttura_servizi (struttura_id, servizio_id)
SELECT s.id, v.id FROM strutture s JOIN servizi v ON v.nome IN ('Ristorante', 'Piscina', 'Animazione', 'Aree verdi', 'Servizi per gruppi')
WHERE s.slug = 'resort-palme';

INSERT IGNORE INTO struttura_servizi (struttura_id, servizio_id)
SELECT s.id, v.id FROM strutture s JOIN servizi v ON v.nome IN ('Eventi serali', 'Musica', 'Sport', 'Mare vicino', 'Sconti comitive')
WHERE s.slug = 'scogliere-nere';

INSERT IGNORE INTO struttura_servizi (struttura_id, servizio_id)
SELECT s.id, v.id FROM strutture s JOIN servizi v ON v.nome IN ('Vista panoramica', 'Ristorante', 'Camere comfort', 'Relax', 'Servizio elegante')
WHERE s.slug = 'promontorio-anti-elios';

INSERT IGNORE INTO struttura_servizi (struttura_id, servizio_id)
SELECT s.id, v.id FROM strutture s JOIN servizi v ON v.nome IN ('Camere hotel', 'Ristorante', 'Neve', 'Settimane bianche', 'Comfort invernale')
WHERE s.slug = 'hotel-baroni';

INSERT IGNORE INTO struttura_servizi (struttura_id, servizio_id)
SELECT s.id, v.id FROM strutture s JOIN servizi v ON v.nome IN ('Camere hotel', 'Tennis', 'Wellness', 'Relax', 'Servizi senior')
WHERE s.slug = 'etranger-glace';

INSERT IGNORE INTO struttura_servizi (struttura_id, servizio_id)
SELECT s.id, v.id FROM strutture s JOIN servizi v ON v.nome IN ('Camere hotel', 'Mare', 'Relax', 'Ristorante', 'Ambiente tranquillo')
WHERE s.slug = 'insenatura-ombrosa';

INSERT IGNORE INTO struttura_servizi (struttura_id, servizio_id)
SELECT s.id, v.id FROM strutture s JOIN servizi v ON v.nome IN ('Ristorante', 'Relax', 'Gruppi organizzati', 'Natura', 'Servizi senior')
WHERE s.slug = 'contado-agro-pontino';

INSERT IGNORE INTO struttura_servizi (struttura_id, servizio_id)
SELECT s.id, v.id FROM strutture s JOIN servizi v ON v.nome IN ('Animazione', 'Escursioni', 'Mare', 'Eventi', 'Sconti comitive')
WHERE s.slug = 'partenza-penelope';

INSERT IGNORE INTO struttura_servizi (struttura_id, servizio_id)
SELECT s.id, v.id FROM strutture s JOIN servizi v ON v.nome IN ('Mare vicino', 'Camere comfort', 'Ristorante', 'Relax', 'Servizi famiglia')
WHERE s.slug = 'lido-apeiron';

INSERT INTO eventi_low_cost
(nome, struttura_id, data_arrivo, data_partenza, prezzo_persona_notte)
SELECT 'Young Summer Tropea', s.id, '2026-07-08', '2026-07-12', 45
FROM strutture s WHERE s.slug = 'scogliere-nere'
ON DUPLICATE KEY UPDATE prezzo_persona_notte = VALUES(prezzo_persona_notte), attivo = 1;

INSERT INTO eventi_low_cost
(nome, struttura_id, data_arrivo, data_partenza, prezzo_persona_notte)
SELECT 'Favignana Young Party', s.id, '2026-07-08', '2026-07-12', 48
FROM strutture s WHERE s.slug = 'partenza-penelope'
ON DUPLICATE KEY UPDATE prezzo_persona_notte = VALUES(prezzo_persona_notte), attivo = 1;

INSERT INTO eventi_low_cost
(nome, struttura_id, data_arrivo, data_partenza, prezzo_persona_notte)
SELECT 'Calabria Low Cost', s.id, '2026-07-15', '2026-07-19', 42
FROM strutture s WHERE s.slug = 'villaggio-anfitrite'
ON DUPLICATE KEY UPDATE prezzo_persona_notte = VALUES(prezzo_persona_notte), attivo = 1;

INSERT INTO eventi_low_cost
(nome, struttura_id, data_arrivo, data_partenza, prezzo_persona_notte)
SELECT 'Sardegna Young Week', s.id, '2026-07-22', '2026-07-26', 50
FROM strutture s WHERE s.slug = 'resort-palme'
ON DUPLICATE KEY UPDATE prezzo_persona_notte = VALUES(prezzo_persona_notte), attivo = 1;

INSERT INTO eventi_low_cost
(nome, struttura_id, data_arrivo, data_partenza, prezzo_persona_notte)
SELECT 'Tropea Young Agosto', s.id, '2026-08-05', '2026-08-09', 55
FROM strutture s WHERE s.slug = 'scogliere-nere'
ON DUPLICATE KEY UPDATE prezzo_persona_notte = VALUES(prezzo_persona_notte), attivo = 1;

INSERT INTO eventi_low_cost
(nome, struttura_id, data_arrivo, data_partenza, prezzo_persona_notte)
SELECT 'Favignana Low Cost Agosto', s.id, '2026-08-05', '2026-08-09', 58
FROM strutture s WHERE s.slug = 'partenza-penelope'
ON DUPLICATE KEY UPDATE prezzo_persona_notte = VALUES(prezzo_persona_notte), attivo = 1;

INSERT INTO eventi_low_cost
(nome, struttura_id, data_arrivo, data_partenza, prezzo_persona_notte)
SELECT 'Resort Young Agosto', s.id, '2026-08-16', '2026-08-20', 60
FROM strutture s WHERE s.slug = 'resort-palme'
ON DUPLICATE KEY UPDATE prezzo_persona_notte = VALUES(prezzo_persona_notte), attivo = 1;

INSERT INTO eventi_low_cost
(nome, struttura_id, data_arrivo, data_partenza, prezzo_persona_notte)
SELECT 'Lido Apeiron Young', s.id, '2026-08-25', '2026-08-29', 52
FROM strutture s WHERE s.slug = 'lido-apeiron'
ON DUPLICATE KEY UPDATE prezzo_persona_notte = VALUES(prezzo_persona_notte), attivo = 1;
