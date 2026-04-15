import {
  clampPercent,
  createInteractiveCalculator,
  safeDivide,
} from "../shared";

function calculateItOperationsEfficiency(values) {
  const provisioningReduction = clampPercent(values.provisioningReductionPct);
  const incidentReduction = clampPercent(values.incidentReductionPct);
  const supportReduction = clampPercent(values.supportReductionPct);
  const turnaroundReduction = clampPercent(values.turnaroundReductionPct);

  const annualProvisioningHoursSaved =
    values.provisioningRequestsPerMonth *
    12 *
    values.manualHoursPerProvisioningRequest *
    provisioningReduction;
  const annualIncidentHoursSaved =
    values.supportIncidentsPerMonth *
    12 *
    values.hoursPerSupportIncident *
    incidentReduction;
  const annualMaintenanceHoursSaved =
    values.environmentSupportHoursPerMonth * 12 * supportReduction;
  const annualHoursSaved =
    annualProvisioningHoursSaved +
    annualIncidentHoursSaved +
    annualMaintenanceHoursSaved;
  const cycleTimeReduction =
    values.requestTurnaroundTime * turnaroundReduction;
  const capacityUnlocked = safeDivide(
    annualHoursSaved,
    values.manualHoursPerProvisioningRequest || 1,
  );

  const laborSavings = annualHoursSaved * values.itHourlyCost;
  const delaySavings =
    values.provisioningRequestsPerMonth *
    12 *
    cycleTimeReduction *
    values.valuePerTurnaroundDay;
  const annualEconomicImpact = laborSavings + delaySavings;
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
    capacityUnit: "requests per year",
    annualEconomicImpact,
    paybackPeriodMonths,
    roiPercent,
  };
}

export const itOperationsEfficiency = createInteractiveCalculator("it", {
  id: "it-operations-efficiency",
  name: "IT Operations Efficiency ROI",
  teaser:
    "Model ROI from reducing manual provisioning, troubleshooting, and environment support effort.",
  businessOutcome:
    "Show how streamlining support and provisioning can free technical teams to support more demand with less manual effort.",
  sections: [
    {
      key: "currentState",
      title: "Current-state inputs",
      fields: [
        {
          key: "provisioningRequestsPerMonth",
          label: "Provisioning requests per month",
          defaultValue: 42,
          min: 0,
          step: 1,
        },
        {
          key: "manualHoursPerProvisioningRequest",
          label: "Manual hours per provisioning request",
          defaultValue: 2.8,
          min: 0,
          step: 0.1,
          suffix: "hours",
        },
        {
          key: "supportIncidentsPerMonth",
          label: "Support incidents per month",
          defaultValue: 18,
          min: 0,
          step: 1,
        },
        {
          key: "hoursPerSupportIncident",
          label: "Hours per support incident",
          defaultValue: 3.2,
          min: 0,
          step: 0.1,
          suffix: "hours",
        },
        {
          key: "environmentSupportHoursPerMonth",
          label: "Environment support hours per month",
          defaultValue: 65,
          min: 0,
          step: 1,
          suffix: "hours",
        },
        {
          key: "requestTurnaroundTime",
          label: "Average turnaround time for a request",
          defaultValue: 2.4,
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
          key: "provisioningReductionPct",
          label: "Provisioning effort reduction",
          defaultValue: 0.45,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
        },
        {
          key: "incidentReductionPct",
          label: "Incident effort reduction",
          defaultValue: 0.3,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
        },
        {
          key: "supportReductionPct",
          label: "Environment support reduction",
          defaultValue: 0.25,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
        },
        {
          key: "turnaroundReductionPct",
          label: "Request turnaround reduction",
          defaultValue: 0.4,
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
          key: "itHourlyCost",
          label: "IT operations hourly cost",
          defaultValue: 130,
          min: 0,
          step: 5,
          prefix: "$",
        },
        {
          key: "valuePerTurnaroundDay",
          label: "Business value per day of faster turnaround",
          defaultValue: 600,
          min: 0,
          step: 25,
          prefix: "$",
          advanced: true,
        },
        {
          key: "platformInvestment",
          label: "Annual platform investment",
          defaultValue: 120000,
          min: 0,
          step: 1000,
          prefix: "$",
        },
      ],
    },
  ],
  calculate: calculateItOperationsEfficiency,
});
