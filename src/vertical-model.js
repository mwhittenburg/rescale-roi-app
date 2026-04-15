export const scenarioKeys = ["conservative", "base", "optimistic"];

export const scenarioLabels = {
  conservative: "Conservative",
  base: "Base Case",
  optimistic: "Optimistic",
};

function fields(list) {
  return list.map((item) => ({ group: "inputs", ...item }));
}

export const verticalTemplates = {
  pharma: {
    id: "pharma",
    label: "Pharmaceutical",
    subtitle: "Drug discovery and scientific computing",
    heroTitle: "Accelerate discovery programs with faster scientific simulation.",
    heroBody:
      "Position Rescale as the compute layer behind molecular modeling, candidate prioritization, and faster scientist iteration loops.",
    recommendation:
      "Lead with program acceleration, scientist throughput, and fewer wet-lab reruns.",
    kpiLabels: [
      "Hit-to-lead cycle time",
      "Scientist hours recovered",
      "Wet-lab reruns avoided",
      "Programs accelerated",
    ],
    valueDrivers: [
      "Reduce queue time for molecular and formulation workloads.",
      "Recover scientist capacity otherwise lost to job setup and environment management.",
      "Decrease wet-lab reruns by improving simulation throughput and confidence.",
      "Advance more programs through hit-to-lead and lead optimization phases.",
    ],
    assumptions: fields([
      {
        key: "annualInvestment",
        label: "Annual platform investment",
        unit: "currency",
        conservative: 280000,
        base: 350000,
        optimistic: 420000,
      },
      {
        key: "scientists",
        label: "Scientists in scope",
        unit: "number",
        conservative: 18,
        base: 24,
        optimistic: 30,
      },
      {
        key: "loadedCost",
        label: "Loaded cost per scientist",
        unit: "currency",
        conservative: 190000,
        base: 210000,
        optimistic: 230000,
      },
      {
        key: "productivityGain",
        label: "Scientist productivity gain",
        unit: "percent",
        conservative: 0.1,
        base: 0.15,
        optimistic: 0.22,
      },
      {
        key: "programsAccelerated",
        label: "Programs accelerated per year",
        unit: "number",
        conservative: 1,
        base: 2,
        optimistic: 3,
      },
      {
        key: "valuePerProgram",
        label: "Value per accelerated program",
        unit: "currency",
        conservative: 450000,
        base: 800000,
        optimistic: 1200000,
      },
      {
        key: "rerunsAvoided",
        label: "Wet-lab reruns avoided",
        unit: "number",
        conservative: 8,
        base: 14,
        optimistic: 20,
      },
      {
        key: "costPerRerun",
        label: "Cost per wet-lab rerun",
        unit: "currency",
        conservative: 12000,
        base: 18000,
        optimistic: 24000,
      },
      {
        key: "queueHoursRecovered",
        label: "Queue/setup hours recovered per scientist",
        unit: "number",
        conservative: 55,
        base: 85,
        optimistic: 120,
      },
    ]),
  },
  automotive: {
    id: "automotive",
    label: "Automotive",
    subtitle: "Vehicle engineering and CAE throughput",
    heroTitle: "Ship more design iterations without waiting on simulation queues.",
    heroBody:
      "Focus the story on CAE throughput, prototype avoidance, and launch timing across vehicle programs.",
    recommendation:
      "Lead with engineering productivity, virtual prototype replacement, and launch acceleration.",
    kpiLabels: [
      "Simulation iterations per week",
      "Prototype builds avoided",
      "Engineer hours recovered",
      "Launch milestones pulled in",
    ],
    valueDrivers: [
      "Run more CAE iterations across crash, NVH, thermal, and aerodynamics.",
      "Avoid expensive prototype builds by validating earlier in simulation.",
      "Recover engineering time from queue wait and infrastructure handoffs.",
      "Accelerate launch milestones through faster design loops.",
    ],
    assumptions: fields([
      {
        key: "annualInvestment",
        label: "Annual platform investment",
        unit: "currency",
        conservative: 320000,
        base: 420000,
        optimistic: 540000,
      },
      {
        key: "scientists",
        label: "Engineers in scope",
        unit: "number",
        conservative: 25,
        base: 35,
        optimistic: 50,
      },
      {
        key: "loadedCost",
        label: "Loaded cost per engineer",
        unit: "currency",
        conservative: 150000,
        base: 165000,
        optimistic: 180000,
      },
      {
        key: "productivityGain",
        label: "Engineering productivity gain",
        unit: "percent",
        conservative: 0.12,
        base: 0.18,
        optimistic: 0.24,
      },
      {
        key: "programsAccelerated",
        label: "Vehicle programs accelerated",
        unit: "number",
        conservative: 1,
        base: 2,
        optimistic: 3,
      },
      {
        key: "valuePerProgram",
        label: "Value per accelerated program",
        unit: "currency",
        conservative: 350000,
        base: 650000,
        optimistic: 1000000,
      },
      {
        key: "rerunsAvoided",
        label: "Prototype builds avoided",
        unit: "number",
        conservative: 4,
        base: 7,
        optimistic: 10,
      },
      {
        key: "costPerRerun",
        label: "Cost per prototype build",
        unit: "currency",
        conservative: 35000,
        base: 50000,
        optimistic: 70000,
      },
      {
        key: "queueHoursRecovered",
        label: "Queue/setup hours recovered per engineer",
        unit: "number",
        conservative: 70,
        base: 100,
        optimistic: 140,
      },
    ]),
  },
  aerospace: {
    id: "aerospace",
    label: "Aerospace",
    subtitle: "Certification-heavy engineering programs",
    heroTitle: "Increase simulation certainty before hardware and test windows close.",
    heroBody:
      "Frame value around design confidence, test avoidance, and program schedule protection.",
    recommendation:
      "Lead with reduced test rework, higher throughput, and schedule assurance on critical programs.",
    kpiLabels: [
      "Certification cycle support",
      "Test events avoided",
      "Engineering hours recovered",
      "Program schedule protection",
    ],
    valueDrivers: [
      "Increase throughput on CFD, structures, thermal, and multiphysics studies.",
      "Reduce physical test rework by validating more digitally before gated reviews.",
      "Protect high-value schedules where delays are disproportionately expensive.",
      "Recover specialist engineering time from infrastructure overhead.",
    ],
    assumptions: fields([
      {
        key: "annualInvestment",
        label: "Annual platform investment",
        unit: "currency",
        conservative: 400000,
        base: 520000,
        optimistic: 680000,
      },
      {
        key: "scientists",
        label: "Engineers in scope",
        unit: "number",
        conservative: 20,
        base: 28,
        optimistic: 36,
      },
      {
        key: "loadedCost",
        label: "Loaded cost per engineer",
        unit: "currency",
        conservative: 185000,
        base: 210000,
        optimistic: 235000,
      },
      {
        key: "productivityGain",
        label: "Engineering productivity gain",
        unit: "percent",
        conservative: 0.1,
        base: 0.16,
        optimistic: 0.21,
      },
      {
        key: "programsAccelerated",
        label: "Programs protected or accelerated",
        unit: "number",
        conservative: 1,
        base: 1.5,
        optimistic: 2,
      },
      {
        key: "valuePerProgram",
        label: "Value per protected program",
        unit: "currency",
        conservative: 600000,
        base: 950000,
        optimistic: 1500000,
      },
      {
        key: "rerunsAvoided",
        label: "Physical test reruns avoided",
        unit: "number",
        conservative: 3,
        base: 5,
        optimistic: 7,
      },
      {
        key: "costPerRerun",
        label: "Cost per test rerun",
        unit: "currency",
        conservative: 85000,
        base: 120000,
        optimistic: 180000,
      },
      {
        key: "queueHoursRecovered",
        label: "Queue/setup hours recovered per engineer",
        unit: "number",
        conservative: 60,
        base: 90,
        optimistic: 120,
      },
    ]),
  },
  oilgas: {
    id: "oilgas",
    label: "Oil & Gas",
    subtitle: "Reservoir, subsurface, and asset optimization",
    heroTitle: "Shorten compute cycles behind exploration, production, and asset decisions.",
    heroBody:
      "Tell the value story through faster modeling, reduced decision latency, and fewer costly field missteps.",
    recommendation:
      "Lead with faster scenario analysis, asset optimization, and avoided operational delays.",
    kpiLabels: [
      "Scenario analysis throughput",
      "Decision latency reduced",
      "Specialist hours recovered",
      "Field interventions avoided",
    ],
    valueDrivers: [
      "Run more subsurface and production scenarios inside decision windows.",
      "Reduce specialist wait time on constrained HPC resources.",
      "Avoid delayed field decisions and downstream operational inefficiencies.",
      "Improve asset optimization and risk management with higher model throughput.",
    ],
    assumptions: fields([
      {
        key: "annualInvestment",
        label: "Annual platform investment",
        unit: "currency",
        conservative: 360000,
        base: 470000,
        optimistic: 610000,
      },
      {
        key: "scientists",
        label: "Specialists in scope",
        unit: "number",
        conservative: 16,
        base: 24,
        optimistic: 32,
      },
      {
        key: "loadedCost",
        label: "Loaded cost per specialist",
        unit: "currency",
        conservative: 210000,
        base: 230000,
        optimistic: 255000,
      },
      {
        key: "productivityGain",
        label: "Specialist productivity gain",
        unit: "percent",
        conservative: 0.09,
        base: 0.14,
        optimistic: 0.2,
      },
      {
        key: "programsAccelerated",
        label: "Asset decisions accelerated",
        unit: "number",
        conservative: 2,
        base: 3,
        optimistic: 4,
      },
      {
        key: "valuePerProgram",
        label: "Value per accelerated decision",
        unit: "currency",
        conservative: 280000,
        base: 500000,
        optimistic: 850000,
      },
      {
        key: "rerunsAvoided",
        label: "Field interventions avoided",
        unit: "number",
        conservative: 2,
        base: 4,
        optimistic: 6,
      },
      {
        key: "costPerRerun",
        label: "Cost per avoided intervention",
        unit: "currency",
        conservative: 60000,
        base: 95000,
        optimistic: 150000,
      },
      {
        key: "queueHoursRecovered",
        label: "Queue/setup hours recovered per specialist",
        unit: "number",
        conservative: 50,
        base: 75,
        optimistic: 110,
      },
    ]),
  },
  manufacturing: {
    id: "manufacturing",
    label: "Manufacturing",
    subtitle: "Industrial equipment and factory throughput",
    heroTitle: "Scale simulation-led product and process decisions across manufacturing teams.",
    heroBody:
      "Position Rescale around faster engineering cycles, reduced physical testing, and better process confidence.",
    recommendation:
      "Lead with design iteration speed, prototype avoidance, and improved factory or process readiness.",
    kpiLabels: [
      "Engineering cycle time",
      "Prototype/test spend avoided",
      "Engineer hours recovered",
      "Programs accelerated",
    ],
    valueDrivers: [
      "Increase simulation throughput for product and process design loops.",
      "Reduce physical prototyping and test spend.",
      "Recover engineer time otherwise lost to infrastructure and queueing.",
      "Accelerate product introductions and process improvements.",
    ],
    assumptions: fields([
      {
        key: "annualInvestment",
        label: "Annual platform investment",
        unit: "currency",
        conservative: 250000,
        base: 330000,
        optimistic: 430000,
      },
      {
        key: "scientists",
        label: "Engineers in scope",
        unit: "number",
        conservative: 18,
        base: 26,
        optimistic: 34,
      },
      {
        key: "loadedCost",
        label: "Loaded cost per engineer",
        unit: "currency",
        conservative: 135000,
        base: 150000,
        optimistic: 170000,
      },
      {
        key: "productivityGain",
        label: "Engineering productivity gain",
        unit: "percent",
        conservative: 0.11,
        base: 0.17,
        optimistic: 0.23,
      },
      {
        key: "programsAccelerated",
        label: "Products or process initiatives accelerated",
        unit: "number",
        conservative: 2,
        base: 3,
        optimistic: 4,
      },
      {
        key: "valuePerProgram",
        label: "Value per accelerated initiative",
        unit: "currency",
        conservative: 180000,
        base: 320000,
        optimistic: 520000,
      },
      {
        key: "rerunsAvoided",
        label: "Prototype/test cycles avoided",
        unit: "number",
        conservative: 4,
        base: 6,
        optimistic: 9,
      },
      {
        key: "costPerRerun",
        label: "Cost per avoided cycle",
        unit: "currency",
        conservative: 18000,
        base: 30000,
        optimistic: 45000,
      },
      {
        key: "queueHoursRecovered",
        label: "Queue/setup hours recovered per engineer",
        unit: "number",
        conservative: 45,
        base: 70,
        optimistic: 95,
      },
    ]),
  },
};

