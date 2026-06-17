import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CalculatorApp } from "./calculator-app";

describe("CalculatorApp", () => {
  it("calculates using button input", () => {
    const { container } = render(<CalculatorApp />);
    const clickKey = (label: string) => {
      const button = Array.from(container.querySelectorAll("button")).find(
        (candidate) => candidate.textContent === label,
      );

      if (!button) {
        throw new Error(`Calculator key ${label} was not rendered`);
      }

      fireEvent.click(button);
    };

    clickKey("2");
    clickKey("+");
    clickKey("2");

    expect(screen.getByLabelText("Formula")).toHaveTextContent("2 + 2");

    clickKey("=");

    expect(
      screen.getByLabelText("Calculator display"),
    ).toHaveTextContent("4");
    expect(screen.getByLabelText("Formula")).toHaveTextContent("2 + 2");
    expect(container).toHaveTextContent("AC");
  });

  it("switches between C and AC clear states", () => {
    const { container } = render(<CalculatorApp />);
    const clickKey = (label: string) => {
      const button = Array.from(container.querySelectorAll("button")).find(
        (candidate) => candidate.textContent === label,
      );

      if (!button) {
        throw new Error(`Calculator key ${label} was not rendered`);
      }

      fireEvent.click(button);
    };

    clickKey("8");

    expect(container).toHaveTextContent("C");

    clickKey("C");

    expect(container).toHaveTextContent("AC");
    expect(
      screen.getByLabelText("Calculator display"),
    ).toHaveTextContent("0");
  });
});
