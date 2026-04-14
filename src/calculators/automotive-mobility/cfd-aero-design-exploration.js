import {
  clampPercent,
  createInteractiveCalculator,
  safeDivide,
} from "../shared";

function calculateCfdAeroDesignExploration(values) {
  const turnaroundImprovement = clampPercent(values.turnaroundImprovementPct);
  const queueImprovement = clampPercent(values.queueReductionPct);
  const engineerImprovement = clampPercent(values.engineerEfficiencyPct);
  const computeImprovement = clampPercent(values.computeEfficiencyPct);
  const prototypeReduction = clampPercent(values.prototypeReductionPct);
  const redesignReduction = clampPercent(values.redesignReductionPct);

  const baselineCycleDays =
    values.averageTurnaroundTimePerSimulation + values.queueDelayPerSimulation;
  const improvedCycleDays =
    values.averageTurnaroundTimePerSimulation * (1 - turnaroundImprovement) +
    values.queueDelayPerSimulation * (1 - queueImprovement);
  const cycleTimeReduction = baselineCycleDays - improvedCycleDays;

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
    values.windTunnelOrPrototypeTestCost *
    prototypeReduction;
  const redesignSavings =
    values.designStudiesPerYear *
    values.redesignSensitivityCost *
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

export const cfdAeroDesignExploration = createInteractiveCalculator(
  "automotive-mobility",
  {
    id: "cfd-aero-design-exploration",
    name: "CFD / Aero Design Exploration",
    teaser:
      "Model ROI from faster aerodynamic exploration and improved design decisions.",
    businessOutcome:
      "Show how evaluating more aerodynamic or thermal options faster can improve vehicle program speed with fewer testing delays and prototype cycles.",
    sections: [
      {
        key: "currentState",
        title: "Current-state inputs",
        fields: [
          {
            key: "designStudiesPerYear",
            label: "Design studies per year",
            defaultValue: 24,
            min: 0,
            step: 1,
          },
          {
            key: "simulationIterationsPerProgram",
            label: "Simulation iterations per program",
            defaultValue: 18,
            min: 0,
            step: 1,
          },
          {
            key: "averageTurnaroundTimePerSimulation",
            label: "Average turnaround time per simulation",
            defaultValue: 3.5,
            min: 0,
            step: 0.1,
            suffix: "days",
          },
          {
            key: "queueDelayPerSimulation",
            label: "Queue delay per simulation",
            defaultValue: 1.2,
            min: 0,
            step: 0.1,
            suffix: "days",
          },
          {
            key: "engineerHoursPerIteration",
            label: "Engineer hours per iteration",
            defaultValue: 18,
            min: 0,
            step: 1,
            suffix: "hours",
          },
          {
            key: "computeCostPerIteration",
            label: "Compute cost per iteration",
            defaultValue: 2600,
            min: 0,
            step: 100,
            prefix: "$",
          },
          {
            key: "windTunnelOrPrototypeTestCost",
            label: "Wind tunnel or prototype test cost",
            defaultValue: 42000,
            min: 0,
            step: 1000,
            prefix: "$",
            advanced: true,
          },
          {
            key: "redesignSensitivityCost",
            label: "Redesign sensitivity per program",
            defaultValue: 70000,
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
            defaultValue: 0.22,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
          },
          {
            key: "queueReductionPct",
            label: "Queue delay reduction",
            defaultValue: 0.4,
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
            defaultValue: 0.26,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
            advanced: true,
          },
          {
            key: "redesignReductionPct",
            label: "Redesign reduction",
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
            defaultValue: 155,
            min: 0,
            step: 5,
            prefix: "$",
          },
          {
            key: "platformInvestment",
            label: "Annual platform investment",
            defaultValue: 155000,
            min: 0,
            step: 1000,
            prefix: "$",
          },
          {
            key: "valuePerIterationDay",
            label: "Business value per iteration day accelerated",
            defaultValue: 2600,
            min: 0,
            step: 100,
            prefix: "$",
            advanced: true,
          },
        ],
      },
    ],
    calculate: calculateCfdAeroDesignExploration,
  },
);
