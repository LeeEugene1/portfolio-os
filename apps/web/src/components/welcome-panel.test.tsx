import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WelcomePanel } from "./welcome-panel";

describe("WelcomePanel", () => {
  it("renders the smoke-test landing content", () => {
    render(<WelcomePanel />);

    expect(
      screen.getByRole("heading", { name: "Portfolio OS" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("웹 테스트 하네스가 준비된 Next.js 앱입니다."),
    ).toBeInTheDocument();
  });
});
