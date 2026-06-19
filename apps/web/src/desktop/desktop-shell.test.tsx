import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DesktopShell } from "./desktop-shell";

describe("DesktopShell", () => {
  it("renders app icons and opens the Portfolio window by default", () => {
    const { container } = render(<DesktopShell />);

    expect(
      screen.getByRole("main", { name: "Portfolio OS desktop" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Open Portfolio" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Dock Portfolio: focus" }),
    ).toHaveAttribute("data-running", "true");
    expect(
      screen.getByRole("dialog", { name: "Portfolio" }),
    ).toBeInTheDocument();
    for (const appName of [
      "Portfolio",
      "Store",
      "Resume",
      "Contact",
      "Calculator",
    ]) {
      expect(
        container.querySelector(`[aria-label="Open ${appName}"]`),
      ).toBeInTheDocument();
    }
    expect(
      container.querySelector(`[aria-label="Terminal portfolio"]`),
    ).toBeInTheDocument();
    expect(screen.getByText("Eugene Lee")).toBeInTheDocument();
  });

  it("shows terminal portfolio project details", () => {
    render(<DesktopShell />);

    fireEvent.click(screen.getByRole("button", { name: "2 thirtymall" }));

    expect(screen.getByText("Thirtymall")).toBeInTheDocument();
    expect(
      screen.getByText("장바구니 응답 속도 1.5s에서 0.6s로 개선"),
    ).toBeInTheDocument();
  });

  it("opens Resume as a document with the provided profile and career details", () => {
    render(<DesktopShell />);

    fireEvent.click(screen.getByRole("button", { name: "Open Resume" }));

    expect(
      screen.getByRole("dialog", { name: "Resume" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Resume document")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "이유진 증명사진" })).toHaveAttribute(
      "src",
      expect.stringContaining("profile.png"),
    );
    expect(screen.getByText("로그인 오류 88% 개선", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("핌아시아")).toBeInTheDocument();
    expect(screen.getByText("iOS WKWebView", { exact: false })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Github" })).toHaveAttribute(
      "href",
      "https://github.com/LeeEugene1",
    );
    expect(screen.getByRole("button", { name: "인쇄" })).toBeInTheDocument();
  });

  it("opens and closes app windows from desktop controls", () => {
    render(<DesktopShell />);

    fireEvent.click(screen.getByRole("button", { name: "Open Store" }));

    expect(screen.getByRole("dialog", { name: "Store" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close Store" }));

    expect(
      screen.queryByRole("dialog", { name: "Store" }),
    ).not.toBeInTheDocument();
  });

  it("opens new desktop windows with a cascading creation offset", () => {
    render(<DesktopShell />);

    fireEvent.click(screen.getByRole("button", { name: "Open Store" }));
    fireEvent.click(screen.getByRole("button", { name: "Open Resume" }));

    expect(screen.getByRole("dialog", { name: "Store" })).toHaveStyle({
      left: "440px",
      top: "158px",
    });
    expect(screen.getByRole("dialog", { name: "Resume" })).toHaveStyle({
      left: "520px",
      top: "120px",
    });
  });

  it("minimizes and restores app windows from the dock", () => {
    render(<DesktopShell />);

    fireEvent.click(screen.getByRole("button", { name: "Open Store" }));
    fireEvent.click(screen.getByRole("button", { name: "Minimize Store" }));

    expect(
      screen.queryByRole("dialog", { name: "Store" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Dock Store: focus" }),
    ).toHaveAttribute("data-minimized", "true");

    fireEvent.click(screen.getByRole("button", { name: "Dock Store: focus" }));

    expect(screen.getByRole("dialog", { name: "Store" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Dock Store: focus" }),
    ).toHaveAttribute("data-minimized", "false");
  });

  it("maximizes and restores app windows from desktop controls", () => {
    render(<DesktopShell />);

    fireEvent.click(screen.getByRole("button", { name: "Open Store" }));

    const storeWindow = screen.getByRole("dialog", { name: "Store" });

    fireEvent.click(screen.getByRole("button", { name: "Maximize Store" }));

    expect(storeWindow).toHaveAttribute("data-maximized", "true");
    expect(
      screen.getByRole("button", { name: "Restore Store" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Restore Store" }));

    expect(storeWindow).toHaveAttribute("data-maximized", "false");
  });

  it("brings an existing window forward when its icon is opened again", () => {
    render(<DesktopShell />);

    const portfolioWindow = screen.getByRole("dialog", { name: "Portfolio" });

    fireEvent.click(screen.getByRole("button", { name: "Open Store" }));

    const storeWindow = screen.getByRole("dialog", { name: "Store" });

    expect(portfolioWindow).toHaveAttribute("data-focused", "false");
    expect(storeWindow).toHaveAttribute("data-focused", "true");

    fireEvent.click(screen.getByRole("button", { name: "Open Portfolio" }));

    expect(portfolioWindow).toHaveAttribute("data-focused", "true");
    expect(storeWindow).toHaveAttribute("data-focused", "false");
  });

  it("focuses a window when the user selects it", () => {
    render(<DesktopShell />);

    fireEvent.click(screen.getByRole("button", { name: "Open Store" }));

    const portfolioWindow = screen.getByRole("dialog", { name: "Portfolio" });
    const storeWindow = screen.getByRole("dialog", { name: "Store" });

    expect(storeWindow).toHaveAttribute("data-focused", "true");

    fireEvent.pointerDown(portfolioWindow);

    expect(portfolioWindow).toHaveAttribute("data-focused", "true");
    expect(storeWindow).toHaveAttribute("data-focused", "false");
  });

  it("renders the focused window first for stacked mobile layout", () => {
    render(<DesktopShell />);

    fireEvent.click(screen.getByRole("button", { name: "Open Calculator" }));

    expect(screen.getAllByRole("dialog")[0]).toHaveAccessibleName(
      "Calculator",
    );
  });

  it("opens the Contact app as a compact resume card", () => {
    render(<DesktopShell />);

    fireEvent.click(screen.getByRole("button", { name: "Open Contact" }));

    expect(screen.getByRole("dialog", { name: "Contact" })).toBeInTheDocument();
    const contactProfile = screen.getByLabelText("Contact profile");

    expect(
      within(contactProfile).getByRole("heading", { name: "이유진" }),
    ).toBeInTheDocument();
    expect(
      within(contactProfile).getByRole("img", { name: "이유진 증명사진" }),
    ).toHaveAttribute(
      "src",
      expect.stringContaining("profile.png"),
    );
    expect(within(contactProfile).getByText("Resume")).toBeInTheDocument();
    expect(
      within(contactProfile).getByText("5년 차 프론트엔드 개발자", { exact: false }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
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

    expect(portfolioWindow).toHaveStyle({ left: "270px", top: "88px" });
  });

  it("renders sortable app icons with running state", () => {
    render(<DesktopShell />);

    const storeIcon = screen.getByRole("button", { name: "Open Store" });

    fireEvent.click(storeIcon);

    expect(screen.getByRole("dialog", { name: "Store" })).toBeInTheDocument();
    expect(storeIcon).toHaveAttribute("data-running", "true");
    expect(
      screen.getByRole("button", { name: "Dock Store: focus" }),
    ).toHaveAttribute("data-running", "true");
  });

  it("keeps maximized windows below the dock controls", () => {
    render(<DesktopShell />);

    fireEvent.click(screen.getByRole("button", { name: "Maximize Portfolio" }));

    expect(screen.getByRole("dialog", { name: "Portfolio" })).toHaveAttribute(
      "data-maximized",
      "true",
    );
    expect(
      screen.getByRole("navigation", { name: "Running applications" }),
    ).toBeInTheDocument();
  });

  it("does not render mobile tabs after opening multiple apps", () => {
    render(<DesktopShell />);

    fireEvent.click(screen.getByRole("button", { name: "Open Store" }));

    expect(
      screen.queryByRole("navigation", { name: "Mobile applications" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Mobile tab Store" }),
    ).not.toBeInTheDocument();
  });
});
