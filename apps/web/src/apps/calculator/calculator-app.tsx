"use client";

import { useReducer } from "react";
import {
  initialCalculatorState,
  reduceCalculatorInput,
  type CalculatorInput,
  type CalculatorOperator,
} from "./calculator-logic";

type CalculatorButton =
  | {
      kind: "action";
      label: string;
      input: CalculatorInput;
    }
  | {
      kind: "operator";
      label: string;
      operator: CalculatorOperator;
    }
  | {
      kind: "digit";
      label: string;
      value: string;
      wide?: boolean;
    }
  | {
      kind: "decimal";
      label: string;
    };

const calculatorButtons: CalculatorButton[] = [
  { kind: "action", label: "AC", input: { type: "clear" } },
  { kind: "action", label: "+/-", input: { type: "toggleSign" } },
  { kind: "action", label: "%", input: { type: "percent" } },
  { kind: "operator", label: "÷", operator: "divide" },
  { kind: "digit", label: "7", value: "7" },
  { kind: "digit", label: "8", value: "8" },
  { kind: "digit", label: "9", value: "9" },
  { kind: "operator", label: "×", operator: "multiply" },
  { kind: "digit", label: "4", value: "4" },
  { kind: "digit", label: "5", value: "5" },
  { kind: "digit", label: "6", value: "6" },
  { kind: "operator", label: "−", operator: "subtract" },
  { kind: "digit", label: "1", value: "1" },
  { kind: "digit", label: "2", value: "2" },
  { kind: "digit", label: "3", value: "3" },
  { kind: "operator", label: "+", operator: "add" },
  { kind: "digit", label: "0", value: "0", wide: true },
  { kind: "decimal", label: "." },
  { kind: "action", label: "=", input: { type: "equals" } },
];

function getButtonInput(button: CalculatorButton): CalculatorInput {
  switch (button.kind) {
    case "action":
      return button.input;
    case "operator":
      return { type: "operator", value: button.operator };
    case "digit":
      return { type: "digit", value: button.value };
    case "decimal":
      return { type: "decimal" };
  }
}

function getButtonClassName(button: CalculatorButton) {
  const classNames = ["calculator-key"];

  if (button.kind === "operator") {
    classNames.push("calculator-key-operator");
  }

  if (button.kind === "action") {
    classNames.push(
      button.label === "=" ? "calculator-key-operator" : "calculator-key-action",
    );
  }

  if (button.kind === "digit" && button.wide) {
    classNames.push("calculator-key-wide");
  }

  return classNames.join(" ");
}

export function CalculatorApp() {
  const [state, dispatch] = useReducer(
    reduceCalculatorInput,
    initialCalculatorState,
  );
  const clearLabel =
    state.error || state.resetOnClear || state.display === "0" ? "AC" : "C";

  return (
    <div className="calculator-app" aria-label="Calculator">
      <div className="calculator-screen" aria-live="polite">
        <div className="calculator-formula" aria-label="Formula">
          {state.formula}
        </div>
        <output className="calculator-display" aria-label="Calculator display">
          {state.display}
        </output>
      </div>
      <div className="calculator-keypad">
        {calculatorButtons.map((button) => (
          <button
            className={getButtonClassName(button)}
            key={`${button.kind}-${button.label}`}
            onClick={() => dispatch(getButtonInput(button))}
            type="button"
          >
            {button.label === "AC" ? clearLabel : button.label}
          </button>
        ))}
      </div>
    </div>
  );
}
