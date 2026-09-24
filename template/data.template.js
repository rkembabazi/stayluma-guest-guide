/**
 * PROPERTY DATA TEMPLATE — copy this whole file to
 * properties/<slug>/data.js and fill it in. This is the only file
 * (plus photos/) a new property needs — nothing in assets/ changes.
 *
 * Every field is documented inline. Fields marked (optional) can
 * be deleted or left as-is if not applicable.
 */
window.PROPERTY = {
  brand: { name: "StayLuma" }, // leave as-is unless white-labeling

  name: "Property Name",                 // shown as the page title and in the top bar
  tagline: "One sentence that sells the stay.",
  location: "Neighbourhood, City, Country",
  address: "Full street address",
  mapUrl: "",                            // (optional) exact Google Maps link. Leave blank to auto-generate one from `address`.
  sleeps: "Sleeps X · Y bedrooms · Z baths",

  photos: {
    hero: "",                            // (optional) path or URL to a hero photo, e.g. "photos/hero.jpg". Leave blank to use the default illustration.
  },

  host: {
    name: "Host Name",
    initials: "HN",                      // shown if no host photo is set
    photo: "",                           // (optional) path or URL to a host photo, e.g. "photos/host.jpg"
    message: "A short, personal welcome message in the host's own voice.",
    signoff: "— Host Name",
    responseNote: "Usually replies within the hour, 7am–10pm",
    phoneDisplay: "+000 000 000 000",
    phoneTel: "+000000000000",           // digits only after the +, used for tel: links
    whatsapp: "000000000000",            // digits only, no +, used for wa.me links
  },

  checkIn: {
    window: "3:00 PM – 9:00 PM",
    subtitle: "One line describing the check-in method",
    lateNote: "What a guest should do if arriving after the window.",
    steps: [
      "Step 1",
      "Step 2",
    ],
  },

  checkOut: {
    time: "11:00 AM",
    steps: [
      "Step 1",
      "Step 2",
    ],
  },

  // (optional) Sensitive access details hidden behind a PIN on the guide page.
  // This is privacy by obscurity, NOT real security — see
  // docs/manual-steps-and-limitations.md before relying on it.
  // Delete this whole block if there's nothing to hide.
  private: {
    pin: "1234",
    fields: [
      { label: "Lockbox code", value: "0000" },
    ],
  },

  wifi: {
    network: "NetworkName",
    password: "Password",
    note: "Where the router is / how to reset it.",
  },

  houseRules: [
    // `icon` must be one of the keys in assets/js/icons.js (guests, smoking, party,
    // quiet, pets, shoes, rug, recycle — or any other icon already defined there).
    { icon: "guests", label: "Rule headline", detail: "One line of detail." },
  ],

  appliances: [
    // `icon` options: ac, stove, water, laundry, coffee, tv, or add a new one to assets/js/icons.js.
    {
      icon: "ac",
      name: "Appliance name",
      summary: "One-line summary shown collapsed",
      instructions: ["Step or tip 1", "Step or tip 2"],
    },
  ],

  emergency: {
    numbers: [
      // set telHref: null for entries that are informational only (e.g. an address, not a phone number)
      { label: "Police", number: "000", telHref: "tel:000" },
    ],
    cohost: {
      name: "Backup contact name",
      note: "When to use this contact",
      phoneDisplay: "+000 000 000 000",
      phoneTel: "+000000000000",
    },
  },

  localGuide: {
    categories: ["Eat", "Sip & shop", "Do"], // filter chips — add/rename/remove categories freely
    items: [
      // `mapUrl` is optional — leave blank to auto-generate a Google Maps search link from name + location
      { category: "Eat", name: "Place name", description: "One line on why it's worth going.", tag: "distance · note", mapUrl: "" },
    ],
  },

  transport: [
    // `icon` options: plane, taxi, tuktuk, ferry, walk, parking — or add a new one to assets/js/icons.js.
    { icon: "plane", label: "Headline", detail: "Detail sentence." },
  ],

  faq: [
    { q: "Question?", a: "Answer." },
  ],
};
