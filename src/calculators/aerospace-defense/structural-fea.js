import {
  clampPercent,
  createInteractiveCalculator,
  safeDivide,
} from "../shared";

function calculateStructuralFea(values) {
  const turnaroundImprovement = clampPercent(values.turnaroundImprovementPct);
  const engineerImprovement = clampPercent(values.engineerEfficiencyPct);
  const computeImprovement = clampPercent(values.computeEfficiencyPct);
  const prototypeReduction = clampPercent(values.prototypeReductionPct);
  const redesignReduction = clampPercent(values.redesignReductionPct);
  const reworkReduction = clampPercent(values.validationReworkReductionPct);

  const cycleTimeReduction =
    values.averageTurnaroundTimePerSimulation * turnaroundImprovement;
  const annualHoursSaved =
    values.structuralStudiesPerYear *
    values.engineerHoursPerProgram *
    engineerImprovement;
  const capacityUnlocked = safeDivide(
    annualHoursSaved,
    values.engineerHoursPerProgram,
  );

  const laborSavings = annualHoursSaved * values.engineerHourlyRate;
  const computeSavings =
    values.structuralStudiesPerYear *
    values.computeCostPerProgram *
    computeImprovement;
  const prototypeSavings =
    values.structuralStudiesPerYear *
    values.physicalTestOrPrototypeCost *
    prototypeReduction;
  const redesignSavings =
    values.structuralStudiesPerYear *
    values.redesignSensitivityCost *
    redesignReduction;
  const reworkSavings =
    values.structuralStudiesPerYear *
    values.validationReworkSensitivityCost *
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

export const structuralFea = createInteractiveCalculator("aerospace-defense", {
  id: "structural-fea",
  name: "Structural / FEA",
  teaser: "Model ROI from faster structural analysis and improved engineering throughput.",
  businessOutcome:
    "Show how testing more structural scenarios virtually can improve validation readiness and reduce late-stage redesign pressure.",
  sections: [
    {
      key: "currentState",
      title: "Current-state inputs",
      fields: [
        {
          key: "structuralStudiesPerYear",
          label: "Structural studies per year",
          defaultValue: 16,
          min: 0,
          step: 1,
        },
        {
          key: "simulationsPerProgram",
          label: "Simulations per program",
          defaultValue: 20,
          min: 0,
          step: 1,
        },
        {
          key: "averageTurnaroundTimePerSimulation",
          label: "Average turnaround time per simulation",
          defaultValue: 5.5,
          min: 0,
          step: 0.1,
          suffix: "days",
        },
        {
          key: "engineerHoursPerProgram",
          label: "Engineer hours per program",
          defaultValue: 280,
          min: 0,
          step: 5,
          suffix: "hours",
        },
        {
          key: "computeCostPerProgram",
          label: "Compute cost per program",
          defaultValue: 50000,
          min: 0,
          step: 500,
          prefix: "$",
        },
        {
          key: "physicalTestOrPrototypeCost",
          label: "Physical test or prototype cost",
          defaultValue: 140000,
          min: 0,
          step: 1000,
          prefix: "$",
        },
        {
          key: "redesignSensitivityCost",
          label: "Expected redesign cost per program",
          defaultValue: 110000,
          min: 0,
          step: 1000,
          prefix: "$",
          advanced: true,
        },
        {
          key: "validationReworkSensitivityCost",
          label: "Expected validation rework cost per program",
          defaultValue: 65000,
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
          defaultValue: 0.18,
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
          key: "prototypeReductionPct",
          label: "Physical test reduction",
          defaultValue: 0.2,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
        },
        {
          key: "redesignReductionPct",
          label: "Redesign reduction",
          defaultValue: 0.15,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
          advanced: true,
        },
        {
          key: "validationReworkReductionPct",
          label: "Validation rework reduction",
          defaultValue: 0.16,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
          advanced: true,
        },
        {
          key: "computeEfficiencyPct",
          label: "Compute cost reduction",
          defaultValue: 0.09,
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
          defaultValue: 172,
          min: 0,
          step: 5,
          prefix: "$",
        },
        {
          key: "platformInvestment",
          label: "Annual platform investment",
          defaultValue: 190000,
          min: 0,
          step: 1000,
          prefix: "$",
        },
      ],
    },
  ],
  calculate: calculateStructuralFea,
});
