import {
  clampPercent,
  createInteractiveCalculator,
  safeDivide,
} from "../shared";

function calculateEdaBurstCompute(values) {
  const delayReduction = clampPercent(values.delayReductionPct);
  const engineerImprovement = clampPercent(values.engineerEfficiencyPct);
  const shortfallReduction = clampPercent(values.shortfallReductionPct);
  const utilizationAvoidance = clampPercent(values.idleCapacityAvoidancePct);

  const cycleTimeReduction =
    values.averageDelayCausedByCapacityLimits * delayReduction;
  const annualHoursSaved =
    values.peakJobsPerQuarter *
    4 *
    values.engineerHoursAffected *
    engineerImprovement;
  const capacityUnlocked = safeDivide(
    annualHoursSaved,
    values.engineerHoursAffected,
  );

  const laborSavings = annualHoursSaved * values.engineerHourlyRate;
  const delaySavings =
    values.peakJobsPerQuarter *
    4 *
    cycleTimeReduction *
    values.valuePerDelayDay;
  const computeBurstCost =
    values.peakJobsPerQuarter * 4 * values.incrementalComputeCost;
  const overbuildAvoidance =
    values.currentCapacityShortfall *
    values.averageBurstDuration *
    values.idleCapacityCostPerDay *
    shortfallReduction *
    utilizationAvoidance;
  const annualEconomicImpact =
    laborSavings + delaySavings + overbuildAvoidance - computeBurstCost;
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
    capacityUnit: "peak jobs per year",
  };
}

export const edaBurstCompute = createInteractiveCalculator("semiconductor", {
  id: "eda-burst-compute",
  name: "Peak EDA Compute Capacity",
  teaser:
    "Model ROI from elastic compute capacity for EDA peaks and deadline-driven runs.",
  businessOutcome:
    "Show how clearing burst demand can reduce delays while avoiding fixed capacity that sits idle outside peak periods.",
  sections: [
    {
      key: "currentState",
      title: "Current-state inputs",
      fields: [
        {
          key: "peakJobsPerQuarter",
          label: "Peak compute jobs per quarter",
          defaultValue: 220,
          min: 0,
          step: 1,
        },
        {
          key: "averageBurstDuration",
          label: "Average burst duration",
          defaultValue: 14,
          min: 0,
          step: 0.5,
          suffix: "days",
        },
        {
          key: "currentCapacityShortfall",
          label: "Current capacity shortfall",
          defaultValue: 40,
          min: 0,
          step: 1,
          suffix: "servers",
        },
        {
          key: "averageDelayCausedByCapacityLimits",
          label: "Average delay caused by capacity limits",
          defaultValue: 2.5,
          min: 0,
          step: 0.1,
          suffix: "days",
        },
        {
          key: "engineerHoursAffected",
          label: "Engineer hours affected",
          defaultValue: 18,
          min: 0,
          step: 1,
          suffix: "hours",
        },
        {
          key: "incrementalComputeCost",
          label: "Incremental compute cost",
          defaultValue: 18000,
          min: 0,
          step: 500,
          prefix: "$",
        },
      ],
    },
    {
      key: "improvements",
      title: "Improvement assumptions",
      fields: [
        {
          key: "delayReductionPct",
          label: "Delay reduction",
          defaultValue: 0.6,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
        },
        {
          key: "engineerEfficiencyPct",
          label: "Engineer time reduction",
          defaultValue: 0.2,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
        },
        {
          key: "shortfallReductionPct",
          label: "Capacity shortfall reduction",
          defaultValue: 0.65,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
          advanced: true,
        },
        {
          key: "idleCapacityAvoidancePct",
          label: "Idle capacity avoidance",
          defaultValue: 0.5,
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
          defaultValue: 160000,
          min: 0,
          step: 1000,
          prefix: "$",
        },
        {
          key: "valuePerDelayDay",
          label: "Business value per delay day avoided",
          defaultValue: 900,
          min: 0,
          step: 25,
          prefix: "$",
          advanced: true,
        },
        {
          key: "idleCapacityCostPerDay",
          label: "Idle capacity cost per day",
          defaultValue: 350,
          min: 0,
          step: 10,
          prefix: "$",
          advanced: true,
        },
      ],
    },
  ],
  calculate: calculateEdaBurstCompute,
});
