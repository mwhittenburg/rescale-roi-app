export const calculatorSections = [
  { key: "workflowDescription", title: "1. Workflow Description" },
  { key: "inputs", title: "2. Inputs" },
  { key: "assumptions", title: "3. Assumptions" },
  { key: "outcomes", title: "4. Outcomes" },
];

export const industries = [
  {
    id: "pharma",
    name: "Pharma",
    label: "Live Path",
    description:
      "ROI models for computational drug discovery, simulation workflows, and R&D acceleration.",
    summary:
      "Start with Pharma to equip reps with workflow-specific business cases for computational science buyers.",
    useCases: [
      {
        id: "virtual-screening",
        name: "Virtual Screening / Docking",
        shortDescription:
          "Estimate value from faster compound triage and docking throughput.",
        workflowDescription:
          "Placeholder content for the virtual screening and docking workflow description.",
        inputs:
          "Placeholder content for screening volume, compute usage, scientist effort, and software inputs.",
        assumptions:
          "Placeholder content for baseline timelines, queue delays, and cost assumptions.",
        outcomes:
          "Placeholder content for throughput improvement, cycle-time compression, and ROI outcomes.",
      },
      {
        id: "molecular-dynamics",
        name: "Molecular Dynamics",
        shortDescription:
          "Estimate value from higher simulation capacity and shorter time to insight.",
        workflowDescription:
          "Placeholder content for the molecular dynamics workflow description.",
        inputs:
          "Placeholder content for simulation scale, compute demand, analyst effort, and tooling inputs.",
        assumptions:
          "Placeholder content for runtime assumptions, infrastructure assumptions, and operating assumptions.",
        outcomes:
          "Placeholder content for simulation capacity, program velocity, and ROI outcomes.",
      },
    ],
  },
  {
    id: "semiconductor",
    name: "Semiconductor",
    label: "Next Path",
    description:
      "Future ROI calculators for chip design, verification, yield optimization, and EDA workflows.",
    summary:
      "Use this path for workflow calculators tied to silicon design, validation, and manufacturing economics.",
    useCases: [
      {
        id: "coming-soon",
        name: "Path Coming Soon",
        shortDescription:
          "Placeholder for future semiconductor-specific workflows.",
        workflowDescription:
          "Placeholder content for future semiconductor workflow descriptions.",
        inputs:
          "Placeholder content for future semiconductor calculator inputs.",
        assumptions:
          "Placeholder content for future semiconductor assumptions.",
        outcomes:
          "Placeholder content for future semiconductor outcomes.",
      },
    ],
  },
  {
    id: "manufacturing",
    name: "Advanced Manufacturing",
    label: "Future Path",
    description:
      "Future ROI calculators for process engineering, digital twins, and plant simulation workflows.",
    summary:
      "Use this path for workflow calculators linked to operations, throughput, and plant performance.",
    useCases: [
      {
        id: "coming-soon",
        name: "Path Coming Soon",
        shortDescription:
          "Placeholder for future manufacturing workflows.",
        workflowDescription:
          "Placeholder content for future manufacturing workflow descriptions.",
        inputs:
          "Placeholder content for future manufacturing calculator inputs.",
        assumptions:
          "Placeholder content for future manufacturing assumptions.",
        outcomes:
          "Placeholder content for future manufacturing outcomes.",
      },
    ],
  },
];
