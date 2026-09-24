/**
 * StayLuma sales landing page content + render logic. This is
 * marketing copy for the product itself, not property data — it
 * has nothing to do with js/data.js or the guide template.
 */
(function () {
  "use strict";
  const icon = window.StayLumaIcons.icon;

  const FEATURES = [
    { icon: "welcome", title: "One link, every answer", desc: "Check-in, wifi, rules, appliances, contacts, local tips — a guest finds it themselves instead of texting you." },
    { icon: "wifi", title: "Built for a phone", desc: "Sticky navigation, big tap targets, works on a slow hotel wifi connection just as well as at home." },
    { icon: "lock", title: "Keep access details private", desc: "Lockbox codes and other sensitive info can sit behind a simple PIN, out of the public page." },
    { icon: "compass", title: "Your local knowledge, packaged", desc: "The recommendations only a host would know — restaurants, transport, the things guests actually ask." },
    { icon: "printer", title: "A sign for the door", desc: "Every guide comes with a print-ready QR code guests can scan the moment they arrive." },
    { icon: "faq", title: "Fewer 11pm messages", desc: "The questions that usually land in your inbox are already answered, before they're asked." },
  ];

  const PACKAGES = [
    {
      name: "Essential",
      tag: "One property",
      desc: "Everything in the demo you just saw, built around your property.",
      features: ["Full guest guide, all sections", "Mobile-first StayLuma design", "Printable QR door sign", "You provide the content via our intake form"],
      featured: false,
    },
    {
      name: "Signature",
      tag: "One property, done for you",
      desc: "The same guide, with us handling the setup and polish.",
      features: ["Everything in Essential", "PIN-protected private access section", "We build the guide from your intake form", "One round of revisions with you"],
      featured: true,
    },
    {
      name: "Portfolio",
      tag: "Multiple properties",
      desc: "For hosts and managers running more than one listing.",
      features: ["Everything in Signature", "Consistent branding across all guides", "One point of contact for updates", "Volume-friendly onboarding"],
      featured: false,
    },
  ];

  const FAQ = [
    { q: "Do I need to know how to code?", a: "No — you fill out the intake form with your property's details and we handle the rest." },
    { q: "Can I update the guide later?", a: "Yes. Send us changes any time, or ask us how to edit it yourself if you're comfortable with that." },
    { q: "Is my guest's data stored anywhere?", a: "No accounts, no logins, no guest data collection — the guide is just a page your guests read." },
    { q: "How private is the access-code section really?", a: "It's hidden from casual view and search engines behind a PIN, but it isn't cryptographic security — it still lives on the page itself. Don't rely on it alone for anything highly sensitive." },
  ];

  function renderFeatures() {
    document.getElementById("features-grid").innerHTML = FEATURES.map(
      (f) => `<div class="lp-feature">
        <div class="lp-feature__icon">${icon(f.icon)}</div>
        <h3>${f.title}</h3>
        <p>${f.desc}</p>
      </div>`
    ).join("");
  }

  function renderPackages() {
    document.getElementById("packages-grid").innerHTML = PACKAGES.map(
      (p) => `<div class="lp-package ${p.featured ? "lp-package--featured" : ""}">
        <div class="lp-package__name">${p.name}</div>
        <div class="lp-package__tag">${p.tag}</div>
        <p class="lp-package__desc">${p.desc}</p>
        <ul class="lp-package__list">
          ${p.features.map((f) => `<li>${icon("check")}<span>${f}</span></li>`).join("")}
        </ul>
        <a class="btn ${p.featured ? "btn--primary" : "btn--ghost"}" href="mailto:stayluma2@gmail.com?subject=${encodeURIComponent("StayLuma " + p.name + " enquiry")}">Ask about ${p.name}</a>
      </div>`
    ).join("");
  }

  function renderFaq() {
    document.getElementById("lp-faq-list").innerHTML = FAQ.map(
      (f) => `<details>
        <summary><span>${f.q}</span>${icon("chevron", "chev")}</summary>
        <div class="lp-faq__body">${f.a}</div>
      </details>`
    ).join("");
  }

  renderFeatures();
  renderPackages();
  renderFaq();
})();
