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

  it("moves a desktop icon by dragging it", () => {
    render(<DesktopShell />);

    const storeIcon = screen.getByRole("button", { name: "Open Store" });

    fireEvent.pointerDown(storeIcon, {
      clientX: 40,
      clientY: 140,
      pointerId: 1,
    });
    fireEvent.pointerMove(storeIcon, {
      clientX: 120,
      clientY: 180,
      pointerId: 1,
    });
    fireEvent.pointerUp(storeIcon, {
      clientX: 120,
      clientY: 180,
      pointerId: 1,
    });

    expect(storeIcon).toHaveStyle({ left: "126px", top: "126px" });
    fireEvent.click(storeIcon);
    expect(
      screen.queryByRole("dialog", { name: "Store" }),
    ).not.toBeInTheDocument();

    fireEvent.click(storeIcon);
    expect(screen.getByRole("dialog", { name: "Store" })).toBeInTheDocument();
  });

  it("keeps desktop icons from overlapping occupied slots", () => {
    render(<DesktopShell />);

    const resumeIcon = screen.getByRole("button", { name: "Open Resume" });

    fireEvent.pointerDown(resumeIcon, {
      clientX: 40,
      clientY: 240,
      pointerId: 1,
    });
    fireEvent.pointerMove(resumeIcon, {
      clientX: 40,
      clientY: 40,
      pointerId: 1,
    });
    fireEvent.pointerUp(resumeIcon, {
      clientX: 40,
      clientY: 40,
      pointerId: 1,
    });

    expect(resumeIcon).toHaveStyle({ left: "126px", top: "24px" });
    expect(screen.getByRole("button", { name: "Open Portfolio" })).toHaveStyle(
      { left: "24px", top: "24px" },
    );
  });
});
