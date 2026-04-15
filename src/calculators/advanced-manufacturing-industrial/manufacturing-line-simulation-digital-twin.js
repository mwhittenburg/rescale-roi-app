import {
  clampPercent,
  createInteractiveCalculator,
  safeDivide,
} from "../shared";

function calculateManufacturingLineSimulation(values) {
  const simulationImprovement = clampPercent(values.simulationTimeImprovementPct);
  const queueImprovement = clampPercent(values.queueReductionPct);
  const engineerImprovement = clampPercent(values.engineerEfficiencyPct);
  const downtimeReduction = clampPercent(values.downtimeReductionPct);
  const throughputCapture = clampPercent(values.throughputCapturePct);
  const computeImprovement = clampPercent(values.computeEfficiencyPct);

  const baselineCycleDays =
    values.currentTimePerSimulationStudy + values.queueWaitTime;
  const improvedCycleDays =
    values.currentTimePerSimulationStudy * (1 - simulationImprovement) +
    values.queueWaitTime * (1 - queueImprovement);
  const cycleTimeReduction = baselineCycleDays - improvedCycleDays;

  const annualHoursSaved =
    values.lineStudiesPerYear *
    values.engineerHoursPerStudy *
    engineerImprovement;
  const capacityUnlocked = safeDivide(
    annualHoursSaved,
    values.engineerHoursPerStudy,
  );

  const laborSavings = annualHoursSaved * values.engineerHourlyRate;
  const computeSavings =
    values.lineStudiesPerYear *
    values.computeCostPerStudy *
    computeImprovement;
  const scenarioValue =
    values.improvementScenariosTestedPerQuarter *
    4 *
    values.valuePerScenarioDecision *
    queueImprovement;
  const downtimeSavings =
    values.downtimeCostPerHour *
    values.annualDowntimeHours *
    downtimeReduction;
  const throughputValue =
    values.throughputValuePerYear * throughputCapture;
  const annualEconomicImpact =
    laborSavings + computeSavings + scenarioValue + downtimeSavings + throughputValue;
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

export const manufacturingLineSimulationDigitalTwin = createInteractiveCalculator(
  "advanced-manufacturing-industrial",
  {
    id: "manufacturing-line-simulation-digital-twin",
    name: "Manufacturing Line Simulation / Digital Twin",
    teaser:
      "Model ROI from better line planning, throughput forecasting, and operational decisions.",
    businessOutcome:
      "Show how testing more line scenarios faster can reduce bottlenecks and improve factory-floor decision speed before changes are made.",
    sections: [
      {
        key: "currentState",
        title: "Current-state inputs",
        fields: [
          {
            key: "lineStudiesPerYear",
            label: "Line studies or scenarios per year",
            defaultValue: 36,
            min: 0,
            step: 1,
          },
          {
            key: "currentTimePerSimulationStudy",
            label: "Current turnaround time per simulation study",
            defaultValue: 8,
            min: 0,
            step: 0.5,
            suffix: "days",
          },
          {
            key: "queueWaitTime",
            label: "Average queue or wait time",
            defaultValue: 3,
            min: 0,
            step: 0.5,
            suffix: "days",
          },
          {
            key: "engineerHoursPerStudy",
            label: "Engineer hours per study",
            defaultValue: 70,
            min: 0,
            step: 1,
            suffix: "hours",
          },
          {
            key: "computeCostPerStudy",
            label: "Compute cost per study",
            defaultValue: 12000,
            min: 0,
            step: 500,
            prefix: "$",
          },
          {
            key: "improvementScenariosTestedPerQuarter",
            label: "Improvement scenarios tested per quarter",
            defaultValue: 6,
            min: 0,
            step: 1,
          },
          {
            key: "annualDowntimeHours",
            label: "Annual downtime hours affected",
            defaultValue: 40,
            min: 0,
            step: 1,
            suffix: "hours",
            advanced: true,
          },
        ],
      },
      {
        key: "improvements",
        title: "Improvement assumptions",
        fields: [
          {
            key: "simulationTimeImprovementPct",
            label: "Simulation study time reduction",
            defaultValue: 0.24,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
          },
          {
            key: "queueReductionPct",
            label: "Queue or wait reduction",
            defaultValue: 0.45,
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
            advanced: true,
          },
          {
            key: "downtimeReductionPct",
            label: "Downtime reduction",
            defaultValue: 0.18,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
            advanced: true,
          },
          {
            key: "throughputCapturePct",
            label: "Throughput value captured",
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
        key: "financial",
        title: "Financial assumptions",
        fields: [
          {
            key: "engineerHourlyRate",
            label: "Engineer hourly cost",
            defaultValue: 135,
            min: 0,
            step: 5,
            prefix: "$",
          },
          {
            key: "platformInvestment",
            label: "Annual platform investment",
            defaultValue: 145000,
            min: 0,
            step: 1000,
            prefix: "$",
          },
          {
            key: "valuePerScenarioDecision",
            label: "Estimated value per improved scenario decision",
            defaultValue: 15000,
            min: 0,
            step: 500,
            prefix: "$",
            advanced: true,
          },
          {
            key: "downtimeCostPerHour",
            label: "Downtime cost per hour",
            defaultValue: 4500,
            min: 0,
            step: 100,
            prefix: "$",
            advanced: true,
          },
          {
            key: "throughputValuePerYear",
            label: "Annual throughput value at stake",
            defaultValue: 600000,
            min: 0,
            step: 5000,
            prefix: "$",
            advanced: true,
          },
        ],
      },
    ],
    calculate: calculateManufacturingLineSimulation,
  },
);
