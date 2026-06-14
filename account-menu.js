inizializzaAccountMenu();
inizializzaNewsletter();

function inizializzaAccountMenu() {
  const nav = document.querySelector("header nav");
  if (!nav || document.getElementById("account-widget")) return;

  injectAccountStyles();

  const loginLink = creaLink("login.php", "Accedi");
  loginLink.dataset.guestLink = "true";

  const registerLink = creaLink("registrazione.php", "Registrati");
  registerLink.className = "nav-register";
  registerLink.dataset.guestLink = "true";

  const widget = document.createElement("div");
  widget.className = "account-widget";
  widget.id = "account-widget";
  widget.innerHTML = `
    <button type="button" class="profile-dot" id="profile-dot" aria-label="Apri menu profilo" aria-expanded="false"></button>
    <div class="profile-menu" id="profile-menu">
      <div class="profile-name" id="profile-name"></div>
      <div class="profile-email" id="profile-email"></div>
      <a href="area-riservata.php">Gestisci profilo</a>
      <a href="logout.php">Esci</a>
    </div>
  `;

  nav.appendChild(loginLink);
  nav.appendChild(registerLink);
  nav.appendChild(widget);

  const profileDot = document.getElementById("profile-dot");
  const profileMenu = document.getElementById("profile-menu");

  profileDot.addEventListener("click", function() {
    const isOpen = profileMenu.classList.toggle("is-open");
    profileDot.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  document.addEventListener("click", function(event) {
    if (!widget.contains(event.target)) {
      profileMenu.classList.remove("is-open");
      profileDot.setAttribute("aria-expanded", "false");
    }
  });

  aggiornaStatoAccount();
}

async function aggiornaStatoAccount() {
  const widget = document.getElementById("account-widget");
  const profileDot = document.getElementById("profile-dot");
  const profileName = document.getElementById("profile-name");
  const profileEmail = document.getElementById("profile-email");
  const guestLinks = document.querySelectorAll("[data-guest-link]");

  try {
    const response = await fetch("account-status.php", {
      headers: {
        "Accept": "application/json"
      }
    });
    const data = await response.json();

    if (!data.loggedIn) return;

    guestLinks.forEach(link => {
      link.style.display = "none";
    });

    profileDot.textContent = data.utente.iniziale || "U";
    profileName.textContent = data.utente.nome;
    profileEmail.textContent = data.utente.email;
    widget.classList.add("is-visible");
  } catch (error) {
    widget.classList.remove("is-visible");
  }
}

function inizializzaNewsletter() {
  const form = document.querySelector(".newsletter form");
  if (!form || form.dataset.newsletterBound === "true") return;

  form.dataset.newsletterBound = "true";
  form.action = "newsletter.php";
  form.method = "POST";

  const input = form.querySelector('input[type="email"]');
  if (input && !input.name) {
    input.name = "email";
  }

  let feedback = document.getElementById("newsletter-feedback");
  if (!feedback) {
    feedback = document.createElement("div");
    feedback.id = "newsletter-feedback";
    feedback.className = "newsletter-feedback";
    feedback.setAttribute("aria-live", "polite");
    form.insertAdjacentElement("afterend", feedback);
  }

  form.addEventListener("submit", async function(event) {
    event.preventDefault();

    feedback.className = "newsletter-feedback success";
    feedback.textContent = "Invio in corso...";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest"
        }
      });
      const data = await response.json();

      feedback.className = "newsletter-feedback " + (data.ok ? "success" : "error");
      feedback.textContent = data.messaggio;

      if (data.ok) form.reset();
    } catch (error) {
      feedback.className = "newsletter-feedback error";
      feedback.textContent = "Non riesco a registrare l'email in questo momento. Controlla che il sito sia aperto da localhost.";
    }
  });
}

function creaLink(href, testo) {
  const link = document.createElement("a");
  link.href = href;
  link.textContent = testo;
  return link;
}

function injectAccountStyles() {
  if (document.getElementById("account-menu-styles")) return;

  const style = document.createElement("style");
  style.id = "account-menu-styles";
  style.textContent = `
    .nav-register{background:var(--oro);color:var(--blu-navy);padding:8px 14px;border-radius:999px}
    .nav-register:hover{background:var(--oro-hover, #b5952f);color:var(--blu-navy)}
    .account-widget{position:relative;display:none;margin-left:20px}
    .account-widget.is-visible{display:inline-flex;align-items:center}
    .profile-dot{width:38px;height:38px;border-radius:50%;border:2px solid var(--oro);background:white;color:var(--blu-navy);font-weight:800;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,.18)}
    .profile-menu{position:absolute;top:calc(100% + 12px);right:0;width:230px;background:white;color:var(--testo-scuro);border-radius:12px;box-shadow:0 12px 35px rgba(0,0,0,.18);padding:14px;display:none;text-align:left;z-index:20}
    .profile-menu.is-open{display:block}
    .profile-name{color:var(--blu-navy);font-weight:800;margin-bottom:2px}
    .profile-email{color:#666;font-size:.9rem;margin-bottom:12px;word-break:break-word}
    .profile-menu a{display:block;color:var(--blu-navy);margin:0;padding:10px;border-radius:8px;font-weight:700}
    .profile-menu a:hover{background:#f8efd0;color:var(--blu-navy)}
    .newsletter-feedback{display:none;max-width:620px;margin:22px auto 0;padding:14px 18px;border-radius:10px;font-weight:600}
    .newsletter-feedback.success{display:block;background:#e4f8ec;color:#176236;border:1px solid #43a267}
    .newsletter-feedback.error{display:block;background:#ffe0e0;color:#8b0000;border:1px solid #cc0000}
  `;
  document.head.appendChild(style);
}
