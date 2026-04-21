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
  const scientistTouchFactor = clampPercent(values.scientistTouchFactor);
  const laborRecoveryFactor = clampPercent(values.laborRecoveryFactor);
  const iterationOpportunityFactor = clampPercent(values.iterationOpportunityFactor);

  const baselineCycleDays = values.currentCampaignTurnaroundDays;
  const currentQueueDelayDays = Math.min(values.queueDelayDays, baselineCycleDays);
  const improvedQueueDelayDays = currentQueueDelayDays * (1 - queueImprovement);
  const nonQueueCycleDays = Math.max(baselineCycleDays - currentQueueDelayDays, 0);
  const improvedCycleDays =
    nonQueueCycleDays * (1 - cycleImprovement) + improvedQueueDelayDays;
  const cycleTimeReduction = baselineCycleDays - improvedCycleDays;
  const queueDelayReductionDays = currentQueueDelayDays - improvedQueueDelayDays;
  const queueDaysReduced = queueDelayReductionDays * values.campaignsPerYear;
  const cycleTimeImprovementPct =
    baselineCycleDays > 0 ? queueDelayReductionDays / baselineCycleDays : 0;

  const directHoursSavedPerCampaign =
    values.scientistHoursPerCampaign * scientistImprovement +
    values.hitReviewHours * hitReviewImprovement;
  const directAnnualHoursSaved = directHoursSavedPerCampaign * values.campaignsPerYear;
  const recoveredScientistHours =
    queueDaysReduced * 8 * scientistTouchFactor * laborRecoveryFactor;
  const recoveredLaborValue = recoveredScientistHours * values.scientistHourlyRate;
  const capacityUnlocked =
    values.campaignsPerYear * cycleTimeImprovementPct * iterationOpportunityFactor;
  const directCapacityUnlocked = safeDivide(
    directAnnualHoursSaved,
    values.scientistHoursPerCampaign + values.hitReviewHours,
  );
  const totalCapacityUnlocked = directCapacityUnlocked + capacityUnlocked;

  const laborSavings = directAnnualHoursSaved * values.scientistHourlyRate;
  const computeSavings =
    values.campaignsPerYear *
    values.computeCostPerCampaign *
    computeImprovement;
  const cycleAccelerationValue =
    values.campaignsPerYear *
    cycleTimeReduction *
    values.valuePerCycleDay;
  const annualEconomicImpact =
    laborSavings + recoveredLaborValue + computeSavings + cycleAccelerationValue;
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
    annualHoursSaved: directAnnualHoursSaved,
    cycleTimeReduction,
    queueDaysReduced,
    queueDelayReductionDays,
    recoveredScientistHours,
    recoveredLaborValue,
    cycleTimeImprovementPct,
    directCapacityUnlocked,
    throughputPotentialCampaigns: capacityUnlocked,
    capacityUnlocked: totalCapacityUnlocked,
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
            defaultValue: 250000,
            min: 0,
            step: 1000,
            confidenceTag: {
              key: "benchmark",
              label: "Benchmark-informed",
            },
            helperText:
              "Use a representative current baseline for the number of compounds screened in a typical campaign. Large-pharma programs vary widely, so replace this with customer data when available.",
          },
          {
            key: "campaignsPerYear",
            label: "Campaigns per year",
            defaultValue: 8,
            min: 0,
            step: 1,
            confidenceTag: {
              key: "benchmark",
              label: "Benchmark-informed",
            },
            helperText:
              "Use the number of screening campaigns typically completed each year by the relevant team or function, not the entire enterprise unless that is the scope being modeled.",
          },
          {
            key: "currentCampaignTurnaroundDays",
            label: "Current campaign turnaround time",
            defaultValue: 14,
            min: 0,
            step: 0.5,
            suffix: "days",
            confidenceTag: {
              key: "benchmark",
              label: "Benchmark-informed",
            },
            helperText:
              "Use the current end-to-end average turnaround time for a typical campaign, from request to usable result.",
          },
          {
            key: "queueDelayDays",
            label: "Queue-related cycle delay",
            defaultValue: 3,
            min: 0,
            step: 0.5,
            suffix: "days",
            confidenceTag: {
              key: "estimated",
              label: "Representative placeholder",
            },
            helperText:
              "Use only the portion of turnaround time caused by waiting for access, scheduling, backlog, or infrastructure contention. Do not include the full campaign duration.",
            helpTooltip: {
              what:
                "Queue delay reflects waiting time due to scheduling, backlog, or resource contention. It is not treated as 1:1 scientist idle time in this model.",
              include:
                "Only the waiting portion caused by scheduling, backlog, or infrastructure contention before the team can advance the campaign.",
              exclude:
                "The full campaign duration, active compute runtime, or a 1:1 assumption that every delayed hour becomes scientist idle time.",
              example:
                "Use 3 days if campaigns typically wait several days in backlog before usable execution begins.",
            },
            // Reserved for later extensions so we can separate queueing into calendar delay,
            // labor recovery, and iteration opportunity without renaming this field.
            futureModelingHooks: [
              "calendarDelayImpact",
              "scientistLaborRecoveryFactor",
              "iterationOpportunityFactor",
            ],
          },
          {
            key: "scientistHoursPerCampaign",
            label: "Scientist hours per campaign",
            defaultValue: 80,
            min: 0,
            step: 1,
            suffix: "hours",
            confidenceTag: {
              key: "customer-provided",
              label: "Customer-validated",
            },
            helperText:
              "Use the current team time tied to setting up, monitoring, interpreting, and advancing each campaign. Validate with the customer when possible.",
            helpTooltip: {
              what:
                "This is a representative working estimate unless the customer has validated team effort data.",
              include:
                "The current scientist time spent setting up, monitoring, interpreting, and advancing a typical campaign.",
              exclude:
                "Unrelated management overhead or broader program time not tied directly to the campaign.",
              example:
                "Use a working estimate first, then replace it with validated customer team-effort data when available.",
            },
          },
          {
            key: "computeCostPerCampaign",
            label: "Compute cost per campaign",
            defaultValue: 12000,
            min: 0,
            step: 500,
            prefix: "$",
            confidenceTag: {
              key: "estimated",
              label: "Representative placeholder",
            },
            helperText:
              "Use the current compute or infrastructure cost tied to each campaign. This can be directional initially and replaced later with customer estimates.",
            helpTooltip: {
              what:
                "This can start as a modeled placeholder and be refined with customer-specific infrastructure cost assumptions later.",
              include:
                "The compute or infrastructure cost directly tied to running a typical campaign in the current environment.",
              exclude:
                "Broader enterprise IT overhead or platform costs already modeled elsewhere.",
              example:
                "Start with a directional campaign-level estimate, then replace it with customer infrastructure cost assumptions later.",
            },
          },
          {
            key: "hitReviewHours",
            label: "Hit review hours",
            defaultValue: 16,
            min: 0,
            step: 1,
            suffix: "hours",
            advanced: true,
            confidenceTag: {
              key: "customer-provided",
              label: "Customer-validated",
            },
            helperText:
              "Use the current time required to review, triage, and assess hit outputs for a typical campaign.",
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
            key: "scientistTouchFactor",
            label: "Scientist touch factor during queue delay",
            defaultValue: 0.15,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
            advanced: true,
            helperText:
              "Use the share of queue-related delay that creates real scientist interruption or handling effort. Keep this conservative.",
          },
          {
            key: "laborRecoveryFactor",
            label: "Labor recovery factor on queue delay",
            defaultValue: 0.35,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
            advanced: true,
            helperText:
              "Use the share of interrupted scientist time that can realistically be recovered in practice. Do not assume full recovery by default.",
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
            key: "iterationOpportunityFactor",
            label: "Iteration opportunity factor",
            defaultValue: 0.2,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
            advanced: true,
            helperText:
              "Use the share of queue-related cycle-time improvement that could realistically turn into more campaigns or faster iteration velocity.",
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
