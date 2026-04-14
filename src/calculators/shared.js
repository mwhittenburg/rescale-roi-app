export function createCalculator(industryId, config) {
  return {
    industryId,
    calculatorType: "content",
    ...config,
  };
}

export function createInteractiveCalculator(industryId, config) {
  return {
    industryId,
    calculatorType: "interactive",
    advancedSectionLabel: "Advanced inputs",
    ...config,
  };
}

export function clampPercent(value) {
  return Math.max(0, Math.min(value, 0.95));
}

export function safeDivide(value, divisor) {
  if (!divisor) {
    return 0;
  }

  return value / divisor;
}
