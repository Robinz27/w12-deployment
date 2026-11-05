"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const options = [
  { label: "None", image: null },
  { label: "Basketball", image: "-basketball.webp" },
  { label: "Football", image: "Football_PNG_Clipart.png" },
  { label: "Volleyball", image: "volleyball.png" },
  { label: "Human", image: "human.jpg" },
];

const width = 636;
const height = 476;
const itemSize = 80;
const radius = itemSize / 2;
const speed = 4 / Math.SQRT2;
const buttonClass = "rounded-md border px-3 py-1.5 text-sm font-medium";

export default function AnimationPage() {
  const [selected, setSelected] = useState(0);
  const [running, setRunning] = useState(false);
  const [position, setPosition] = useState({
    x: width / 2,
    y: height / 2,
    rotation: 0,
  });
  const motion = useRef({
    x: width / 2,
    y: height / 2,
    rotation: 0,
    vx: speed,
    vy: -speed,
  });
  const item = options[selected];

  useEffect(() => {
    if (!running) return;

    let frame: number;
    const animate = () => {
      const state = motion.current;
      const nextX = state.x + state.vx;
      const nextY = state.y + state.vy;

      if (nextX <= radius || nextX >= width - radius) state.vx *= -1;
      if (nextY <= radius || nextY >= height - radius) state.vy *= -1;

      state.x = Math.max(radius, Math.min(nextX, width - radius));
      state.y = Math.max(radius, Math.min(nextY, height - radius));
      state.rotation = (state.rotation + 5) % 360;
      setPosition({ x: state.x, y: state.y, rotation: state.rotation });
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.repeat ||
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
      )
        return;
      if (event.code === "Space") {
        if (
          event.target instanceof HTMLElement &&
          event.target.closest(
            "a, button, input, textarea, select, [contenteditable]",
          )
        )
          return;
        event.preventDefault();
        setRunning((current) => !current);
      } else if (/^[0-4]$/.test(event.key)) {
        setSelected(Number(event.key));
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section
      className="mx-auto max-w-[664px] px-3 text-center"
      aria-label="Animation"
    >
      <p className="text-2xl">68071529 Sanchai Jaiyakan</p>
      <div
        className="relative mt-2 aspect-[4/3] w-full overflow-hidden rounded-2xl border-2 border-slate-900 bg-amber-200 bg-cover bg-center"
        style={{ backgroundImage: "url('/animation-assets/wood-.avif')" }}
      >
        <div
          className="pointer-events-none absolute aspect-square overflow-hidden rounded-full"
          style={{
            left: `${(position.x / width) * 100}%`,
            top: `${(position.y / height) * 100}%`,
            width: `${(itemSize / width) * 100}%`,
            transform: `translate(-50%, -50%) rotate(${position.rotation}deg)`,
          }}
        >
          {item.image ? (
            <Image
              src={`/animation-assets/${item.image}`}
              alt={item.label}
              fill
              sizes="80px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="size-full rounded-full border-[3px] border-black" />
          )}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap justify-center gap-1.5">
        <button
          type="button"
          aria-pressed={running}
          onClick={() => setRunning((current) => !current)}
          className={`${buttonClass} text-white ${running ? "bg-red-600" : "bg-green-700"}`}
        >
          {running ? "PAUSE" : "RUN"}
        </button>
        {options.map(({ label }, index) => (
          <button
            key={label}
            type="button"
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
            className={`${buttonClass} border-blue-600 ${selected === index ? "bg-blue-600 text-white" : "text-blue-700"}`}
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}
