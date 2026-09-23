/**
 * Render engine — generic across any PROPERTY object shaped like
 * js/data.js. Nothing property-specific lives in this file.
 */
(function () {
  "use strict";

  const ICONS = {
    welcome: '<path d="M3 11l9-7 9 7"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"/>',
    key: '<circle cx="8" cy="14" r="4"/><path d="M11 11l9-9"/><path d="M16 6l3 3"/><path d="M13 9l2.5 2.5"/>',
    wifi: '<path d="M2 8.5a16 16 0 0 1 20 0"/><path d="M5.5 12a11 11 0 0 1 13 0"/><path d="M9 15.5a6 6 0 0 1 6 0"/><circle cx="12" cy="19" r="1.2" fill="currentColor" stroke="none"/>',
    rules: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8"/><path d="M8 12h8"/><path d="M8 16h5"/>',
    appliance: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h.01"/><path d="M8 11h.01"/><circle cx="14" cy="9" r="3"/>',
    phone: '<path d="M4 5a1 1 0 0 1 1-1h3l2 5-2 1.2a12 12 0 0 0 5.8 5.8L15 14l5 2v3a1 1 0 0 1-1 1C10.5 20 4 13.5 4 5z"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15 9l-2 6-6 2 2-6z"/>',
    transport: '<path d="M4 16V8a2 2 0 0 1 2-2h6l4 4h2a2 2 0 0 1 2 2v4"/><circle cx="7.5" cy="16.5" r="1.7"/><circle cx="17.5" cy="16.5" r="1.7"/><path d="M4 16h1.8M15.8 16h1.7"/>',
    faq: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.7-2.2 2-2.2 3.8"/><path d="M12 16.5h.01"/>',
    pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.4"/>',
    chevron: '<path d="M6 9l6 6 6-6"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    guests: '<circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="17.5" cy="9" r="2.4"/><path d="M15.5 19a4.5 4.5 0 0 1 6.5-4"/>',
    smoking: '<path d="M3 15h13"/><path d="M18 15h3"/><path d="M16 12c1.2-1 1.2-2 0-3"/><path d="M18.5 12.5c1.2-1 1.2-2.5 0-4"/>',
    party: '<path d="M4 20l3-11 12 5-11 6z"/><path d="M7 9l1-5"/><path d="M11 6l1.5-3"/><path d="M15 8l2.5-2.5"/>',
    quiet: '<path d="M9 9v6H5V9z"/><path d="M9 9l6-4v14l-6-4"/><path d="M18 9a4 4 0 0 1 0 6"/>',
    pets: '<circle cx="7" cy="8" r="1.6"/><circle cx="11.5" cy="5.5" r="1.6"/><circle cx="16" cy="8" r="1.6"/><circle cx="18" cy="12.5" r="1.6"/><path d="M8 20c-1.5-3 .5-6 3.5-6s5 3 3.5 6c-1 2-6 2-7 0z"/>',
    shoes: '<path d="M4 18v-3.5c0-1 .5-1.8 1.4-2.2L11 10l3-3 2.5 1c.9.35 1.5 1.2 1.5 2.2V18z"/><path d="M4 18h16"/>',
    rug: '<rect x="4" y="6" width="16" height="12" rx="1.5"/><rect x="7" y="9" width="10" height="6" rx="1"/>',
    recycle: '<path d="M7 9l-2.5 4.3 2 1.2"/><path d="M13 4.3L15.5 8.6l-2 1.2"/><path d="M17 15h2.9l-2 3.5"/><path d="M4.5 13.3L7 9l2 1.2M15.5 8.6L13 4.3l-2 1.2M20 18.5H15"/>',
    ac: '<rect x="3" y="6" width="18" height="7" rx="2"/><path d="M6 17l1.5-4M11 17l1-4M16 17l1.5-4"/>',
    stove: '<rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="9" cy="9" r="1.6"/><circle cx="15" cy="9" r="1.6"/><circle cx="9" cy="15" r="1.6"/><circle cx="15" cy="15" r="1.6"/>',
    water: '<path d="M12 3s6 7 6 11.5a6 6 0 0 1-12 0C6 10 12 3 12 3z"/>',
    laundry: '<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="13" r="5"/><circle cx="12" cy="13" r="2"/><circle cx="7" cy="6" r=".8" fill="currentColor" stroke="none"/>',
    coffee: '<path d="M5 9h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z"/><path d="M16 10.5h1.5a2 2 0 0 1 0 4H16"/><path d="M8 4c0 1-1.2 1-1.2 2M12 4c0 1-1.2 1-1.2 2"/>',
    tv: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M9 21h6"/>',
    plane: '<path d="M3 13l7-2 4-7 1.8.6-2 6.9 5.7-1.6 1.5 1-5.4 3.3.4 4-1.6.8-2-3.6-6.6 2z"/>',
    taxi: '<path d="M4 16V9.5l1.6-3.6A2 2 0 0 1 7.4 4.7h9.2a2 2 0 0 1 1.8 1.2L20 9.5V16"/><path d="M4 16h16v2.5a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1V17h-9v1.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><circle cx="7.5" cy="12.5" r=".9" fill="currentColor" stroke="none"/><circle cx="16.5" cy="12.5" r=".9" fill="currentColor" stroke="none"/>',
    tuktuk: '<circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/><path d="M4 17.5V11a2 2 0 0 1 2-2h7l4 4v4.5"/><path d="M6 9l2-3h5"/>',
    ferry: '<path d="M4 14l1.5 5c.2.6.8 1 1.4 1h10.2c.6 0 1.2-.4 1.4-1L20 14"/><path d="M6 14V6h9l3 4"/><path d="M4 14h16"/>',
    walk: '<circle cx="13" cy="4.5" r="1.7"/><path d="M10 21l2-6 2 2 2 4"/><path d="M9 13l2-3 2.5 1 2.5-1.5"/><path d="M11 10L9 8"/>',
    parking: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M10 16V8h3a2.5 2.5 0 0 1 0 5h-3"/>',
    whatsapp: '<path d="M6 20l1.2-3.5A7.5 7.5 0 1 1 10 18.6z"/><path d="M9 9.3c0 3 2.7 5.7 5.7 5.7.5 0 .9-.4.9-1v-.7c0-.3-.2-.6-.5-.7l-1.6-.6c-.3-.1-.6 0-.7.3l-.3.5a5 5 0 0 1-2.1-2.1l.5-.3c.3-.2.4-.5.3-.7l-.6-1.6c-.1-.3-.4-.5-.7-.5H9c-.6 0-1 .4-1 .9z" fill="currentColor" stroke="none"/>',
  };

  function icon(name, cls) {
    return `<svg class="${cls || ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
  }

  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function heroArt() {
    return `
    <svg viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustration of Stone Town rooftops at dusk">
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
    document.getElementById("hero-art").innerHTML = heroArt();
    document.getElementById("hero-location").innerHTML = `${icon("pin")}<span>${p.location}</span>`;
    document.getElementById("hero-title").textContent = p.name;
    document.getElementById("hero-tagline").textContent = p.tagline;
    document.getElementById("hero-meta").textContent = p.sleeps;
    document.getElementById("topbar-property").textContent = p.name;
    document.title = `${p.name} — Guest Guide`;

    document.getElementById("host-initials").textContent = p.host.initials;
    document.getElementById("host-quote").textContent = p.host.message;
    document.getElementById("host-byline").textContent = `${p.host.signoff} · ${p.host.responseNote}`;
  }

  function renderCheckInOut(p) {
    document.getElementById("checkin-window").textContent = p.checkIn.window;
    document.getElementById("checkin-sub").textContent = p.checkIn.subtitle;
    document.getElementById("checkout-time").textContent = p.checkOut.time;
    document.getElementById("checkout-sub").textContent = "Please leave by this time";

    const addr = document.getElementById("property-address");
    addr.innerHTML = `${icon("pin")}<span>${p.address}</span>`;

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
              <span class="guide-item__name">${i.name}</span>
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
