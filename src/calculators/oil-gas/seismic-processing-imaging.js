import {
  clampPercent,
  createInteractiveCalculator,
  safeDivide,
} from "../shared";

function calculateSeismicProcessing(values) {
  const turnaroundImprovement = clampPercent(values.turnaroundImprovementPct);
  const queueImprovement = clampPercent(values.backlogReductionPct);
  const specialistImprovement = clampPercent(values.specialistEfficiencyPct);
  const computeImprovement = clampPercent(values.computeEfficiencyPct);
  const interpretationDelayReduction = clampPercent(
    values.interpretationDelayReductionPct,
  );
  const burstReduction = clampPercent(values.burstDemandReductionPct);

  const baselineCycleDays =
    values.averageProcessingTurnaroundTime + values.queueDelayOrBacklogDelay;
  const improvedCycleDays =
    values.averageProcessingTurnaroundTime * (1 - turnaroundImprovement) +
    values.queueDelayOrBacklogDelay * (1 - queueImprovement);
  const cycleTimeReduction = baselineCycleDays - improvedCycleDays;

  const annualHoursSaved =
    values.seismicProjectsPerYear *
    values.specialistHoursPerProject *
    specialistImprovement;
  const capacityUnlocked = safeDivide(
    annualHoursSaved,
    values.specialistHoursPerProject,
  );

  const laborSavings = annualHoursSaved * values.specialistHourlyRate;
  const computeSavings =
    values.seismicProjectsPerYear *
    values.computeCostPerProject *
    computeImprovement;
  const delayedInterpretationValue =
    values.seismicProjectsPerYear *
    values.costSensitivityToDelayedInterpretation *
    interpretationDelayReduction;
  const burstDemandValue =
    values.burstDemandPeriods *
    values.burstDemandCostPerPeriod *
    burstReduction;
  const annualEconomicImpact =
    laborSavings + computeSavings + delayedInterpretationValue + burstDemandValue;
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

export const seismicProcessingImaging = createInteractiveCalculator("oil-gas", {
  id: "seismic-processing-imaging",
  name: "Seismic Processing / Imaging",
  teaser:
    "Model ROI from faster seismic turnaround and earlier subsurface interpretation.",
  businessOutcome:
    "Show how faster seismic processing can shorten time to interpretation and support earlier subsurface decisions.",
  sections: [
    {
      key: "currentState",
      title: "Current-state inputs",
      fields: [
        {
          key: "seismicProjectsPerYear",
          label: "Seismic projects per year",
          defaultValue: 12,
          min: 0,
          step: 1,
        },
        {
          key: "averageProcessingTurnaroundTime",
          label: "Average processing turnaround time",
          defaultValue: 18,
          min: 0,
          step: 0.1,
          suffix: "days",
        },
        {
          key: "queueDelayOrBacklogDelay",
          label: "Queue delay or backlog delay",
          defaultValue: 6,
          min: 0,
          step: 0.1,
          suffix: "days",
        },
        {
          key: "specialistHoursPerProject",
          label: "Specialist hours per project",
          defaultValue: 220,
          min: 0,
          step: 5,
          suffix: "hours",
        },
        {
          key: "computeCostPerProject",
          label: "Compute cost per project",
          defaultValue: 52000,
          min: 0,
          step: 500,
          prefix: "$",
        },
        {
          key: "costSensitivityToDelayedInterpretation",
          label: "Cost sensitivity to delayed interpretation",
          defaultValue: 180000,
          min: 0,
          step: 1000,
          prefix: "$",
        },
        {
          key: "burstDemandPeriods",
          label: "Burst demand periods per year",
          defaultValue: 4,
          min: 0,
          step: 1,
          advanced: true,
        },
        {
          key: "burstDemandCostPerPeriod",
          label: "Burst demand cost per period",
          defaultValue: 35000,
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
          defaultValue: 0.24,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
        },
        {
          key: "backlogReductionPct",
          label: "Backlog delay reduction",
          defaultValue: 0.42,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
        },
        {
          key: "specialistEfficiencyPct",
          label: "Specialist time reduction",
          defaultValue: 0.16,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
        },
        {
          key: "interpretationDelayReductionPct",
          label: "Delayed interpretation exposure reduction",
          defaultValue: 0.2,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
          advanced: true,
        },
        {
          key: "burstDemandReductionPct",
          label: "Burst demand exposure reduction",
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
          defaultValue: 0.11,
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
          key: "specialistHourlyRate",
          label: "Specialist hourly cost",
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
      ],
    },
  ],
  calculate: calculateSeismicProcessing,
});
