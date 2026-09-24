/**
 * Client-side PIN gate for a property's private/access-details
 * section. This is privacy by obscurity, not real security: the
 * PIN and the gated content both ship inside the page's own
 * source, so anyone who opens developer tools can read them
 * regardless of the PIN. Its purpose is to keep sensitive access
 * details off the visible page and out of search engines for a
 * casual visitor — see docs/manual-steps-and-limitations.md.
 */
window.StayLumaPinGate = (function () {
  "use strict";

  function attach(cardEl, correctPin) {
    if (!cardEl || correctPin === undefined || correctPin === null) return;
    const form = cardEl.querySelector("#pin-form");
    const input = cardEl.querySelector("#pin-input");
    const error = cardEl.querySelector("#pin-error");
    if (!form || !input) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (input.value.trim() === String(correctPin).trim()) {
        cardEl.setAttribute("data-unlocked", "true");
        error.textContent = "";
      } else {
        error.textContent = "Incorrect PIN — try again.";
        input.value = "";
        input.focus();
      }
    });
  }

  return { attach };
})();
