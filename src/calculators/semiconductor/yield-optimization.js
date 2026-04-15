import {
  clampPercent,
  createInteractiveCalculator,
  safeDivide,
} from "../shared";

function calculateYieldOptimization(values) {
  const cycleImprovement = clampPercent(values.cycleTimeImprovementPct);
  const engineerImprovement = clampPercent(values.engineerEfficiencyPct);
  const computeImprovement = clampPercent(values.computeEfficiencyPct);
  const delayReduction = clampPercent(values.delaySensitivityReductionPct);

  const cycleTimeReduction = values.cycleTimePerCycle * cycleImprovement;
  const annualHoursSaved =
    values.yieldLearningCyclesPerYear *
    values.engineerHoursPerCycle *
    engineerImprovement;
  const capacityUnlocked = safeDivide(
    annualHoursSaved,
    values.engineerHoursPerCycle,
  );

  const laborSavings = annualHoursSaved * values.engineerHourlyRate;
  const computeSavings =
    values.yieldLearningCyclesPerYear *
    values.computeCostPerCycle *
    computeImprovement;
  const cycleAccelerationValue =
    values.yieldLearningCyclesPerYear *
    cycleTimeReduction *
    values.valuePerCycleDay;
  const delaySensitivityValue =
    values.delaySensitivityCost *
    delayReduction *
    values.yieldLearningCyclesPerYear;
  const annualEconomicImpact =
    laborSavings + computeSavings + cycleAccelerationValue + delaySensitivityValue;
  const annualInvestment = values.platformInvestment;
  const paybackPeriodMonths =
    annualEconomicImpact > 0
      ? (annualInvestment / annualEconomicImpact) * 12
      : 0;
  const roiPercent =
    annualInvestment > 0
      ? ((annualEconomicImpact - annualInvestment) / annualInvestment) * 100
      : 0;

  return {
    annualHoursSaved,
    cycleTimeReduction,
    capacityUnlocked,
    annualEconomicImpact,
    paybackPeriodMonths,
    roiPercent,
    capacityUnit: "cycles per year",
  };
}

export const yieldOptimization = createInteractiveCalculator("semiconductor", {
  id: "yield-optimization",
  name: "Yield Learning / Optimization",
  teaser: "Model ROI from faster learning cycles and improved yield tuning.",
  businessOutcome:
    "Show how running more yield-learning iterations faster can reduce time to process insight and accelerate improvement loops.",
  sections: [
    {
      key: "currentState",
      title: "Current-state inputs",
      fields: [
        {
          key: "yieldLearningCyclesPerYear",
          label: "Yield-learning cycles per year",
          defaultValue: 18,
          min: 0,
          step: 1,
        },
        {
          key: "runsPerCycle",
          label: "Meaningful runs or analyses per yield-learning cycle",
          defaultValue: 24,
          min: 0,
          step: 1,
        },
        {
          key: "cycleTimePerCycle",
          label: "Current cycle time per yield-learning cycle",
          defaultValue: 12,
          min: 0,
          step: 0.5,
          suffix: "days",
        },
        {
          key: "engineerHoursPerCycle",
          label: "Engineer hours per cycle",
          defaultValue: 95,
          min: 0,
          step: 1,
          suffix: "hours",
        },
        {
          key: "computeCostPerCycle",
          label: "Compute cost per cycle",
          defaultValue: 22000,
          min: 0,
          step: 500,
          prefix: "$",
        },
        {
          key: "delaySensitivityCost",
          label: "Cost of delaying one cycle",
          defaultValue: 12000,
          min: 0,
          step: 500,
          prefix: "$",
          advanced: true,
        },
      ],
    },
    {
      key: "improvements",
      title: "Improvement assumptions",
      fields: [
        {
          key: "cycleTimeImprovementPct",
          label: "Cycle-time improvement",
          defaultValue: 0.22,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
        },
        {
          key: "engineerEfficiencyPct",
          label: "Engineer time reduction",
          defaultValue: 0.14,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
        },
        {
          key: "computeEfficiencyPct",
          label: "Compute cost reduction",
          defaultValue: 0.12,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
          advanced: true,
        },
        {
          key: "delaySensitivityReductionPct",
          label: "Cost of delay reduction",
          defaultValue: 0.3,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
          advanced: true,
        },
      ],
    },
    {
      key: "financial",
      title: "Financial assumptions",
      fields: [
        {
          key: "engineerHourlyRate",
          label: "Engineer hourly cost",
          defaultValue: 160,
          min: 0,
          step: 5,
          prefix: "$",
        },
        {
          key: "platformInvestment",
          label: "Annual platform investment",
          defaultValue: 150000,
          min: 0,
          step: 1000,
          prefix: "$",
        },
        {
          key: "valuePerCycleDay",
          label: "Business value per cycle day accelerated",
          defaultValue: 5000,
          min: 0,
          step: 100,
          prefix: "$",
          advanced: true,
        },
      ],
    },
  ],
  calculate: calculateYieldOptimization,
});
