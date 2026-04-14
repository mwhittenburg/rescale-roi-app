import {
  clampPercent,
  createInteractiveCalculator,
  safeDivide,
} from "../shared";

function calculateMolecularDynamics(values) {
  const runtimeImprovement = clampPercent(values.runtimeImprovementPct);
  const queueImprovement = clampPercent(values.queueReductionPct);
  const scientistImprovement = clampPercent(values.scientistEfficiencyPct);
  const rerunReduction = clampPercent(values.rerunReductionPct);

  const baselineStudyDays =
    (values.simulationsPerStudy *
      (values.averageRuntimePerSimulation + values.queueDelayPerSimulation)) /
    24;
  const improvedStudyDays =
    (values.simulationsPerStudy *
      (values.averageRuntimePerSimulation * (1 - runtimeImprovement) +
        values.queueDelayPerSimulation * (1 - queueImprovement))) /
    24;
  const cycleTimeReduction = baselineStudyDays - improvedStudyDays;

  const annualHoursSaved =
    values.studiesPerYear *
    values.scientistHoursPerStudy *
    scientistImprovement;
  const capacityUnlocked = safeDivide(
    annualHoursSaved,
    values.scientistHoursPerStudy,
  );

  const laborSavings = annualHoursSaved * values.scientistHourlyRate;
  const computeSavings =
    values.studiesPerYear *
    values.computeCostPerStudy *
    (runtimeImprovement + values.rerunRate * rerunReduction);
  const storageSavings =
    values.studiesPerYear *
    values.storageCost *
    runtimeImprovement *
    0.5;
  const cycleAccelerationValue =
    values.studiesPerYear *
    cycleTimeReduction *
    values.valuePerStudyDay;
  const annualEconomicImpact =
    laborSavings + computeSavings + storageSavings + cycleAccelerationValue;
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

export const molecularDynamics = createInteractiveCalculator(
  "pharma-biopharma",
  {
    id: "molecular-dynamics",
    name: "Molecular Dynamics",
    teaser: "Model ROI from higher simulation capacity and shorter time to insight.",
    businessOutcome:
      "Show how shorter queue times and faster study completion can expand simulation capacity across the portfolio.",
    sections: [
      {
        key: "currentState",
        title: "Current-state inputs",
        fields: [
          {
            key: "studiesPerYear",
            label: "Studies per year",
            defaultValue: 24,
            min: 0,
            step: 1,
          },
          {
            key: "simulationsPerStudy",
            label: "Simulations per study",
            defaultValue: 30,
            min: 0,
            step: 1,
          },
          {
            key: "averageRuntimePerSimulation",
            label: "Average runtime per simulation",
            defaultValue: 18,
            min: 0,
            step: 0.5,
            suffix: "hours",
          },
          {
            key: "queueDelayPerSimulation",
            label: "Queue delay per simulation",
            defaultValue: 12,
            min: 0,
            step: 0.5,
            suffix: "hours",
          },
          {
            key: "scientistHoursPerStudy",
            label: "Scientist hours per study",
            defaultValue: 120,
            min: 0,
            step: 1,
            suffix: "hours",
          },
          {
            key: "computeCostPerStudy",
            label: "Compute cost per study",
            defaultValue: 18000,
            min: 0,
            step: 500,
            prefix: "$",
          },
          {
            key: "storageCost",
            label: "Storage cost per study",
            defaultValue: 1200,
            min: 0,
            step: 100,
            prefix: "$",
            advanced: true,
          },
          {
            key: "rerunRate",
            label: "Rerun rate",
            defaultValue: 0.12,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
            advanced: true,
          },
        ],
      },
      {
        key: "improvements",
        title: "Improvement assumptions",
        fields: [
          {
            key: "runtimeImprovementPct",
            label: "Runtime improvement",
            defaultValue: 0.3,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
          },
          {
            key: "queueReductionPct",
            label: "Queue delay reduction",
            defaultValue: 0.55,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
          },
          {
            key: "scientistEfficiencyPct",
            label: "Scientist time reduction",
            defaultValue: 0.2,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
            advanced: true,
          },
          {
            key: "rerunReductionPct",
            label: "Rerun reduction",
            defaultValue: 0.35,
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
            key: "scientistHourlyRate",
            label: "Scientist hourly cost",
            defaultValue: 145,
            min: 0,
            step: 5,
            prefix: "$",
          },
          {
            key: "platformInvestment",
            label: "Annual platform investment",
            defaultValue: 110000,
            min: 0,
            step: 1000,
            prefix: "$",
          },
          {
            key: "valuePerStudyDay",
            label: "Business value per study day accelerated",
            defaultValue: 3000,
            min: 0,
            step: 100,
            prefix: "$",
            advanced: true,
          },
        ],
      },
    ],
    calculate: calculateMolecularDynamics,
  },
);
