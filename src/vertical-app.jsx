import { useEffect, useMemo, useState } from "react";
import {
  calculateVertical,
  cloneTemplate,
  formatValue,
  scenarioKeys,
  scenarioLabels,
  verticalTemplates,
} from "./vertical-model";

const STORAGE_KEY = "vertical-roi-studio-v1";
const verticalOrder = ["pharma", "automotive", "aerospace", "oilgas", "manufacturing"];

function compactCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        activeVertical: "pharma",
        activeScenario: "base",
        templates: Object.fromEntries(verticalOrder.map((id) => [id, cloneTemplate(id)])),
      };
    }

    const parsed = JSON.parse(raw);
    return {
      activeVertical: parsed.activeVertical || "pharma",
      activeScenario: parsed.activeScenario || "base",
      templates:
        parsed.templates ||
        Object.fromEntries(verticalOrder.map((id) => [id, cloneTemplate(id)])),
    };
  } catch {
    return {
      activeVertical: "pharma",
      activeScenario: "base",
      templates: Object.fromEntries(verticalOrder.map((id) => [id, cloneTemplate(id)])),
    };
  }
}

export default function VerticalApp() {
  const initial = useMemo(loadInitial, []);
  const [activeVertical, setActiveVertical] = useState(initial.activeVertical);
  const [activeScenario, setActiveScenario] = useState(initial.activeScenario);
  const [templates, setTemplates] = useState(initial.templates);
  const [showEditor, setShowEditor] = useState(false);

  const template = templates[activeVertical];
  const metrics = useMemo(
    () =>
      Object.fromEntries(
        scenarioKeys.map((scenario) => [
          scenario,
          calculateVertical(template, scenario),
        ]),
      ),
    [template],
  );
  const current = metrics[activeScenario];

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ activeVertical, activeScenario, templates }),
    );
  }, [activeVertical, activeScenario, templates]);

  function updateAssumption(key, scenario, value) {
    setTemplates((currentTemplates) => ({
      ...currentTemplates,
      [activeVertical]: {
        ...currentTemplates[activeVertical],
        assumptions: currentTemplates[activeVertical].assumptions.map((field) =>
          field.key === key ? { ...field, [scenario]: Number(value) } : field,
        ),
      },
    }));
  }

  function resetVertical() {
    setTemplates((currentTemplates) => ({
      ...currentTemplates,
      [activeVertical]: cloneTemplate(activeVertical),
    }));
  }

  return (
    <div className="vertical-shell">
      <header className="vertical-hero">
        <div className="hero-left">
          <span className="hero-chip">Vertical ROI Studio</span>
          <p className="vertical-kicker">{template.subtitle}</p>
          <h1>{template.heroTitle}</h1>
          <p className="hero-copy">{template.heroBody}</p>
          <div className="hero-actions">
            <button onClick={() => setShowEditor((currentValue) => !currentValue)}>
              {showEditor ? "Hide model editor" : "Edit vertical model"}
            </button>
            <button className="ghost" onClick={resetVertical}>
              Reset this vertical
            </button>
          </div>
        </div>

        <section className="hero-right">
          <span className="section-label">Recommended positioning</span>
          <h2>{template.label}</h2>
          <p>{template.recommendation}</p>

          <div className="scenario-tabs">
            {scenarioKeys.map((scenario) => (
              <button
                key={scenario}
                className={scenario === activeScenario ? "active" : ""}
                onClick={() => setActiveScenario(scenario)}
              >
                {scenarioLabels[scenario]}
              </button>
            ))}
          </div>

          <div className="mini-summary">
            <MetricCard
              label="Annual value"
              value={compactCurrency(current.totalBenefits)}
              note={`${compactCurrency(current.netBenefit)} net`}
            />
            <MetricCard
              label="Year 1 ROI"
              value={`${(current.roi * 100).toFixed(0)}%`}
              note={`${current.paybackMonths.toFixed(1)} month payback`}
            />
          </div>
        </section>
      </header>

      <section className="vertical-picker">
        {verticalOrder.map((id) => {
          const item = templates[id];
          return (
            <button
              key={id}
              className={`vertical-pill${id === activeVertical ? " active" : ""}`}
              onClick={() => setActiveVertical(id)}
            >
              <span>{item.label}</span>
              <small>{item.subtitle}</small>
            </button>
          );
        })}
      </section>

      <main className="vertical-layout">
        <section className="presentation-panel">
          <div className="panel-header">
            <div>
              <span className="section-label">Executive readout</span>
              <h2>{template.label} business case</h2>
            </div>
          </div>

          <section className="metric-grid">
            <MetricCard
              label={template.kpiLabels[0]}
              value={compactCurrency(current.accelerationValue)}
              note={`${current.values.programsAccelerated} initiatives accelerated`}
            />
            <MetricCard
              label={template.kpiLabels[1]}
              value={compactCurrency(current.recoveredHoursValue)}
              note={`${Math.round(current.recoveredHours).toLocaleString()} hours recovered`}
            />
            <MetricCard
              label={template.kpiLabels[2]}
              value={compactCurrency(current.avoidedCostValue)}
              note={`${current.values.rerunsAvoided} avoided events`}
            />
            <MetricCard
              label={template.kpiLabels[3]}
              value={compactCurrency(current.productivityValue)}
              note={`${current.values.scientists} people in scope`}
            />
          </section>

          <section className="highlight-band">
            <div>
              <span className="section-label">Talk track</span>
              <h3>
                In the {scenarioLabels[activeScenario].toLowerCase()} case,{" "}
                {template.label.toLowerCase()} teams unlock{" "}
                {compactCurrency(current.totalBenefits)} in annual value on{" "}
                {compactCurrency(current.values.annualInvestment)} of spend.
              </h3>
            </div>
            <div className="highlight-tag">
              <span>3-Year NPV</span>
              <strong>{compactCurrency(current.npv)}</strong>
            </div>
          </section>

          <section className="split-grid">
            <div className="surface-card">
              <h3>Value drivers</h3>
              <ul className="clean-list">
                {template.valueDrivers.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="surface-card">
              <h3>Scenario comparison</h3>
              <div className="comparison-list">
                {scenarioKeys.map((scenario) => {
                  const view = metrics[scenario];
                  return (
                    <div
                      key={scenario}
                      className={`comparison-row${
                        scenario === activeScenario ? " active" : ""
                      }`}
                    >
                      <div>
                        <span className="section-label">{scenarioLabels[scenario]}</span>
                        <strong>{(view.roi * 100).toFixed(0)}% ROI</strong>
                      </div>
                      <div className="comparison-values">
                        <span>{compactCurrency(view.netBenefit)} net</span>
                        <span>{view.paybackMonths.toFixed(1)} mo</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </section>

        <aside className="support-panel">
          <div className="surface-card">
            <h3>Default assumptions</h3>
            <div className="assumption-stack">
              {template.assumptions.slice(0, 5).map((field) => (
                <div key={field.key} className="assumption-row">
                  <span>{field.label}</span>
                  <strong>{formatValue(field.unit, field[activeScenario])}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card">
            <h3>Where this could go</h3>
            <ul className="clean-list">
              <li>Industry-specific KPI language and talk tracks.</li>
              <li>Template libraries for each vertical with saved defaults.</li>
              <li>Client-safe microsites by vertical and account.</li>
              <li>Export-ready proposal pages per industry motion.</li>
            </ul>
          </div>
        </aside>
      </main>

      {showEditor ? (
        <section className="editor-panel">
          <div className="panel-header">
            <div>
              <span className="section-label">Template editor</span>
              <h2>{template.label} assumptions</h2>
            </div>
          </div>

          <div className="editor-grid">
            {template.assumptions.map((field) => (
              <article key={field.key} className="editor-card">
                <h3>{field.label}</h3>
                <div className="editor-scenarios">
                  {scenarioKeys.map((scenario) => (
                    <label key={`${field.key}-${scenario}`}>
                      <span>{scenarioLabels[scenario]}</span>
                      <input
                        type="number"
                        step={field.unit === "percent" ? "0.01" : "1"}
                        value={field[scenario]}
                        onChange={(event) =>
                          updateAssumption(field.key, scenario, event.target.value)
                        }
                      />
                    </label>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function MetricCard({ label, value, note }) {
  return (
    <article className="metric-card">
      <span className="section-label">{label}</span>
      <strong>{value}</strong>
      <p>{note}</p>
    </article>
  );
}
