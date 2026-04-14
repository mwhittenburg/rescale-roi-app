import {
  clampPercent,
  createInteractiveCalculator,
  safeDivide,
} from "../shared";

function calculateReservoirSimulation(values) {
  const turnaroundImprovement = clampPercent(values.turnaroundImprovementPct);
  const queueImprovement = clampPercent(values.queueReductionPct);
  const engineerImprovement = clampPercent(values.engineerEfficiencyPct);
  const computeImprovement = clampPercent(values.computeEfficiencyPct);
  const decisionDelayReduction = clampPercent(values.delayedDecisionReductionPct);
  const scenarioExpansion = clampPercent(values.additionalScenarioValueCapturePct);

  const baselineCycleDays =
    values.averageTurnaroundTimePerScenario + values.queueDelayPerScenario;
  const improvedCycleDays =
    values.averageTurnaroundTimePerScenario * (1 - turnaroundImprovement) +
    values.queueDelayPerScenario * (1 - queueImprovement);
  const cycleTimeReduction = baselineCycleDays - improvedCycleDays;

  const annualHoursSaved =
    values.reservoirStudiesPerYear *
    values.engineerOrGeoscientistHoursPerStudy *
    engineerImprovement;
  const capacityUnlocked = safeDivide(
    annualHoursSaved,
    values.engineerOrGeoscientistHoursPerStudy,
  );

  const laborSavings = annualHoursSaved * values.engineerHourlyRate;
  const computeSavings =
    values.reservoirStudiesPerYear *
    values.computeCostPerStudy *
    computeImprovement;
  const decisionSpeedValue =
    values.reservoirStudiesPerYear *
    values.delayedDecisionCost *
    decisionDelayReduction;
  const scenarioValue =
    values.reservoirStudiesPerYear *
    values.scenariosPerStudy *
    values.additionalScenarioValue *
    scenarioExpansion;
  const annualEconomicImpact =
    laborSavings + computeSavings + decisionSpeedValue + scenarioValue;
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

export const reservoirSimulationFieldDevelopmentPlanning =
  createInteractiveCalculator("oil-gas", {
    id: "reservoir-simulation-field-development-planning",
    name: "Reservoir Simulation / Field Development Planning",
    teaser:
      "Model ROI from evaluating more field development scenarios with less delay.",
    businessOutcome:
      "Show how faster reservoir scenario evaluation can improve field planning decisions and reduce the cost of delayed development choices.",
    sections: [
      {
        key: "currentState",
        title: "Current-state inputs",
        fields: [
          {
            key: "reservoirStudiesPerYear",
            label: "Reservoir studies per year",
            defaultValue: 18,
            min: 0,
            step: 1,
          },
          {
            key: "scenariosPerStudy",
            label: "Scenarios per study",
            defaultValue: 14,
            min: 0,
            step: 1,
          },
          {
            key: "averageTurnaroundTimePerScenario",
            label: "Average turnaround time per scenario",
            defaultValue: 6,
            min: 0,
            step: 0.1,
            suffix: "days",
          },
          {
            key: "queueDelayPerScenario",
            label: "Queue delay per scenario",
            defaultValue: 2,
            min: 0,
            step: 0.1,
            suffix: "days",
          },
          {
            key: "engineerOrGeoscientistHoursPerStudy",
            label: "Engineer or geoscientist hours per study",
            defaultValue: 180,
            min: 0,
            step: 5,
            suffix: "hours",
          },
          {
            key: "computeCostPerStudy",
            label: "Compute cost per study",
            defaultValue: 38000,
            min: 0,
            step: 500,
            prefix: "$",
          },
          {
            key: "delayedDecisionCost",
            label: "Cost of delayed planning decisions",
            defaultValue: 160000,
            min: 0,
            step: 1000,
            prefix: "$",
            advanced: true,
          },
          {
            key: "additionalScenarioValue",
            label: "Value per additional scenario considered",
            defaultValue: 4500,
            min: 0,
            step: 100,
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
            label: "Engineer or geoscientist time reduction",
            defaultValue: 0.15,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
          },
          {
            key: "delayedDecisionReductionPct",
            label: "Delayed decision exposure reduction",
            defaultValue: 0.2,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
            advanced: true,
          },
          {
            key: "additionalScenarioValueCapturePct",
            label: "Additional scenario value captured",
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
            label: "Engineer or geoscientist hourly cost",
            defaultValue: 165,
            min: 0,
            step: 5,
            prefix: "$",
          },
          {
            key: "platformInvestment",
            label: "Annual platform investment",
            defaultValue: 175000,
            min: 0,
            step: 1000,
            prefix: "$",
          },
        ],
      },
    ],
    calculate: calculateReservoirSimulation,
  });
