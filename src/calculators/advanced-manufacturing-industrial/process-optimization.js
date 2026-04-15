import {
  clampPercent,
  createInteractiveCalculator,
  safeDivide,
} from "../shared";

function calculateProcessOptimization(values) {
  const cycleImprovement = clampPercent(values.cycleTimeImprovementPct);
  const engineerImprovement = clampPercent(values.engineerEfficiencyPct);
  const computeImprovement = clampPercent(values.computeEfficiencyPct);
  const trialReduction = clampPercent(values.physicalTrialReductionPct);
  const yieldCapture = clampPercent(values.yieldSensitivityCapturePct);
  const reworkReduction = clampPercent(values.reworkReductionPct);

  const cycleTimeReduction = values.cycleTimePerStudy * cycleImprovement;
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
  const trialSavings =
    values.optimizationStudiesPerYear *
    values.costOfPhysicalTrials *
    trialReduction;
  const throughputValue =
    values.throughputOrEnergyImpactValue * yieldCapture;
  const reworkSavings =
    values.optimizationStudiesPerYear *
    values.reworkCostPerStudy *
    reworkReduction;
  const annualEconomicImpact =
    laborSavings + computeSavings + trialSavings + throughputValue + reworkSavings;
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

export const processOptimization = createInteractiveCalculator(
  "advanced-manufacturing-industrial",
  {
    id: "process-optimization",
    name: "Process Optimization",
    teaser:
      "Model ROI from faster optimization cycles and more efficient operations.",
    businessOutcome:
      "Show how virtual process experiments can reduce optimization time while improving throughput, cost efficiency, and operating performance.",
    sections: [
      {
        key: "currentState",
        title: "Current-state inputs",
        fields: [
          {
            key: "optimizationStudiesPerYear",
            label: "Optimization studies per year",
            defaultValue: 28,
            min: 0,
            step: 1,
          },
          {
            key: "cycleTimePerStudy",
            label: "Cycle time per study",
            defaultValue: 11,
            min: 0,
            step: 0.5,
            suffix: "days",
          },
          {
            key: "engineeringHoursPerStudy",
            label: "Engineering hours per study",
            defaultValue: 85,
            min: 0,
            step: 1,
            suffix: "hours",
          },
          {
            key: "computeCostPerStudy",
            label: "Compute cost per study",
            defaultValue: 14000,
            min: 0,
            step: 500,
            prefix: "$",
          },
          {
            key: "costOfPhysicalTrials",
            label: "Cost of physical trials or process experiments",
            defaultValue: 22000,
            min: 0,
            step: 500,
            prefix: "$",
          },
          {
            key: "throughputOrEnergyImpactValue",
            label: "Estimated annual value from throughput, scrap, or energy improvement",
            defaultValue: 450000,
            min: 0,
            step: 5000,
            prefix: "$",
          },
          {
            key: "reworkCostPerStudy",
            label: "Rework cost per study",
            defaultValue: 9000,
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
            key: "physicalTrialReductionPct",
            label: "Physical trial reduction",
            defaultValue: 0.25,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
          },
          {
            key: "yieldSensitivityCapturePct",
            label: "Throughput, scrap, or energy value captured",
            defaultValue: 0.09,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
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
          {
            key: "reworkReductionPct",
            label: "Rework reduction",
            defaultValue: 0.22,
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
            defaultValue: 140,
            min: 0,
            step: 5,
            prefix: "$",
          },
          {
            key: "platformInvestment",
            label: "Annual platform investment",
            defaultValue: 135000,
            min: 0,
            step: 1000,
            prefix: "$",
          },
        ],
      },
    ],
    calculate: calculateProcessOptimization,
  },
);
