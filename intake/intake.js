/**
 * StayLuma host intake wizard.
 *
 * There is no backend: "submitting" serializes the answers into a
 * data.js file (matching template/data.template.js's shape) and
 * triggers a download. Placing that file into properties/<slug>/
 * and adding the actual photo files is a manual step — see
 * docs/adding-a-new-property.md.
 *
 * Draft answers autosave to localStorage on this device only
 * (DRAFT_KEY) so an incomplete form can be resumed later in the
 * same browser. Photo *files* are never persisted (browsers can't
 * serialize File objects to localStorage) — only their filenames,
 * so a resumed draft shows the picked filename but the preview
 * won't reappear until the file is re-selected.
 */
(function () {
  "use strict";
  const icon = window.StayLumaIcons.icon;
  const DRAFT_KEY = "stayluma-intake-draft-v1";

  // ---------- state ----------

  function blankState() {
    return {
      name: "", tagline: "", location: "", address: "", mapUrl: "", sleeps: "",
      photos: { hero: "" },
      host: { name: "", initials: "", photo: "", message: "", signoff: "", responseNote: "", phoneDisplay: "", phoneTel: "", whatsapp: "" },
      checkIn: { window: "", subtitle: "", lateNote: "", steps: [""] },
      checkOut: { time: "", steps: [""] },
      private: { enabled: false, pin: "", fields: [] },
      wifi: { network: "", password: "", note: "" },
      houseRules: [{ icon: "guests", label: "", detail: "" }],
      appliances: [{ icon: "ac", name: "", summary: "", instructions: [""] }],
      emergency: {
        numbers: [{ label: "", number: "", telHref: "" }],
        cohost: { name: "", note: "", phoneDisplay: "", phoneTel: "" },
      },
      localGuide: { categoriesRaw: "Eat, Sip & shop, Do", items: [{ category: "Eat", name: "", description: "", tag: "", mapUrl: "" }] },
      transport: [{ icon: "plane", label: "", detail: "" }],
      faq: [{ q: "", a: "" }],
    };
  }

  let state = blankState();
  let currentStepIndex = 0;
  const completedSteps = new Set();

  function getPath(obj, path) {
    return path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
  }
  function setPath(obj, path, value) {
    const keys = path.split(".");
    let cur = obj;
    for (let i = 0; i < keys.length - 1; i += 1) cur = cur[keys[i]];
    cur[keys[keys.length - 1]] = value;
  }

  // ---------- persistence ----------

  let saveTimer = null;
  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ state, currentStepIndex }));
      } catch (e) {
        // localStorage unavailable (private window, quota, etc.) — draft simply won't persist
      }
    }, 400);
  }

  function loadDraft() {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) {}
  }

  // ---------- validation helpers ----------

  const PHONE_RE = /^\+?[0-9()\-\s]{7,20}$/;
  const URL_RE = /^https?:\/\/.+\..+/;

  function isBlank(v) { return v === undefined || v === null || String(v).trim() === ""; }

  // ---------- repeatable list helpers ----------

  function addRow(path, blankItem) {
    const arr = getPath(state, path);
    arr.push(blankItem());
    renderStep();
    scheduleSave();
  }
  function removeRow(path, index) {
    const arr = getPath(state, path);
    if (arr.length <= 1) return;
    arr.splice(index, 1);
    renderStep();
    scheduleSave();
  }

  function stringListField(path, label, placeholder) {
    const arr = getPath(state, path);
    return `
      <div class="ik-field">
        <label>${label}</label>
        <div class="ik-repeat">
          ${arr
            .map(
              (val, i) => `<div class="ik-repeat__item">
                ${arr.length > 1 ? `<button type="button" class="ik-repeat__remove" data-remove-row="${path}" data-index="${i}">Remove</button>` : ""}
                <input type="text" data-path="${path}.${i}" value="${escapeAttr(val)}" placeholder="${placeholder}" />
              </div>`
            )
            .join("")}
        </div>
        <button type="button" class="ik-repeat__add" data-add-row="${path}" data-kind="string">+ Add another step</button>
      </div>`;
  }

  function escapeAttr(v) {
    return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }

  function field({ path, label, hint, type = "text", placeholder = "", options = null, textarea = false }) {
    const value = getPath(state, path);
    let control;
    if (options) {
      control = `<select data-path="${path}">${options
        .map((o) => `<option value="${o.value}" ${o.value === value ? "selected" : ""}>${o.label}</option>`)
        .join("")}</select>`;
    } else if (textarea) {
      control = `<textarea data-path="${path}" placeholder="${placeholder}">${value == null ? "" : escapeHtml(value)}</textarea>`;
    } else {
      control = `<input type="${type}" data-path="${path}" value="${escapeAttr(value)}" placeholder="${placeholder}" />`;
    }
    return `
      <div class="ik-field" data-field-wrap="${path}">
        <label>${label}${hint ? `<span class="ik-hint">${hint}</span>` : ""}</label>
        ${control}
        <div class="ik-field__error"></div>
      </div>`;
  }

  function escapeHtml(v) {
    return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  const ICON_OPTIONS = {
    rule: ["guests", "smoking", "party", "quiet", "pets", "shoes", "rug", "recycle"],
    appliance: ["ac", "stove", "water", "laundry", "coffee", "tv"],
    transport: ["plane", "taxi", "tuktuk", "ferry", "walk", "parking"],
  };
  function iconOptions(kind) {
    return ICON_OPTIONS[kind].map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) }));
  }

  // ---------- steps ----------

  const STEPS = [
    {
      id: "basics",
      label: "Basics",
      title: "Property basics",
      intro: "The essentials every guide needs.",
      render: () => `
        ${field({ path: "name", label: "Property name*", placeholder: "e.g. Casa Baraza" })}
        ${field({ path: "tagline", label: "One-line tagline*", placeholder: "A sentence that sells the stay" })}
        ${field({ path: "location", label: "Location*", placeholder: "Neighbourhood, City, Country" })}
        ${field({ path: "address", label: "Full address*", placeholder: "Street address" })}
        ${field({ path: "mapUrl", label: "Google Maps link", hint: "Optional — leave blank and we'll generate one from the address", type: "url", placeholder: "https://maps.google.com/..." })}
        ${field({ path: "sleeps", label: "Capacity*", placeholder: "Sleeps 4 · 2 bedrooms · 1 bath" })}
      `,
      validate: () => {
        const errors = {};
        ["name", "tagline", "location", "address", "sleeps"].forEach((p) => {
          if (isBlank(getPath(state, p))) errors[p] = "This field is required.";
        });
        if (!isBlank(state.mapUrl) && !URL_RE.test(state.mapUrl.trim())) errors.mapUrl = "Enter a full URL starting with https://";
        return errors;
      },
    },
    {
      id: "branding",
      label: "Branding",
      title: "Branding and photographs",
      intro: "A hero photo and a host photo make the guide feel personal. Both are optional — the guide has a built-in illustration and a monogram if you skip them.",
      render: () => `
        ${field({ path: "host.initials", label: "Host initials*", hint: "Shown if there's no host photo, e.g. “AS”", placeholder: "AS" })}
        <div class="ik-field">
          <label>Hero photo<span class="ik-hint">JPG, PNG or WEBP</span></label>
          <input type="file" accept=".jpg,.jpeg,.png,.webp" data-photo="photos.hero" />
          <img class="ik-photo-preview" id="preview-hero" alt="" />
          <div class="ik-field__error" id="error-photos.hero"></div>
        </div>
        <div class="ik-field">
          <label>Host photo<span class="ik-hint">JPG, PNG or WEBP</span></label>
          <input type="file" accept=".jpg,.jpeg,.png,.webp" data-photo="host.photo" />
          <img class="ik-photo-preview" id="preview-host.photo" alt="" />
          <div class="ik-field__error" id="error-host.photo"></div>
        </div>
        <p class="ik-step__intro">Photos can't be uploaded from this form (there's no server behind it) — picking one here just validates the format and remembers the filename. You'll still need to send us the actual image file, or drop it into the property's <code>photos/</code> folder yourself.</p>
      `,
      validate: () => {
        const errors = {};
        if (isBlank(state.host.initials)) errors["host.initials"] = "This field is required.";
        return errors;
      },
    },
    {
      id: "arrival",
      label: "Arrival",
      title: "Arrival and departure",
      intro: "How a guest gets in, and what they should do before they leave.",
      render: () => `
        ${field({ path: "checkIn.window", label: "Check-in window*", placeholder: "3:00 PM – 9:00 PM" })}
        ${field({ path: "checkIn.subtitle", label: "Check-in subtitle", placeholder: "e.g. Self check-in, no one to wait for" })}
        ${stringListField("checkIn.steps", "Check-in steps*", "e.g. Find the blue door...")}
        ${field({ path: "checkIn.lateNote", label: "Late arrival note", textarea: true, placeholder: "What should a guest do if arriving late?" })}
        ${field({ path: "checkOut.time", label: "Check-out time*", placeholder: "11:00 AM" })}
        ${stringListField("checkOut.steps", "Check-out steps*", "e.g. Strip the beds...")}
        <div class="ik-field">
          <label><input type="checkbox" id="private-enabled" ${state.private.enabled ? "checked" : ""} /> This property has private access details to hide behind a PIN (e.g. a safe code)</label>
        </div>
        ${state.private.enabled ? renderPrivateFields() : ""}
      `,
      validate: () => {
        const errors = {};
        if (isBlank(state.checkIn.window)) errors["checkIn.window"] = "This field is required.";
        if (isBlank(state.checkOut.time)) errors["checkOut.time"] = "This field is required.";
        state.checkIn.steps.forEach((s, i) => { if (isBlank(s)) errors[`checkIn.steps.${i}`] = "Fill this in or remove it."; });
        state.checkOut.steps.forEach((s, i) => { if (isBlank(s)) errors[`checkOut.steps.${i}`] = "Fill this in or remove it."; });
        if (state.private.enabled) {
          if (isBlank(state.private.pin)) errors["private.pin"] = "Set a PIN, or turn off the private section.";
          state.private.fields.forEach((f, i) => {
            if (isBlank(f.label)) errors[`private.fields.${i}.label`] = "Label is required.";
            if (isBlank(f.value)) errors[`private.fields.${i}.value`] = "Value is required.";
          });
        }
        return errors;
      },
    },
    {
      id: "wifi-rules",
      label: "Wifi & rules",
      title: "Wi-Fi and house rules",
      intro: "",
      render: () => `
        ${field({ path: "wifi.network", label: "Wifi network name*" })}
        ${field({ path: "wifi.password", label: "Wifi password*" })}
        ${field({ path: "wifi.note", label: "Router note", placeholder: "Where it is, how to reset it" })}
        <div class="ik-field">
          <label>House rules*</label>
          <div class="ik-repeat">
            ${state.houseRules
              .map(
                (r, i) => `<div class="ik-repeat__item">
                  ${state.houseRules.length > 1 ? `<button type="button" class="ik-repeat__remove" data-remove-row="houseRules" data-index="${i}">Remove</button>` : ""}
                  ${field({ path: `houseRules.${i}.icon`, label: "Icon", options: iconOptions("rule") })}
                  ${field({ path: `houseRules.${i}.label`, label: "Rule*", placeholder: "e.g. No smoking indoors" })}
                  ${field({ path: `houseRules.${i}.detail`, label: "Detail", placeholder: "One line of context" })}
                </div>`
              )
              .join("")}
          </div>
          <button type="button" class="ik-repeat__add" data-add-row="houseRules" data-kind="rule">+ Add another rule</button>
        </div>
      `,
      validate: () => {
        const errors = {};
        if (isBlank(state.wifi.network)) errors["wifi.network"] = "This field is required.";
        if (isBlank(state.wifi.password)) errors["wifi.password"] = "This field is required.";
        state.houseRules.forEach((r, i) => { if (isBlank(r.label)) errors[`houseRules.${i}.label`] = "Required."; });
        return errors;
      },
    },
    {
      id: "appliances",
      label: "Appliances",
      title: "Appliances and amenities",
      intro: "",
      render: () => `
        <div class="ik-field">
          <label>Key appliances*</label>
          <div class="ik-repeat">
            ${state.appliances
              .map(
                (a, i) => `<div class="ik-repeat__item">
                  ${state.appliances.length > 1 ? `<button type="button" class="ik-repeat__remove" data-remove-row="appliances" data-index="${i}">Remove</button>` : ""}
                  ${field({ path: `appliances.${i}.icon`, label: "Icon", options: iconOptions("appliance") })}
                  ${field({ path: `appliances.${i}.name`, label: "Name*", placeholder: "e.g. Air conditioning" })}
                  ${field({ path: `appliances.${i}.summary`, label: "One-line summary", placeholder: "Shown collapsed" })}
                  <div class="ik-field">
                    <label>Instructions*</label>
                    <div class="ik-repeat">
                      ${a.instructions
                        .map(
                          (ins, j) => `<div class="ik-repeat__item">
                            ${a.instructions.length > 1 ? `<button type="button" class="ik-repeat__remove" data-remove-instruction="${i}" data-index="${j}">Remove</button>` : ""}
                            <input type="text" data-path="appliances.${i}.instructions.${j}" value="${escapeAttr(ins)}" placeholder="Step or tip" />
                          </div>`
                        )
                        .join("")}
                    </div>
                    <button type="button" class="ik-repeat__add" data-add-instruction="${i}">+ Add instruction</button>
                  </div>
                </div>`
              )
              .join("")}
          </div>
          <button type="button" class="ik-repeat__add" data-add-row="appliances" data-kind="appliance">+ Add another appliance</button>
        </div>
      `,
      validate: () => {
        const errors = {};
        state.appliances.forEach((a, i) => {
          if (isBlank(a.name)) errors[`appliances.${i}.name`] = "Required.";
          a.instructions.forEach((ins, j) => { if (isBlank(ins)) errors[`appliances.${i}.instructions.${j}`] = "Fill this in or remove it."; });
        });
        return errors;
      },
    },
    {
      id: "contacts",
      label: "Contacts",
      title: "Host and emergency contacts",
      intro: "",
      render: () => `
        ${field({ path: "host.name", label: "Host name*" })}
        ${field({ path: "host.message", label: "Welcome message*", textarea: true, placeholder: "A short, personal welcome in your own voice" })}
        ${field({ path: "host.signoff", label: "Sign-off", placeholder: "e.g. — Amina" })}
        ${field({ path: "host.responseNote", label: "Response time note", placeholder: "Usually replies within the hour, 7am–10pm" })}
        <div class="ik-row">
          ${field({ path: "host.phoneDisplay", label: "Phone (shown to guests)*", type: "tel", placeholder: "+255 777 123 456" })}
          ${field({ path: "host.phoneTel", label: "Phone (for tap-to-call)*", type: "tel", hint: "Same number, digits only after the +", placeholder: "+255777123456" })}
        </div>
        ${field({ path: "host.whatsapp", label: "WhatsApp number*", type: "tel", hint: "Digits only, no +", placeholder: "255777123456" })}
        <div class="ik-field">
          <label>Emergency numbers*</label>
          <div class="ik-repeat">
            ${state.emergency.numbers
              .map(
                (n, i) => `<div class="ik-repeat__item">
                  ${state.emergency.numbers.length > 1 ? `<button type="button" class="ik-repeat__remove" data-remove-row="emergency.numbers" data-index="${i}">Remove</button>` : ""}
                  ${field({ path: `emergency.numbers.${i}.label`, label: "Label*", placeholder: "e.g. Police" })}
                  ${field({ path: `emergency.numbers.${i}.number`, label: "Number or note*", placeholder: "e.g. 999, or “Mnazi Mmoja Hospital · 10 min”" })}
                </div>`
              )
              .join("")}
          </div>
          <button type="button" class="ik-repeat__add" data-add-row="emergency.numbers" data-kind="emergencyNumber">+ Add another number</button>
        </div>
        <div class="ik-row">
          ${field({ path: "emergency.cohost.name", label: "Backup contact name" })}
          ${field({ path: "emergency.cohost.note", label: "When to use them", placeholder: "e.g. For anything urgent after 10pm" })}
        </div>
        <div class="ik-row">
          ${field({ path: "emergency.cohost.phoneDisplay", label: "Backup phone (shown)", type: "tel" })}
          ${field({ path: "emergency.cohost.phoneTel", label: "Backup phone (tap-to-call)", type: "tel" })}
        </div>
      `,
      validate: () => {
        const errors = {};
        ["host.name", "host.message"].forEach((p) => { if (isBlank(getPath(state, p))) errors[p] = "This field is required."; });
        ["host.phoneDisplay", "host.phoneTel"].forEach((p) => {
          const v = getPath(state, p);
          if (isBlank(v)) errors[p] = "This field is required.";
          else if (!PHONE_RE.test(v.trim())) errors[p] = "That doesn't look like a valid phone number.";
        });
        if (isBlank(state.host.whatsapp)) errors["host.whatsapp"] = "This field is required.";
        else if (!/^[0-9]{7,15}$/.test(state.host.whatsapp.trim())) errors["host.whatsapp"] = "Digits only, no + or spaces.";
        state.emergency.numbers.forEach((n, i) => {
          if (isBlank(n.label)) errors[`emergency.numbers.${i}.label`] = "Required.";
          if (isBlank(n.number)) errors[`emergency.numbers.${i}.number`] = "Required.";
        });
        return errors;
      },
    },
    {
      id: "local",
      label: "Local guide",
      title: "Local recommendations",
      intro: "Restaurants, shops, experiences — the things only a host would know.",
      render: () => `
        ${field({ path: "localGuide.categoriesRaw", label: "Categories*", hint: "Comma-separated, e.g. Eat, Sip & shop, Do" })}
        <div class="ik-field">
          <label>Recommendations*</label>
          <div class="ik-repeat">
            ${state.localGuide.items
              .map(
                (it, i) => `<div class="ik-repeat__item">
                  ${state.localGuide.items.length > 1 ? `<button type="button" class="ik-repeat__remove" data-remove-row="localGuide.items" data-index="${i}">Remove</button>` : ""}
                  ${field({ path: `localGuide.items.${i}.category`, label: "Category*", placeholder: "Must match one of the categories above" })}
                  ${field({ path: `localGuide.items.${i}.name`, label: "Name*" })}
                  ${field({ path: `localGuide.items.${i}.description`, label: "One-line description" })}
                  ${field({ path: `localGuide.items.${i}.tag`, label: "Tag", placeholder: "e.g. 4 min walk · cash only" })}
                  ${field({ path: `localGuide.items.${i}.mapUrl`, label: "Map link", hint: "Optional — auto-generated from the name if left blank", type: "url" })}
                </div>`
              )
              .join("")}
          </div>
          <button type="button" class="ik-repeat__add" data-add-row="localGuide.items" data-kind="localGuideItem">+ Add another place</button>
        </div>
      `,
      validate: () => {
        const errors = {};
        if (isBlank(state.localGuide.categoriesRaw)) errors["localGuide.categoriesRaw"] = "Required.";
        state.localGuide.items.forEach((it, i) => {
          if (isBlank(it.name)) errors[`localGuide.items.${i}.name`] = "Required.";
          if (isBlank(it.category)) errors[`localGuide.items.${i}.category`] = "Required.";
          if (!isBlank(it.mapUrl) && !URL_RE.test(it.mapUrl.trim())) errors[`localGuide.items.${i}.mapUrl`] = "Enter a full URL starting with https://";
        });
        return errors;
      },
    },
    {
      id: "transport",
      label: "Transport",
      title: "Transport",
      intro: "",
      render: () => `
        <div class="ik-field">
          <label>Transport information*</label>
          <div class="ik-repeat">
            ${state.transport
              .map(
                (t, i) => `<div class="ik-repeat__item">
                  ${state.transport.length > 1 ? `<button type="button" class="ik-repeat__remove" data-remove-row="transport" data-index="${i}">Remove</button>` : ""}
                  ${field({ path: `transport.${i}.icon`, label: "Icon", options: iconOptions("transport") })}
                  ${field({ path: `transport.${i}.label`, label: "Headline*", placeholder: "e.g. From the airport" })}
                  ${field({ path: `transport.${i}.detail`, label: "Detail", textarea: true })}
                </div>`
              )
              .join("")}
          </div>
          <button type="button" class="ik-repeat__add" data-add-row="transport" data-kind="transport">+ Add another entry</button>
        </div>
      `,
      validate: () => {
        const errors = {};
        state.transport.forEach((t, i) => { if (isBlank(t.label)) errors[`transport.${i}.label`] = "Required."; });
        return errors;
      },
    },
    {
      id: "faq",
      label: "FAQs",
      title: "Frequently asked questions",
      intro: "",
      render: () => `
        <div class="ik-field">
          <label>FAQs*</label>
          <div class="ik-repeat">
            ${state.faq
              .map(
                (f, i) => `<div class="ik-repeat__item">
                  ${state.faq.length > 1 ? `<button type="button" class="ik-repeat__remove" data-remove-row="faq" data-index="${i}">Remove</button>` : ""}
                  ${field({ path: `faq.${i}.q`, label: "Question*" })}
                  ${field({ path: `faq.${i}.a`, label: "Answer*", textarea: true })}
                </div>`
              )
              .join("")}
          </div>
          <button type="button" class="ik-repeat__add" data-add-row="faq" data-kind="faq">+ Add another question</button>
        </div>
      `,
      validate: () => {
        const errors = {};
        state.faq.forEach((f, i) => {
          if (isBlank(f.q)) errors[`faq.${i}.q`] = "Required.";
          if (isBlank(f.a)) errors[`faq.${i}.a`] = "Required.";
        });
        return errors;
      },
    },
    {
      id: "review",
      label: "Review",
      title: "Review and submit",
      intro: "Check everything over, then download your property's data file.",
      render: () => renderReview(),
      validate: () => ({}),
    },
  ];

  function renderPrivateFields() {
    return `
      ${field({ path: "private.pin", label: "PIN*", hint: "A simple code you'll share with guests directly" })}
      <div class="ik-field">
        <label>Private fields*</label>
        <div class="ik-repeat">
          ${state.private.fields
            .map(
              (f, i) => `<div class="ik-repeat__item">
                <button type="button" class="ik-repeat__remove" data-remove-row="private.fields" data-index="${i}">Remove</button>
                ${field({ path: `private.fields.${i}.label`, label: "Label*", placeholder: "e.g. Safe code" })}
                ${field({ path: `private.fields.${i}.value`, label: "Value*" })}
              </div>`
            )
            .join("")}
        </div>
        <button type="button" class="ik-repeat__add" data-add-row="private.fields" data-kind="privateField">+ Add another private field</button>
      </div>
      <p class="ik-step__intro">This is hidden from the visible page behind a PIN, but it isn't real security — the value still ships inside the page's own code. Don't use it for anything you can't afford a technical visitor to see.</p>
    `;
  }

  function renderReview() {
    const p = buildPropertyObject();
    return `
      <div class="ik-review">
        <h3>Property</h3>
        <dl>
          <dt>Name</dt><dd>${escapeHtml(p.name)}</dd>
          <dt>Location</dt><dd>${escapeHtml(p.location)}</dd>
          <dt>Sleeps</dt><dd>${escapeHtml(p.sleeps)}</dd>
        </dl>
        <h3>Host</h3>
        <dl>
          <dt>Name</dt><dd>${escapeHtml(p.host.name)}</dd>
          <dt>Phone</dt><dd>${escapeHtml(p.host.phoneDisplay)}</dd>
        </dl>
        <h3>Content</h3>
        <dl>
          <dt>House rules</dt><dd>${p.houseRules.length}</dd>
          <dt>Appliances</dt><dd>${p.appliances.length}</dd>
          <dt>Local recommendations</dt><dd>${p.localGuide.items.length}</dd>
          <dt>Transport entries</dt><dd>${p.transport.length}</dd>
          <dt>FAQs</dt><dd>${p.faq.length}</dd>
          <dt>Private section</dt><dd>${state.private.enabled ? "Yes, PIN-protected" : "Not used"}</dd>
        </dl>
      </div>
      <button type="button" class="ik-download-btn" id="ik-download">${icon("copy")}Download data.js</button>
      <div class="ik-success" id="ik-download-success" hidden>
        Downloaded <strong id="ik-download-filename"></strong>. Place it at <code id="ik-download-path"></code> in the repo (see <em>docs/adding-a-new-property.md</em>), add any photo files to that same folder's <code>photos/</code>, then deploy.
      </div>
    `;
  }

  function slugify(name) {
    return (name || "property")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "property";
  }

  function buildPropertyObject() {
    const categories = state.localGuide.categoriesRaw.split(",").map((c) => c.trim()).filter(Boolean);
    const out = {
      brand: { name: "StayLuma" },
      name: state.name,
      tagline: state.tagline,
      location: state.location,
      address: state.address,
      mapUrl: state.mapUrl,
      sleeps: state.sleeps,
      photos: { hero: state.photos.hero },
      host: { ...state.host },
      checkIn: { ...state.checkIn },
      checkOut: { ...state.checkOut },
      wifi: { ...state.wifi },
      houseRules: state.houseRules.map((r) => ({ ...r })),
      appliances: state.appliances.map((a) => ({ ...a, instructions: [...a.instructions] })),
      emergency: {
        numbers: state.emergency.numbers.map((n) => {
          const digitsOnly = (n.number || "").replace(/[^0-9]/g, "");
          const looksLikePhone = digitsOnly.length >= 3 && digitsOnly.length <= 15 && /^[0-9+\s()-]+$/.test((n.number || "").trim());
          return { label: n.label, number: n.number, telHref: looksLikePhone ? `tel:${digitsOnly}` : null };
        }),
        cohost: { ...state.emergency.cohost },
      },
      localGuide: { categories, items: state.localGuide.items.map((i) => ({ ...i })) },
      transport: state.transport.map((t) => ({ ...t })),
      faq: state.faq.map((f) => ({ ...f })),
    };
    if (state.private.enabled) {
      out.private = { pin: state.private.pin, fields: state.private.fields.map((f) => ({ ...f })) };
    }
    return out;
  }

  function serializeDataJs(p) {
    return `window.PROPERTY = ${JSON.stringify(p, null, 2)};\n`;
  }

  // ---------- rendering / navigation ----------

  const stepnavEl = document.getElementById("ik-stepnav");
  const stepContentEl = document.getElementById("ik-step-content");
  const stepLabelEl = document.getElementById("ik-step-label");
  const progressBarEl = document.getElementById("ik-progress-bar");
  const backBtn = document.getElementById("ik-back");
  const nextBtn = document.getElementById("ik-next");
  const formEl = document.getElementById("ik-form");

  function renderStepnav() {
    stepnavEl.innerHTML = STEPS.map(
      (s, i) => `<button type="button" class="ik-stepnav__item" data-goto="${i}" aria-current="${i === currentStepIndex}" data-done="${completedSteps.has(i)}">${i + 1}. ${s.label}</button>`
    ).join("");
  }

  function renderStep() {
    const step = STEPS[currentStepIndex];
    stepLabelEl.textContent = `Step ${currentStepIndex + 1} of ${STEPS.length}`;
    progressBarEl.style.width = `${((currentStepIndex + 1) / STEPS.length) * 100}%`;
    stepContentEl.innerHTML = `<h2>${step.title}</h2>${step.intro ? `<p class="ik-step__intro">${step.intro}</p>` : ""}${step.render()}`;
    backBtn.disabled = currentStepIndex === 0;
    nextBtn.textContent = currentStepIndex === STEPS.length - 1 ? "Done" : "Continue";
    renderStepnav();
    restorePhotoPreviews();
  }

  function restorePhotoPreviews() {
    ["photos.hero", "host.photo"].forEach((path) => {
      const val = getPath(state, path);
      const previewId = `preview-${path}`;
      const previewEl = document.getElementById(previewId);
      if (previewEl && val && state._photoDataUrls && state._photoDataUrls[path]) {
        previewEl.src = state._photoDataUrls[path];
        previewEl.setAttribute("data-show", "true");
      }
    });
  }

  function showErrors(errors) {
    stepContentEl.querySelectorAll("[data-field-wrap]").forEach((el) => {
      el.setAttribute("data-invalid", "false");
      el.querySelector(".ik-field__error").textContent = "";
    });
    Object.keys(errors).forEach((path) => {
      const wrap = stepContentEl.querySelector(`[data-field-wrap="${cssEscape(path)}"]`);
      if (wrap) {
        wrap.setAttribute("data-invalid", "true");
        wrap.querySelector(".ik-field__error").textContent = errors[path];
      } else {
        // photo or nested error without a standard wrapper
        const errEl = document.getElementById(`error-${path}`);
        if (errEl) errEl.textContent = errors[path];
      }
    });
    const firstInvalid = stepContentEl.querySelector('[data-invalid="true"]');
    if (firstInvalid) firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function cssEscape(s) {
    return s.replace(/[."[\]]/g, "\\$&");
  }

  function goToStep(index) {
    currentStepIndex = Math.max(0, Math.min(STEPS.length - 1, index));
    renderStep();
    scheduleSave();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  nextBtn.addEventListener("click", () => {
    const step = STEPS[currentStepIndex];
    const errors = step.validate();
    if (Object.keys(errors).length) {
      showErrors(errors);
      return;
    }
    completedSteps.add(currentStepIndex);
    if (currentStepIndex < STEPS.length - 1) goToStep(currentStepIndex + 1);
  });
  backBtn.addEventListener("click", () => goToStep(currentStepIndex - 1));
  stepnavEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-goto]");
    if (btn) goToStep(Number(btn.getAttribute("data-goto")));
  });

  // ---------- field input delegation ----------

  formEl.addEventListener("input", (e) => {
    const target = e.target;
    if (target.matches("[data-path]")) {
      setPath(state, target.getAttribute("data-path"), target.value);
      scheduleSave();
    } else if (target.id === "private-enabled") {
      state.private.enabled = target.checked;
      if (target.checked && state.private.fields.length === 0) state.private.fields.push({ label: "", value: "" });
      renderStep();
      scheduleSave();
    }
  });

  formEl.addEventListener("change", (e) => {
    const target = e.target;
    if (target.matches("[data-photo]")) {
      const path = target.getAttribute("data-photo");
      const file = target.files && target.files[0];
      const errEl = document.getElementById(`error-${path}`);
      errEl.textContent = "";
      if (!file) return;
      const okExt = /\.(jpe?g|png|webp)$/i.test(file.name);
      if (!okExt) {
        errEl.textContent = "Please choose a JPG, PNG or WEBP file.";
        target.value = "";
        return;
      }
      const suggestedPath = `photos/${file.name.replace(/\s+/g, "-").toLowerCase()}`;
      setPath(state, path, suggestedPath);
      const reader = new FileReader();
      reader.onload = () => {
        state._photoDataUrls = state._photoDataUrls || {};
        state._photoDataUrls[path] = reader.result;
        const previewEl = document.getElementById(`preview-${path}`);
        if (previewEl) {
          previewEl.src = reader.result;
          previewEl.setAttribute("data-show", "true");
        }
      };
      reader.readAsDataURL(file);
    }
  });

  formEl.addEventListener("click", (e) => {
    const addRowBtn = e.target.closest("[data-add-row]");
    const removeRowBtn = e.target.closest("[data-remove-row]");
    const addInsBtn = e.target.closest("[data-add-instruction]");
    const removeInsBtn = e.target.closest("[data-remove-instruction]");

    if (addRowBtn) {
      const path = addRowBtn.getAttribute("data-add-row");
      const kind = addRowBtn.getAttribute("data-kind");
      addRow(path, () => blankRow(kind));
    } else if (removeRowBtn) {
      removeRow(removeRowBtn.getAttribute("data-remove-row"), Number(removeRowBtn.getAttribute("data-index")));
    } else if (addInsBtn) {
      const i = Number(addInsBtn.getAttribute("data-add-instruction"));
      state.appliances[i].instructions.push("");
      renderStep();
      scheduleSave();
    } else if (removeInsBtn) {
      const i = Number(removeInsBtn.getAttribute("data-remove-instruction"));
      const j = Number(removeInsBtn.getAttribute("data-index"));
      if (state.appliances[i].instructions.length > 1) {
        state.appliances[i].instructions.splice(j, 1);
        renderStep();
        scheduleSave();
      }
    } else if (e.target.id === "ik-download") {
      downloadDataFile();
    }
  });

  function blankRow(kind) {
    switch (kind) {
      case "rule": return { icon: "guests", label: "", detail: "" };
      case "appliance": return { icon: "ac", name: "", summary: "", instructions: [""] };
      case "emergencyNumber": return { label: "", number: "", telHref: "" };
      case "localGuideItem": return { category: "", name: "", description: "", tag: "", mapUrl: "" };
      case "transport": return { icon: "plane", label: "", detail: "" };
      case "faq": return { q: "", a: "" };
      case "privateField": return { label: "", value: "" };
      case "string": return "";
      default: return {};
    }
  }

  function downloadDataFile() {
    const p = buildPropertyObject();
    const slug = slugify(p.name);
    const filename = "data.js";
    const blob = new Blob([serializeDataJs(p)], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    document.getElementById("ik-download-filename").textContent = filename;
    document.getElementById("ik-download-path").textContent = `properties/${slug}/data.js`;
    document.getElementById("ik-download-success").hidden = false;
  }

  // ---------- draft resume ----------

  const draftBanner = document.getElementById("ik-draft-banner");
  const draft = loadDraft();
  if (draft && draft.state) {
    draftBanner.hidden = false;
    document.getElementById("ik-draft-resume").addEventListener("click", () => {
      state = draft.state;
      currentStepIndex = draft.currentStepIndex || 0;
      draftBanner.hidden = true;
      renderStep();
    });
    document.getElementById("ik-draft-discard").addEventListener("click", () => {
      clearDraft();
      draftBanner.hidden = true;
    });
  }

  renderStep();
})();
