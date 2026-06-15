import { fireEvent, render, screen } from "@testing-library/react";
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

  it("moves a window by dragging its titlebar", () => {
    render(<DesktopShell />);

    const portfolioWindow = screen.getByRole("dialog", { name: "Portfolio" });
    const titlebar = screen.getByRole("heading", {
      name: "Portfolio",
    }).parentElement?.parentElement;

    if (!titlebar) {
      throw new Error("Portfolio titlebar was not rendered");
    }

    fireEvent.pointerDown(titlebar, {
      clientX: 300,
      clientY: 100,
      pointerId: 1,
    });
    fireEvent.pointerMove(titlebar, {
      clientX: 340,
      clientY: 130,
      pointerId: 1,
    });
    fireEvent.pointerUp(titlebar, {
      clientX: 340,
      clientY: 130,
      pointerId: 1,
    });

    expect(portfolioWindow).toHaveStyle({ left: "310px", top: "108px" });
  });
});
