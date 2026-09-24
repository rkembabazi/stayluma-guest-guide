/**
 * Render engine — generic across any PROPERTY object shaped like
 * a property's data.js. Nothing property-specific lives in this
 * file. Depends on assets/js/icons.js and, if the property has a
 * private/PIN-gated section, assets/js/pin-gate.js.
 */
(function () {
  "use strict";

  const icon = window.StayLumaIcons.icon;

  function mapHref(mapUrl, fallbackQuery) {
    return mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fallbackQuery)}`;
  }

  function mapLinkHtml(mapUrl, fallbackQuery) {
    return `<a class="maplink" href="${mapHref(mapUrl, fallbackQuery)}" target="_blank" rel="noopener">${icon("pin")}<span>Map</span></a>`;
  }

  function heroArt() {
    return `
    <svg viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustration of rooftops at dusk">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f3d9a8"/>
          <stop offset="55%" stop-color="#e7ac6f"/>
          <stop offset="100%" stop-color="#c1602d"/>
        </linearGradient>
      </defs>
      <rect width="640" height="300" fill="url(#sky)"/>
      <circle cx="500" cy="80" r="46" fill="#f7efdf" opacity="0.85"/>
      <g fill="#1e2a3c" opacity="0.92">
        <rect x="0" y="185" width="120" height="95"/>
        <rect x="70" y="150" width="90" height="130"/>
        <rect x="150" y="200" width="70" height="80"/>
        <rect x="205" y="160" width="100" height="120"/>
        <rect x="295" y="195" width="80" height="85"/>
        <rect x="360" y="170" width="110" height="110"/>
        <rect x="455" y="205" width="70" height="75"/>
        <rect x="510" y="180" width="130" height="100"/>
        <rect x="120" y="130" width="10" height="30"/>
        <rect x="330" y="140" width="10" height="35"/>
        <rect x="430" y="150" width="10" height="30"/>
        <path d="M20 185l40-28 40 28z"/>
        <path d="M225 160l35-24 35 24z"/>
        <path d="M375 170l35-24 35 24z"/>
      </g>
      <g fill="#6c7247">
        <ellipse cx="60" cy="278" rx="30" ry="8"/>
        <ellipse cx="580" cy="282" rx="36" ry="9"/>
      </g>
    </svg>`;
  }

  function renderHero(p) {
    const artEl = document.getElementById("hero-art");
    if (p.photos && p.photos.hero) {
      artEl.innerHTML = `<img src="${p.photos.hero}" alt="${p.name}" />`;
    } else {
      artEl.innerHTML = heroArt();
    }

    document.getElementById("hero-location").innerHTML = `${icon("pin")}<span>${p.location}</span>`;
    document.getElementById("hero-title").textContent = p.name;
    document.getElementById("hero-tagline").textContent = p.tagline;
    document.getElementById("hero-meta").textContent = p.sleeps;
    document.getElementById("topbar-property").textContent = p.name;
    document.title = `${p.name} — Guest Guide`;

    const avatarEl = document.getElementById("host-initials");
    if (p.host.photo) {
      avatarEl.innerHTML = `<img src="${p.host.photo}" alt="${p.host.name}" />`;
    } else {
      avatarEl.textContent = p.host.initials;
    }
    document.getElementById("host-quote").textContent = p.host.message;
    document.getElementById("host-byline").textContent = `${p.host.signoff} · ${p.host.responseNote}`;
  }

  function renderCheckInOut(p) {
    document.getElementById("checkin-window").textContent = p.checkIn.window;
    document.getElementById("checkin-sub").textContent = p.checkIn.subtitle;
    document.getElementById("checkout-time").textContent = p.checkOut.time;
    document.getElementById("checkout-sub").textContent = "Please leave by this time";

    const addr = document.getElementById("property-address");
    addr.innerHTML = `${icon("pin")}<span>${p.address}</span>${mapLinkHtml(p.mapUrl, p.address)}`;

    const stepsWrap = document.getElementById("checkin-steps");
    stepsWrap.innerHTML = p.checkIn.steps
      .map((s, i) => `<li><span class="steps__num">${i + 1}</span><span>${s}</span></li>`)
      .join("");

    document.getElementById("checkin-late-note").textContent = p.checkIn.lateNote;

    const outWrap = document.getElementById("checkout-steps");
    outWrap.innerHTML = p.checkOut.steps
      .map((s, i) => `<li><span class="steps__num">${i + 1}</span><span>${s}</span></li>`)
      .join("");
  }

  function renderPrivate(p) {
    const container = document.getElementById("private-section");
    if (!container) return;
    if (!p.private || !p.private.fields || !p.private.fields.length) {
      container.hidden = true;
      return;
    }
    container.hidden = false;
    container.innerHTML = `
      <div class="private-card" data-unlocked="false" id="private-card">
        <div class="private-card__title">${icon("lock")}<span>Private access details</span></div>
        <div class="private-card__locked">
          <p>Enter the PIN your host shared with you to reveal this.</p>
          <form class="pin-form" id="pin-form">
            <input type="text" inputmode="numeric" autocomplete="off" placeholder="PIN" aria-label="Enter PIN" id="pin-input" />
            <button type="submit">Unlock</button>
          </form>
          <div class="pin-form__error" role="alert" id="pin-error"></div>
        </div>
        <div class="private-card__content">
          ${p.private.fields
            .map(
              (f) => `<div class="private-card__field">
                <div class="private-card__field-label">${f.label}</div>
                <div class="private-card__field-value">${f.value}</div>
              </div>`
            )
            .join("")}
        </div>
      </div>`;

    if (window.StayLumaPinGate) {
      window.StayLumaPinGate.attach(document.getElementById("private-card"), p.private.pin);
    }
  }

  function renderWifi(p) {
    document.getElementById("wifi-network").textContent = p.wifi.network;
    document.getElementById("wifi-password").textContent = p.wifi.password;
    document.getElementById("wifi-note").textContent = p.wifi.note;

    document.querySelectorAll("[data-copy-target]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-copy-target");
        const text = document.getElementById(targetId).textContent;
        copyText(text, btn);
      });
    });
  }

  async function copyText(text, btn) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      // clipboard API unavailable — fail silently, still show intent via toast
    }
    if (btn) {
      const original = btn.textContent;
      btn.textContent = "Copied";
      btn.setAttribute("data-copied", "true");
      setTimeout(() => {
        btn.textContent = original;
        btn.removeAttribute("data-copied");
      }, 1400);
    }
    showToast("Copied to clipboard");
  }

  function renderRules(p) {
    const list = document.getElementById("rules-list");
    list.innerHTML = p.houseRules
      .map(
        (r) => `<li>
          <span class="rules__icon">${icon(r.icon)}</span>
          <span>
            <span class="rules__label">${r.label}</span>
            <span class="rules__detail">${r.detail}</span>
          </span>
        </li>`
      )
      .join("");
  }

  function renderAppliances(p) {
    const wrap = document.getElementById("appliances-list");
    wrap.innerHTML = p.appliances
      .map(
        (a) => `<details>
          <summary>
            <span class="accordion__icon">${icon(a.icon)}</span>
            <span class="summary-title"><span>${a.name}</span><span class="summary-sub">${a.summary}</span></span>
            ${icon("chevron", "chev")}
          </summary>
          <div class="accordion__body">
            <ul>${a.instructions.map((i) => `<li>${i}</li>`).join("")}</ul>
          </div>
        </details>`
      )
      .join("");
  }

  function renderEmergency(p) {
    const list = document.getElementById("emergency-list");
    list.innerHTML = p.emergency.numbers
      .map(
        (n) => `<li class="emergency__row">
          <span>${n.label}</span>
          ${n.telHref ? `<a href="${n.telHref}">${n.number}</a>` : `<span>${n.number}</span>`}
        </li>`
      )
      .join("");

    document.getElementById("host-contact-name").textContent = p.host.name;
    document.getElementById("host-contact-sub").textContent = p.host.responseNote;
    document.getElementById("host-call").href = `tel:${p.host.phoneTel}`;
    document.getElementById("host-whatsapp").href = `https://wa.me/${p.host.whatsapp}`;

    const cohost = p.emergency.cohost;
    document.getElementById("cohost-info").innerHTML =
      `<strong>${cohost.name}</strong> — ${cohost.note}: <a href="tel:${cohost.phoneTel}">${cohost.phoneDisplay}</a>`;
  }

  function renderLocalGuide(p) {
    const chipsWrap = document.getElementById("guide-chips");
    const listWrap = document.getElementById("guide-list");
    const categories = ["All", ...p.localGuide.categories];

    function draw(activeCat) {
      chipsWrap.innerHTML = categories
        .map((c) => `<button class="chip" type="button" data-cat="${c}" aria-pressed="${c === activeCat}">${c}</button>`)
        .join("");

      const items = activeCat === "All" ? p.localGuide.items : p.localGuide.items.filter((i) => i.category === activeCat);
      listWrap.innerHTML = items
        .map(
          (i) => `<div class="guide-item">
            <div class="guide-item__top">
              <span class="guide-item__name">${i.name}${mapLinkHtml(i.mapUrl, `${i.name}, ${p.location}`)}</span>
              <span class="guide-item__tag">${i.tag}</span>
            </div>
            <div class="guide-item__desc">${i.description}</div>
          </div>`
        )
        .join("");

      chipsWrap.querySelectorAll(".chip").forEach((chip) => {
        chip.addEventListener("click", () => draw(chip.getAttribute("data-cat")));
      });
    }

    draw("All");
  }

  function renderTransport(p) {
    const list = document.getElementById("transport-list");
    list.innerHTML = p.transport
      .map(
        (t) => `<li>
          <span class="transport-list__icon">${icon(t.icon)}</span>
          <span>
            <span class="transport-list__label">${t.label}</span>
            <span class="transport-list__detail">${t.detail}</span>
          </span>
        </li>`
      )
      .join("");
  }

  function renderFaq(p) {
    const wrap = document.getElementById("faq-list");
    wrap.innerHTML = p.faq
      .map(
        (f) => `<details>
          <summary><span>${f.q}</span>${icon("chevron", "chev")}</summary>
          <div class="accordion__body"><p>${f.a}</p></div>
        </details>`
      )
      .join("");
  }

  function renderQuickbar(p) {
    document.getElementById("quickbar-whatsapp").href = `https://wa.me/${p.host.whatsapp}`;
  }

  function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.setAttribute("data-show", "true");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.removeAttribute("data-show"), 1600);
  }

  function setupNav() {
    const nav = document.getElementById("section-nav");
    const pills = Array.from(nav.querySelectorAll(".navpill"));
    const sections = pills.map((p) => document.getElementById(p.getAttribute("data-target")));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          pills.forEach((pill) => {
            pill.setAttribute("aria-current", pill.getAttribute("data-target") === id ? "true" : "false");
          });
          const activePill = pills.find((pill) => pill.getAttribute("data-target") === id);
          if (activePill) activePill.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => s && observer.observe(s));

    pills.forEach((pill) => {
      pill.addEventListener("click", () => {
        const target = document.getElementById(pill.getAttribute("data-target"));
        if (target) target.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  function renderAll() {
    const p = window.PROPERTY;
    renderHero(p);
    renderCheckInOut(p);
    renderPrivate(p);
    renderWifi(p);
    renderRules(p);
    renderAppliances(p);
    renderEmergency(p);
    renderLocalGuide(p);
    renderTransport(p);
    renderFaq(p);
    renderQuickbar(p);
    setupNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderAll);
  } else {
    renderAll();
  }
})();
