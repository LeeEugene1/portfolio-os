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
    expect(screen.getByText("Frontend Engineer")).toBeInTheDocument();
    expect(screen.queryByText("eugene@portfolio:", { exact: false })).not.toBeInTheDocument();
  });

  it("shows anchor-based portfolio sections", () => {
    render(<DesktopShell />);

    const portfolioWindow = screen.getByRole("dialog", { name: "Portfolio" });
    const thirtymallLink = screen.getByRole("link", { name: "2 thirtymall" });
    const portfolioPdfLink = within(portfolioWindow).getByRole("link", { name: "PDF" });

    expect(thirtymallLink).toHaveAttribute("href", "#portfolio-thirtymall");
    expect(portfolioPdfLink).toHaveAttribute("href", "/portfolio-eugene-lee-frontend.pdf");
    expect(portfolioPdfLink).toHaveAttribute(
      "download",
      "포트폴리오_이유진_프론트엔드개발자.pdf",
    );
    fireEvent.click(thirtymallLink);
    expect(thirtymallLink).toHaveAttribute("aria-current", "true");
    expect(within(portfolioWindow).getByText("Thirtymall")).toBeInTheDocument();
    expect(within(portfolioWindow).getByText("Caveduck")).toBeInTheDocument();
    expect(within(portfolioWindow).getByText("Sheepfarm")).toBeInTheDocument();
    expect(within(portfolioWindow).getByText("Etc")).toBeInTheDocument();
    expect(
      within(portfolioWindow).getAllByText("장바구니 가격 반영 시간 1.5초 → 0.6초 개선"),
    ).toHaveLength(1);
    expect(
      within(portfolioWindow).queryByText("eugene@portfolio:", { exact: false }),
    ).not.toBeInTheDocument();
    expect(
      within(portfolioWindow).getByText("웹/모바일 52개 페이지 이벤트 추적 구조 표준화"),
    ).toBeInTheDocument();
    expect(within(portfolioWindow).getByRole("link", { name: "UX_Portfolio 바로가기" })).toHaveAttribute(
      "href",
      "https://leeeugene1.github.io/UX_Portfolio/",
    );
  });

  it("opens Resume as a document with the provided profile and career details", () => {
    render(<DesktopShell />);

    fireEvent.click(screen.getByRole("button", { name: "Open Resume" }));

    const resumeWindow = screen.getByRole("dialog", { name: "Resume" });

    expect(resumeWindow).toBeInTheDocument();
    expect(within(resumeWindow).getByLabelText("Resume document")).toBeInTheDocument();
    expect(within(resumeWindow).getByRole("img", { name: "이유진 증명사진" })).toHaveAttribute(
      "src",
      expect.stringContaining("profile.png"),
    );
    expect(within(resumeWindow).getByText("로그인 오류 88% 개선", { exact: false })).toBeInTheDocument();
    expect(within(resumeWindow).getByText("핌아시아")).toBeInTheDocument();
    expect(within(resumeWindow).getByText("iOS WKWebView", { exact: false })).toBeInTheDocument();
    expect(
      within(resumeWindow).getByText("iOS 로그인 직후 5분 내 401 인증 오류 88% 감소(170건 → 20건)"),
    ).toBeInTheDocument();
    expect(within(resumeWindow).getByRole("link", { name: "Github" })).toHaveAttribute(
      "href",
      "https://github.com/LeeEugene1",
    );
    expect(within(resumeWindow).getByRole("link", { name: "PDF" })).toHaveAttribute(
      "href",
      "/resume-eugene-lee-frontend.pdf",
    );
    expect(within(resumeWindow).getByRole("link", { name: "PDF" })).toHaveAttribute(
      "download",
      "이력서_이유진_프론트엔드개발자.pdf",
    );
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

    expect(
      screen.getByRole("region", { name: "Open windows" }),
    ).toHaveAttribute("data-window-count", "2");
    expect(screen.getAllByRole("dialog")[0]).toHaveAccessibleName(
      "Calculator",
    );
    expect(screen.getAllByRole("dialog")[1]).toHaveAttribute(
      "data-stack-index",
      "1",
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
    expect(within(contactProfile).getByText("프론트엔드개발자")).toBeInTheDocument();
    expect(
      within(contactProfile).getByRole("img", { name: "이유진 증명사진" }),
    ).toHaveAttribute(
      "src",
      expect.stringContaining("profile.png"),
    );
    expect(screen.getByLabelText("Contact channels")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "uwm1004@gmail.com" })).toHaveAttribute(
      "href",
      "mailto:uwm1004@gmail.com",
    );
    expect(screen.getByRole("link", { name: "github.com/LeeEugene1" })).toHaveAttribute(
      "href",
      "https://github.com/LeeEugene1",
    );
    expect(screen.getByRole("link", { name: "dubaiyu.tistory.com" })).toHaveAttribute(
      "href",
      "https://dubaiyu.tistory.com/",
    );
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

    expect(portfolioWindow).toHaveStyle({ left: "350px", top: "60px" });
  });

  it("resizes a window by dragging a corner handle", () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1440,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 900,
    });
    render(<DesktopShell />);

    const portfolioWindow = screen.getByRole("dialog", { name: "Portfolio" });
    const resizeHandle = screen.getByRole("button", {
      name: "Resize Portfolio se",
    });

    fireEvent.pointerDown(resizeHandle, {
      clientX: 1050,
      clientY: 618,
      pointerId: 1,
    });
    fireEvent.pointerMove(resizeHandle, {
      clientX: 1130,
      clientY: 658,
      pointerId: 1,
    });
    fireEvent.pointerUp(resizeHandle, {
      clientX: 1130,
      clientY: 658,
      pointerId: 1,
    });

    expect(portfolioWindow).toHaveStyle({ width: "900px", height: "600px" });
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
