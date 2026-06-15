import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WelcomePanel } from "./welcome-panel";

describe("WelcomePanel", () => {
  it("renders the app name", () => {
    render(<WelcomePanel />);

    expect(
      screen.getByRole("heading", { name: "Portfolio OS" }),
    ).toBeInTheDocument();
  });
});
