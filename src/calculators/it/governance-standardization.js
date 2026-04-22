import { clampPercent, createInteractiveCalculator } from "../shared";

function annualizeThreeYears(value) {
  return value * 3;
}

function calculatePeakCapacityTco(values) {
  const averageUtilization = Math.max(
    clampPercent(values.averageUtilizationPct),
    0.05,
  );
  const peakUtilization = Math.max(clampPercent(values.peakUtilizationPct), 0.06);
  const peakToAverageDemandRatio = Math.max(peakUtilization / averageUtilization, 1);
  const averageDemandEquivalentCost =
    values.annualPeakBuiltCapacityCost / peakToAverageDemandRatio;
  const annualIdleCapacityTax = Math.max(
    values.annualPeakBuiltCapacityCost - averageDemandEquivalentCost,
    0,
  );
  const currentOverflowAnnualCost =
    values.burstWindowsPerYear * values.currentEmergencyBurstCostPerWindow;
  const currentAnnualCost =
    values.annualPeakBuiltCapacityCost +
    currentOverflowAnnualCost +
    values.currentSupportAdminCost;

  const commitmentDiscount = clampPercent(values.commitmentDiscountPct);
  const discountedHybridBaseline =
    values.hybridBaselineCapacityCost * (1 - commitmentDiscount);
  const futureElasticBurstAnnualCost =
    values.burstWindowsPerYear *
    values.burstDurationHours *
    values.futureElasticBurstCostPerHour;
  const futureAnnualCost =
    discountedHybridBaseline +
    futureElasticBurstAnnualCost +
    values.futureSupportAdminCost +
    values.futureGovernanceToolingCost;

  const futureResidualIdleCost = Math.max(
    discountedHybridBaseline - averageDemandEquivalentCost,
    0,
  );
  const transitionCost = values.transitionCost;
  const annualCostDifference = currentAnnualCost - futureAnnualCost;
  const threeYearCumulativeDifference =
    annualizeThreeYears(currentAnnualCost) -
    (annualizeThreeYears(futureAnnualCost) + transitionCost);
  const fixedCostAvoided = Math.max(
    values.annualPeakBuiltCapacityCost - discountedHybridBaseline,
    0,
  );
  const idleCapacityCostReduced = Math.max(
    annualIdleCapacityTax - futureResidualIdleCost,
    0,
  );
  const adminSupportHoursReduced =
    (values.currentSupportHoursPerMonth - values.futureSupportHoursPerMonth) * 12;
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
        label: "Peak-to-average demand ratio",
        value: `${peakToAverageDemandRatio.toFixed(1)}x`,
      },
      {
        label: "Annual fixed cost built for peak",
        value: `$${Math.round(values.annualPeakBuiltCapacityCost).toLocaleString()}`,
      },
      {
        label: "Future steady-state baseline cost",
        value: `$${Math.round(discountedHybridBaseline).toLocaleString()}`,
      },
      {
        label: "Annual elastic burst cost",
        value: `$${Math.round(futureElasticBurstAnnualCost).toLocaleString()}`,
      },
      {
        label: "Annual blended baseline + burst cost",
        value: `$${Math.round(futureAnnualCost).toLocaleString()}`,
      },
      {
        label: "Annual idle-capacity tax avoided",
        value: `$${Math.round(idleCapacityCostReduced).toLocaleString()}`,
      },
    ],
  };
}

