import {
  clampPercent,
  createInteractiveCalculator,
  safeDivide,
} from "../shared";

function calculateDrillingProductionOptimization(values) {
  const turnaroundImprovement = clampPercent(values.turnaroundImprovementPct);
  const engineerImprovement = clampPercent(values.engineerEfficiencyPct);
  const computeImprovement = clampPercent(values.computeEfficiencyPct);
  const decisionDelayReduction = clampPercent(values.decisionDelayReductionPct);
  const nptReduction = clampPercent(values.nonproductiveTimeReductionPct);
  const productionValueCapture = clampPercent(values.productionValueCapturePct);

  const cycleTimeReduction = values.turnaroundTimePerStudy * turnaroundImprovement;
  const annualHoursSaved =
    values.optimizationStudiesPerYear *
    values.engineeringHoursPerStudy *
    engineerImprovement;
  const capacityUnlocked = safeDivide(
    annualHoursSaved,
    values.engineeringHoursPerStudy,
  );

  const laborSavings = annualHoursSaved * values.engineerHourlyRate;
  const computeSavings =
    values.optimizationStudiesPerYear *
    values.computeCostPerStudy *
    computeImprovement;
  const delayedDecisionValue =
    values.optimizationStudiesPerYear *
    values.costOfDelayedDrillingOrProductionDecisions *
    decisionDelayReduction;
  const nptSavings =
    values.nonproductiveTimeCostPerYear * nptReduction;
  const productionValue =
    values.productionImprovementValuePerYear * productionValueCapture;
  const annualEconomicImpact =
    laborSavings + computeSavings + delayedDecisionValue + nptSavings + productionValue;
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
    capacityUnit: "studies per year",
  };
}

export const drillingProductionOptimization = createInteractiveCalculator(
  "oil-gas",
  {
    id: "drilling-production-optimization",
    name: "Drilling and Production Optimization",
    teaser:
      "Model ROI from faster optimization cycles and better drilling or production decisions.",
    businessOutcome:
      "Show how faster evaluation of drilling and production scenarios can improve operational decisions and reduce lost time from slow analysis cycles.",
    sections: [
      {
        key: "currentState",
        title: "Current-state inputs",
        fields: [
          {
            key: "optimizationStudiesPerYear",
            label: "Optimization studies per year",
            defaultValue: 24,
            min: 0,
            step: 1,
          },
          {
            key: "scenariosPerStudy",
            label: "Scenarios per study",
            defaultValue: 10,
            min: 0,
            step: 1,
          },
          {
            key: "turnaroundTimePerStudy",
            label: "Turnaround time per study",
            defaultValue: 7,
            min: 0,
            step: 0.1,
            suffix: "days",
          },
          {
            key: "engineeringHoursPerStudy",
            label: "Engineering hours per study",
            defaultValue: 120,
            min: 0,
            step: 5,
            suffix: "hours",
          },
          {
            key: "computeCostPerStudy",
            label: "Compute cost per study",
            defaultValue: 28000,
            min: 0,
            step: 500,
            prefix: "$",
          },
          {
            key: "costOfDelayedDrillingOrProductionDecisions",
            label: "Cost of delayed drilling or production decisions",
            defaultValue: 150000,
            min: 0,
            step: 1000,
            prefix: "$",
          },
          {
            key: "nonproductiveTimeCostPerYear",
            label: "Nonproductive time cost per year",
            defaultValue: 500000,
            min: 0,
            step: 5000,
            prefix: "$",
            advanced: true,
          },
          {
            key: "productionImprovementValuePerYear",
            label: "Estimated annual production improvement value",
            defaultValue: 700000,
            min: 0,
            step: 5000,
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
            key: "turnaroundImprovementPct",
            label: "Turnaround improvement",
            defaultValue: 0.2,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
          },
          {
            key: "engineerEfficiencyPct",
            label: "Engineering time reduction",
            defaultValue: 0.15,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
          },
          {
            key: "decisionDelayReductionPct",
            label: "Delayed decision exposure reduction",
            defaultValue: 0.18,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
          },
          {
            key: "nonproductiveTimeReductionPct",
            label: "Nonproductive time reduction",
            defaultValue: 0.1,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
            advanced: true,
          },
          {
            key: "productionValueCapturePct",
            label: "Production improvement value captured",
            defaultValue: 0.08,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
            advanced: true,
          },
          {
            key: "computeEfficiencyPct",
            label: "Compute cost reduction",
            defaultValue: 0.1,
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
            defaultValue: 180000,
            min: 0,
            step: 1000,
            prefix: "$",
          },
        ],
      },
    ],
    calculate: calculateDrillingProductionOptimization,
  },
);
