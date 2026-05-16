/* ============================================================
   cursor.js — hexagon cursor controller
   Drop one <script src="cursor.js" defer></script> in your
   HTML <head> (after cursor.css). Works on every page.
   ============================================================ */

   (function () {
    /* Only run on pointer devices — skip touch-only screens */
    if (!window.matchMedia("(pointer: fine)").matches) return;
  
    /* ── Build DOM ───────────────────────────────────────────── */
    const hex = document.createElement("div");
    hex.className = "hex-cursor";
    hex.innerHTML = `
      <div class="hex-cursor__outer-wrap"></div>
      <div class="hex-cursor__dot"></div>
    `;
    document.body.appendChild(hex);
  
    /* ── Track position with requestAnimationFrame ───────────── */
    let mouseX = -100, mouseY = -100;
  
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
  
    function loop() {
      hex.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      requestAnimationFrame(loop);
    }
    loop();
  
    /* ── Hover state on interactive elements ─────────────────── */
    const hoverSelectors = [
      "a", "button", "input", "textarea", "select",
      "[role='button']", ".item", ".platform-card",
      ".project-card", ".accordion-header", ".panel-nav-dot",
      ".carousel-btn", ".dot", ".sub-container > div",
    ].join(", ");
  
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hoverSelectors)) {
        hex.classList.add("is-hovering");
      }
    });
  
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hoverSelectors)) {
        hex.classList.remove("is-hovering");
      }
    });
  
    /* ── Click pulse ─────────────────────────────────────────── */
    document.addEventListener("mousedown", () => {
      hex.classList.add("is-clicking");
    });
  
    document.addEventListener("mouseup", () => {
      hex.classList.remove("is-clicking");
    });
  
    /* ── Hide when leaving window ────────────────────────────── */
    document.addEventListener("mouseleave", () => {
      hex.style.opacity = "0";
    });
  
    document.addEventListener("mouseenter", () => {
      hex.style.opacity = "1";
    });
  })();
