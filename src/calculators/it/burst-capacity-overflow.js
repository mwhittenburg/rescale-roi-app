import { clampPercent, createInteractiveCalculator, safeDivide } from "../shared";

function annualizeThreeYears(value, growthRate) {
  return (
    value * (1 + (1 + growthRate) + Math.pow(1 + growthRate, 2))
  );
}

function calculateInfrastructureTco(values) {
  const annualizedHardwareRefresh =
    values.hardwareRefreshCost / Math.max(values.depreciationYears, 1);
  const productiveUtilization = Math.max(
    clampPercent(values.productiveUtilizationPct),
    0.05,
  );
  const cloudCommitmentDiscount = clampPercent(values.cloudCommitmentDiscountPct);
  const reservationUtilization = Math.max(
    clampPercent(values.reservationUtilizationPct),
    0.35,
  );
  const onPremShare = clampPercent(values.workloadShareStayingOnPremPct);
  const workloadGrowthRate = clampPercent(values.workloadGrowthRatePct);
  const installedCoreHoursPerYear =
    Math.max(values.installedCoreCount, 1) * 24 * 365;
  const utilizedCoreHoursPerYear =
    installedCoreHoursPerYear * productiveUtilization;

  const currentInfrastructureBase =
    annualizedHardwareRefresh +
    values.maintenanceSupportContracts +
    values.dataCenterColoCost +
    values.storageCost +
    values.backupDisasterRecoveryCost +
    values.networkEgressCost +
    values.licensingCost +
    values.securityComplianceCost;
  const currentAdminSupportCost =
    values.currentAdminSupportHoursPerMonth * 12 * values.adminHourlyCost;
  const currentAnnualCost =
    currentInfrastructureBase +
    currentAdminSupportCost +
    values.currentPlatformToolingCost;

  const currentFixedInfraRetained = currentInfrastructureBase * onPremShare;
  const discountedCloudCost =
    (values.cloudInfrastructureCostPerMonth * 12 * (1 - cloudCommitmentDiscount)) /
    reservationUtilization;
  const futureAdminSupportCost =
    values.futureAdminSupportHoursPerMonth * 12 * values.adminHourlyCost;
  const futureAnnualCost =
    currentFixedInfraRetained +
    discountedCloudCost +
    values.futureLicensingCost +
    values.futureSecurityComplianceCost +
    values.futureStorageDrCost +
    values.futureNetworkEgressCost +
    values.futurePlatformToolingCost +
    futureAdminSupportCost;

  const transitionCost = values.migrationCutoverCost + values.parallelRunCost;
  const annualCostDifference = currentAnnualCost - futureAnnualCost;
  const threeYearCumulativeDifference =
    annualizeThreeYears(currentAnnualCost, workloadGrowthRate) -
    (annualizeThreeYears(futureAnnualCost, workloadGrowthRate) + transitionCost);
  const fixedCostAvoided = currentInfrastructureBase - currentFixedInfraRetained;
  const annualIdleCapacityCost = currentInfrastructureBase * (1 - productiveUtilization);
  const idleCapacityCostReduced = annualIdleCapacityCost * (1 - onPremShare);
  const adminSupportHoursReduced =
    (values.currentAdminSupportHoursPerMonth - values.futureAdminSupportHoursPerMonth) *
    12;
  const migrationPaybackMonths =
    annualCostDifference > 0 ? (transitionCost / annualCostDifference) * 12 : 0;
  const installedCoreHourCost = safeDivide(
    currentAnnualCost,
    installedCoreHoursPerYear,
  );
  const utilizedCoreHourCost = safeDivide(
    currentAnnualCost,
    utilizedCoreHoursPerYear,
  );

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
        label: "Retained on-prem annual cost",
        value: `$${Math.round(currentFixedInfraRetained).toLocaleString()}`,
      },
      {
        label: "Future cloud annual baseline",
        value: `$${Math.round(discountedCloudCost).toLocaleString()}`,
      },
      {
        label: "Installed core-hour cost",
        value: `${installedCoreHourCost.toFixed(2)} per core-hour`,
      },
      {
        label: "Effective utilized core-hour cost",
        value: `${utilizedCoreHourCost.toFixed(2)} per used core-hour`,
      },
      {
        label: "Annual idle-capacity cost",
        value: `$${Math.round(annualIdleCapacityCost).toLocaleString()}`,
      },
      {
        label: "Fixed cost avoided",
        value: `$${Math.round(fixedCostAvoided).toLocaleString()}`,
      },
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
    "Compare current-state annual cost, future-state annual cost, and transition cost for a cloud or hybrid move with utilization-aware unit economics.",
  sections: [
    {
      key: "currentState",
      title: "Current-state cost inputs",
      description: "Start with the biggest annual current-state cost lines the IT team carries today.",
      advancedSectionLabel: "Utilization and additional cost buckets",
      fields: [
        {
          key: "hardwareRefreshCost",
          label: "Hardware refresh cost",
          defaultValue: 1200000,
          min: 0,
          step: 10000,
          prefix: "$",
        },
        {
          key: "maintenanceSupportContracts",
          label: "Maintenance and support contracts",
          defaultValue: 180000,
          min: 0,
          step: 5000,
          prefix: "$",
        },
        {
          key: "dataCenterColoCost",
          label: "Data center or colo cost",
          defaultValue: 220000,
          min: 0,
          step: 5000,
          prefix: "$",
        },
        {
          key: "depreciationYears",
          label: "Depreciation window",
          defaultValue: 4,
          min: 1,
          step: 1,
          suffix: "years",
          advanced: true,
        },
        {
          key: "storageCost",
          label: "Storage cost",
          defaultValue: 110000,
          min: 0,
          step: 5000,
          prefix: "$",
          advanced: true,
        },
        {
          key: "backupDisasterRecoveryCost",
          label: "Backup and disaster recovery cost",
          defaultValue: 50000,
          min: 0,
          step: 5000,
          prefix: "$",
          advanced: true,
        },
        {
          key: "networkEgressCost",
          label: "Network and egress cost",
          defaultValue: 70000,
          min: 0,
          step: 5000,
          prefix: "$",
          advanced: true,
        },
        {
          key: "licensingCost",
          label: "Current licensing cost",
          defaultValue: 240000,
          min: 0,
          step: 5000,
          prefix: "$",
          advanced: true,
        },
        {
          key: "securityComplianceCost",
          label: "Current security and compliance tooling cost",
          defaultValue: 85000,
          min: 0,
          step: 5000,
          prefix: "$",
          advanced: true,
        },
        {
          key: "installedCoreCount",
          label: "Installed cores",
          defaultValue: 1000,
          min: 1,
          step: 10,
          advanced: true,
        },
        {
          key: "productiveUtilizationPct",
          label: "Average productive utilization",
          defaultValue: 0.52,
          min: 0.01,
          max: 0.95,
          step: 0.01,
          kind: "percent",
          advanced: true,
        },
      ],
    },
    {
      key: "futureState",
      title: "Future-state cost inputs",
      description: "Model the future steady-state cost of the cloud or hybrid operating model.",
      advancedSectionLabel: "Licensing, resiliency, and growth",
      fields: [
        {
          key: "cloudInfrastructureCostPerMonth",
          label: "Future cloud infrastructure cost per month",
          defaultValue: 95000,
          min: 0,
          step: 1000,
          prefix: "$",
          helperText:
            "Use the expected monthly run-state cloud or hybrid infrastructure baseline for the future model before the add-on cost buckets below.",
          helpTooltip: {
            what:
              "Represents the expected monthly infrastructure baseline for the future cloud or hybrid model.",
            include:
              "Core run-state cloud or hybrid infrastructure needed to serve the target workload mix before separate storage, network, licensing, security, and tooling add-ons below.",
            exclude:
              "One-time migration cost, retained on-prem cost already modeled separately, or future add-on buckets that are entered in their own fields below.",
            example:
              "A directional monthly cloud baseline that covers the primary future workload footprint before storage, egress, and tooling are layered in.",
          },
        },
        {
          key: "workloadShareStayingOnPremPct",
          label: "Share of workloads staying on-prem or in hybrid",
          defaultValue: 0.35,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
          helperText:
            "Use the share of workload you expect to retain outside a full cloud move because of performance, governance, data, or licensing constraints.",
        },
        {
          key: "cloudCommitmentDiscountPct",
          label: "Commitment discount assumption",
          defaultValue: 0.18,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
        },
        {
          key: "futureLicensingCost",
          label: "Future-state licensing cost",
          defaultValue: 210000,
          min: 0,
          step: 5000,
          prefix: "$",
          advanced: true,
        },
        {
          key: "futureSecurityComplianceCost",
          label: "Future-state security and compliance tooling cost",
          defaultValue: 90000,
          min: 0,
          step: 5000,
          prefix: "$",
          advanced: true,
        },
        {
          key: "futureStorageDrCost",
          label: "Future-state storage and DR cost",
          defaultValue: 130000,
          min: 0,
          step: 5000,
          prefix: "$",
          advanced: true,
        },
        {
          key: "futureNetworkEgressCost",
          label: "Future-state network and egress cost",
          defaultValue: 90000,
          min: 0,
          step: 5000,
          prefix: "$",
          advanced: true,
        },
        {
          key: "futurePlatformToolingCost",
          label: "Future annual tooling and platform support cost",
          defaultValue: 70000,
          min: 0,
          step: 5000,
          prefix: "$",
          advanced: true,
        },
        {
          key: "reservationUtilizationPct",
          label: "Commitment or reservation utilization",
          defaultValue: 0.82,
          min: 0.2,
          max: 0.95,
          step: 0.01,
          kind: "percent",
          advanced: true,
        },
        {
          key: "workloadGrowthRatePct",
          label: "Workload growth rate",
          defaultValue: 0.08,
          min: 0,
          max: 0.35,
          step: 0.01,
          kind: "percent",
          advanced: true,
        },
      ],
    },
    {
      key: "support",
      title: "Support and admin inputs",
      description: "Include the recurring labor burden that changes between the current and future model.",
      advancedSectionLabel: "Additional support assumptions",
      fields: [
        {
          key: "currentAdminSupportHoursPerMonth",
          label: "Current admin and support hours per month",
          defaultValue: 280,
          min: 0,
          step: 5,
          suffix: "hours",
        },
        {
          key: "futureAdminSupportHoursPerMonth",
          label: "Future admin and support hours per month",
          defaultValue: 180,
          min: 0,
          step: 5,
          suffix: "hours",
        },
        {
          key: "adminHourlyCost",
          label: "Admin and support hourly cost",
          defaultValue: 125,
          min: 0,
          step: 5,
          prefix: "$",
        },
        {
          key: "currentPlatformToolingCost",
          label: "Current annual tooling and platform support cost",
          defaultValue: 45000,
          min: 0,
          step: 5000,
          prefix: "$",
          advanced: true,
        },
      ],
    },
    {
      key: "transition",
      title: "Transition or migration cost inputs",
      description: "Model the one-time cost of moving from the current model to the future model.",
      advancedSectionLabel: "Timing and overlap assumptions",
      fields: [
        {
          key: "migrationCutoverCost",
          label: "Migration and cutover cost",
          defaultValue: 320000,
          min: 0,
          step: 10000,
          prefix: "$",
        },
        {
          key: "parallelRunCost",
          label: "Parallel run or dual-operation cost",
          defaultValue: 90000,
          min: 0,
          step: 5000,
          prefix: "$",
          advanced: true,
        },
      ],
    },
  ],
  calculate: calculateInfrastructureTco,
});
