import {
  clampPercent,
  createInteractiveCalculator,
  safeDivide,
} from "../shared";

function calculateBurstCapacityOverflow(values) {
  const delayReduction = clampPercent(values.delayReductionPct);
  const laborReduction = clampPercent(values.manualSupportReductionPct);
  const fixedCapacityAvoidance = clampPercent(values.fixedCapacityAvoidancePct);

  const annualPeakWindows = values.peakWindowsPerYear;
  const annualOverflowJobs = annualPeakWindows * values.jobsImpactedPerPeakWindow;
  const cycleTimeReduction = values.averageDelayPerJob * delayReduction;
  const annualHoursSaved =
    annualPeakWindows *
    values.hoursAffectedPerPeakWindow *
    laborReduction;
  const capacityUnlocked = annualOverflowJobs * delayReduction;

  const laborSavings = annualHoursSaved * values.technicalHourlyCost;
  const delaySavings =
    annualOverflowJobs * cycleTimeReduction * values.valuePerDelayDay;
  const annualOverflowSpend =
    annualPeakWindows * values.overflowComputeSpendPerPeakWindow;
  const avoidedFixedCapacity =
    values.annualFixedCapacityCost * fixedCapacityAvoidance;
  const annualEconomicImpact =
    laborSavings + delaySavings + avoidedFixedCapacity - annualOverflowSpend;
  const paybackPeriodMonths =
    annualEconomicImpact > 0
      ? (values.platformInvestment / annualEconomicImpact) * 12
      : 0;
  const roiPercent =
    values.platformInvestment > 0
      ? ((annualEconomicImpact - values.platformInvestment) /
          values.platformInvestment) *
        100
      : 0;

  return {
    annualHoursSaved,
    cycleTimeReduction,
    capacityUnlocked,
    capacityUnit: "overflow jobs per year",
    annualEconomicImpact,
    paybackPeriodMonths,
    roiPercent,
  };
}

export const burstCapacityOverflow = createInteractiveCalculator("it", {
  id: "burst-capacity-overflow",
  name: "Burst Capacity / Overflow ROI",
  teaser:
    "Model ROI from handling peak workload demand without overbuilding fixed infrastructure.",
  businessOutcome:
    "Show how elastic overflow capacity can reduce queue delay and avoid the cost of capacity that sits idle outside peak periods.",
  sections: [
    {
      key: "currentState",
      title: "Current-state inputs",
      fields: [
        {
          key: "peakWindowsPerYear",
          label: "Peak demand windows per year",
          defaultValue: 10,
          min: 0,
          step: 1,
        },
        {
          key: "jobsImpactedPerPeakWindow",
          label: "Jobs impacted per peak window",
          defaultValue: 140,
          min: 0,
          step: 1,
        },
        {
          key: "averageDelayPerJob",
          label: "Average delay per job",
          defaultValue: 1.8,
          min: 0,
          step: 0.1,
          suffix: "days",
        },
        {
          key: "hoursAffectedPerPeakWindow",
          label: "Technical team hours affected per peak window",
          defaultValue: 70,
          min: 0,
          step: 1,
          suffix: "hours",
        },
        {
          key: "overflowComputeSpendPerPeakWindow",
          label: "Overflow compute spend per peak window",
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
          defaultValue: 0.65,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
        },
        {
          key: "manualSupportReductionPct",
          label: "Manual support time reduction",
          defaultValue: 0.25,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
        },
        {
          key: "fixedCapacityAvoidancePct",
          label: "Fixed capacity cost avoided",
          defaultValue: 0.45,
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
          key: "technicalHourlyCost",
          label: "Technical team hourly cost",
          defaultValue: 140,
          min: 0,
          step: 5,
          prefix: "$",
        },
        {
          key: "valuePerDelayDay",
          label: "Business value per delay day avoided",
          defaultValue: 850,
          min: 0,
          step: 25,
          prefix: "$",
        },
        {
          key: "annualFixedCapacityCost",
          label: "Annual fixed capacity cost that could be avoided",
          defaultValue: 240000,
          min: 0,
          step: 5000,
          prefix: "$",
          advanced: true,
        },
        {
          key: "platformInvestment",
          label: "Annual platform investment",
          defaultValue: 150000,
          min: 0,
          step: 1000,
          prefix: "$",
        },
      ],
    },
  ],
  calculate: calculateBurstCapacityOverflow,
});
