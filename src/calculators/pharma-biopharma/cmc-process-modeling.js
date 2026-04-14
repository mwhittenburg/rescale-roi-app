import {
  clampPercent,
  createInteractiveCalculator,
  safeDivide,
} from "../shared";

function calculateCmcProcessModeling(values) {
  const cycleImprovement = clampPercent(values.cycleTimeImprovementPct);
  const physicalReduction = clampPercent(values.physicalIterationReductionPct);
  const hoursImprovement = clampPercent(values.scientistEfficiencyPct);
  const computeImprovement = clampPercent(values.computeEfficiencyPct);
  const scaleUpReduction = clampPercent(values.scaleUpDelayReductionPct);
  const reworkReduction = clampPercent(values.lateReworkReductionPct);

  const baselineCycleDays = values.cycleTimePerStudy + values.scaleUpDelay;
  const improvedCycleDays =
    values.cycleTimePerStudy * (1 - cycleImprovement) +
    values.scaleUpDelay * (1 - scaleUpReduction);
  const cycleTimeReduction = baselineCycleDays - improvedCycleDays;

  const annualHoursSaved =
    values.developmentStudiesPerYear *
    values.scientistHoursPerStudy *
    hoursImprovement;
  const capacityUnlocked = safeDivide(
    annualHoursSaved,
    values.scientistHoursPerStudy,
  );

  const experimentsAvoided =
    values.programsPerYear *
    values.physicalIterationsPerProgram *
    physicalReduction;
  const laborSavings = annualHoursSaved * values.scientistHourlyRate;
  const computeSavings =
    values.developmentStudiesPerYear *
    values.computeCostPerStudy *
    computeImprovement;
  const experimentSavings =
    experimentsAvoided * values.costPerPhysicalExperiment;
  const cycleAccelerationValue =
    values.developmentStudiesPerYear *
    cycleTimeReduction *
    values.valuePerStudyDay;
  const reworkSavings =
    values.programsPerYear *
    values.lateReworkCost *
    reworkReduction;
  const annualEconomicImpact =
    laborSavings +
    computeSavings +
    experimentSavings +
    cycleAccelerationValue +
    reworkSavings;
  const annualInvestment =
    values.platformInvestment + values.modelingSoftwareCost;
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

export const cmcProcessModeling = createInteractiveCalculator(
  "pharma-biopharma",
  {
    id: "cmc-process-modeling",
    name: "CMC / Process Modeling",
    teaser:
      "Model ROI from faster scale-up decisions and more efficient process development.",
    businessOutcome:
      "Show how better process modeling can cut study cycle times, reduce physical iterations, and speed development readiness.",
    sections: [
      {
        key: "currentState",
        title: "Current-state inputs",
        fields: [
          {
            key: "developmentStudiesPerYear",
            label: "Development studies per year",
            defaultValue: 30,
            min: 0,
            step: 1,
          },
          {
            key: "cycleTimePerStudy",
            label: "Cycle time per study",
            defaultValue: 21,
            min: 0,
            step: 0.5,
            suffix: "days",
          },
          {
            key: "physicalIterationsPerProgram",
            label: "Physical iterations per program",
            defaultValue: 6,
            min: 0,
            step: 1,
          },
          {
            key: "scientistHoursPerStudy",
            label: "Scientist or engineering hours per study",
            defaultValue: 140,
            min: 0,
            step: 1,
            suffix: "hours",
          },
          {
            key: "computeCostPerStudy",
            label: "Compute cost per study",
            defaultValue: 10000,
            min: 0,
            step: 500,
            prefix: "$",
          },
          {
            key: "costPerPhysicalExperiment",
            label: "Cost per physical experiment",
            defaultValue: 45000,
            min: 0,
            step: 1000,
            prefix: "$",
          },
          {
            key: "scaleUpDelay",
            label: "Scale-up delay",
            defaultValue: 14,
            min: 0,
            step: 0.5,
            suffix: "days",
            advanced: true,
          },
          {
            key: "programsPerYear",
            label: "Programs per year",
            defaultValue: 4,
            min: 0,
            step: 1,
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
            label: "Study cycle-time improvement",
            defaultValue: 0.25,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
          },
          {
            key: "physicalIterationReductionPct",
            label: "Physical iteration reduction",
            defaultValue: 0.3,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
          },
          {
            key: "scientistEfficiencyPct",
            label: "Scientist or engineering time reduction",
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
            key: "scaleUpDelayReductionPct",
            label: "Scale-up delay reduction",
            defaultValue: 0.35,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
            advanced: true,
          },
          {
            key: "lateReworkReductionPct",
            label: "Late rework reduction",
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
            label: "Scientist or engineering hourly cost",
            defaultValue: 150,
            min: 0,
            step: 5,
            prefix: "$",
          },
          {
            key: "platformInvestment",
            label: "Annual platform investment",
            defaultValue: 120000,
            min: 0,
            step: 1000,
            prefix: "$",
          },
          {
            key: "valuePerStudyDay",
            label: "Business value per study day accelerated",
            defaultValue: 4000,
            min: 0,
            step: 100,
            prefix: "$",
            advanced: true,
          },
          {
            key: "lateReworkCost",
            label: "Late rework cost per program",
            defaultValue: 150000,
            min: 0,
            step: 5000,
            prefix: "$",
            advanced: true,
          },
          {
            key: "modelingSoftwareCost",
            label: "Annual modeling software cost",
            defaultValue: 60000,
            min: 0,
            step: 1000,
            prefix: "$",
            advanced: true,
          },
        ],
      },
    ],
    calculate: calculateCmcProcessModeling,
  },
);
