const percent = (value) => Number(value || 0) / 100;
const money = (value) => Number(value || 0);
const number = (value) => Number(value || 0);

function confidenceMultiplier(confidence) {
  if (confidence === "High") return { low: 0.9, high: 1.1, score: 0.9 };
  if (confidence === "Low") return { low: 0.55, high: 0.85, score: 0.55 };
  return { low: 0.75, high: 1, score: 0.75 };
}

function scenarioFitMultiplier(scenarioId) {
  if (scenarioId === "benchmark-first") return 0.55;
  if (scenarioId === "hybrid-execution") return 0.8;
  if (scenarioId === "cloud-burst") return 0.9;
  return 1;
}

function round(value) {
  return Math.round(Number(value || 0));
}

function formatRange(low, high) {
  if (low <= 0 && high <= 0) return "Not quantified yet";
  return `$${round(low).toLocaleString()} - $${round(high).toLocaleString()}`;
}

function addRange(items) {
  return items.reduce(
    (acc, item) => ({
      low: acc.low + number(item.low),
      high: acc.high + number(item.high),
    }),
    { low: 0, high: 0 },
  );
}

export function calculatePlanner(form) {
  const { workload, currentState, estimates, scenario, assumptions } = form;
  const annualJobs = number(currentState.jobsPerMonth) * 12;
  const delayedJobsShare = percent(currentState.percentJobsAffected);
  const queueReductionShare = percent(scenario.queueReductionPercent);
  const rerunReductionShare = percent(scenario.rerunReductionPercent);
  const runtimeImprovementShare = percent(scenario.runtimeImprovementPercent);
  const utilizationImprovementShare = percent(scenario.utilizationImprovementPercent);
  const governanceImprovementShare = percent(scenario.governanceImprovementPercent);
  const moveShare = Math.min(
    percent(estimates.workloadMovablePercent || 0),
    percent(scenario.workloadMovePercent || 0) || 1,
  );
  const rerunShare = percent(estimates.rerunRatePercent);
  const successfulCompletionShare = Math.max(0.01, 1 - rerunShare);
  const confidence = confidenceMultiplier(scenario.confidence);
  const fitMultiplier = scenarioFitMultiplier(scenario.id);

  const annualRuntimeHours = annualJobs * number(currentState.averageRuntimeHours);
  const delayedJobHoursReduced =
    number(currentState.jobsPerMonth) *
    delayedJobsShare *
    number(currentState.averageQueueDelayHours) *
    queueReductionShare;
  const annualDecisionLatencyHoursReduced = delayedJobHoursReduced * 12 * moveShare;

  const estimatedExecutionCost =
    annualRuntimeHours * money(estimates.costPerComputeHour) * moveShare;
  const totalAnnualCost =
    Math.max(
      money(currentState.annualInfrastructureSpend) +
        money(currentState.annualSoftwareSpend) +
        money(estimates.annualSupportOverhead) +
        money(estimates.facilitiesCost),
      estimatedExecutionCost +
        money(currentState.annualSoftwareSpend) +
        money(estimates.annualSupportOverhead),
    ) || 0;

  const successfulJobs = Math.max(1, annualJobs * successfulCompletionShare);
  const currentCostPerResult = totalAnnualCost / successfulJobs;

  const efficiencyGain = Math.min(
    0.75,
    runtimeImprovementShare * 0.45 +
      rerunReductionShare * 0.25 +
      utilizationImprovementShare * 0.2 +
      governanceImprovementShare * 0.1,
  );

  const gcpCostPerResult =
    currentCostPerResult * Math.max(0.35, 1 - efficiencyGain * fitMultiplier);
  const costPerResultSavingsPerJob = Math.max(0, currentCostPerResult - gcpCostPerResult);
  const costPerResultRange = {
    low: costPerResultSavingsPerJob * successfulJobs * moveShare * confidence.low,
    high: costPerResultSavingsPerJob * successfulJobs * moveShare * confidence.high,
  };

  const avoidedRefreshBase =
    money(currentState.refreshAmount) *
    percent(assumptions.refreshDeferredPercent) *
    moveShare *
    fitMultiplier;
  const overprovisioningProxy =
    currentState.utilizationPercent > 0
      ? money(currentState.annualInfrastructureSpend) *
        Math.max(0, (70 - number(currentState.utilizationPercent)) / 100) *
        moveShare
      : 0;
  const burstCapacityBase =
    money(assumptions.incrementalCapacityUnits) * money(assumptions.capacityUnitCost);
  const capacityRange = {
    low: (avoidedRefreshBase + overprovisioningProxy + burstCapacityBase) * confidence.low,
    high: (avoidedRefreshBase + overprovisioningProxy + burstCapacityBase) * confidence.high,
  };

  const rerunImpactBase =
    annualJobs * rerunShare * currentCostPerResult * rerunReductionShare * moveShare;
  const rerunRange = {
    low: rerunImpactBase * confidence.low,
    high: rerunImpactBase * confidence.high,
  };

  const decisionLatencyBase =
    money(estimates.delayedProjectDecisionCost) *
    number(currentState.campaignsPerYear) *
    delayedJobsShare *
    queueReductionShare *
    moveShare *
    fitMultiplier;
  const decisionLatencyRange = {
    low: decisionLatencyBase * confidence.low,
    high: decisionLatencyBase * confidence.high,
  };

  const governanceBase =
    money(estimates.annualSupportOverhead) *
    governanceImprovementShare *
    percent(assumptions.visibilityValuePercent || 0) *
    fitMultiplier;
  const governanceRange = {
    low: governanceBase * 0.8,
    high: governanceBase * 1.15,
  };

  const totalRange = addRange([
    capacityRange,
    decisionLatencyRange,
    rerunRange,
    costPerResultRange,
    governanceRange,
  ]);

  const constraints = [];
  if (
    number(currentState.utilizationPercent) >= 70 ||
    number(currentState.averageQueueDelayHours) >= 8 ||
    number(currentState.refreshAmount) > 0 ||
    workload.primaryBottleneck === "capacity"
  ) {
    constraints.push("Capacity-constrained");
  }
  if (
    ["GPU access", "runtime"].includes(workload.primaryBottleneck) ||
    ["GPU-intensive", "memory-intensive", "network-intensive"].includes(workload.computeProfile) ||
    scenario.id === "gpu-acceleration"
  ) {
    constraints.push("Architecture-constrained");
  }
  if (
    ["cost visibility", "governance"].includes(workload.primaryBottleneck) ||
    governanceImprovementShare >= 0.1
  ) {
    constraints.push("Governance-constrained");
  }
  if (
    workload.category.includes("AI") ||
    workload.primaryBottleneck === "data movement" ||
    workload.computeProfile === "GPU-intensive"
  ) {
    constraints.push("Data/AI-constrained");
  }
  if (
    constraints.length === 0 ||
    money(currentState.annualInfrastructureSpend) === 0 ||
    scenario.confidence === "Low"
  ) {
    constraints.push("Economics unclear");
  }

  const quantifiedDrivers = [
    { label: "Capacity economics", range: capacityRange },
    { label: "Decision latency reduction", range: decisionLatencyRange },
    { label: "Cost per completed result", range: costPerResultRange },
    { label: "Governance and AI/data readiness", range: governanceRange },
    { label: "Rerun reduction", range: rerunRange },
  ].sort((a, b) => b.range.high - a.range.high);

  const primaryValueDriver = quantifiedDrivers[0]?.label || "Not quantified yet";

  const recommendation = deriveRecommendation({
    totalRange,
    constraints,
    scenario,
    workload,
    moveShare,
    decisionLatencyBase,
    gcpCostPerResult,
    currentCostPerResult,
  });

  const formulas = [
    {
      label: "Decision latency hours reduced",
      formula:
        "jobs_per_month x percent_jobs_delayed x queue_delay_hours x expected_queue_reduction_percent",
      value: `${round(delayedJobHoursReduced).toLocaleString()} hours per month`,
    },
    {
      label: "Annual decision latency hours reduced",
      formula: "monthly_decision_latency_hours_reduced x 12",
      value: `${round(annualDecisionLatencyHoursReduced).toLocaleString()} hours per year`,
    },
    {
      label: "Cost per completed result",
      formula: "total_workload_cost / successful_completed_jobs",
      value: `$${round(currentCostPerResult).toLocaleString()} current vs $${round(gcpCostPerResult).toLocaleString()} directional GCP`,
    },
    {
      label: "Rerun impact",
      formula: "annual_jobs x rerun_rate x average_cost_per_job",
      value: formatRange(rerunRange.low, rerunRange.high),
    },
    {
      label: "Avoided refresh value",
      formula: "planned_refresh_amount x percent_refresh_deferred_or_avoided",
      value: formatRange(capacityRange.low, capacityRange.high),
    },
    {
      label: "Annual value range",
      formula:
        "capacity_value + decision_latency_value + rerun_reduction_value + cost_per_result_improvement + governance_value",
      value: formatRange(totalRange.low, totalRange.high),
    },
  ];

  const assumptionList = [
    `Workload move share modeled at ${round(moveShare * 100)}%.`,
    `Scenario confidence is ${scenario.confidence.toLowerCase()}, so outputs are shown as ranges rather than point estimates.`,
    `Decision latency value is modeled as business cycle acceleration, not recovered idle labor time.`,
  ];

  const risks = [];
  if (scenario.confidence === "Low") risks.push("Runtime and cost assumptions are still low confidence.");
  if (workload.primaryBottleneck === "software licensing") risks.push("Licensing portability or concurrency terms may limit the move scope.");
  if (workload.primaryBottleneck === "data movement") risks.push("Data transfer, locality, or pipeline changes may reduce near-term value.");
  if (workload.currentEnvironment === "hybrid") risks.push("Hybrid operating complexity may slow initial execution changes.");
  if (!risks.length) {
    risks.push("Benchmark outcomes may differ from directional assumptions.");
    risks.push("Business sponsorship and validation scope may need to be clarified.");
    risks.push("Workload portability and governance requirements should be validated early.");
  }

  const proofRequired = [];
  if (recommendation.action === "Move") {
    proofRequired.push("Validate a representative benchmark and target architecture choice.");
    proofRequired.push("Confirm governance, security, and operating model readiness.");
    proofRequired.push("Align commercial assumptions with official pricing and account terms.");
  }
  if (recommendation.action === "Benchmark") {
    proofRequired.push("Benchmark runtime, queue relief, and cost per completed result on representative workloads.");
    proofRequired.push("Validate licensing, data movement, and orchestration requirements.");
    proofRequired.push("Confirm which workload share can realistically move in phase one.");
  }
  if (recommendation.action === "Hold") {
    proofRequired.push("Clarify the actual business constraint and sponsorship.");
    proofRequired.push("Establish a cleaner baseline for cost, utilization, and workload demand.");
    proofRequired.push("Revisit after a refresh event, project deadline, or architecture change.");
  }

  return {
    annualJobs,
    annualRuntimeHours,
    annualDecisionLatencyHoursReduced,
    currentCostPerResult,
    gcpCostPerResult,
    constraints,
    ranges: {
      capacity: capacityRange,
      decisionLatency: decisionLatencyRange,
      costPerResult: costPerResultRange,
      governance: governanceRange,
      rerun: rerunRange,
      total: totalRange,
    },
    formulas,
    primaryValueDriver,
    quantifiedDrivers,
    recommendation,
    assumptions: assumptionList,
    risks: risks.slice(0, 3),
    proofRequired: proofRequired.slice(0, 3),
  };
}

