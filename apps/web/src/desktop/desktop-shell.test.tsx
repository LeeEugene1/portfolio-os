import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DesktopShell } from "./desktop-shell";

describe("DesktopShell", () => {
  it("renders app icons and opens the Portfolio window by default", () => {
    render(<DesktopShell />);

    expect(
      screen.getByRole("main", { name: "Portfolio OS desktop" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Open Portfolio" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("dialog", { name: "Portfolio" }),
    ).toBeInTheDocument();
  });

  it("opens and closes app windows from desktop controls", async () => {
    const user = userEvent.setup();

    render(<DesktopShell />);

    await user.click(screen.getByRole("button", { name: "Open Store" }));

    expect(screen.getByRole("dialog", { name: "Store" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close Store" }));

    expect(
      screen.queryByRole("dialog", { name: "Store" }),
    ).not.toBeInTheDocument();
  });
});
