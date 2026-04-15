import {
  clampPercent,
  createInteractiveCalculator,
  safeDivide,
} from "../shared";

function calculateCfdAeroPerformance(values) {
  const turnaroundImprovement = clampPercent(values.turnaroundImprovementPct);
  const queueImprovement = clampPercent(values.queueReductionPct);
  const engineerImprovement = clampPercent(values.engineerEfficiencyPct);
  const computeImprovement = clampPercent(values.computeEfficiencyPct);
  const windTunnelReduction = clampPercent(values.windTunnelReductionPct);
  const redesignReduction = clampPercent(values.redesignReductionPct);

  const baselineCycleDays =
    values.averageTurnaroundTimePerSimulation + values.queueDelayPerSimulation;
  const improvedCycleDays =
    values.averageTurnaroundTimePerSimulation * (1 - turnaroundImprovement) +
    values.queueDelayPerSimulation * (1 - queueImprovement);
  const cycleTimeReduction = baselineCycleDays - improvedCycleDays;

  const annualHoursSaved =
    values.aeroStudiesPerYear *
    values.engineerHoursPerProgram *
    engineerImprovement;
  const capacityUnlocked = safeDivide(
    annualHoursSaved,
    values.engineerHoursPerProgram,
  );

  const laborSavings = annualHoursSaved * values.engineerHourlyRate;
  const computeSavings =
    values.aeroStudiesPerYear *
    values.computeCostPerProgram *
    computeImprovement;
  const windTunnelSavings =
    values.aeroStudiesPerYear *
    values.windTunnelTestCost *
    windTunnelReduction;
  const redesignSavings =
    values.aeroStudiesPerYear *
    values.redesignSensitivityCost *
    redesignReduction;
  const cycleAccelerationValue =
    values.aeroStudiesPerYear *
    values.simulationRunsPerProgram *
    cycleTimeReduction *
    values.valuePerSimulationDay;
  const annualEconomicImpact =
    laborSavings +
    computeSavings +
    windTunnelSavings +
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
    capacityUnit: "programs per year",
  };
}

export const cfdAeroPerformance = createInteractiveCalculator("aerospace-defense", {
  id: "cfd-aero-performance",
  name: "CFD / Aero Performance",
  teaser: "Model ROI from faster aerodynamic analysis and more design exploration.",
  businessOutcome:
    "Show how faster aero performance analysis can improve program decision velocity and increase schedule confidence across complex aerospace programs.",
  sections: [
    {
      key: "currentState",
      title: "Current-state inputs",
      fields: [
        {
          key: "aeroStudiesPerYear",
          label: "Aero studies per year",
          defaultValue: 20,
          min: 0,
          step: 1,
        },
        {
          key: "simulationRunsPerProgram",
          label: "Simulation runs per program",
          defaultValue: 22,
          min: 0,
          step: 1,
        },
        {
          key: "averageTurnaroundTimePerSimulation",
          label: "Average turnaround time per simulation",
          defaultValue: 4.5,
          min: 0,
          step: 0.1,
          suffix: "days",
        },
        {
          key: "queueDelayPerSimulation",
          label: "Queue delay per simulation",
          defaultValue: 1.5,
          min: 0,
          step: 0.1,
          suffix: "days",
        },
        {
          key: "engineerHoursPerProgram",
          label: "Engineer hours per program",
          defaultValue: 260,
          min: 0,
          step: 5,
          suffix: "hours",
        },
        {
          key: "computeCostPerProgram",
          label: "Compute cost per program",
          defaultValue: 44000,
          min: 0,
          step: 500,
          prefix: "$",
        },
        {
          key: "windTunnelTestCost",
          label: "Wind tunnel test cost",
          defaultValue: 120000,
          min: 0,
          step: 1000,
          prefix: "$",
          advanced: true,
        },
        {
          key: "redesignSensitivityCost",
          label: "Expected redesign cost per program",
          defaultValue: 95000,
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
          key: "queueReductionPct",
          label: "Queue delay reduction",
          defaultValue: 0.38,
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
          key: "windTunnelReductionPct",
          label: "Wind tunnel test reduction",
          defaultValue: 0.22,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
          advanced: true,
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
          defaultValue: 170,
          min: 0,
          step: 5,
          prefix: "$",
        },
        {
          key: "platformInvestment",
          label: "Annual platform investment",
          defaultValue: 185000,
          min: 0,
          step: 1000,
          prefix: "$",
        },
        {
          key: "valuePerSimulationDay",
          label: "Business value per simulation day accelerated",
          defaultValue: 3200,
          min: 0,
          step: 100,
          prefix: "$",
          advanced: true,
        },
      ],
    },
  ],
  calculate: calculateCfdAeroPerformance,
});
