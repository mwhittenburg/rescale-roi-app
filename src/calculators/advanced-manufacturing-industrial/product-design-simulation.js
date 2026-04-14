import {
  clampPercent,
  createInteractiveCalculator,
  safeDivide,
} from "../shared";

function calculateProductDesignSimulation(values) {
  const iterationImprovement = clampPercent(values.iterationTimeImprovementPct);
  const engineerImprovement = clampPercent(values.engineerEfficiencyPct);
  const prototypeReduction = clampPercent(values.prototypeReductionPct);
  const redesignReduction = clampPercent(values.redesignReductionPct);
  const computeImprovement = clampPercent(values.computeEfficiencyPct);

  const cycleTimeReduction = values.cycleTimePerIteration * iterationImprovement;
  const annualHoursSaved =
    values.designStudiesPerYear *
    values.simulationIterationsPerProgram *
    values.engineerHoursPerIteration *
    engineerImprovement;
  const capacityUnlocked = safeDivide(
    annualHoursSaved,
    values.engineerHoursPerIteration,
  );

  const laborSavings = annualHoursSaved * values.engineerHourlyRate;
  const computeSavings =
    values.designStudiesPerYear *
    values.simulationIterationsPerProgram *
    values.computeCostPerIteration *
    computeImprovement;
  const prototypeSavings =
    values.designStudiesPerYear *
    values.physicalPrototypeCost *
    prototypeReduction;
  const redesignSavings =
    values.designStudiesPerYear *
    values.lateStageRedesignCost *
    redesignReduction;
  const cycleAccelerationValue =
    values.designStudiesPerYear *
    values.simulationIterationsPerProgram *
    cycleTimeReduction *
    values.valuePerIterationDay;
  const annualEconomicImpact =
    laborSavings +
    computeSavings +
    prototypeSavings +
    redesignSavings +
    cycleAccelerationValue;
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
    capacityUnit: "iterations per year",
  };
}

export const productDesignSimulation = createInteractiveCalculator(
  "advanced-manufacturing-industrial",
  {
    id: "product-design-simulation",
    name: "Product Design Simulation",
    teaser:
      "Model ROI from faster design iteration and fewer physical prototypes.",
    businessOutcome:
      "Show how evaluating more design concepts faster can reduce prototype cycles and accelerate engineering decisions.",
    sections: [
      {
        key: "currentState",
        title: "Current-state inputs",
        fields: [
          {
            key: "designStudiesPerYear",
            label: "Design studies per year",
            defaultValue: 20,
            min: 0,
            step: 1,
          },
          {
            key: "simulationIterationsPerProgram",
            label: "Simulation iterations per program",
            defaultValue: 14,
            min: 0,
            step: 1,
          },
          {
            key: "engineerHoursPerIteration",
            label: "Engineer hours per iteration",
            defaultValue: 24,
            min: 0,
            step: 1,
            suffix: "hours",
          },
          {
            key: "computeCostPerIteration",
            label: "Compute cost per iteration",
            defaultValue: 3200,
            min: 0,
            step: 100,
            prefix: "$",
          },
          {
            key: "physicalPrototypeCost",
            label: "Physical prototype cost",
            defaultValue: 65000,
            min: 0,
            step: 1000,
            prefix: "$",
          },
          {
            key: "cycleTimePerIteration",
            label: "Cycle time per iteration",
            defaultValue: 6,
            min: 0,
            step: 0.5,
            suffix: "days",
          },
          {
            key: "lateStageRedesignCost",
            label: "Late-stage redesign cost",
            defaultValue: 85000,
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
            key: "iterationTimeImprovementPct",
            label: "Iteration cycle-time improvement",
            defaultValue: 0.22,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
          },
          {
            key: "engineerEfficiencyPct",
            label: "Engineer time reduction",
            defaultValue: 0.16,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
          },
          {
            key: "prototypeReductionPct",
            label: "Prototype reduction",
            defaultValue: 0.3,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
          },
          {
            key: "redesignReductionPct",
            label: "Late-stage redesign reduction",
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
            defaultValue: 145,
            min: 0,
            step: 5,
            prefix: "$",
          },
          {
            key: "platformInvestment",
            label: "Annual platform investment",
            defaultValue: 140000,
            min: 0,
            step: 1000,
            prefix: "$",
          },
          {
            key: "valuePerIterationDay",
            label: "Business value per iteration day accelerated",
            defaultValue: 2200,
            min: 0,
            step: 100,
            prefix: "$",
            advanced: true,
          },
        ],
      },
    ],
    calculate: calculateProductDesignSimulation,
  },
);
