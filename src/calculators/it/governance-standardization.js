import { clampPercent, createInteractiveCalculator } from "../shared";

function calculatePeakCapacityTco(values) {
  const averageUtilization = clampPercent(values.averageUtilizationPct);
  const peakUtilization = Math.max(clampPercent(values.peakUtilizationPct), 0.01);
  const rightSizedBaselineCost =
    values.annualPeakBuiltCapacityCost * Math.max(averageUtilization / peakUtilization, 0.1);
  const currentBurstPremium =
    values.burstWindowsPerYear * values.currentEmergencyBurstCostPerWindow;
  const currentAnnualCost =
    values.annualPeakBuiltCapacityCost +
    currentBurstPremium +
    values.currentSupportAdminCost;

  const futureElasticBurstCost =
    values.burstWindowsPerYear * values.futureElasticBurstCostPerWindow;
  const commitmentDiscount = clampPercent(values.commitmentDiscountPct);
  const discountedHybridBaseline =
    values.hybridBaselineCapacityCost * (1 - commitmentDiscount);
  const futureAnnualCost =
    discountedHybridBaseline +
    futureElasticBurstCost +
    values.futureSupportAdminCost +
    values.futureGovernanceToolingCost;

  const annualCostDifference = currentAnnualCost - futureAnnualCost;
  const fixedCostAvoided = values.annualPeakBuiltCapacityCost - discountedHybridBaseline;
  const idleCapacityCostReduced = values.annualPeakBuiltCapacityCost - rightSizedBaselineCost;
  const adminSupportHoursReduced =
    (values.currentSupportHoursPerMonth - values.futureSupportHoursPerMonth) * 12;
  const migrationPaybackMonths =
    annualCostDifference > 0
      ? (values.transitionCost / annualCostDifference) * 12
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
      { label: "Average utilization", value: `${Math.round(averageUtilization * 100)}%` },
      { label: "Peak utilization", value: `${Math.round(peakUtilization * 100)}%` },
      { label: "Elastic overflow cost", value: `$${Math.round(futureElasticBurstCost).toLocaleString()}` },
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
    "Compare the current cost of building for the peak against a future-state model that uses a right-sized baseline plus elastic overflow.",
  sections: [
    {
      key: "currentState",
      title: "Current-state cost inputs",
      description: "Capture the annual cost of building and carrying enough capacity to cover peak demand.",
      fields: [
        { key: "annualPeakBuiltCapacityCost", label: "Annual fixed capacity cost built for peak demand", defaultValue: 780000, min: 0, step: 10000, prefix: "$" },
        { key: "burstWindowsPerYear", label: "Peak demand windows per year", defaultValue: 12, min: 0, step: 1 },
        { key: "currentEmergencyBurstCostPerWindow", label: "Current emergency overflow cost per peak window", defaultValue: 18000, min: 0, step: 500, prefix: "$" },
        { key: "averageUtilizationPct", label: "Average utilization", defaultValue: 0.46, min: 0, max: 0.95, step: 0.01, kind: "percent" },
        { key: "peakUtilizationPct", label: "Peak utilization", defaultValue: 0.92, min: 0.01, max: 0.99, step: 0.01, kind: "percent" },
      ],
    },
    {
      key: "futureState",
      title: "Future-state cost inputs",
      description: "Model a right-sized baseline plus elastic overflow for peak periods.",
      fields: [
        { key: "hybridBaselineCapacityCost", label: "Future baseline capacity cost", defaultValue: 420000, min: 0, step: 10000, prefix: "$" },
        { key: "futureElasticBurstCostPerWindow", label: "Elastic burst cost per peak window", defaultValue: 14000, min: 0, step: 500, prefix: "$" },
        { key: "commitmentDiscountPct", label: "Commitment discount assumption", defaultValue: 0.12, min: 0, max: 0.95, step: 0.01, kind: "percent" },
        { key: "futureGovernanceToolingCost", label: "Future governance and utilization tooling cost", defaultValue: 65000, min: 0, step: 5000, prefix: "$" },
      ],
    },
    {
      key: "support",
      title: "Support and admin inputs",
      description: "Include support labor that changes between the current and future peak-capacity models.",
      fields: [
        { key: "currentSupportAdminCost", label: "Current annual support and admin cost", defaultValue: 160000, min: 0, step: 5000, prefix: "$" },
        { key: "futureSupportAdminCost", label: "Future annual support and admin cost", defaultValue: 115000, min: 0, step: 5000, prefix: "$" },
        { key: "currentSupportHoursPerMonth", label: "Current support hours per month", defaultValue: 110, min: 0, step: 1, suffix: "hours" },
        { key: "futureSupportHoursPerMonth", label: "Future support hours per month", defaultValue: 72, min: 0, step: 1, suffix: "hours" },
      ],
    },
    {
      key: "transition",
      title: "Transition cost inputs",
      description: "Include one-time costs required to adopt the future peak-capacity strategy.",
      fields: [
        { key: "transitionCost", label: "Migration and cutover cost", defaultValue: 180000, min: 0, step: 5000, prefix: "$" },
      ],
    },
  ],
  calculate: calculatePeakCapacityTco,
});
