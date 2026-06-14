caricaCatalogoStrutture();

async function caricaCatalogoStrutture() {
  const grid = document.querySelector(".catalog-container .grid");

  if (!grid) return;

  try {
    const response = await fetch("api-strutture.php", {
      headers: {
        "Accept": "application/json"
      }
    });
    const data = await response.json();

    if (!data.ok) {
      throw new Error(data.messaggio || "Errore durante il caricamento delle strutture.");
    }

    grid.innerHTML = data.strutture.map(renderCardStruttura).join("");
    inizializzaFiltriCatalogo();
  } catch (error) {
    grid.innerHTML = `<div class="errore">${escapeHtml(error.message)}</div>`;
  }
}

function renderCardStruttura(struttura) {
  const tipologia = String(struttura.tipologia || "");
  const isHotel = tipologia.toLowerCase() === "hotel";
  const categoria = struttura.categoria || `${tipologia.toLowerCase()} mare`;

  return `
    <div class="card" data-category="${escapeAttribute(categoria)}">
      <div class="card-img" style="background-image: url('${escapeAttribute(struttura.immagine)}');">
        <span class="badge" ${isHotel ? 'style="background: var(--blu-navy); color: white;"' : ""}>
          ${escapeHtml(tipologia)}
        </span>
      </div>
      <div class="card-content">
        <div class="location">📍 ${escapeHtml(struttura.localita)}</div>
        <h3 class="card-title">${escapeHtml(struttura.nome)}</h3>
        <p class="card-desc">${escapeHtml(struttura.descrizione)}</p>
        <div class="card-meta">
          <span>👥 Capienza: ${parseInt(struttura.capienza, 10)}</span>
          <span>⭐ Target: ${escapeHtml(struttura.target)}</span>
        </div>
        <a href="dettaglio-struttura.html?id=${encodeURIComponent(struttura.slug)}" class="btn-card">Scopri Tariffe e Dettagli</a>
      </div>
    </div>
  `;
}

function inizializzaFiltriCatalogo() {
  const bottoniFiltro = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".catalog-container .card");

  bottoniFiltro.forEach(bottone => {
    bottone.onclick = function() {
      const filtro = this.getAttribute("data-filter");

      bottoniFiltro.forEach(btn => btn.classList.remove("active"));
      this.classList.add("active");

      cards.forEach(card => {
        const categorie = card.getAttribute("data-category") || "";
        card.style.display = filtro === "tutti" || categorie.includes(filtro) ? "flex" : "none";
      });
    };
  });
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
