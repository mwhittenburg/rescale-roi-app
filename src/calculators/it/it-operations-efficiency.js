import { clampPercent, createInteractiveCalculator } from "../shared";

function annualizeThreeYears(value) {
  return value * 3;
}

function calculateItOperationsTco(values) {
  const provisioningReduction = clampPercent(values.provisioningReductionPct);
  const incidentReduction = clampPercent(values.incidentReductionPct);
  const environmentReduction = clampPercent(values.environmentReductionPct);
  const governanceReduction = clampPercent(values.governanceReductionPct);
  const backupReduction = clampPercent(values.backupRestoreReductionPct);
  const patchingReduction = clampPercent(values.patchingSecurityReductionPct);

  const currentProvisioningHours =
    values.provisioningRequestsPerMonth *
    values.manualHoursPerProvisioningRequest *
    12;
  const currentIncidentHours =
    values.supportIncidentsPerMonth * values.hoursPerSupportIncident * 12;
  const currentEnvironmentHours = values.environmentManagementHoursPerMonth * 12;
  const currentGovernanceHours = values.governanceComplianceHoursPerMonth * 12;
  const currentBackupHours = values.backupRestoreHoursPerMonth * 12;
  const currentPatchingHours = values.patchingSecurityHoursPerMonth * 12;

  const futureProvisioningHours = currentProvisioningHours * (1 - provisioningReduction);
  const futureIncidentHours = currentIncidentHours * (1 - incidentReduction);
  const futureEnvironmentHours = currentEnvironmentHours * (1 - environmentReduction);
  const futureGovernanceHours = currentGovernanceHours * (1 - governanceReduction);
  const futureBackupHours = currentBackupHours * (1 - backupReduction);
  const futurePatchingHours = currentPatchingHours * (1 - patchingReduction);

  const currentAdminSupportHours =
    currentProvisioningHours +
    currentIncidentHours +
    currentEnvironmentHours +
    currentGovernanceHours +
    currentBackupHours +
    currentPatchingHours;
  const futureAdminSupportHours =
    futureProvisioningHours +
    futureIncidentHours +
    futureEnvironmentHours +
    futureGovernanceHours +
    futureBackupHours +
    futurePatchingHours;

  const currentLaborCost = currentAdminSupportHours * values.itHourlyCost;
  const futureLaborCost = futureAdminSupportHours * values.itHourlyCost;
  const currentAnnualCost =
    currentLaborCost +
    values.currentToolingCost +
    values.currentSecurityComplianceCost;
  const futureAnnualCost =
    futureLaborCost +
    values.futureToolingCost +
    values.futureSecurityComplianceCost;
  const transitionCost = values.transitionTrainingCost;
  const annualCostDifference = currentAnnualCost - futureAnnualCost;
  const threeYearCumulativeDifference =
    annualizeThreeYears(currentAnnualCost) -
    (annualizeThreeYears(futureAnnualCost) + transitionCost);
  const fixedCostAvoided = values.currentToolingCost - values.futureToolingCost;
  const idleCapacityCostReduced = 0;
  const adminSupportHoursReduced = currentAdminSupportHours - futureAdminSupportHours;
  const migrationPaybackMonths =
    annualCostDifference > 0 ? (transitionCost / annualCostDifference) * 12 : 0;

  return {
    currentAnnualCost,
    futureAnnualCost,
    annualCostDifference,
    transitionCost,
    threeYearCumulativeDifference,
    fixedCostAvoided,
    idleCapacityCostReduced,
    adminSupportHoursReduced,
    migrationPaybackMonths,
    extraOutputs: [
      {
        label: "Provisioning hours reduced",
        value: `${Math.round(
          currentProvisioningHours - futureProvisioningHours,
        ).toLocaleString()} hours`,
      },
      {
        label: "Troubleshooting hours reduced",
        value: `${Math.round(
          currentIncidentHours - futureIncidentHours,
        ).toLocaleString()} hours`,
      },
      {
        label: "Environment and governance hours reduced",
        value: `${Math.round(
          currentEnvironmentHours -
            futureEnvironmentHours +
            (currentGovernanceHours - futureGovernanceHours),
        ).toLocaleString()} hours`,
      },
      {
        label: "Backup and patching hours reduced",
        value: `${Math.round(
          currentBackupHours -
            futureBackupHours +
            (currentPatchingHours - futurePatchingHours),
        ).toLocaleString()} hours`,
      },
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
    "Compare the annual support and admin burden today against a future operating model with lower manual effort and better tooling.",
  sections: [
    {
      key: "currentState",
      title: "Current-state workload inputs",
      description: "Start with the operating workload the platform or infrastructure team handles today.",
      advancedSectionLabel: "Current category workload",
      fields: [
        {
          key: "provisioningRequestsPerMonth",
          label: "Provisioning requests per month",
          defaultValue: 48,
          min: 0,
          step: 1,
        },
        {
          key: "manualHoursPerProvisioningRequest",
          label: "Hours per provisioning request",
          defaultValue: 2.6,
          min: 0,
          step: 0.1,
          suffix: "hours",
        },
        {
          key: "supportIncidentsPerMonth",
          label: "Support incidents per month",
          defaultValue: 22,
          min: 0,
          step: 1,
        },
        {
          key: "hoursPerSupportIncident",
          label: "Hours per support incident",
          defaultValue: 3.4,
          min: 0,
          step: 0.1,
          suffix: "hours",
        },
        {
          key: "environmentManagementHoursPerMonth",
          label: "Environment management hours per month",
          defaultValue: 52,
          min: 0,
          step: 1,
          suffix: "hours",
          advanced: true,
        },
        {
          key: "governanceComplianceHoursPerMonth",
          label: "Governance and compliance hours per month",
          defaultValue: 54,
          min: 0,
          step: 1,
          suffix: "hours",
          advanced: true,
        },
        {
          key: "backupRestoreHoursPerMonth",
          label: "Backup and restore hours per month",
          defaultValue: 18,
          min: 0,
          step: 1,
          suffix: "hours",
          advanced: true,
        },
        {
          key: "patchingSecurityHoursPerMonth",
          label: "Patching and security operations hours per month",
          defaultValue: 26,
          min: 0,
          step: 1,
          suffix: "hours",
          advanced: true,
        },
      ],
    },
    {
      key: "futureState",
      title: "Future-state effort inputs",
      description: "Model how much manual operations effort remains under the future operating model.",
      advancedSectionLabel: "Category-specific reductions",
      fields: [
        {
          key: "provisioningReductionPct",
          label: "Provisioning effort reduction",
          defaultValue: 0.42,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
        },
        {
          key: "incidentReductionPct",
          label: "Troubleshooting effort reduction",
          defaultValue: 0.28,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
        },
        {
          key: "environmentReductionPct",
          label: "Environment management effort reduction",
          defaultValue: 0.35,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
          advanced: true,
        },
        {
          key: "governanceReductionPct",
          label: "Governance and compliance effort reduction",
          defaultValue: 0.36,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
          advanced: true,
        },
        {
          key: "backupRestoreReductionPct",
          label: "Backup and restore effort reduction",
          defaultValue: 0.22,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
          advanced: true,
        },
        {
          key: "patchingSecurityReductionPct",
          label: "Patching and security operations reduction",
          defaultValue: 0.2,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
          advanced: true,
        },
      ],
    },
    {
      key: "support",
      title: "Support and tooling cost inputs",
      description: "Include the direct labor rate and recurring tooling cost for the current and future model.",
      advancedSectionLabel: "Security and support assumptions",
      fields: [
        {
          key: "itHourlyCost",
          label: "Loaded IT operations hourly cost",
          defaultValue: 132,
          min: 0,
          step: 5,
          prefix: "$",
        },
        {
          key: "currentToolingCost",
          label: "Current annual tooling and platform support cost",
          defaultValue: 210000,
          min: 0,
          step: 5000,
          prefix: "$",
        },
        {
          key: "futureToolingCost",
          label: "Future annual tooling and platform support cost",
          defaultValue: 165000,
          min: 0,
          step: 5000,
          prefix: "$",
        },
        {
          key: "currentSecurityComplianceCost",
          label: "Current annual security and compliance tooling cost",
          defaultValue: 95000,
          min: 0,
          step: 5000,
          prefix: "$",
          advanced: true,
        },
        {
          key: "futureSecurityComplianceCost",
          label: "Future annual security and compliance tooling cost",
          defaultValue: 82000,
          min: 0,
          step: 5000,
          prefix: "$",
          advanced: true,
        },
      ],
    },
    {
      key: "transition",
      title: "Transition cost inputs",
      description: "Model the one-time training, migration, or operating-model transition effort.",
      fields: [
        {
          key: "transitionTrainingCost",
          label: "Migration and operating-model transition cost",
          defaultValue: 140000,
          min: 0,
          step: 5000,
          prefix: "$",
        },
      ],
    },
  ],
  calculate: calculateItOperationsTco,
});
