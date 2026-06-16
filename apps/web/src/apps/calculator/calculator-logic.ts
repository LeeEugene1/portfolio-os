export type CalculatorOperator = "add" | "subtract" | "multiply" | "divide";

export type CalculatorState = {
  display: string;
  formula: string;
  lastOperator: CalculatorOperator | null;
  lastRightValue: number | null;
  leftValue: number | null;
  operator: CalculatorOperator | null;
  resetOnClear: boolean;
  waitingForOperand: boolean;
  error: boolean;
};

export type CalculatorInput =
  | { type: "digit"; value: string }
  | { type: "decimal" }
  | { type: "operator"; value: CalculatorOperator }
  | { type: "equals" }
  | { type: "clear" }
  | { type: "percent" }
  | { type: "toggleSign" };

export const initialCalculatorState: CalculatorState = {
  display: "0",
  error: false,
  formula: "",
  lastOperator: null,
  lastRightValue: null,
  leftValue: null,
  operator: null,
  resetOnClear: false,
  waitingForOperand: false,
};

const operatorSymbols: Record<CalculatorOperator, string> = {
  add: "+",
  divide: "÷",
  multiply: "×",
  subtract: "−",
};

function formatNumber(value: number) {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  if (Object.is(value, -0)) {
    return "0";
  }

  const roundedValue = Number.parseFloat(value.toPrecision(12));

  return roundedValue.toString();
}

function getDisplayValue(state: CalculatorState) {
  return Number.parseFloat(state.display);
}

function getPendingFormula(state: CalculatorState, display: string) {
  if (state.leftValue === null || state.operator === null) {
    return state.formula;
  }

  return `${formatNumber(state.leftValue)} ${operatorSymbols[state.operator]} ${display}`;
}

function calculate(
  leftValue: number,
  rightValue: number,
  operator: CalculatorOperator,
) {
  switch (operator) {
    case "add":
      return leftValue + rightValue;
    case "subtract":
      return leftValue - rightValue;
    case "multiply":
      return leftValue * rightValue;
    case "divide":
      return rightValue === 0 ? Number.NaN : leftValue / rightValue;
  }
}

function withError(): CalculatorState {
  return {
    ...initialCalculatorState,
    display: "Error",
    error: true,
    waitingForOperand: true,
  };
}

function inputDigit(state: CalculatorState, digit: string): CalculatorState {
  if (state.error) {
    return { ...initialCalculatorState, display: digit };
  }

  if (state.resetOnClear && state.waitingForOperand) {
    return { ...initialCalculatorState, display: digit };
  }

  if (state.waitingForOperand) {
    return {
      ...state,
      display: digit,
      formula: getPendingFormula(state, digit),
      resetOnClear: false,
      waitingForOperand: false,
    };
  }

  const display = state.display === "0" ? digit : `${state.display}${digit}`;

  return {
    ...state,
    display,
    formula: getPendingFormula(state, display),
  };
}

function inputDecimal(state: CalculatorState): CalculatorState {
  if (state.error) {
    return { ...initialCalculatorState, display: "0." };
  }

  if (state.resetOnClear && state.waitingForOperand) {
    return { ...initialCalculatorState, display: "0." };
  }

  if (state.waitingForOperand) {
    return {
      ...state,
      display: "0.",
      formula: getPendingFormula(state, "0."),
      resetOnClear: false,
      waitingForOperand: false,
    };
  }

  if (state.display.includes(".")) {
    return state;
  }

  const display = `${state.display}.`;

  return {
    ...state,
    display,
    formula: getPendingFormula(state, display),
  };
}

function inputOperator(
  state: CalculatorState,
  operator: CalculatorOperator,
): CalculatorState {
  if (state.error) {
    return state;
  }

  const currentValue = getDisplayValue(state);

  if (state.leftValue === null) {
    return {
      ...state,
      formula: `${state.display} ${operatorSymbols[operator]}`,
      lastOperator: null,
      lastRightValue: null,
      leftValue: currentValue,
      operator,
      resetOnClear: false,
      waitingForOperand: true,
    };
  }

  if (state.operator && !state.waitingForOperand) {
    const result = calculate(state.leftValue, currentValue, state.operator);

    if (!Number.isFinite(result)) {
      return withError();
    }

    const display = formatNumber(result);

    return {
      ...state,
      display,
      formula: `${display} ${operatorSymbols[operator]}`,
      lastOperator: null,
      lastRightValue: null,
      leftValue: result,
      operator,
      resetOnClear: false,
      waitingForOperand: true,
    };
  }

  return {
    ...state,
    formula: `${formatNumber(state.leftValue)} ${operatorSymbols[operator]}`,
    lastOperator: null,
    lastRightValue: null,
    operator,
    resetOnClear: false,
    waitingForOperand: true,
  };
}

function inputEquals(state: CalculatorState): CalculatorState {
  if (state.error) {
    return state;
  }

  const hasPendingOperation = state.leftValue !== null && state.operator !== null;
  const leftValue = hasPendingOperation
    ? state.leftValue
    : getDisplayValue(state);
  const rightValue = hasPendingOperation
    ? getDisplayValue(state)
    : state.lastRightValue;
  const operator = hasPendingOperation ? state.operator : state.lastOperator;

  if (leftValue === null || rightValue === null || operator === null) {
    return state;
  }

  const result = calculate(leftValue, rightValue, operator);

  if (!Number.isFinite(result)) {
    return withError();
  }

  const display = formatNumber(result);

  return {
    ...state,
    display,
    formula: `${formatNumber(leftValue)} ${operatorSymbols[operator]} ${formatNumber(
      rightValue,
    )}`,
    lastOperator: operator,
    lastRightValue: rightValue,
    leftValue: null,
    operator: null,
    resetOnClear: true,
    waitingForOperand: true,
  };
}

function inputPercent(state: CalculatorState): CalculatorState {
  if (state.error) {
    return state;
  }

  const currentValue = getDisplayValue(state);
  const value =
    state.leftValue !== null &&
    (state.operator === "add" || state.operator === "subtract")
      ? (state.leftValue * currentValue) / 100
      : currentValue / 100;

  return {
    ...state,
    display: formatNumber(value),
    formula: getPendingFormula(state, formatNumber(value)),
  };
}

function toggleSign(state: CalculatorState): CalculatorState {
  if (state.error || state.display === "0") {
    return state;
  }

  const display = state.display.startsWith("-")
    ? state.display.slice(1)
    : `-${state.display}`;

  return {
    ...state,
    display,
    formula: getPendingFormula(state, display),
  };
}

export function reduceCalculatorInput(
  state: CalculatorState,
  input: CalculatorInput,
): CalculatorState {
  switch (input.type) {
    case "digit":
      return inputDigit(state, input.value);
    case "decimal":
      return inputDecimal(state);
    case "operator":
      return inputOperator(state, input.value);
    case "equals":
      return inputEquals(state);
    case "clear":
      if (state.error || state.display === "0") {
        return initialCalculatorState;
      }

      if (state.resetOnClear) {
        return initialCalculatorState;
      }

      return {
        ...state,
        display: "0",
        resetOnClear: false,
        waitingForOperand: true,
      };
    case "percent":
      return inputPercent(state);
    case "toggleSign":
      return toggleSign(state);
  }
}
