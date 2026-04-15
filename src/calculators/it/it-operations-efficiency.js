import { clampPercent, createInteractiveCalculator } from "../shared";

function calculateItOperationsTco(values) {
  const provisioningReduction = clampPercent(values.provisioningReductionPct);
  const incidentReduction = clampPercent(values.incidentReductionPct);
  const governanceReduction = clampPercent(values.governanceReductionPct);

  const currentAdminSupportHours =
    values.provisioningRequestsPerMonth *
      values.manualHoursPerProvisioningRequest *
      12 +
    values.supportIncidentsPerMonth * values.hoursPerSupportIncident * 12 +
    values.governanceHoursPerMonth * 12 +
    values.environmentMaintenanceHoursPerMonth * 12;

  const futureAdminSupportHours =
    values.provisioningRequestsPerMonth *
      values.manualHoursPerProvisioningRequest *
      12 *
      (1 - provisioningReduction) +
    values.supportIncidentsPerMonth *
      values.hoursPerSupportIncident *
      12 *
      (1 - incidentReduction) +
    values.governanceHoursPerMonth * 12 * (1 - governanceReduction) +
    values.futureEnvironmentMaintenanceHoursPerMonth * 12;

  const currentAdminSupportCost =
    currentAdminSupportHours * values.itHourlyCost +
    values.currentToolingCost +
    values.currentSecurityComplianceCost;
  const futureAdminSupportCost =
    futureAdminSupportHours * values.itHourlyCost +
    values.futureToolingCost +
    values.futureSecurityComplianceCost;

  const currentAnnualCost = currentAdminSupportCost;
  const futureAnnualCost = futureAdminSupportCost;
  const annualCostDifference = currentAnnualCost - futureAnnualCost;
  const fixedCostAvoided = values.currentToolingCost - values.futureToolingCost;
  const idleCapacityCostReduced = 0;
  const adminSupportHoursReduced = currentAdminSupportHours - futureAdminSupportHours;
  const migrationPaybackMonths =
    annualCostDifference > 0
      ? (values.transitionTrainingCost / annualCostDifference) * 12
      : 0;

  return {
    currentAnnualCost,
    futureAnnualCost,
    annualCostDifference,
    fixedCostAvoided,
    idleCapacityCostReduced,
    adminSupportHoursReduced,
    migrationPaybackMonths,
    extraOutputs: [
      { label: "Current admin hours", value: `${Math.round(currentAdminSupportHours).toLocaleString()} hours` },
      { label: "Future admin hours", value: `${Math.round(futureAdminSupportHours).toLocaleString()} hours` },
      { label: "Annual support cost", value: `$${Math.round(futureAdminSupportCost).toLocaleString()}` },
    ],
  };
}

export const itOperationsTco = createInteractiveCalculator("it", {
  id: "it-operations-tco",
  valueModel: "tco",
  name: "IT Operations TCO",
  teaser:
    "Model the cost of manual provisioning, environment management, troubleshooting, governance, and support overhead.",
  businessOutcome:
    "Compare current-state operations cost against a future-state operating model with lower support and admin burden.",
  sections: [
    {
      key: "currentState",
      title: "Current-state cost inputs",
      description: "Capture the monthly operations workload and direct cost of supporting the current environment.",
      fields: [
        { key: "provisioningRequestsPerMonth", label: "Provisioning requests per month", defaultValue: 48, min: 0, step: 1 },
        { key: "manualHoursPerProvisioningRequest", label: "Manual hours per provisioning request", defaultValue: 2.6, min: 0, step: 0.1, suffix: "hours" },
        { key: "supportIncidentsPerMonth", label: "Support incidents per month", defaultValue: 22, min: 0, step: 1 },
        { key: "hoursPerSupportIncident", label: "Hours per support incident", defaultValue: 3.4, min: 0, step: 0.1, suffix: "hours" },
        { key: "governanceHoursPerMonth", label: "Governance and reporting hours per month", defaultValue: 54, min: 0, step: 1, suffix: "hours" },
        { key: "environmentMaintenanceHoursPerMonth", label: "Environment maintenance hours per month", defaultValue: 78, min: 0, step: 1, suffix: "hours" },
      ],
    },
    {
      key: "futureState",
      title: "Future-state cost inputs",
      description: "Model how the support burden changes under the future operating model.",
      fields: [
        { key: "provisioningReductionPct", label: "Provisioning effort reduction", defaultValue: 0.42, min: 0, max: 0.95, step: 0.01, kind: "percent" },
        { key: "incidentReductionPct", label: "Troubleshooting effort reduction", defaultValue: 0.28, min: 0, max: 0.95, step: 0.01, kind: "percent" },
        { key: "governanceReductionPct", label: "Governance and reporting effort reduction", defaultValue: 0.36, min: 0, max: 0.95, step: 0.01, kind: "percent" },
        { key: "futureEnvironmentMaintenanceHoursPerMonth", label: "Future environment maintenance hours per month", defaultValue: 42, min: 0, step: 1, suffix: "hours" },
      ],
    },
    {
      key: "support",
      title: "Support and tooling cost inputs",
      description: "Include direct labor and tooling costs for the current and future models.",
      fields: [
        { key: "itHourlyCost", label: "IT operations hourly cost", defaultValue: 132, min: 0, step: 5, prefix: "$" },
        { key: "currentToolingCost", label: "Current annual tooling and platform support cost", defaultValue: 210000, min: 0, step: 5000, prefix: "$" },
        { key: "futureToolingCost", label: "Future annual tooling and platform support cost", defaultValue: 165000, min: 0, step: 5000, prefix: "$" },
        { key: "currentSecurityComplianceCost", label: "Current annual security and compliance tooling cost", defaultValue: 95000, min: 0, step: 5000, prefix: "$" },
        { key: "futureSecurityComplianceCost", label: "Future annual security and compliance tooling cost", defaultValue: 82000, min: 0, step: 5000, prefix: "$" },
      ],
    },
    {
      key: "transition",
      title: "Transition cost inputs",
      description: "Model one-time training, migration, or operating-model transition cost.",
      fields: [
        { key: "transitionTrainingCost", label: "Migration and operating-model transition cost", defaultValue: 140000, min: 0, step: 5000, prefix: "$" },
      ],
    },
  ],
  calculate: calculateItOperationsTco,
});
