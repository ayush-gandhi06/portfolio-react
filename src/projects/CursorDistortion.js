// ============================================================
//  CursorDistortion.js — v1
//  Custom cursor: a sharp dot (exact position) + a larger
//  lagged ring that lerps toward the dot with a spring feel.
//  The ring expands + recolors when hovering interactive els.
//  Hides automatically on touch/mobile (pointer: coarse).
// ============================================================

import React, { useEffect, useRef } from "react";

const CursorDistortion = () => {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Only activate on fine-pointer devices (mouse/trackpad)
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let mouseX = window.innerWidth  / 2;
    let mouseY = window.innerHeight / 2;
    let ringX  = mouseX;
    let ringY  = mouseY;
    let rafId;

    const lerp = (a, b, t) => a + (b - a) * t;

    // ── track raw mouse ──────────────────────────────────────
    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // ── animate dot (instant) + ring (lagged) ───────────────
    const tick = () => {
      ringX = lerp(ringX, mouseX, 0.09);
      ringY = lerp(ringY, mouseY, 0.09);

      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(${ringX - 22}px, ${ringY - 22}px)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    // ── ring expand on hoverable elements ───────────────────
    const expand = () => ringRef.current?.classList.add("ring--expanded");
    const shrink = () => ringRef.current?.classList.remove("ring--expanded");

    const bindHoverables = () => {
      document
        .querySelectorAll("a, button, .project-card, .flip-card, .accordion-header")
        .forEach((el) => {
          el.addEventListener("mouseenter", expand);
          el.addEventListener("mouseleave", shrink);
        });
    };

    // Small delay so DOM is ready
    const timer = setTimeout(bindHoverables, 300);

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
};

export default CursorDistortion;