export const peakCapacityTco = createInteractiveCalculator("it", {
  id: "peak-capacity-tco",
  valueModel: "tco",
  name: "Peak Capacity TCO",
  teaser:
    "Model the cost of handling peak demand without buying infrastructure for the peak.",
  businessOutcome:
    "Compare building fixed capacity for peak demand against a smaller steady-state baseline plus intentional burst capacity during peak periods.",
  sections: [
    {
      key: "currentState",
      title: "Current-state cost inputs",
      description: "Capture what it costs today to carry peak-sized fixed capacity and what demand really looks like.",
      advancedSectionLabel: "Overflow and capacity assumptions",
      fields: [
        {
          key: "annualPeakBuiltCapacityCost",
          label: "Current annual cost of carrying peak-sized on-prem capacity",
          defaultValue: 780000,
          min: 0,
          step: 10000,
          prefix: "$",
        },
        {
          key: "averageUtilizationPct",
          label: "Average utilization",
          defaultValue: 0.46,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
        },
        {
          key: "peakUtilizationPct",
          label: "Peak utilization",
          defaultValue: 0.92,
          min: 0.01,
          max: 0.99,
          step: 0.01,
          kind: "percent",
        },
        {
          key: "burstWindowsPerYear",
          label: "Peak demand windows per year",
          defaultValue: 12,
          min: 0,
          step: 1,
        },
        {
          key: "burstDurationHours",
          label: "Burst duration per peak period",
          defaultValue: 72,
          min: 1,
          step: 1,
          suffix: "hours",
        },
        {
          key: "currentEmergencyBurstCostPerWindow",
          label: "Current extra overflow cost per peak period",
          defaultValue: 18000,
          min: 0,
          step: 500,
          prefix: "$",
          advanced: true,
          helperText:
            "Use the extra burst or overflow cost on top of the fixed environment during one typical peak period.",
          helpTooltip: {
            what:
              "Represents the extra overflow or burst cost incurred during one typical peak period on top of the fixed on-prem capacity cost above.",
            include:
              "Burst-to-cloud spend, temporary extra capacity, premium support effort, or workaround costs tied to one peak period.",
            exclude:
              "The annual fixed on-prem capacity cost already captured above or normal day-to-day operating spend that would exist even without the spike.",
            example:
              "One quarter-end crunch that triggers about $18,000 of burst-to-cloud or overflow cost beyond the fixed baseline.",
          },
        },
      ],
    },
    {
      key: "futureState",
      title: "Future-state cost inputs",
      description: "Model a smaller always-on baseline plus intentional elastic burst capacity during peak periods.",
      advancedSectionLabel: "Commitment and governance assumptions",
      fields: [
        {
          key: "hybridBaselineCapacityCost",
          label: "Future steady-state capacity cost",
          defaultValue: 420000,
          min: 0,
          step: 10000,
          prefix: "$",
        },
        {
          key: "futureElasticBurstCostPerHour",
          label: "Future elastic burst cost per peak hour",
          defaultValue: 190,
          min: 0,
          step: 5,
          prefix: "$",
          helperText:
            "Use your estimated cost of serving one burst hour with elastic or overflow capacity. Keep this directional unless workload-hour pricing has been validated.",
          helpTooltip: {
            what:
              "Represents the incremental cost of serving one peak hour with elastic capacity on top of the future steady-state baseline.",
            include:
              "Cloud burst, temporary overflow capacity, or time-bound elastic infrastructure cost directly tied to one peak hour.",
            exclude:
              "The future baseline cost that already exists year-round or one-time migration cost.",
            example:
              "If a typical burst hour costs about $190 in elastic infrastructure, use that hourly amount here. Treat it as a planning assumption until workload-hour pricing is validated.",
          },
        },
        {
          key: "commitmentDiscountPct",
          label: "Commitment discount assumption",
          defaultValue: 0.12,
          min: 0,
          max: 0.95,
          step: 0.01,
          kind: "percent",
          advanced: true,
        },
        {
          key: "futureGovernanceToolingCost",
          label: "Future governance and utilization tooling cost",
          defaultValue: 65000,
          min: 0,
          step: 5000,
          prefix: "$",
          advanced: true,
        },
      ],
    },
    {
      key: "support",
      title: "Support and admin inputs",
      description: "Include the recurring operating burden that changes between the peak-built and burst models.",
      advancedSectionLabel: "Detailed support assumptions",
      fields: [
        {
          key: "currentSupportAdminCost",
          label: "Current annual support and admin cost",
          defaultValue: 160000,
          min: 0,
          step: 5000,
          prefix: "$",
          advanced: true,
        },
        {
          key: "futureSupportAdminCost",
          label: "Future annual support and admin cost",
          defaultValue: 115000,
          min: 0,
          step: 5000,
          prefix: "$",
          advanced: true,
        },
        {
          key: "currentSupportHoursPerMonth",
          label: "Current support hours per month",
          defaultValue: 110,
          min: 0,
          step: 1,
          suffix: "hours",
          advanced: true,
        },
        {
          key: "futureSupportHoursPerMonth",
          label: "Future support hours per month",
          defaultValue: 72,
          min: 0,
          step: 1,
          suffix: "hours",
          advanced: true,
        },
      ],
    },
    {
      key: "transition",
      title: "Transition cost inputs",
      description: "Include one-time cost required to adopt the future peak-capacity strategy.",
      fields: [
        {
          key: "transitionCost",
          label: "Migration and cutover cost",
          defaultValue: 180000,
          min: 0,
          step: 5000,
          prefix: "$",
        },
      ],
    },
  ],
  calculate: calculatePeakCapacityTco,
});