export function cloneTemplate(id) {
  return structuredClone(verticalTemplates[id]);
}

export function formatValue(unit, value) {
  if (unit === "currency") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  }

  if (unit === "percent") {
    return `${(value * 100).toFixed(0)}%`;
  }

  return `${Number(value).toLocaleString()}`;
}

export function calculateVertical(template, scenario) {
  const values = Object.fromEntries(
    template.assumptions.map((field) => [field.key, Number(field[scenario]) || 0]),
  );

  const productivityValue =
    values.scientists * values.loadedCost * values.productivityGain;
  const accelerationValue = values.programsAccelerated * values.valuePerProgram;
  const avoidedCostValue = values.rerunsAvoided * values.costPerRerun;
  const recoveredHours = values.scientists * values.queueHoursRecovered;
  const recoveredHoursValue =
    (values.loadedCost / 1800) * recoveredHours * 0.35;
  const totalBenefits =
    productivityValue + accelerationValue + avoidedCostValue + recoveredHoursValue;
  const netBenefit = totalBenefits - values.annualInvestment;
  const roi = values.annualInvestment > 0 ? netBenefit / values.annualInvestment : 0;
  const paybackMonths =
    totalBenefits > 0 ? values.annualInvestment / (totalBenefits / 12) : 0;

  return {
    values,
    productivityValue,
    accelerationValue,
    avoidedCostValue,
    recoveredHours,
    recoveredHoursValue,
    totalBenefits,
    netBenefit,
    roi,
    paybackMonths,
    npv:
      netBenefit / 1.1 +
      netBenefit / 1.1 ** 2 +
      netBenefit / 1.1 ** 3,
  };
}
