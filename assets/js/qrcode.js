/**
 * Printable QR sign generator. Builds on the vendored qrcode-lib.js
 * (kazuhikoarase/qrcode-generator, MIT). Draws to a canvas so we
 * control resolution precisely for print, rather than relying on
 * the library's built-in GIF/SVG output.
 */
window.StayLumaQr = (function () {
  "use strict";

  function render(url, canvas, opts) {
    const cellSize = (opts && opts.cellSize) || 16;
    const marginModules = (opts && opts.marginModules) || 4;

    const qr = window.qrcode(0, "M");
    qr.addData(url);
    qr.make();

    const count = qr.getModuleCount();
    const size = (count + marginModules * 2) * cellSize;
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#000000";

    for (let row = 0; row < count; row += 1) {
      for (let col = 0; col < count; col += 1) {
        if (qr.isDark(row, col)) {
          ctx.fillRect(
            (col + marginModules) * cellSize,
            (row + marginModules) * cellSize,
            cellSize,
            cellSize
          );
        }
      }
    }
    return canvas;
  }

  function downloadPng(canvas, filename) {
    const link = document.createElement("a");
    link.download = filename || "qr-code.png";
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return { render, downloadPng };
})();
