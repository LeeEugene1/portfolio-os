import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CalculatorApp } from "./calculator-app";

describe("CalculatorApp", () => {
  it("calculates using button input", () => {
    render(<CalculatorApp />);

    fireEvent.click(screen.getByRole("button", { name: "2" }));
    fireEvent.click(screen.getByRole("button", { name: "+" }));
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    fireEvent.click(screen.getByRole("button", { name: "=" }));

    expect(
      screen.getByLabelText("Calculator display"),
    ).toHaveTextContent("4");
    expect(screen.getByLabelText("Formula")).toHaveTextContent("2 + 2");
    expect(screen.getByRole("button", { name: "AC" })).toBeInTheDocument();
  });

  it("switches between C and AC clear states", () => {
    render(<CalculatorApp />);

    fireEvent.click(screen.getByRole("button", { name: "8" }));

    expect(screen.getByRole("button", { name: "C" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "C" }));

    expect(screen.getByRole("button", { name: "AC" })).toBeInTheDocument();
    expect(
      screen.getByLabelText("Calculator display"),
    ).toHaveTextContent("0");
  });
});
