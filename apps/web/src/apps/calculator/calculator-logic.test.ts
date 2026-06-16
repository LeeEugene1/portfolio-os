import { describe, expect, it } from "vitest";
import {
  initialCalculatorState,
  reduceCalculatorInput,
  type CalculatorInput,
} from "./calculator-logic";

function applyInputs(inputs: CalculatorInput[]) {
  return inputs.reduce(reduceCalculatorInput, initialCalculatorState);
}

describe("calculator logic", () => {
  it("adds numbers", () => {
    const state = applyInputs([
      { type: "digit", value: "8" },
      { type: "operator", value: "add" },
      { type: "digit", value: "5" },
      { type: "equals" },
    ]);

    expect(state.display).toBe("13");
    expect(state.formula).toBe("8 + 5");
  });

  it("accepts the right-hand operand before equals", () => {
    const state = applyInputs([
      { type: "digit", value: "2" },
      { type: "operator", value: "add" },
      { type: "digit", value: "2" },
    ]);

    expect(state.display).toBe("2");
    expect(state.waitingForOperand).toBe(false);
  });

  it("supports subtract, multiply, and divide operations", () => {
    expect(
      applyInputs([
        { type: "digit", value: "9" },
        { type: "operator", value: "subtract" },
        { type: "digit", value: "4" },
        { type: "equals" },
      ]).display,
    ).toBe("5");
    expect(
      applyInputs([
        { type: "digit", value: "6" },
        { type: "operator", value: "multiply" },
        { type: "digit", value: "7" },
        { type: "equals" },
      ]).display,
    ).toBe("42");
    expect(
      applyInputs([
        { type: "digit", value: "8" },
        { type: "operator", value: "divide" },
        { type: "digit", value: "2" },
        { type: "equals" },
      ]).display,
    ).toBe("4");
  });

  it("repeats the previous operation when equals is pressed again", () => {
    const state = applyInputs([
      { type: "digit", value: "8" },
      { type: "operator", value: "add" },
      { type: "digit", value: "5" },
      { type: "equals" },
      { type: "equals" },
    ]);

    expect(state.display).toBe("18");
  });

  it("handles macOS-style percent for pending addition", () => {
    const state = applyInputs([
      { type: "digit", value: "2" },
      { type: "digit", value: "0" },
      { type: "digit", value: "0" },
      { type: "operator", value: "add" },
      { type: "digit", value: "1" },
      { type: "digit", value: "0" },
      { type: "percent" },
      { type: "equals" },
    ]);

    expect(state.display).toBe("220");
  });

  it("clears the current entry before all-clear reset", () => {
    const clearedEntry = applyInputs([
      { type: "digit", value: "8" },
      { type: "operator", value: "add" },
      { type: "digit", value: "5" },
      { type: "clear" },
    ]);
    const fullyCleared = reduceCalculatorInput(clearedEntry, { type: "clear" });

    expect(clearedEntry.display).toBe("0");
    expect(clearedEntry.operator).toBe("add");
    expect(fullyCleared).toEqual(initialCalculatorState);
  });

  it("resets all state when clear is pressed after equals", () => {
    const result = applyInputs([
      { type: "digit", value: "2" },
      { type: "operator", value: "add" },
      { type: "digit", value: "2" },
      { type: "equals" },
    ]);

    expect(result.display).toBe("4");
    expect(result.resetOnClear).toBe(true);
    expect(reduceCalculatorInput(result, { type: "clear" })).toEqual(
      initialCalculatorState,
    );
  });

  it("shows an error for division by zero", () => {
    const state = applyInputs([
      { type: "digit", value: "8" },
      { type: "operator", value: "divide" },
      { type: "digit", value: "0" },
      { type: "equals" },
    ]);

    expect(state.display).toBe("Error");
    expect(state.error).toBe(true);
  });
});
