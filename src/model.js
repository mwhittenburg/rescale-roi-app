export const scenarioKeys = ["conservative", "base", "optimistic"];

export const scenarioLabels = {
  conservative: "Conservative",
  base: "Base Case",
  optimistic: "Optimistic",
};

export const supportingContent = {
  valueDrivers: [
    "Engineer productivity from reduced setup, admin work, and environment friction.",
    "Time-to-market pull-in from faster iteration and better queue performance.",
    "Prototype reduction by moving more validation into simulation.",
    "Global collaboration through a shared platform instead of siloed regional workflows.",
  ],
  successMetrics: [
    "Simulation runs or iterations completed per team each week.",
    "Queue time and total turnaround time versus baseline.",
    "Engineer hours spent on setup and administration.",
    "Prototype count and associated test spend.",
    "Reruns caused by environment or configuration issues.",
  ],
  sourceNotes: [
    "Pricing and package components were inferred from the workbook proposal and source notes.",
    "Engineer compensation assumptions follow the workbook's BLS-based loaded-cost framing.",
    "Time-to-market is the most sensitive assumption, so the app keeps a visible on/off toggle.",
    "Adoption ramp is not modeled yet, which means year-one value may be slightly overstated.",
  ],
  timeline: [
    { title: "POC Complete", date: "Mid-February 2026", owner: "Rescale / Alex" },
    { title: "ROI Review", date: "Week of April 27, 2026", owner: "Amol / Alex / Rescale" },
    { title: "Executive Readout", date: "First half of May 2026", owner: "Rescale + Stakeholders" },
    { title: "Budget Discussion", date: "Mid-May 2026", owner: "Rescale + Stakeholders" },
  ],
};

export const defaultBranding = {
  companyName: "Owens Corning",
  preparedDate: "March 2026",
  preparedBy: "Mark Whittenburg",
  accentColor: "#a64b2a",
  logoText: "Rescale ROI",
};

export const defaultFields = [
  {
    key: "platform",
    label: "Platform",
    unit: "currency",
    note: "Enterprise platform subscription.",
    group: "Investment",
    conservative: 45000,
    base: 45000,
    optimistic: 45000,
  },
  {
    key: "infrastructure",
    label: "Infrastructure (Compute)",
    unit: "currency",
    note: "Annual cloud HPC usage pool.",
    group: "Investment",
    conservative: 114700,
    base: 114700,
    optimistic: 114700,
  },
  {
    key: "advancedModeling",
    label: "Advanced Modeling & Simulation",
    unit: "currency",
    note: "Advanced simulation tooling and licenses.",
    group: "Investment",
    conservative: 25000,
    base: 25000,
    optimistic: 25000,
  },
  {
    key: "addons",
    label: "Add-ons",
    unit: "currency",
    note: "Storage, transfer, workstations, and license proxy.",
    group: "Investment",
    conservative: 15200,
    base: 15200,
    optimistic: 15200,
  },
  {
    key: "services",
    label: "Services & Training",
    unit: "currency",
    note: "Enablement, onboarding, and training.",
    group: "Investment",
    conservative: 25000,
    base: 25000,
    optimistic: 25000,
  },
  {
    key: "support",
    label: "Support",
    unit: "currency",
    note: "Dedicated support coverage.",
    group: "Investment",
    conservative: 25100,
    base: 25100,
    optimistic: 25100,
  },
  {
    key: "engineers",
    label: "Number of simulation engineers",
    unit: "count",
    note: "Active simulation engineers using the platform.",
    group: "Assumptions",
    conservative: 20,
    base: 20,
    optimistic: 25,
  },
  {
    key: "loadedCost",
    label: "Fully loaded cost per engineer",
    unit: "currency",
    note: "Salary, benefits, and overhead.",
    group: "Assumptions",
    conservative: 140000,
    base: 140000,
    optimistic: 150000,
  },
  {
    key: "adminHoursToday",
    label: "Data/admin hours per week per engineer - today",
    unit: "number",
    note: "Time lost to data search, setup, and admin tasks today.",
    group: "Assumptions",
    conservative: 1.5,
    base: 1.5,
    optimistic: 2,
  },
  {
    key: "adminHoursRescale",
    label: "Data/admin hours per week per engineer w/ Rescale",
    unit: "number",
    note: "Expected weekly admin overhead with Rescale.",
    group: "Assumptions",
    conservative: 0.08,
    base: 0.08,
    optimistic: 0.08,
  },
  {
    key: "queueTimeToday",
    label: "Avg queue time per job - today",
    unit: "number",
    note: "Current average queue delay in hours per job.",
    group: "Assumptions",
    conservative: 8,
    base: 6,
    optimistic: 4,
  },
  {
    key: "queueTimeRescale",
    label: "Avg queue time per job w/ Rescale",
    unit: "number",
    note: "Expected average queue delay with elastic compute.",
    group: "Assumptions",
    conservative: 2,
    base: 1,
    optimistic: 0.5,
  },
  {
    key: "runtimeIncrease",
    label: "Avg sim run time increase per job w/ Rescale",
    unit: "number",
    note: "Placeholder from the workbook for future benchmarking.",
    group: "Assumptions",
    conservative: 2,
    base: 3,
    optimistic: 5,
  },
  {
    key: "jobsPerWeek",
    label: "Jobs per week per engineer",
    unit: "count",
    note: "Average jobs per engineer per week.",
    group: "Assumptions",
    conservative: 3,
    base: 4,
    optimistic: 5,
  },
  {
    key: "productivityImprovement",
    label: "Productivity improvement",
    unit: "percent",
    note: "Share of engineer capacity recovered.",
    group: "Assumptions",
    conservative: 0.15,
    base: 0.2,
    optimistic: 0.25,
  },
  {
    key: "productsAccelerated",
    label: "Products accelerated per year",
    unit: "count",
    note: "Products reaching market earlier.",
    group: "Assumptions",
    conservative: 2,
    base: 2,
    optimistic: 3,
  },
  {
    key: "revenuePerProduct",
    label: "Revenue per product per year",
    unit: "currency",
    note: "Average annual revenue per product.",
    group: "Assumptions",
    conservative: 5000000,
    base: 6000000,
    optimistic: 7000000,
  },
  {
    key: "monthsAcceleration",
    label: "Months of acceleration",
    unit: "number",
    note: "How many months faster launches happen.",
    group: "Assumptions",
    conservative: 1,
    base: 1,
    optimistic: 2,
  },
  {
    key: "ttmAttribution",
    label: "TTM attribution to simulation",
    unit: "percent",
    note: "Share of acceleration credited to simulation and HPC.",
    group: "Assumptions",
    conservative: 0.25,
    base: 0.35,
    optimistic: 0.5,
  },
  {
    key: "includeTtm",
    label: "Include time-to-market? (1=yes, 0=no)",
    unit: "toggle",
    note: "Use 0 to remove time-to-market value from the model.",
    group: "Assumptions",
    conservative: 1,
    base: 1,
    optimistic: 1,
  },
  {
    key: "prototypesEliminated",
    label: "Prototypes eliminated per year",
    unit: "count",
    note: "Hardware prototypes avoided.",
    group: "Assumptions",
    conservative: 4,
    base: 6,
    optimistic: 8,
  },
  {
    key: "costPerPrototype",
    label: "Cost per prototype",
    unit: "currency",
    note: "Average prototype and test spend.",
    group: "Assumptions",
    conservative: 20000,
    base: 20000,
    optimistic: 25000,
  },
  {
    key: "qualityRework",
    label: "Quality / rework avoidance",
    unit: "currency",
    note: "Estimated avoided late-stage rework.",
    group: "Assumptions",
    conservative: 50000,
    base: 100000,
    optimistic: 150000,
  },
];

