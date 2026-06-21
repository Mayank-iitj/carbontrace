"use client";

import { Fragment } from "react";
import { cn } from "@/lib/utils";

/**
 * Infinite horizontal ticker (reference's category / logo rows).
 * Pure CSS animation so it works without JS; pauses on hover and is
 * disabled under prefers-reduced-motion (see globals.css media query).
 *
 * The track is rendered twice and translated by -50%, giving a seamless loop.
 */
export function Marquee({
  items,
  className,
  reverse = false,
  speed = 32,
  separator = "·",
}: {
  items: React.ReactNode[];
  className?: string;
  reverse?: boolean;
  speed?: number;
  separator?: string;
}) {
  const renderTrack = (ariaHidden: boolean) => (
    <ul
      className="flex shrink-0 items-center gap-10 pl-10"
      aria-hidden={ariaHidden}
    >
      {items.map((item, i) => (
        <Fragment key={i}>
          <li className="whitespace-nowrap">{item}</li>
          {separator && (
            <li className="text-[var(--color-accent)]" aria-hidden>
              {separator}
            </li>
          )}
        </Fragment>
      ))}
    </ul>
  );

  return (
    <div
      className={cn(
        "group relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className,
      )}
    >
      <div
        className="flex w-max items-center group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={{
          animation: `marquee-scroll ${speed}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {renderTrack(false)}
        {renderTrack(true)}
      </div>
    </div>
  );
}
