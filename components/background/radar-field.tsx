"use client";

import { Radar } from "@/components/background/radar";

/**
 * The page background.
 *
 * A fixed, full-viewport radar scope with a stack of CSS textures on top of
 * it: a fine engineering grid, film grain, and a vignette that sinks the
 * edges into the black page.
 *
 * Every layer is pointer-transparent, so the scope still reacts to the mouse
 * through the window-level listener inside <Radar /> without ever stealing a
 * click.
 */

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23g)'/%3E%3C/svg%3E\")";

export function RadarField() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black"
    >
      {/* Static scope. Doubles as the fallback when WebGL2 is unavailable. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "repeating-radial-gradient(circle at 50% 44%, transparent 0 74px, rgba(255,255,255,0.055) 74px 75px)",
            "radial-gradient(circle at 50% 44%, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 32%, transparent 62%)",
          ].join(", "),
        }}
      />

      {/* The live scope. */}
      <Radar
        className="absolute inset-0"
        color="#ffffff"
        base="#8c8c8c"
        backgroundColor="transparent"
        mode="sweep"
        speed={0.75}
        trail={0.42}
        scale={1.05}
        ringCount={7}
        spokeCount={12}
        ticks
        targets={5}
        clutter={0.55}
        glow={1.1}
        brightness={1}
        gridOpacity={0.9}
        lineWidth={1}
        centerX={0.5}
        centerY={0.44}
        mouseInteraction
        grain={0.05}
        fade={0.06}
        opacity={0.6}
        fps={30}
      />

      {/* Engineering grid. */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(circle at 50% 44%, black 0%, rgba(0,0,0,0.5) 45%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 44%, black 0%, rgba(0,0,0,0.5) 45%, transparent 78%)",
        }}
      />

      {/* Film grain. */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-screen"
        style={{ backgroundImage: GRAIN, backgroundSize: "180px 180px" }}
      />

      {/* Vignette, sinking the scope into the page. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 44%, transparent 30%, rgba(0,0,0,0.55) 72%, rgba(0,0,0,0.9) 100%)",
        }}
      />
    </div>
  );
}
