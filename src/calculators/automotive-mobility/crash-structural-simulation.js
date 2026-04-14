import {
  clampPercent,
  createInteractiveCalculator,
  safeDivide,
} from "../shared";

function calculateCrashStructuralSimulation(values) {
  const turnaroundImprovement = clampPercent(values.turnaroundImprovementPct);
  const engineerImprovement = clampPercent(values.engineerEfficiencyPct);
  const computeImprovement = clampPercent(values.computeEfficiencyPct);
  const prototypeReduction = clampPercent(values.prototypeReductionPct);
  const redesignReduction = clampPercent(values.redesignReductionPct);
  const reworkReduction = clampPercent(values.reworkReductionPct);

  const cycleTimeReduction =
    values.averageTurnaroundTimePerSimulation * turnaroundImprovement;
  const annualHoursSaved =
    values.programsPerYear *
    values.engineerHoursPerProgram *
    engineerImprovement;
  const capacityUnlocked = safeDivide(
    annualHoursSaved,
    values.engineerHoursPerProgram,
  );

  const laborSavings = annualHoursSaved * values.engineerHourlyRate;
  const computeSavings =
    values.programsPerYear *
    values.computeCostPerProgram *
    computeImprovement;
  const prototypeSavings =
    values.programsPerYear *
    values.physicalValidationTestCost *
    prototypeReduction;
  const redesignSavings =
    values.programsPerYear *
    values.redesignSensitivityCost *
    redesignReduction;
  const reworkSavings =
    values.programsPerYear *
    values.reworkSensitivityCost *
    reworkReduction;
  const annualEconomicImpact =
    laborSavings +
    computeSavings +
    prototypeSavings +
    redesignSavings +
    reworkSavings;
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
    capacityUnit: "programs per year",
  };
}

export const crashStructuralSimulation = createInteractiveCalculator(
  "automotive-mobility",
  {
    id: "crash-structural-simulation",
    name: "Crash / Structural Simulation",
    teaser:
      "Model ROI from more simulation throughput and earlier structural insight.",
    businessOutcome:
      "Show how testing more crash and structural scenarios virtually can reduce validation cost and improve vehicle program speed.",
    sections: [
      {
        key: "currentState",
        title: "Current-state inputs",
        fields: [
          {
            key: "programsPerYear",
            label: "Programs per year",
            defaultValue: 8,
            min: 0,
            step: 1,
          },
          {
            key: "simulationsPerProgram",
            label: "Structural or crash simulations per program",
            defaultValue: 28,
            min: 0,
            step: 1,
          },
          {
            key: "averageTurnaroundTimePerSimulation",
            label: "Average turnaround time per simulation",
            defaultValue: 4.2,
            min: 0,
            step: 0.1,
            suffix: "days",
          },
          {
            key: "engineerHoursPerProgram",
            label: "Engineer hours per program",
            defaultValue: 240,
            min: 0,
            step: 5,
            suffix: "hours",
          },
          {
            key: "computeCostPerProgram",
            label: "Compute cost per program",
            defaultValue: 38000,
            min: 0,
            step: 500,
            prefix: "$",
          },
          {
            key: "physicalValidationTestCost",
            label: "Physical prototype or validation test cost",
            defaultValue: 95000,
            min: 0,
            step: 1000,
            prefix: "$",
          },
          {
            key: "redesignSensitivityCost",
            label: "Redesign sensitivity per program",
            defaultValue: 85000,
            min: 0,
            step: 1000,
            prefix: "$",
            advanced: true,
          },
          {
            key: "reworkSensitivityCost",
            label: "Rework sensitivity per program",
            defaultValue: 40000,
            min: 0,
            step: 1000,
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
            label: "Engineer time reduction",
            defaultValue: 0.15,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
          },
          {
            key: "prototypeReductionPct",
            label: "Validation test reduction",
            defaultValue: 0.22,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
          },
          {
            key: "redesignReductionPct",
            label: "Redesign reduction",
            defaultValue: 0.16,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
            advanced: true,
          },
          {
            key: "reworkReductionPct",
            label: "Rework reduction",
            defaultValue: 0.18,
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
            defaultValue: 165000,
            min: 0,
            step: 1000,
            prefix: "$",
          },
        ],
      },
    ],
    calculate: calculateCrashStructuralSimulation,
  },
);