function deriveRecommendation({
  totalRange,
  constraints,
  scenario,
  workload,
  moveShare,
}) {
  const material = totalRange.high >= 250000;
  const constraintClear = !constraints.includes("Economics unclear");
  const confident = scenario.confidence === "High" || scenario.confidence === "Medium";
  const lowPain = workload.urgency === "exploratory" && workload.primaryBottleneck === "unclear";
  const risky =
    workload.primaryBottleneck === "software licensing" ||
    workload.primaryBottleneck === "data movement";

  let action = "Benchmark";
  if (material && constraintClear && confident && !risky && moveShare >= 0.4) {
    action = "Move";
  } else if (lowPain || (!material && scenario.confidence === "Low") || moveShare < 0.2) {
    action = "Hold";
  }

  const confidenceLabel = scenario.confidence;
  const why =
    action === "Move"
      ? "The current constraint is clear, the directional value appears material, and the scenario assumptions are strong enough to support a move-oriented plan."
      : action === "Benchmark"
        ? "The opportunity appears promising, but the runtime, architecture fit, or operating assumptions still need proof before a broader commitment."
        : "The current pain or quantified value case is not yet strong enough to justify a move motion ahead of clearer baseline data and sponsorship.";

  const nextStep =
    action === "Move"
      ? "Build a workload-specific migration and benchmark plan, then validate with the official Google Cloud Pricing Calculator and target architecture review."
      : action === "Benchmark"
        ? "Run a benchmark-first motion on representative jobs and compare runtime, queue relief, and cost per completed result."
        : "Hold the motion, tighten the baseline assumptions, and revisit once a clearer event or constraint emerges.";

  return {
    action,
    confidence: confidenceLabel,
    why,
    nextStep,
    annualValueRangeLabel: formatRange(totalRange.low, totalRange.high),
  };
}

export function summaryText(form, results) {
  return `Workload Business Case Summary

1. Workload evaluated
${form.workload.name || "Unnamed workload"} (${form.workload.category})

2. Current constraint
${results.constraints.join(", ")}

3. Business impact hypothesis
The value case centers on ${results.primaryValueDriver.toLowerCase()} with directional annual value of ${results.recommendation.annualValueRangeLabel}.

4. GCP scenario considered
${form.scenario.id.replace(/-/g, " ")} with ${form.scenario.workloadMovePercent}% of workload modeled for GCP.

5. Estimated annual value range
${results.recommendation.annualValueRangeLabel}

6. Recommendation
${results.recommendation.action}

7. Proof required
${results.proofRequired.map((item, index) => `${index + 1}. ${item}`).join("\n")}

8. Suggested next step
${results.recommendation.nextStep}

Disclaimer
This tool provides directional workload business-case estimates. It is not an official Google Cloud pricing calculator. Final infrastructure costs should be validated using the official Google Cloud Pricing Calculator, current customer pricing, benchmark results, workload-specific architecture review, and account-specific commercial terms.`;
}
