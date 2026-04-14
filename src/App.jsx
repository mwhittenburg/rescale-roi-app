import { useMemo, useState } from "react";
import { calculatorSections, industries } from "./platformData";

function PlatformHeader({ onHome, breadcrumb, title, description }) {
  return (
    <header className="platform-header">
      <div className="brand-lockup">
        <p className="eyebrow">ROI Calculator Platform</p>
        <h1>{title}</h1>
        <p className="hero-text">{description}</p>
      </div>

      <div className="header-actions">
        <button type="button" className="ghost-button" onClick={onHome}>
          Platform Home
        </button>
        <div className="breadcrumb">{breadcrumb}</div>
      </div>
    </header>
  );
}

function IndustryHome({ onSelectIndustry }) {
  return (
    <>
      <PlatformHeader
        onHome={() => {}}
        breadcrumb="Home / Industries"
        title="Industry-specific ROI calculator paths for reps"
        description="Choose an industry path, then choose a workflow-specific calculator. Each path is designed to hold distinct ROI stories without overwriting the others."
      />

      <section className="panel intro-panel">
        <div>
          <p className="section-kicker">Platform Strategy</p>
          <h2>Start with an industry, then drill into a use case.</h2>
        </div>
        <p className="panel-copy">
          This structure keeps the rep experience organized while giving us room
          to build unique calculators for each workflow over time.
        </p>
      </section>

      <section className="industry-grid">
        {industries.map((industry) => (
          <article key={industry.id} className="industry-card">
            <div className="card-label-row">
              <span className="pill">{industry.label}</span>
              <span className="card-meta">{industry.useCases.length} use case</span>
            </div>
            <h3>{industry.name}</h3>
            <p>{industry.description}</p>
            <button type="button" onClick={() => onSelectIndustry(industry.id)}>
              Open {industry.name} Path
            </button>
          </article>
        ))}
      </section>
    </>
  );
}

function IndustryPath({ industry, onBackHome, onSelectUseCase }) {
  return (
    <>
      <PlatformHeader
        onHome={onBackHome}
        breadcrumb={`Home / ${industry.name}`}
        title={`${industry.name} workflow calculator path`}
        description={industry.summary}
      />

      <section className="panel path-panel">
        <div>
          <p className="section-kicker">Pick a Use Case</p>
          <h2>{industry.name} calculators</h2>
        </div>
        <p className="panel-copy">
          Each calculator follows the same structure so reps can move quickly
          from one workflow conversation to the next.
        </p>
      </section>

      <section className="use-case-grid">
        {industry.useCases.map((useCase) => (
          <article key={useCase.id} className="use-case-card">
            <p className="card-meta">{industry.name}</p>
            <h3>{useCase.name}</h3>
            <p>{useCase.shortDescription}</p>
            <button type="button" onClick={() => onSelectUseCase(useCase.id)}>
              Open Calculator
            </button>
          </article>
        ))}
      </section>
    </>
  );
}

function CalculatorView({ industry, useCase, activeUseCaseId, onBackIndustry, onSwitchUseCase }) {
  return (
    <>
      <PlatformHeader
        onHome={onBackIndustry}
        breadcrumb={`Home / ${industry.name} / ${useCase.name}`}
        title={useCase.name}
        description="Placeholder calculator page with reusable sections for workflow description, inputs, assumptions, and outcomes. Formulas can be added next."
      />

      <section className="hero-layout">
        <div className="panel calculator-intro">
          <p className="section-kicker">Industry Path</p>
          <h2>{industry.name}</h2>
          <p className="panel-copy">{industry.summary}</p>
        </div>

        <aside className="panel workflow-picker">
          <label className="picker-label" htmlFor="workflow-select">
            Pick a use case
          </label>

          <div className="button-group" role="tablist" aria-label="Use cases">
            {industry.useCases.map((item) => (
              <button
                key={item.id}
                type="button"
                className={item.id === activeUseCaseId ? "use-case-button active" : "use-case-button"}
                onClick={() => onSwitchUseCase(item.id)}
                aria-pressed={item.id === activeUseCaseId}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="select-wrap">
            <select
              id="workflow-select"
              value={activeUseCaseId}
              onChange={(event) => onSwitchUseCase(event.target.value)}
            >
              {industry.useCases.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </aside>
      </section>

      <section className="use-case-summary" aria-live="polite">
        <div>
          <span className="summary-label">Selected Calculator</span>
          <strong>{useCase.name}</strong>
        </div>
        <p>{useCase.shortDescription}</p>
      </section>

      <section className="content-grid">
        {calculatorSections.map((section) => (
          <article key={section.key} className="content-panel">
            <header className="panel-header">
              <h2>{section.title}</h2>
            </header>
            <p>{useCase[section.key]}</p>
          </article>
        ))}
      </section>
    </>
  );
}

function App() {
  const [activeIndustryId, setActiveIndustryId] = useState("pharma");
  const [activeUseCaseId, setActiveUseCaseId] = useState("virtual-screening");
  const [currentView, setCurrentView] = useState("calculator");

  const activeIndustry = useMemo(
    () => industries.find((industry) => industry.id === activeIndustryId) ?? industries[0],
    [activeIndustryId],
  );

  const activeUseCase = useMemo(
    () =>
      activeIndustry.useCases.find((useCase) => useCase.id === activeUseCaseId) ??
      activeIndustry.useCases[0],
    [activeIndustry, activeUseCaseId],
  );

  function goHome() {
    setCurrentView("home");
  }

  function openIndustry(industryId) {
    const nextIndustry =
      industries.find((industry) => industry.id === industryId) ?? industries[0];
    setActiveIndustryId(nextIndustry.id);
    setActiveUseCaseId(nextIndustry.useCases[0].id);
    setCurrentView("industry");
  }

  function openCalculator(useCaseId) {
    setActiveUseCaseId(useCaseId);
    setCurrentView("calculator");
  }

  function returnToIndustry() {
    setCurrentView("industry");
  }

  return (
    <div className="app-shell">
      <main className="app-card">
        {currentView === "home" ? <IndustryHome onSelectIndustry={openIndustry} /> : null}

        {currentView === "industry" ? (
          <IndustryPath
            industry={activeIndustry}
            onBackHome={goHome}
            onSelectUseCase={openCalculator}
          />
        ) : null}

        {currentView === "calculator" ? (
          <CalculatorView
            industry={activeIndustry}
            useCase={activeUseCase}
            activeUseCaseId={activeUseCase.id}
            onBackIndustry={returnToIndustry}
            onSwitchUseCase={setActiveUseCaseId}
          />
        ) : null}
      </main>
    </div>
  );
}

export default App;
