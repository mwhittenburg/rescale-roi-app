import {
  clampPercent,
  createInteractiveCalculator,
  safeDivide,
} from "../shared";

function calculateMultidisciplinaryDesignExploration(values) {
  const turnaroundImprovement = clampPercent(values.turnaroundImprovementPct);
  const engineerImprovement = clampPercent(values.engineerEfficiencyPct);
  const computeImprovement = clampPercent(values.computeEfficiencyPct);
  const delayReduction = clampPercent(values.programDecisionDelayReductionPct);
  const redesignReduction = clampPercent(values.redesignReductionPct);
  const changeReduction = clampPercent(values.lateStageChangeReductionPct);

  const cycleTimeReduction =
    values.averageTurnaroundTimePerStudy * turnaroundImprovement;
  const annualHoursSaved =
    values.designTradeStudiesPerYear *
    values.engineerHoursPerStudy *
    engineerImprovement;
  const capacityUnlocked = safeDivide(
    annualHoursSaved,
    values.engineerHoursPerStudy,
  );

  const laborSavings = annualHoursSaved * values.engineerHourlyRate;
  const computeSavings =
    values.designTradeStudiesPerYear *
    values.computeCostPerStudy *
    computeImprovement;
  const decisionVelocityValue =
    values.designTradeStudiesPerYear *
    values.costOfDelayedProgramDecisions *
    delayReduction;
  const redesignSavings =
    values.designTradeStudiesPerYear *
    values.redesignSensitivityCost *
    redesignReduction;
  const changeSavings =
    values.designTradeStudiesPerYear *
    values.lateStageChangeSensitivityCost *
    changeReduction;
  const annualEconomicImpact =
    laborSavings +
    computeSavings +
    decisionVelocityValue +
    redesignSavings +
    changeSavings;
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
    capacityUnit: "trade studies per year",
  };
}

export const multidisciplinaryDesignExploration = createInteractiveCalculator(
  "aerospace-defense",
  {
    id: "multidisciplinary-design-exploration",
    name: "Multidisciplinary Design Exploration",
    teaser:
      "Model ROI from faster trade studies across complex aerospace programs.",
    businessOutcome:
      "Show how evaluating more multi-variable tradeoffs earlier can improve schedule confidence and reduce redesign risk across complex programs.",
    sections: [
      {
        key: "currentState",
        title: "Current-state inputs",
        fields: [
          {
            key: "designTradeStudiesPerYear",
            label: "Design trade studies per year",
            defaultValue: 14,
            min: 0,
            step: 1,
          },
          {
            key: "configurationsEvaluatedPerStudy",
            label: "Variables or configurations evaluated per study",
            defaultValue: 18,
            min: 0,
            step: 1,
          },
          {
            key: "averageTurnaroundTimePerStudy",
            label: "Average turnaround time per study",
            defaultValue: 9,
            min: 0,
            step: 0.1,
            suffix: "days",
          },
          {
            key: "engineerHoursPerStudy",
            label: "Engineer hours per study",
            defaultValue: 190,
            min: 0,
            step: 5,
            suffix: "hours",
          },
          {
            key: "computeCostPerStudy",
            label: "Compute cost per study",
            defaultValue: 36000,
            min: 0,
            step: 500,
            prefix: "$",
          },
          {
            key: "costOfDelayedProgramDecisions",
            label: "Cost of delayed program decisions",
            defaultValue: 140000,
            min: 0,
            step: 1000,
            prefix: "$",
          },
          {
            key: "redesignSensitivityCost",
            label: "Expected redesign cost per study",
            defaultValue: 95000,
            min: 0,
            step: 1000,
            prefix: "$",
            advanced: true,
          },
          {
            key: "lateStageChangeSensitivityCost",
            label: "Expected late-stage change cost per study",
            defaultValue: 80000,
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
            defaultValue: 0.18,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
          },
          {
            key: "engineerEfficiencyPct",
            label: "Engineer time reduction",
            defaultValue: 0.13,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
          },
          {
            key: "programDecisionDelayReductionPct",
            label: "Program decision delay reduction",
            defaultValue: 0.2,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
          },
          {
            key: "redesignReductionPct",
            label: "Redesign reduction",
            defaultValue: 0.15,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
            advanced: true,
          },
          {
            key: "lateStageChangeReductionPct",
            label: "Late-stage change reduction",
            defaultValue: 0.14,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
            advanced: true,
          },
          {
            key: "computeEfficiencyPct",
            label: "Compute cost reduction",
            defaultValue: 0.08,
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
            defaultValue: 175,
            min: 0,
            step: 5,
            prefix: "$",
          },
          {
            key: "platformInvestment",
            label: "Annual platform investment",
            defaultValue: 195000,
            min: 0,
            step: 1000,
            prefix: "$",
          },
        ],
      },
    ],
    calculate: calculateMultidisciplinaryDesignExploration,
  },
);
