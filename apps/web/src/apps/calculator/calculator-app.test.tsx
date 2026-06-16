import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CalculatorApp } from "./calculator-app";

describe("CalculatorApp", () => {
  it("calculates using pointer-driven button input", async () => {
    const user = userEvent.setup();

    render(<CalculatorApp />);

    await user.click(screen.getByRole("button", { name: "8" }));
    await user.click(screen.getByRole("button", { name: "+" }));
    await user.click(screen.getByRole("button", { name: "5" }));
    await user.click(screen.getByRole("button", { name: "=" }));

    expect(
      screen.getByLabelText("Calculator display"),
    ).toHaveTextContent("13");
    expect(screen.getByLabelText("Formula")).toHaveTextContent("8 + 5");
  });

  it("switches between C and AC clear states", async () => {
    const user = userEvent.setup();

    render(<CalculatorApp />);

    await user.click(screen.getByRole("button", { name: "8" }));

    expect(screen.getByRole("button", { name: "C" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "C" }));

    expect(screen.getByRole("button", { name: "AC" })).toBeInTheDocument();
    expect(
      screen.getByLabelText("Calculator display"),
    ).toHaveTextContent("0");
  });
});
