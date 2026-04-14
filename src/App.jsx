import { useState } from "react";

const useCases = {
  screening: {
    label: "Virtual Screening / Docking",
    workflowDescription:
      "Placeholder content for the virtual screening and docking workflow description.",
    inputs:
      "Placeholder content for workflow volume, compute usage, scientist effort, and software inputs.",
    assumptions:
      "Placeholder content for baseline timelines, utilization assumptions, and cost assumptions.",
    outcomes:
      "Placeholder content for cycle-time, throughput, and ROI outcomes.",
  },
  dynamics: {
    label: "Molecular Dynamics",
    workflowDescription:
      "Placeholder content for the molecular dynamics workflow description.",
    inputs:
      "Placeholder content for simulation scale, compute demand, analyst effort, and tooling inputs.",
    assumptions:
      "Placeholder content for runtime assumptions, infrastructure assumptions, and operating assumptions.",
    outcomes:
      "Placeholder content for delivery speed, simulation capacity, and ROI outcomes.",
  },
};

const sectionConfig = [
  { key: "workflowDescription", title: "1. Workflow Description" },
  { key: "inputs", title: "2. Inputs" },
  { key: "assumptions", title: "3. Assumptions" },
  { key: "outcomes", title: "4. Outcomes" },
];

function App() {
  const [activeUseCase, setActiveUseCase] = useState("screening");
  const selectedUseCase = useCases[activeUseCase];

  return (
    <div className="app-shell">
      <main className="app-card">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">Pharma Computational Workflow ROI Calculator</p>
            <h1>Pick a use case</h1>
            <p className="hero-text">
              Choose a workflow to view its placeholder structure for description,
              inputs, assumptions, and outcomes.
            </p>
          </div>

          <div className="picker-panel">
            <label className="picker-label" htmlFor="use-case-select">
              Select workflow
            </label>

            <div className="button-group" role="tablist" aria-label="Use cases">
              {Object.entries(useCases).map(([key, useCase]) => (
                <button
                  key={key}
                  type="button"
                  className={key === activeUseCase ? "use-case-button active" : "use-case-button"}
                  onClick={() => setActiveUseCase(key)}
                  aria-pressed={key === activeUseCase}
                >
                  {useCase.label}
                </button>
              ))}
            </div>

            <div className="select-wrap">
              <select
                id="use-case-select"
                value={activeUseCase}
                onChange={(event) => setActiveUseCase(event.target.value)}
              >
                {Object.entries(useCases).map(([key, useCase]) => (
                  <option key={key} value={key}>
                    {useCase.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="use-case-summary" aria-live="polite">
          <span className="summary-label">Selected Use Case</span>
          <strong>{selectedUseCase.label}</strong>
        </section>

        <section className="content-grid">
          {sectionConfig.map((section) => (
            <article key={section.key} className="content-panel">
              <header className="panel-header">
                <h2>{section.title}</h2>
              </header>
              <p>{selectedUseCase[section.key]}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
