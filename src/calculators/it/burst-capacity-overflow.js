import { clampPercent, createInteractiveCalculator } from "../shared";

function calculateInfrastructureTco(values) {
  const annualizedHardwareRefresh =
    values.hardwareRefreshCost / Math.max(values.depreciationYears, 1);
  const currentInfrastructureBase =
    annualizedHardwareRefresh +
    values.maintenanceSupportContracts +
    values.dataCenterColoCost +
    values.storageBackupCost +
    values.networkEgressCost +
    values.licensingCost +
    values.securityComplianceCost;
  const currentAdminSupportCost =
    values.adminSupportHoursPerMonth * 12 * values.adminHourlyCost;
  const currentAnnualCost = currentInfrastructureBase + currentAdminSupportCost;

  const cloudCommitmentDiscount = clampPercent(values.cloudCommitmentDiscountPct);
  const onPremShare = clampPercent(values.workloadShareStayingOnPremPct);
  const currentFixedInfraRetained = currentInfrastructureBase * onPremShare;
  const discountedCloudCost =
    values.cloudInfrastructureCost * 12 * (1 - cloudCommitmentDiscount);
  const futureAdminSupportCost =
    values.futureAdminSupportHoursPerMonth * 12 * values.adminHourlyCost;
  const futureAnnualCost =
    currentFixedInfraRetained +
    discountedCloudCost +
    values.futureLicensingCost +
    values.futureSecurityComplianceCost +
    values.futureStorageDrCost +
    futureAdminSupportCost;

  const annualCostDifference = currentAnnualCost - futureAnnualCost;
  const fixedCostAvoided = currentInfrastructureBase - currentFixedInfraRetained;
  const idleCapacityCostReduced =
    currentInfrastructureBase * clampPercent(values.idleCapacityReductionPct);
  const adminSupportHoursReduced =
    (values.adminSupportHoursPerMonth - values.futureAdminSupportHoursPerMonth) * 12;
  const migrationPaybackMonths =
    annualCostDifference > 0
      ? ((values.migrationCutoverCost + values.parallelRunCost) /
          annualCostDifference) *
        12
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
      { label: "Cloud annual cost", value: `$${Math.round(discountedCloudCost).toLocaleString()}` },
      { label: "On-prem retained", value: `$${Math.round(currentFixedInfraRetained).toLocaleString()}` },
      { label: "Admin hours reduced", value: `${Math.round(adminSupportHoursReduced).toLocaleString()} hours` },
    ],
  };
}

export const infrastructureTco = createInteractiveCalculator("it", {
  id: "infrastructure-tco",
  valueModel: "tco",
  name: "Infrastructure TCO",
  teaser:
    "Compare the total cost of fixed on-prem infrastructure against a more elastic cloud or hybrid operating model.",
  businessOutcome:
    "Compare current-state total cost against future-state cloud or hybrid total cost, including migration and support burden.",
  sections: [
    {
      key: "currentState",
      title: "Current-state cost inputs",
      description: "Start with the annual costs the IT team carries today.",
      fields: [
        { key: "hardwareRefreshCost", label: "Hardware refresh cost", defaultValue: 1200000, min: 0, step: 10000, prefix: "$" },
        { key: "depreciationYears", label: "Depreciation window", defaultValue: 4, min: 1, step: 1, suffix: "years" },
        { key: "maintenanceSupportContracts", label: "Maintenance and support contracts", defaultValue: 180000, min: 0, step: 5000, prefix: "$" },
        { key: "dataCenterColoCost", label: "Data center or colo cost", defaultValue: 220000, min: 0, step: 5000, prefix: "$" },
        { key: "storageBackupCost", label: "Storage, backup, and disaster recovery cost", defaultValue: 160000, min: 0, step: 5000, prefix: "$" },
        { key: "networkEgressCost", label: "Network and egress cost", defaultValue: 70000, min: 0, step: 5000, prefix: "$" },
      ],
    },
    {
      key: "futureState",
      title: "Future-state cost inputs",
      description: "Model the annual cost of the proposed cloud or hybrid operating model.",
      fields: [
        { key: "cloudInfrastructureCost", label: "Cloud infrastructure cost per month", defaultValue: 95000, min: 0, step: 1000, prefix: "$" },
        { key: "cloudCommitmentDiscountPct", label: "Commitment discount assumption", defaultValue: 0.18, min: 0, max: 0.95, step: 0.01, kind: "percent" },
        { key: "workloadShareStayingOnPremPct", label: "Share of workloads staying on-prem or in hybrid", defaultValue: 0.35, min: 0, max: 0.95, step: 0.01, kind: "percent" },
        { key: "futureLicensingCost", label: "Future-state licensing cost", defaultValue: 210000, min: 0, step: 5000, prefix: "$" },
        { key: "futureSecurityComplianceCost", label: "Future-state security and compliance tooling cost", defaultValue: 90000, min: 0, step: 5000, prefix: "$" },
        { key: "futureStorageDrCost", label: "Future-state storage and DR cost", defaultValue: 130000, min: 0, step: 5000, prefix: "$" },
      ],
    },
    {
      key: "support",
      title: "Support and utilization assumptions",
      description: "Include labor and capacity assumptions that affect the TCO story.",
      fields: [
        { key: "adminSupportHoursPerMonth", label: "Current admin and support hours per month", defaultValue: 280, min: 0, step: 5, suffix: "hours" },
        { key: "futureAdminSupportHoursPerMonth", label: "Future admin and support hours per month", defaultValue: 180, min: 0, step: 5, suffix: "hours" },
        { key: "adminHourlyCost", label: "Admin and support hourly cost", defaultValue: 125, min: 0, step: 5, prefix: "$" },
        { key: "idleCapacityReductionPct", label: "Idle capacity cost reduced", defaultValue: 0.28, min: 0, max: 0.95, step: 0.01, kind: "percent", advanced: true },
        { key: "licensingCost", label: "Current licensing cost", defaultValue: 240000, min: 0, step: 5000, prefix: "$" },
        { key: "securityComplianceCost", label: "Current security and compliance tooling cost", defaultValue: 85000, min: 0, step: 5000, prefix: "$" },
      ],
    },
    {
      key: "transition",
      title: "Transition or migration cost inputs",
      description: "Model one-time costs needed to move from the current model to the future model.",
      fields: [
        { key: "migrationCutoverCost", label: "Migration and cutover cost", defaultValue: 320000, min: 0, step: 10000, prefix: "$" },
        { key: "parallelRunCost", label: "Parallel run or dual-operation cost", defaultValue: 90000, min: 0, step: 5000, prefix: "$", advanced: true },
      ],
    },
  ],
  calculate: calculateInfrastructureTco,
});
