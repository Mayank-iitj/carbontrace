import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Marquee } from "@/components/marketing/marquee";

describe("Marquee", () => {
  it("renders each item (duplicated for the seamless loop)", () => {
    render(<Marquee items={["Transport", "Energy", "Food"]} speed={20} />);
    // Track is rendered twice → each label appears twice.
    expect(screen.getAllByText("Transport")).toHaveLength(2);
    expect(screen.getAllByText("Energy")).toHaveLength(2);
    expect(screen.getAllByText("Food")).toHaveLength(2);
  });

  it("applies the marquee animation with the requested speed", () => {
    const { container } = render(<Marquee items={["A", "B"]} speed={15} />);
    const track = container.querySelector('[style*="marquee-scroll"]') as HTMLElement;
    expect(track).toBeTruthy();
    expect(track.style.animation).toContain("15s");
  });
});
