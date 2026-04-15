import {
  clampPercent,
  createInteractiveCalculator,
} from "../shared";

function calculateGovernanceStandardization(values) {
  const reportingReduction = clampPercent(values.reportingReductionPct);
  const incidentReduction = clampPercent(values.incidentReductionPct);
  const delayReduction = clampPercent(values.delayReductionPct);
  const duplicateSpendReduction = clampPercent(values.duplicateSpendReductionPct);

  const annualReportingHoursSaved =
    values.manualGovernanceHoursPerMonth * 12 * reportingReduction;
  const annualIncidentHoursSaved =
    values.governanceIncidentsPerQuarter *
    4 *
    values.hoursPerGovernanceIncident *
    incidentReduction;
  const annualHoursSaved =
    annualReportingHoursSaved + annualIncidentHoursSaved;
  const cycleTimeReduction =
    values.averageDelayPerGovernanceEvent * delayReduction;
  const capacityUnlocked =
    values.teamsUsingFragmentedWorkflows * delayReduction;

  const laborSavings = annualHoursSaved * values.governanceHourlyCost;
  const delaySavings =
    values.governanceIncidentsPerQuarter *
    4 *
    cycleTimeReduction *
    values.valuePerDelayDay;
  const duplicateSpendSavings =
    values.annualDuplicateToolingSpend * duplicateSpendReduction;
  const annualEconomicImpact =
    laborSavings + delaySavings + duplicateSpendSavings;
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
    capacityUnit: "teams standardized",
    annualEconomicImpact,
    paybackPeriodMonths,
    roiPercent,
  };
}

export const governanceStandardization = createInteractiveCalculator("it", {
  id: "governance-standardization",
  name: "Governance / Standardization ROI",
  teaser:
    "Model ROI from replacing fragmented compute workflows with a governed operating model.",
  businessOutcome:
    "Show how standardization can reduce manual governance effort, lower rework risk, and improve decision speed across teams.",
  sections: [
    {
      key: "currentState",
      title: "Current-state inputs",
      fields: [
        {
          key: "teamsUsingFragmentedWorkflows",
          label: "Teams using fragmented compute workflows",
          defaultValue: 9,
          min: 0,
          step: 1,
        },
        {
          key: "manualGovernanceHoursPerMonth",
          label: "Manual governance and reporting hours per month",
          defaultValue: 48,
          min: 0,
          step: 1,
          suffix: "hours",
        },
        {
          key: "governanceIncidentsPerQuarter",
          label: "Governance or rework events per quarter",
          defaultValue: 6,
          min: 0,
          step: 1,
        },
        {
          key: "hoursPerGovernanceIncident",
          label: "Hours per governance event",
          defaultValue: 10,
          min: 0,
          step: 0.5,
          suffix: "hours",
        },
        {
          key: "averageDelayPerGovernanceEvent",
          label: "Average delay per governance event",
          defaultValue: 3.5,
          min: 0,
          step: 0.1,
          suffix: "days",
        },
      ],
    },
    {
      key: "improvements",
      title: "Improvement assumptions",
      fields: [
        {
          key: "reportingReductionPct",
          label: "Reporting effort reduction",
          defaultValue: 0.5,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
        },
        {
          key: "incidentReductionPct",
          label: "Governance event reduction",
          defaultValue: 0.35,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
        },
        {
          key: "delayReductionPct",
          label: "Delay reduction",
          defaultValue: 0.45,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
        },
        {
          key: "duplicateSpendReductionPct",
          label: "Duplicate tooling or process spend reduction",
          defaultValue: 0.3,
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
          key: "governanceHourlyCost",
          label: "Governance or platform team hourly cost",
          defaultValue: 145,
          min: 0,
          step: 5,
          prefix: "$",
        },
        {
          key: "valuePerDelayDay",
          label: "Business value per day of avoided delay",
          defaultValue: 950,
          min: 0,
          step: 25,
          prefix: "$",
        },
        {
          key: "annualDuplicateToolingSpend",
          label: "Annual duplicate tooling or process spend",
          defaultValue: 160000,
          min: 0,
          step: 5000,
          prefix: "$",
          advanced: true,
        },
        {
          key: "platformInvestment",
          label: "Annual platform investment",
          defaultValue: 140000,
          min: 0,
          step: 1000,
          prefix: "$",
        },
      ],
    },
  ],
  calculate: calculateGovernanceStandardization,
});
