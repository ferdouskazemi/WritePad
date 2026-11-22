"use client";

import React, { useEffect, useRef } from "react";
import "./film.css";

interface FilmFrameProps {
  enabled?: boolean;
  onWobbleChange?: (transform: string) => void;
  children?: React.ReactNode;
}

export function FilmFrame({
  enabled = false,
  onWobbleChange,
  children,
}: FilmFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLCanvasElement>(null);
  const flickRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check if ?nofilm query param or prefers-reduced-motion is active
    const params = new URLSearchParams(window.location.search);
    const noFilmParam = params.has("nofilm");
    const reducedMotion =
      typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;

    if (!enabled || noFilmParam || reducedMotion) {
      container.style.display = "none";
      onWobbleChange?.("");
      return;
    }

    container.style.display = "block";

    const dust = dustRef.current;
    const grain = grainRef.current;
    const flick = flickRef.current;
    if (!dust || !grain || !flick) return;

    const dg = dust.getContext("2d");
    if (!dg) return;

    // Create 220x220 grain noise tile
    const tile = document.createElement("canvas");
    tile.width = tile.height = 220;
    const tx = tile.getContext("2d");
    if (tx) {
      const d = tx.createImageData(220, 220);
      const a = d.data;
      for (let i = 0; i < a.length; i += 4) {
        const v = 196 + Math.random() * 59;
        a[i] = v;
        a[i + 1] = v * 0.98;
        a[i + 2] = v * 0.94;
        a[i + 3] = 255;
      }
      tx.putImageData(d, 0, 0);
      grain.style.background = `url(${tile.toDataURL("image/png")})`;
    }

    const resize = () => {
      dust.width = window.innerWidth;
      dust.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Hash function for repeatable pseudo-randomness
    const getHash = (n: number) => {
      const rh = (window as unknown as { RubberHose?: { hash?: (x: number) => number } })
        .RubberHose;
      if (rh && typeof rh.hash === "function") {
        return rh.hash(n);
      }
      const v = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
      return v - Math.floor(v);
    };

    let animationFrameId: number;
    let last = -1;
    let scratch: { x: number; life: number; dark: boolean } | null = null;

    const tick = (time: number) => {
      animationFrameId = requestAnimationFrame(tick);

      const rh = (window as unknown as { RubberHose?: { calm?: boolean; now?: number } })
        .RubberHose;
      if (rh?.calm) {
        dg.clearRect(0, 0, dust.width, dust.height);
        flick.style.opacity = "0";
        onWobbleChange?.("");
        return;
      }

      const clockNow = rh?.now !== undefined ? rh.now : time / 1000;
      const k = Math.floor(clockNow * 12);
      if (k === last) return;
      last = k;

      // Move grain position
      grain.style.backgroundPosition = `${Math.floor(getHash(k * 1.7) * 220)}px ${Math.floor(
        getHash(k * 2.9) * 220
      )}px`;

      // Gate wobble applied to callback (for page frame/border only)
      const wobbleX = ((getHash(k * 4.1) - 0.5) * 1.1).toFixed(2);
      const wobbleY = ((getHash(k * 6.3) - 0.5) * 1.5).toFixed(2);
      onWobbleChange?.(`translate(${wobbleX}px, ${wobbleY}px)`);

      // Flicker opacity
      flick.style.opacity = (
        getHash(k * 8.7) < 0.2 ? 0.035 + getHash(k * 3.3) * 0.05 : 0
      ).toFixed(3);

      // Dust & scratches on canvas
      const W = dust.width;
      const H = dust.height;
      dg.clearRect(0, 0, W, H);

      if (!scratch && getHash(k * 5.9) < 0.05) {
        scratch = {
          x: getHash(k * 7.7) * W,
          life: 3 + Math.floor(getHash(k) * 8),
          dark: getHash(k * 2.2) < 0.6,
        };
      }

      if (scratch) {
        scratch.x += (getHash(k * 9.9) - 0.5) * 5;
        dg.strokeStyle = scratch.dark
          ? "rgba(60, 40, 25, 0.38)"
          : "rgba(255, 250, 235, 0.5)";
        dg.lineWidth = 1;
        dg.beginPath();
        dg.moveTo(scratch.x, 0);
        dg.lineTo(scratch.x + (getHash(k * 1.3) - 0.5) * 6, H);
        dg.stroke();
        if (--scratch.life <= 0) scratch = null;
      }

      const n = getHash(k * 3.9) < 0.45 ? 1 + Math.floor(getHash(k * 6.1) * 3) : 0;
      dg.fillStyle = "rgba(50, 34, 20, 0.55)";
      dg.strokeStyle = "rgba(50, 34, 20, 0.5)";
      dg.lineWidth = 1.2;

      for (let i = 0; i < n; i++) {
        const px = getHash(k * 2.3 + i * 7.1) * W;
        const py = getHash(k * 5.1 + i * 3.3) * H;
        const r = 0.8 + getHash(k + i * 9.7) * 2.2;
        if (getHash(k * 1.1 + i) < 0.25) {
          dg.beginPath();
          dg.moveTo(px, py);
          dg.quadraticCurveTo(
            px + 14 * (getHash(i + k) - 0.5),
            py + 9,
            px + 18 * (getHash(i * 2 + k) - 0.5),
            py + 22
          );
          dg.stroke();
        } else {
          dg.beginPath();
          dg.ellipse(
            px,
            py,
            r,
            r * (0.6 + getHash(i * 4 + k) * 0.8),
            getHash(i + k * 2) * 3,
            0,
            7
          );
          dg.fill();
        }
      }
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, [enabled, onWobbleChange]);

  return (
    <>
      <div className="paper-bg" aria-hidden="true" />
      {enabled && (
        <div ref={containerRef} className="film-container" aria-hidden="true">
          <div ref={grainRef} className="film-grain" />
          <canvas ref={dustRef} className="film-dust" />
          <div className="film-vignette" />
          <div ref={flickRef} className="film-flicker" />
        </div>
      )}
      {children}
    </>
  );
}