export function getScenarioValues(fields, scenario) {
  return Object.fromEntries(
    fields.map((field) => [field.key, Number(field[scenario]) || 0]),
  );
}

export function calculateScenario(fields, scenario) {
  const values = getScenarioValues(fields, scenario);
  const annualInvestment =
    values.platform +
    values.infrastructure +
    values.advancedModeling +
    values.addons +
    values.services +
    values.support;

  const engineerProductivity =
    values.engineers * values.loadedCost * values.productivityImprovement;
  const timeToMarket =
    values.includeTtm *
    values.productsAccelerated *
    (values.revenuePerProduct / 12) *
    values.monthsAcceleration *
    values.ttmAttribution;
  const prototypeReduction =
    values.prototypesEliminated * values.costPerPrototype;
  const qualityReworkAvoidance = values.qualityRework;

  const totalBenefits =
    engineerProductivity +
    timeToMarket +
    prototypeReduction +
    qualityReworkAvoidance;
  const netAnnualBenefit = totalBenefits - annualInvestment;
  const yearOneRoi =
    annualInvestment > 0 ? netAnnualBenefit / annualInvestment : 0;
  const paybackPeriod =
    totalBenefits > 0 ? annualInvestment / (totalBenefits / 12) : 0;
  const threeYearNpv =
    netAnnualBenefit / 1.1 +
    netAnnualBenefit / 1.1 ** 2 +
    netAnnualBenefit / 1.1 ** 3;
  const adminHoursRecovered =
    (values.adminHoursToday - values.adminHoursRescale) *
    values.engineers *
    52;
  const queueHoursRecovered =
    (values.queueTimeToday - values.queueTimeRescale) *
    values.jobsPerWeek *
    values.engineers *
    52;

  return {
    values,
    annualInvestment,
    engineerProductivity,
    timeToMarket,
    prototypeReduction,
    qualityReworkAvoidance,
    totalBenefits,
    netAnnualBenefit,
    yearOneRoi,
    paybackPeriod,
    threeYearNpv,
    adminHoursRecovered,
    queueHoursRecovered,
  };
}

export function buildExportPayload({ branding, fields }) {
  return {
    branding,
    fields,
    metrics: Object.fromEntries(
      scenarioKeys.map((scenario) => [scenario, calculateScenario(fields, scenario)]),
    ),
    exportedAt: new Date().toISOString(),
  };
}
