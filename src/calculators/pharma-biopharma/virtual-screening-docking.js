import {
  clampPercent,
  createInteractiveCalculator,
  safeDivide,
} from "../shared";

function calculateVirtualScreening(values) {
  const cycleImprovement = clampPercent(values.turnaroundImprovementPct);
  const queueImprovement = clampPercent(values.queueReductionPct);
  const scientistImprovement = clampPercent(values.scientistEfficiencyPct);
  const hitReviewImprovement = clampPercent(values.hitReviewEfficiencyPct);
  const computeImprovement = clampPercent(values.computeEfficiencyPct);

  const baselineCycleDays =
    values.currentCampaignTurnaroundDays + values.queueDelayDays;
  const improvedCycleDays =
    values.currentCampaignTurnaroundDays * (1 - cycleImprovement) +
    values.queueDelayDays * (1 - queueImprovement);
  const cycleTimeReduction = baselineCycleDays - improvedCycleDays;

  const hoursSavedPerCampaign =
    values.scientistHoursPerCampaign * scientistImprovement +
    values.hitReviewHours * hitReviewImprovement;
  const annualHoursSaved = hoursSavedPerCampaign * values.campaignsPerYear;
  const capacityUnlocked = safeDivide(
    annualHoursSaved,
    values.scientistHoursPerCampaign + values.hitReviewHours,
  );

  const laborSavings = annualHoursSaved * values.scientistHourlyRate;
  const computeSavings =
    values.campaignsPerYear *
    values.computeCostPerCampaign *
    computeImprovement;
  const cycleAccelerationValue =
    values.campaignsPerYear *
    cycleTimeReduction *
    values.valuePerCycleDay;
  const annualEconomicImpact =
    laborSavings + computeSavings + cycleAccelerationValue;
  const annualInvestment =
    values.platformInvestment + values.softwareCost;
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
    capacityUnit: "campaigns per year",
  };
}

export const virtualScreeningDocking = createInteractiveCalculator(
  "pharma-biopharma",
  {
    id: "virtual-screening-docking",
    name: "Virtual Screening / Docking",
    teaser: "Model ROI from faster compound triage and docking throughput.",
    businessOutcome:
      "Show how faster screening cycles can unlock more campaigns and accelerate hit progression.",
    sections: [
      {
        key: "currentState",
        title: "Current-state inputs",
        fields: [
          {
            key: "compoundsScreenedPerCampaign",
            label: "Compounds screened per campaign",
            defaultValue: 500000,
            min: 0,
            step: 1000,
          },
          {
            key: "campaignsPerYear",
            label: "Campaigns per year",
            defaultValue: 12,
            min: 0,
            step: 1,
          },
          {
            key: "currentCampaignTurnaroundDays",
            label: "Current campaign turnaround time in days",
            defaultValue: 14,
            min: 0,
            step: 0.5,
            suffix: "days",
          },
          {
            key: "queueDelayDays",
            label: "Queue delay in days",
            defaultValue: 5,
            min: 0,
            step: 0.5,
            suffix: "days",
          },
          {
            key: "scientistHoursPerCampaign",
            label: "Scientist hours per campaign",
            defaultValue: 80,
            min: 0,
            step: 1,
            suffix: "hours",
          },
          {
            key: "computeCostPerCampaign",
            label: "Compute cost per campaign",
            defaultValue: 12000,
            min: 0,
            step: 500,
            prefix: "$",
          },
          {
            key: "hitReviewHours",
            label: "Hit review hours",
            defaultValue: 16,
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
            key: "turnaroundImprovementPct",
            label: "Turnaround improvement",
            defaultValue: 0.35,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
          },
          {
            key: "queueReductionPct",
            label: "Queue delay reduction",
            defaultValue: 0.6,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
          },
          {
            key: "scientistEfficiencyPct",
            label: "Scientist time reduction",
            defaultValue: 0.25,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
            advanced: true,
          },
          {
            key: "computeEfficiencyPct",
            label: "Compute cost reduction",
            defaultValue: 0.2,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
            advanced: true,
          },
          {
            key: "hitReviewEfficiencyPct",
            label: "Hit review time reduction",
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
            key: "scientistHourlyRate",
            label: "Scientist hourly cost",
            defaultValue: 135,
            min: 0,
            step: 5,
            prefix: "$",
          },
          {
            key: "platformInvestment",
            label: "Annual platform investment",
            defaultValue: 90000,
            min: 0,
            step: 1000,
            prefix: "$",
          },
          {
            key: "valuePerCycleDay",
            label: "Business value per day accelerated",
            defaultValue: 2500,
            min: 0,
            step: 100,
            prefix: "$",
            advanced: true,
          },
          {
            key: "softwareCost",
            label: "Annual software cost",
            defaultValue: 35000,
            min: 0,
            step: 1000,
            prefix: "$",
            advanced: true,
          },
        ],
      },
    ],
    calculate: calculateVirtualScreening,
  },
);
