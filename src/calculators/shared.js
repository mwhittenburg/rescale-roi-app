export const calculatorSections = [
  { key: "workflowDescription", title: "Workflow Description" },
  { key: "inputs", title: "Inputs" },
  { key: "assumptions", title: "Assumptions" },
  { key: "outcomes", title: "Outcomes" },
  { key: "formulas", title: "Formulas" },
];

export function createCalculator(industryId, config) {
  return {
    industryId,
    ...config,
  };
}
