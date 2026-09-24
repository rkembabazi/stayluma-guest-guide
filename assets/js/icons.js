/**
 * Shared icon set — a single line-icon system used across every
 * page (guides, landing, intake). Purely visual, no property or
 * form data lives here.
 */
window.StayLumaIcons = (function () {
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
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    printer: '<path d="M6 9V4h12v5"/><rect x="4" y="9" width="16" height="8" rx="1.5"/><rect x="7" y="14" width="10" height="7"/>',
    map: '<path d="M9 4l-5 2v14l5-2 6 2 5-2V4l-5 2-6-2z"/><path d="M9 4v14"/><path d="M15 6v14"/>',
    star: '<path d="M12 3.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.65l5.9-.85z"/>',
    photo: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.7"/><path d="M21 16l-5.5-5.5L9 17"/>',
  };

  function icon(name, cls) {
    return `<svg class="${cls || ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
  }

  return { icon, ICONS };
})();
