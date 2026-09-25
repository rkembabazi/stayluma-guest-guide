/**
 * StayLuma sales landing page content + render logic. This is
 * marketing copy for the product itself, not property data — it
 * has nothing to do with js/data.js or the guide template.
 */
(function () {
  "use strict";
  const icon = window.StayLumaIcons.icon;

  const POINTS = [
    { icon: "key", title: "Check-in without a phone call", desc: "The exact door, the exact code, in order — not “call me when you get there.”" },
    { icon: "wifi", title: "Wifi they can actually copy", desc: "One tap copies the password. No squinting at a printed card taped to the fridge." },
    { icon: "rules", title: "The rules, said once, kindly", desc: "Quiet hours, shoes off, no smoking — written so you don't have to enforce them in person." },
    { icon: "lock", title: "Access codes, not broadcast", desc: "A lockbox or safe code sits behind a PIN, not sitting in a page search engines can index." },
    { icon: "printer", title: "A door that points the way", desc: "A QR code guests scan the moment they arrive — no “check your email” required." },
  ];

  const PACKAGES = ["Essential", "Signature", "Portfolio"];
  const PACKAGE_TAGS = ["One property", "One property, done for you", "Multiple properties"];
  const ROWS = [
    { label: "Full guest guide, all sections", cells: [true, true, true] },
    { label: "Mobile-first StayLuma design", cells: [true, true, true] },
    { label: "Printable QR door sign", cells: [true, true, true] },
    { label: "Content via our intake form", cells: [true, true, true] },
    { label: "We build &amp; polish it for you", cells: [false, true, true] },
    { label: "PIN-protected private section", cells: [false, true, true] },
    { label: "One round of revisions", cells: [false, true, true] },
    { label: "Consistent branding across listings", cells: [false, false, true] },
    { label: "One contact for every property", cells: [false, false, true] },
  ];

  const FAQ = [
    { q: "Do I need to know how to code?", a: "No — you fill out the intake form with your property's details and we handle the rest." },
    { q: "Can I update the guide later?", a: "Yes. Send us changes any time, or ask us how to edit it yourself if you're comfortable with that." },
    { q: "Is my guest's data stored anywhere?", a: "No accounts, no logins, no guest data collection — the guide is just a page your guests read." },
    { q: "How private is the access-code section really?", a: "It's hidden from casual view and search engines behind a PIN, but it isn't cryptographic security — it still lives on the page itself. Don't rely on it alone for anything highly sensitive." },
  ];

  function renderPoints() {
    document.getElementById("points-list").innerHTML = POINTS.map(
      (p) => `<div class="lp-point">
        <div class="lp-point__icon">${icon(p.icon)}</div>
        <div>
          <h3>${p.title}</h3>
          <p>${p.desc}</p>
        </div>
      </div>`
    ).join("");
  }

  function cell(has) {
    return has ? `<td>${icon("check")}</td>` : `<td>&mdash;</td>`;
  }

  function renderCompare() {
    const thead = `<thead><tr>
      <th></th>
      ${PACKAGES.map((name, i) => `<th class="${i === 1 ? "lp-compare--featured" : ""}">${name}<span class="lp-compare__tag">${PACKAGE_TAGS[i]}</span></th>`).join("")}
    </tr></thead>`;
    const tbody = `<tbody>${ROWS.map(
      (r) => `<tr>
        <td>${r.label}</td>
        ${r.cells.map((c, i) => (i === 1 ? cell(c).replace("<td>", `<td class="lp-compare--featured">`) : cell(c))).join("")}
      </tr>`
    ).join("")}</tbody>`;
    document.getElementById("compare-table").innerHTML = thead + tbody;
  }

  function renderFaq() {
    document.getElementById("lp-faq-list").innerHTML = FAQ.map(
      (f) => `<details>
        <summary><span>${f.q}</span>${icon("chevron", "chev")}</summary>
        <div class="lp-faq__body">${f.a}</div>
      </details>`
    ).join("");
  }

  renderPoints();
  renderCompare();
  renderFaq();
})();
