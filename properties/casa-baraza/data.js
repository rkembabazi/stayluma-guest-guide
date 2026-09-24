/**
 * PROPERTY DATA — the single swap point for a new host.
 * Replace every value in this file to re-skin the guide for a different
 * property. Nothing in assets/css or assets/js needs to change.
 * See template/data.template.js for a blank, annotated version of every field.
 */
window.PROPERTY = {
  brand: { name: "StayLuma" },

  name: "Casa Baraza",
  tagline: "A restored 1900s townhouse, two minutes from the Indian Ocean.",
  location: "Shangani, Stone Town, Zanzibar, Tanzania",
  address: "12 Hurumzi Street, Shangani, Stone Town, Zanzibar",
  mapUrl: "", // left blank on purpose — the guide auto-generates a Google Maps search link from the address
  sleeps: "Sleeps 5 · 2 bedrooms · 1.5 baths",

  photos: {
    hero: "", // left blank on purpose — shows the template's default illustration for properties without photos yet
  },

  host: {
    name: "Amina Suleiman",
    initials: "AS",
    photo: "",
    message:
      "Karibu — welcome to Casa Baraza. My grandmother's family has kept this house since 1962; we restored it in 2019 so we could share it. I hope the rooftop baraza becomes your favourite spot for morning coffee. If anything isn't as it should be, message me any time — I'm five minutes away by scooter.",
    signoff: "— Amina",
    responseNote: "Usually replies within the hour, 7am–10pm",
    phoneDisplay: "+255 777 123 456",
    phoneTel: "+255777123456",
    whatsapp: "255777123456",
  },

  checkIn: {
    window: "3:00 PM – 9:00 PM",
    subtitle: "Self check-in, no one to wait for",
    lateNote:
      "Arriving after 9pm? The street doorman is on duty until midnight. Message Amina if you'll be later than that.",
    steps: [
      "Find the blue door with the brass ‘12’, beside the spice shop on Hurumzi Street.",
      "The lockbox sits waist-height on the right-hand door frame. Enter the code sent to you by WhatsApp that morning.",
      "Take the key from the lockbox — it opens both the street door and the apartment door one flight up.",
      "Text Amina “We're in!” so she knows you've arrived safely.",
    ],
  },

  checkOut: {
    time: "11:00 AM",
    steps: [
      "Strip the beds and leave linens in the hallway basket.",
      "Run the dishwasher if you used it — start button is on the top edge.",
      "Close and latch all windows (Stone Town gets sudden rain, even in dry season).",
      "Leave the key in the lockbox and give the dial a spin to scramble the code.",
    ],
  },

  // Demonstrates the PIN-gated private section — this is privacy by
  // obscurity, not real security, since the value still ships in this
  // file. See docs/manual-steps-and-limitations.md.
  private: {
    pin: "1962",
    fields: [
      { label: "Rooftop safe code (for valuables)", value: "7734" },
    ],
  },

  wifi: {
    network: "CasaBaraza_2F",
    password: "Zanzibar1962!",
    note: "Router is on the hallway console table. If it's slow, hold the button on the back for 10 seconds to restart it.",
  },

  houseRules: [
    { icon: "guests", label: "Maximum 5 guests", detail: "Please don't exceed the listed sleep count." },
    { icon: "smoking", label: "No smoking indoors", detail: "The rooftop terrace is fine — ashtray is by the bench." },
    { icon: "party", label: "No parties or events", detail: "Stone Town's alleys carry sound a long way." },
    { icon: "quiet", label: "Quiet hours, 10pm–8am", detail: "Neighbours are lovely — let's keep it that way." },
    { icon: "pets", label: "Pets on request only", detail: "Message Amina before booking if you're travelling with one." },
    { icon: "shoes", label: "Shoes off at the door", detail: "Basket for shoes is just inside the entrance." },
    { icon: "rug", label: "No food or drink on the majlis rugs", detail: "They're original to the house and hand-woven." },
    { icon: "recycle", label: "Glass goes in the ground-floor bin", detail: "Separate from the regular kitchen bin." },
  ],

  appliances: [
    {
      icon: "ac",
      name: "Air conditioning",
      summary: "Split units in both bedrooms",
      instructions: [
        "Remote is on each nightstand — power button top-left.",
        "22–24°C is the sweet spot for the tropics.",
        "Please turn it off if you open the balcony doors — the sea air is worth it anyway.",
      ],
    },
    {
      icon: "stove",
      name: "Gas hob",
      summary: "Two-ring stove, matches in the drawer",
      instructions: [
        "Matches are in the drawer left of the sink.",
        "Turn the dial to the flame symbol and light immediately — the gas flows fast.",
        "If it doesn't catch, turn off, wait 30 seconds for gas to clear, then try again.",
      ],
    },
    {
      icon: "water",
      name: "Hot water",
      summary: "Instant heater in the bathroom",
      instructions: [
        "Switch is on the wall beside the shower — flip it on before you undress.",
        "Give it about 30 seconds to warm up.",
        "Turn it off after your shower; it heats water on demand rather than storing it.",
      ],
    },
    {
      icon: "laundry",
      name: "Washing machine",
      summary: "Ground floor utility nook",
      instructions: [
        "Powder is in the blue tin above the machine.",
        "Cotton cycle for most loads — dial is marked, takes about 90 minutes.",
        "Drying racks fold out from the wall on the rooftop terrace.",
      ],
    },
    {
      icon: "coffee",
      name: "Coffee",
      summary: "Stovetop moka pot",
      instructions: [
        "Beans are in the canister by the stove; grinder is the small silver one.",
        "Fill the base to the valve line, pack the basket, screw on top, low heat.",
        "Off the heat the moment it starts gurgling, or it turns bitter.",
      ],
    },
    {
      icon: "tv",
      name: "TV & streaming",
      summary: "Netflix and YouTube preloaded",
      instructions: [
        "Remote is on the shelf below the screen.",
        "Accounts are already signed in — please don't log out.",
        "HDMI cable in the drawer underneath if you'd rather use your own device.",
      ],
    },
  ],

  emergency: {
    numbers: [
      { label: "Police", number: "999", telHref: "tel:999" },
      { label: "Fire & Ambulance", number: "114", telHref: "tel:114" },
      { label: "Nearest hospital", number: "Mnazi Mmoja Hospital · 10 min drive", telHref: null },
      { label: "Nearest pharmacy", number: "Shangani Chemist · 3 min walk", telHref: null },
    ],
    cohost: {
      name: "Juma (co-host)",
      note: "For anything urgent after 10pm",
      phoneDisplay: "+255 777 654 321",
      phoneTel: "+255777654321",
    },
  },

  localGuide: {
    categories: ["Eat", "Sip & shop", "Do"],
    items: [
      { category: "Eat", name: "Lukmaan Restaurant", description: "Zanzibari home cooking — the pilau sells out by 2pm.", tag: "4 min walk · cash only", mapUrl: "" },
      { category: "Eat", name: "Emerson Rooftop", description: "Sunset dinner above the rooftops; book a few days ahead.", tag: "8 min walk · reservation", mapUrl: "" },
      { category: "Eat", name: "Forodhani Night Market", description: "Seafood skewers and Zanzibari pizza from 7pm.", tag: "10 min walk · evenings only", mapUrl: "" },
      { category: "Sip & shop", name: "Zanzibar Coffee House", description: "The best espresso in Stone Town, with rooftop seating.", tag: "3 min walk", mapUrl: "" },
      { category: "Sip & shop", name: "Memories of Zanzibar", description: "Fair-trade spices and souvenirs, fixed prices.", tag: "5 min walk", mapUrl: "" },
      { category: "Sip & shop", name: "Upendo Arts Gallery", description: "Small original prints from local artists.", tag: "6 min walk", mapUrl: "" },
      { category: "Do", name: "Spice Farm Tour", description: "Half-day tour through a working spice plantation.", tag: "~$25pp · ask Amina to book", mapUrl: "" },
      { category: "Do", name: "Sunset Dhow Cruise", description: "Traditional sailboat out of Forodhani Gardens.", tag: "Daily 5:30pm", mapUrl: "" },
      { category: "Do", name: "Stone Town Walking Tour", description: "Two-hour guided history walk from the House of Wonders.", tag: "Starts 9am & 4pm", mapUrl: "" },
    ],
  },

  transport: [
    { icon: "plane", label: "From the airport (ZNZ)", detail: "About 20 minutes by taxi (~$15–20). Ask Amina to arrange pickup 48 hours ahead." },
    { icon: "taxi", label: "Getting around", detail: "No Uber in Zanzibar — use the local ‘Wallah’ app, or ask any hotel to call a taxi." },
    { icon: "tuktuk", label: "Tuktuk (bajaji)", detail: "Flag one down on Kenyatta Road. Agree the fare before you get in — short trips run 2,000–5,000 TSh." },
    { icon: "ferry", label: "Ferry to Dar es Salaam", detail: "Azam Marine from the port, book a day ahead — the crossing takes about 2 hours." },
    { icon: "walk", label: "On foot", detail: "Stone Town is best explored walking — the house sits in a car-free lane of the old town." },
    { icon: "parking", label: "Parking", detail: "None on-site. Nearest public lot is on Mizingani Road, a 5 minute walk." },
  ],

  faq: [
    { q: "Is there air conditioning?", a: "Yes — both bedrooms have split-unit AC. The living room relies on sea breeze and a ceiling fan." },
    { q: "Can I check in early or store luggage?", a: "Full check-in starts at 3pm, but you're welcome to drop bags any time after 11am if Amina is around." },
    { q: "Is there a washing machine?", a: "Yes, on the ground floor, with drying space on the rooftop terrace." },
    { q: "Do you allow pets?", a: "On request only — message Amina before you book so she can prepare the house." },
    { q: "Is the tap water drinkable?", a: "Not directly — use the filtered dispenser in the kitchen. Bottled water is also stocked in the fridge." },
    { q: "Is there parking?", a: "No on-site parking; the old town is car-free. Nearest public lot is 5 minutes away on foot." },
    { q: "What's the wifi like?", a: "Solid enough for video calls and streaming — roughly 30mbps on a good day." },
    { q: "Is there a curfew?", a: "No curfew — just the 10pm–8am quiet hours, since sound travels in the old stone alleys." },
  ],
};
