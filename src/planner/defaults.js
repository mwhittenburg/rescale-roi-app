export const WORKLOAD_CATEGORIES = [
  "Computational chemistry",
  "Molecular dynamics",
  "Genomics / bioinformatics",
  "CFD",
  "FEA",
  "EDA / semiconductor",
  "AI training",
  "AI inference",
  "Batch processing",
  "Rendering",
  "Custom workload",
];

export const BUSINESS_FUNCTIONS = [
  "R&D",
  "Product engineering",
  "Manufacturing",
  "Clinical / life sciences",
  "Platform operations",
  "Data / AI",
  "Design verification",
  "Content production",
  "Back-office operations",
  "Other",
];

export const ENVIRONMENTS = [
  "on-prem",
  "cloud",
  "hybrid",
  "outsourced",
  "unknown",
];

export const BOTTLENECKS = [
  "capacity",
  "queue time",
  "runtime",
  "GPU access",
  "cost visibility",
  "governance",
  "data movement",
  "software licensing",
  "unclear",
];

export const COMPUTE_PROFILES = [
  "CPU-intensive",
  "GPU-intensive",
  "memory-intensive",
  "storage-intensive",
  "network-intensive",
  "mixed",
  "unknown",
];

export const URGENCY_LEVELS = [
  "exploratory",
  "active pain",
  "executive priority",
  "renewal/refresh event",
  "budget event",
  "project deadline",
];

export const SCENARIO_TYPES = [
  {
    id: "cloud-burst",
    name: "Cloud burst",
    fit: "Best for teams with constrained on-prem capacity and periodic demand spikes.",
  },
  {
    id: "full-migration",
    name: "Full workload migration",
    fit: "Best for repeatable workloads where the customer wants to reduce dependency on fixed infrastructure.",
  },
  {
    id: "gpu-acceleration",
    name: "GPU acceleration",
    fit: "Best for AI, molecular dynamics, accelerated solvers, surrogate modeling, or workloads that benefit from GPU architectures.",
  },
  {
    id: "batch-modernization",
    name: "Batch modernization",
    fit: "Best for high-volume job execution where customers need scalable batch infrastructure and better operational control.",
  },
  {
    id: "hybrid-execution",
    name: "Hybrid execution",
    fit: "Best when some workloads stay on-prem due to data, licensing, security, or operational constraints, while others move to GCP.",
  },
  {
    id: "benchmark-first",
    name: "Benchmark first",
    fit: "Best when the workload economics are promising but not yet proven.",
  },
];

export const CONFIDENCE_LEVELS = ["High", "Medium", "Low"];

export const INITIAL_SCENARIO = {
  id: "cloud-burst",
  workloadMovePercent: 40,
  runtimeImprovementPercent: 20,
  queueReductionPercent: 40,
  rerunReductionPercent: 15,
  utilizationImprovementPercent: 10,
  governanceImprovementPercent: 10,
  confidence: "Medium",
  notes: "",
};

export const INITIAL_FORM = {
  workload: {
    category: "CFD",
    name: "Aerodynamics design study",
    businessFunction: "Product engineering",
    currentEnvironment: "on-prem",
    primaryBottleneck: "capacity",
    computeProfile: "CPU-intensive",
    urgency: "active pain",
  },
  currentState: {
    usersAffected: 25,
    jobsPerMonth: 320,
    campaignsPerYear: 10,
    averageRuntimeHours: 6,
    averageQueueDelayHours: 18,
    percentJobsAffected: 55,
    annualInfrastructureSpend: 850000,
    annualSoftwareSpend: 220000,
    utilizationPercent: 78,
    refreshAmount: 1200000,
    refreshTimingMonths: 9,
  },
  estimates: {
    costPerComputeHour: 2.75,
    annualSupportOverhead: 180000,
    facilitiesCost: 95000,
    delayedProjectDecisionCost: 150000,
    rerunRatePercent: 12,
    workloadMovablePercent: 50,
    laborBackedDecisionValue: 0,
  },
  assumptions: {
    refreshDeferredPercent: 50,
    incrementalCapacityUnits: 0,
    capacityUnitCost: 0,
    visibilityValuePercent: 12,
  },
  scenario: { ...INITIAL_SCENARIO },
  validationItems: [
    "Benchmark runtime on representative GCP machine families",
    "Validate data movement and licensing constraints",
    "Confirm workload percentage that can realistically move",
  ],
};

export const STEPS = [
  { id: "landing", label: "Start Here", title: "Which workloads are worth moving, benchmarking, or holding?" },
  { id: "workload", label: "1", title: "Start with the workload" },
  { id: "current", label: "2", title: "Define the current state" },
  { id: "constraints", label: "3", title: "Identify the business constraint" },
  { id: "scenario", label: "4", title: "Model the GCP opportunity" },
  { id: "value", label: "5", title: "Estimate directional value" },
  { id: "recommendation", label: "6", title: "Produce a recommendation" },
  { id: "summary", label: "7", title: "Executive summary output" },
  { id: "assumptions", label: "8", title: "Assumptions & disclaimer" },
];
