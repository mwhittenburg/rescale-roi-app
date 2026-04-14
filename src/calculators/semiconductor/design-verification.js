import {
  clampPercent,
  createInteractiveCalculator,
  safeDivide,
} from "../shared";

function calculateDesignVerification(values) {
  const turnaroundImprovement = clampPercent(values.turnaroundImprovementPct);
  const queueImprovement = clampPercent(values.queueReductionPct);
  const engineerImprovement = clampPercent(values.engineerEfficiencyPct);
  const computeImprovement = clampPercent(values.computeEfficiencyPct);
  const overheadReduction = clampPercent(values.infrastructureOverheadReductionPct);

  const baselineRunDays =
    values.averageTurnaroundTimePerRun + values.queueDelayPerRun;
  const improvedRunDays =
    values.averageTurnaroundTimePerRun * (1 - turnaroundImprovement) +
    values.queueDelayPerRun * (1 - queueImprovement);
  const cycleTimeReduction = baselineRunDays - improvedRunDays;

  const annualHoursSaved =
    values.projectsPerYear *
    values.engineerHoursPerProject *
    engineerImprovement;
  const capacityUnlocked = safeDivide(
    annualHoursSaved,
    values.engineerHoursPerProject,
  );

  const laborSavings = annualHoursSaved * values.engineerHourlyRate;
  const computeSavings =
    values.projectsPerYear *
    values.computeCostPerProject *
    computeImprovement;
  const infrastructureSavings =
    values.projectsPerYear *
    values.infrastructureOverhead *
    overheadReduction;
  const scheduleAccelerationValue =
    values.projectsPerYear *
    values.verificationRunsPerProject *
    cycleTimeReduction *
    values.valuePerRunDay;
  const peakDemandValue =
    values.peakDemandPeriods * values.peakDelayCostPerPeriod * queueImprovement;
  const annualEconomicImpact =
    laborSavings +
    computeSavings +
    infrastructureSavings +
    scheduleAccelerationValue +
    peakDemandValue;
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
    capacityUnit: "projects per year",
  };
}

export const designVerification = createInteractiveCalculator("semiconductor", {
  id: "design-verification",
  name: "Chip Design Verification",
  teaser:
    "Model ROI from shorter verification cycles and faster tape-out readiness.",
  businessOutcome:
    "Show how faster verification turnaround and burst capacity can reduce schedule pressure without overbuilding fixed infrastructure.",
  sections: [
    {
      key: "currentState",
      title: "Current-state inputs",
      fields: [
        {
          key: "verificationRunsPerProject",
          label: "Verification runs per project",
          defaultValue: 180,
          min: 0,
          step: 1,
        },
        {
          key: "projectsPerYear",
          label: "Projects per year",
          defaultValue: 6,
          min: 0,
          step: 1,
        },
        {
          key: "averageTurnaroundTimePerRun",
          label: "Average turnaround time per run",
          defaultValue: 1.6,
          min: 0,
          step: 0.1,
          suffix: "days",
        },
        {
          key: "queueDelayPerRun",
          label: "Queue delay per run",
          defaultValue: 0.9,
          min: 0,
          step: 0.1,
          suffix: "days",
        },
        {
          key: "engineerHoursPerProject",
          label: "Engineer hours per project",
          defaultValue: 420,
          min: 0,
          step: 5,
          suffix: "hours",
        },
        {
          key: "computeCostPerProject",
          label: "Compute cost per project",
          defaultValue: 65000,
          min: 0,
          step: 1000,
          prefix: "$",
        },
        {
          key: "peakDemandPeriods",
          label: "Peak demand periods per year",
          defaultValue: 4,
          min: 0,
          step: 1,
          advanced: true,
        },
        {
          key: "infrastructureOverhead",
          label: "Infrastructure overhead per project",
          defaultValue: 15000,
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
          key: "turnaroundImprovementPct",
          label: "Turnaround improvement",
          defaultValue: 0.28,
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
          key: "engineerEfficiencyPct",
          label: "Engineer time reduction",
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
          defaultValue: 0.15,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
          advanced: true,
        },
        {
          key: "infrastructureOverheadReductionPct",
          label: "Infrastructure overhead reduction",
          defaultValue: 0.25,
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
          defaultValue: 165,
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
        {
          key: "valuePerRunDay",
          label: "Business value per run day accelerated",
          defaultValue: 550,
          min: 0,
          step: 25,
          prefix: "$",
          advanced: true,
        },
        {
          key: "peakDelayCostPerPeriod",
          label: "Peak delay cost per period",
          defaultValue: 40000,
          min: 0,
          step: 1000,
          prefix: "$",
          advanced: true,
        },
      ],
    },
  ],
  calculate: calculateDesignVerification,
});
