import {
  clampPercent,
  createInteractiveCalculator,
  safeDivide,
} from "../shared";

function calculateEvBatteryThermalPackOptimization(values) {
  const turnaroundImprovement = clampPercent(values.turnaroundImprovementPct);
  const engineerImprovement = clampPercent(values.engineerEfficiencyPct);
  const computeImprovement = clampPercent(values.computeEfficiencyPct);
  const testReduction = clampPercent(values.testReductionPct);
  const redesignReduction = clampPercent(values.coolingRedesignReductionPct);

  const cycleTimeReduction =
    values.turnaroundTimePerIteration * turnaroundImprovement;
  const annualHoursSaved =
    values.batteryStudiesPerYear *
    values.engineerHoursPerStudy *
    engineerImprovement;
  const capacityUnlocked = safeDivide(
    annualHoursSaved,
    values.engineerHoursPerStudy,
  );

  const laborSavings = annualHoursSaved * values.engineerHourlyRate;
  const computeSavings =
    values.batteryStudiesPerYear *
    values.computeCostPerStudy *
    computeImprovement;
  const testSavings =
    values.batteryStudiesPerYear *
    values.physicalBuildOrTestCost *
    testReduction;
  const redesignSavings =
    values.batteryStudiesPerYear *
    values.coolingRedesignCost *
    redesignReduction;
  const cycleAccelerationValue =
    values.batteryStudiesPerYear *
    values.designIterationsPerStudy *
    cycleTimeReduction *
    values.valuePerIterationDay;
  const annualEconomicImpact =
    laborSavings +
    computeSavings +
    testSavings +
    redesignSavings +
    cycleAccelerationValue;
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

export const evBatteryThermalPackOptimization = createInteractiveCalculator(
  "automotive-mobility",
  {
    id: "ev-battery-thermal-pack-optimization",
    name: "EV Battery Thermal Optimization",
    teaser:
      "Model ROI from faster battery optimization and fewer late-stage design surprises.",
    businessOutcome:
      "Show how faster battery thermal iteration can reduce physical test cycles and improve EV program speed.",
    sections: [
      {
        key: "currentState",
        title: "Current-state inputs",
        fields: [
          {
            key: "batteryStudiesPerYear",
            label: "Battery studies per year",
            defaultValue: 18,
            min: 0,
            step: 1,
          },
          {
            key: "designIterationsPerStudy",
            label: "Design iterations per study",
            defaultValue: 12,
            min: 0,
            step: 1,
          },
          {
            key: "turnaroundTimePerIteration",
            label: "Turnaround time per iteration",
            defaultValue: 5,
            min: 0,
            step: 0.1,
            suffix: "days",
          },
          {
            key: "engineerHoursPerStudy",
            label: "Engineer hours per study",
            defaultValue: 130,
            min: 0,
            step: 1,
            suffix: "hours",
          },
          {
            key: "computeCostPerStudy",
            label: "Compute cost per study",
            defaultValue: 26000,
            min: 0,
            step: 500,
            prefix: "$",
          },
          {
            key: "physicalBuildOrTestCost",
            label: "Physical build or test cost",
            defaultValue: 80000,
            min: 0,
            step: 1000,
            prefix: "$",
          },
          {
            key: "coolingRedesignCost",
            label: "Expected cooling redesign cost per study",
            defaultValue: 70000,
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
            defaultValue: 0.2,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
          },
          {
            key: "engineerEfficiencyPct",
            label: "Engineer time reduction",
            defaultValue: 0.14,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
          },
          {
            key: "testReductionPct",
            label: "Physical test reduction",
            defaultValue: 0.24,
            min: 0,
            max: 0.95,
            step: 0.01,
            kind: "percent",
          },
          {
            key: "coolingRedesignReductionPct",
            label: "Cooling redesign reduction",
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
            defaultValue: 0.1,
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
            defaultValue: 158,
            min: 0,
            step: 5,
            prefix: "$",
          },
          {
            key: "platformInvestment",
            label: "Annual platform investment",
            defaultValue: 170000,
            min: 0,
            step: 1000,
            prefix: "$",
          },
          {
            key: "valuePerIterationDay",
            label: "Business value per iteration day accelerated",
            defaultValue: 2800,
            min: 0,
            step: 100,
            prefix: "$",
            advanced: true,
          },
        ],
      },
    ],
    calculate: calculateEvBatteryThermalPackOptimization,
  },
);
