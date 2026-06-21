import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatCounter } from "@/components/marketing/stat-counter";

describe("StatCounter", () => {
  it("renders the label and reaches the final value when in view", async () => {
    render(<StatCounter value={42000} suffix="t" label="CO2e tracked" />);
    expect(screen.getByText("CO2e tracked")).toBeInTheDocument();

    // useInView fires via the mocked IntersectionObserver; the value animates
    // to its target. Assert the final formatted number eventually appears.
    expect(await screen.findByText(/42,000t/, undefined, { timeout: 3000 })).toBeInTheDocument();
  });

  it("formats with the requested decimals and prefix", async () => {
    render(<StatCounter value={1.9} decimals={1} prefix="$" label="Trees" />);
    expect(await screen.findByText(/\$1\.9/, undefined, { timeout: 3000 })).toBeInTheDocument();
  });
});
