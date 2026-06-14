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
      showPreventivoModal('<div class="errore">Non riesco a salvare il preventivo in questo momento. Controlla che il sito sia aperto da localhost e che MySQL sia attivo.</div>');
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
