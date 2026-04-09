import { useEffect, useMemo, useState } from "react";
import {
  buildExportPayload,
  calculateScenario,
  defaultBranding,
  defaultFields,
  scenarioKeys,
  scenarioLabels,
  supportingContent,
} from "./model";

const STORAGE_KEY = "rescale-roi-framework-state-v1";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value) {
  return `${(value * 100).toFixed(0)}%`;
}

function formatMonths(value) {
  return `${value.toFixed(1)} months`;
}

function formatCompactCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function downloadFile(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

function buildCsv(fields) {
  const header = [
    "Group",
    "Label",
    "Conservative",
    "Base Case",
    "Optimistic",
    "Unit",
    "Note",
  ];
  const lines = [header.join(",")];

  fields.forEach((field) => {
    const row = [
      field.group,
      field.label,
      field.conservative,
      field.base,
      field.optimistic,
      field.unit,
      field.note,
    ].map((value) => `"${String(value).replaceAll('"', '""')}"`);

    lines.push(row.join(","));
  });

  return lines.join("\n");
}

function buildSavedScenario(fields, branding) {
  return {
    id: crypto.randomUUID(),
    name: `${branding.companyName} ${new Date().toLocaleDateString()}`,
    createdAt: new Date().toISOString(),
    branding,
    fields,
  };
}

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        branding: defaultBranding,
        fields: defaultFields,
        savedViews: [],
      };
    }

    const parsed = JSON.parse(raw);
    return {
      branding: parsed.branding || defaultBranding,
      fields: parsed.fields || defaultFields,
      savedViews: parsed.savedViews || [],
    };
  } catch {
    return {
      branding: defaultBranding,
      fields: defaultFields,
      savedViews: [],
    };
  }
}

function App() {
  const initial = useMemo(loadInitialState, []);
  const [branding, setBranding] = useState(initial.branding);
  const [fields, setFields] = useState(initial.fields);
  const [savedViews, setSavedViews] = useState(initial.savedViews);
  const [activeScenario, setActiveScenario] = useState("base");
  const [toast, setToast] = useState("");

  const metrics = useMemo(
    () =>
      Object.fromEntries(
        scenarioKeys.map((scenario) => [scenario, calculateScenario(fields, scenario)]),
      ),
    [fields],
  );

  const activeMetrics = metrics[activeScenario];
  const strongestScenario = scenarioKeys.reduce(
    (best, scenario) =>
      metrics[scenario].yearOneRoi > metrics[best].yearOneRoi ? scenario : best,
    "conservative",
  );

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--accent",
      branding.accentColor || "#a64b2a",
    );
  }, [branding.accentColor]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        branding,
        fields,
        savedViews,
      }),
    );
  }, [branding, fields, savedViews]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  function updateBranding(key, value) {
    setBranding((current) => ({ ...current, [key]: value }));
  }

  function updateField(key, scenario, value) {
    setFields((current) =>
      current.map((field) =>
        field.key === key ? { ...field, [scenario]: Number(value) } : field,
      ),
    );
  }

  function saveCurrentView() {
    setSavedViews((current) => [
      buildSavedScenario(structuredClone(fields), structuredClone(branding)),
      ...current,
    ]);
    setToast("View saved locally");
  }

  function loadSavedView(savedView) {
    setFields(savedView.fields);
    setBranding(savedView.branding);
    setToast(`Loaded ${savedView.name}`);
  }

  function deleteSavedView(id) {
    setSavedViews((current) => current.filter((view) => view.id !== id));
  }

  function resetDefaults() {
    setFields(defaultFields);
    setBranding(defaultBranding);
    setToast("Reset to workbook defaults");
  }

  function exportJson() {
    downloadFile(
      "rescale-roi-export.json",
      JSON.stringify(buildExportPayload({ branding, fields }), null, 2),
      "application/json",
    );
  }

  function exportCsv() {
    downloadFile("rescale-roi-inputs.csv", buildCsv(fields), "text/csv");
  }

  function printPdf() {
    window.print();
  }

  return (
    <div className="page-shell">
      <header className="hero">
        <div className="hero-copy">
          <div className="hero-badge">{branding.logoText}</div>
          <p className="eyebrow">Rescale Business Case Builder</p>
          <h1>Share the ROI story without touching the spreadsheet.</h1>
          <p className="hero-text">
            This React app turns the workbook into a cleaner experience with
            saved views, browser exports, and a print-friendly summary for PDF
            handoff.
          </p>

          <div className="hero-actions no-print">
            <button onClick={saveCurrentView}>Save this view</button>
            <button onClick={exportJson}>Export JSON</button>
            <button onClick={exportCsv}>Export CSV</button>
            <button onClick={printPdf}>Print / PDF</button>
            <button className="ghost" onClick={resetDefaults}>
              Reset defaults
            </button>
          </div>

          <section className="hero-proof">
            <div className="proof-card proof-card-accent">
              <span className="metric-label">Current Recommendation</span>
              <strong>{scenarioLabels[activeScenario]} scenario</strong>
              <p>
                {formatPercent(activeMetrics.yearOneRoi)} year-one ROI with{" "}
                {formatMonths(activeMetrics.paybackPeriod)} payback.
              </p>
            </div>
            <div className="proof-card">
              <span className="metric-label">Best Case In Model</span>
              <strong>{scenarioLabels[strongestScenario]}</strong>
              <p>
                Peaks at {formatPercent(metrics[strongestScenario].yearOneRoi)} ROI
                and {formatCompactCurrency(metrics[strongestScenario].threeYearNpv)} NPV.
              </p>
            </div>
          </section>
        </div>

        <section className="hero-card">
          <div className="panel-mini-header">
            <h2>Branding</h2>
            <p>Customize the customer-facing header.</p>
          </div>

          <label className="field">
            <span>Customer</span>
            <input
              type="text"
              value={branding.companyName}
              onChange={(event) => updateBranding("companyName", event.target.value)}
            />
          </label>

          <label className="field">
            <span>Prepared date</span>
            <input
              type="text"
              value={branding.preparedDate}
              onChange={(event) => updateBranding("preparedDate", event.target.value)}
            />
          </label>

          <label className="field">
            <span>Prepared by</span>
            <input
              type="text"
              value={branding.preparedBy}
              onChange={(event) => updateBranding("preparedBy", event.target.value)}
            />
          </label>

          <label className="field">
            <span>Logo text</span>
            <input
              type="text"
              value={branding.logoText}
              onChange={(event) => updateBranding("logoText", event.target.value)}
            />
          </label>

          <label className="field">
            <span>Accent color</span>
            <input
              type="color"
              value={branding.accentColor}
              onChange={(event) => updateBranding("accentColor", event.target.value)}
            />
          </label>
        </section>
      </header>

      <main className="layout">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Inputs</p>
              <h2>Model setup</h2>
            </div>
            <p className="panel-text">
              Edit the three scenario columns directly. The model recalculates
              instantly.
            </p>
          </div>

          {["Investment", "Assumptions"].map((groupName) => (
            <section key={groupName} className="input-group">
              <h3>{groupName}</h3>
              <div className="input-grid">
                {fields
                  .filter((field) => field.group === groupName)
                  .map((field) => (
                    <article className="input-card" key={field.key}>
                      <div className="input-card-top">
                        <h4>{field.label}</h4>
                        <p>{field.note}</p>
                      </div>

                      <div className="scenario-fields">
                        {scenarioKeys.map((scenario) => (
                          <label className="field" key={`${field.key}-${scenario}`}>
                            <span>{scenarioLabels[scenario]}</span>
                            {field.unit === "toggle" ? (
                              <select
                                value={field[scenario]}
                                onChange={(event) =>
                                  updateField(field.key, scenario, event.target.value)
                                }
                              >
                                <option value={1}>Yes</option>
                                <option value={0}>No</option>
                              </select>
                            ) : (
                              <input
                                type="number"
                                step={field.unit === "percent" ? "0.01" : "0.1"}
                                value={field[scenario]}
                                onChange={(event) =>
                                  updateField(field.key, scenario, event.target.value)
                                }
                              />
                            )}
                          </label>
                        ))}
                      </div>
                    </article>
                  ))}
              </div>
            </section>
          ))}
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Outputs</p>
              <h2>{branding.companyName} ROI summary</h2>
            </div>

            <div className="scenario-picker no-print">
              {scenarioKeys.map((scenario) => (
                <button
                  key={scenario}
                  className={activeScenario === scenario ? "active" : ""}
                  onClick={() => setActiveScenario(scenario)}
                >
                  {scenarioLabels[scenario]}
                </button>
              ))}
            </div>
          </div>

          <div className="meta-row">
            <div>
              <span className="meta-label">Prepared</span>
              <strong>{branding.preparedDate}</strong>
            </div>
            <div>
              <span className="meta-label">Prepared by</span>
              <strong>{branding.preparedBy}</strong>
            </div>
            <div>
              <span className="meta-label">Scenario</span>
              <strong>{scenarioLabels[activeScenario]}</strong>
            </div>
          </div>

          <section className="summary-strip">
            <SummaryCard
              label="Annual Investment"
              value={formatCurrency(activeMetrics.annualInvestment)}
              note="Platform + services"
            />
            <SummaryCard
              label="Total Annual Benefits"
              value={formatCurrency(activeMetrics.totalBenefits)}
              note={`${formatCurrency(activeMetrics.netAnnualBenefit)} net benefit`}
            />
            <SummaryCard
              label="Year 1 ROI"
              value={formatPercent(activeMetrics.yearOneRoi)}
              note={formatMonths(activeMetrics.paybackPeriod)}
            />
            <SummaryCard
              label="3-Year NPV"
              value={formatCurrency(activeMetrics.threeYearNpv)}
              note="10% discount rate"
            />
          </section>

          <section className="proposal-banner">
            <div>
              <span className="metric-label">Executive takeaway</span>
              <h3>
                {branding.companyName} can unlock{" "}
                {formatCompactCurrency(activeMetrics.totalBenefits)} in annual value
                while recovering{" "}
                {Math.round(activeMetrics.adminHoursRecovered).toLocaleString()} admin
                hours per year.
              </h3>
            </div>
            <div className="proposal-banner-chip">
              <span>TTM</span>
              <strong>
                {activeMetrics.values.includeTtm ? "Included" : "Excluded"}
              </strong>
            </div>
          </section>

          <section className="results-grid">
            <MetricPanel
              title="Benefit breakdown"
              items={[
                [
                  "Engineer Productivity",
                  formatCurrency(activeMetrics.engineerProductivity),
                ],
                ["Time-to-Market", formatCurrency(activeMetrics.timeToMarket)],
                [
                  "Prototype Reduction",
                  formatCurrency(activeMetrics.prototypeReduction),
                ],
                [
                  "Quality / Rework Avoidance",
                  formatCurrency(activeMetrics.qualityReworkAvoidance),
                ],
              ]}
            />

            <MetricPanel
              title="Operating impact"
              items={[
                [
                  "Admin hours recovered",
                  `${Math.round(activeMetrics.adminHoursRecovered).toLocaleString()} hrs`,
                ],
                [
                  "Queue hours recovered",
                  `${Math.round(activeMetrics.queueHoursRecovered).toLocaleString()} hrs`,
                ],
                [
                  "Products accelerated",
                  String(activeMetrics.values.productsAccelerated),
                ],
                [
                  "Prototype count avoided",
                  String(activeMetrics.values.prototypesEliminated),
                ],
              ]}
            />

            <MetricPanel
              title="Executive framing"
              items={[
                [
                  "Engineers in scope",
                  String(activeMetrics.values.engineers),
                ],
                [
                  "Loaded cost",
                  formatCurrency(activeMetrics.values.loadedCost),
                ],
                [
                  "TTM included",
                  activeMetrics.values.includeTtm ? "Yes" : "No",
                ],
                [
                  "Productivity gain",
                  formatPercent(activeMetrics.values.productivityImprovement),
                ],
              ]}
            />
          </section>

          <section className="comparison-panel">
            <div className="panel-mini-header">
              <h3>Scenario comparison</h3>
              <p>Use this when you want a faster executive readout across all cases.</p>
            </div>
            <div className="comparison-grid">
              {scenarioKeys.map((scenario) => (
                <article
                  key={scenario}
                  className={`comparison-card${
                    activeScenario === scenario ? " active" : ""
                  }`}
                >
                  <span className="metric-label">{scenarioLabels[scenario]}</span>
                  <strong>{formatPercent(metrics[scenario].yearOneRoi)}</strong>
                  <p>{formatCompactCurrency(metrics[scenario].netAnnualBenefit)} net annual benefit</p>
                  <div className="comparison-meta">
                    <span>{formatMonths(metrics[scenario].paybackPeriod)} payback</span>
                    <span>{formatCompactCurrency(metrics[scenario].threeYearNpv)} NPV</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </main>

      <section className="panel lower-panels">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Support</p>
            <h2>Saved views, sources, and next steps</h2>
          </div>
        </div>

        <div className="lower-grid">
          <section className="support-card no-print">
            <h3>Saved views</h3>
            {savedViews.length === 0 ? (
              <p className="muted">No saved views yet. Save one from the top bar.</p>
            ) : (
              <div className="saved-list">
                {savedViews.map((view) => (
                  <div className="saved-row" key={view.id}>
                    <div>
                      <strong>{view.name}</strong>
                      <p>{new Date(view.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="saved-actions">
                      <button onClick={() => loadSavedView(view)}>Load</button>
                      <button className="ghost" onClick={() => deleteSavedView(view.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <SupportList title="Value drivers" items={supportingContent.valueDrivers} />
          <SupportList title="Success metrics" items={supportingContent.successMetrics} />
          <SupportList title="Sources and risks" items={supportingContent.sourceNotes} />
          <section className="support-card">
            <h3>Timeline</h3>
            <div className="timeline">
              {supportingContent.timeline.map((item) => (
                <div className="timeline-row" key={`${item.title}-${item.date}`}>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.owner}</p>
                  </div>
                  <span>{item.date}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      {toast ? <div className="toast no-print">{toast}</div> : null}
    </div>
  );
}

function SummaryCard({ label, value, note }) {
  return (
    <article className="summary-card">
      <span className="metric-label">{label}</span>
      <strong className="summary-value">{value}</strong>
      <span className="summary-note">{note}</span>
    </article>
  );
}

function MetricPanel({ title, items }) {
  return (
    <article className="support-card">
      <h3>{title}</h3>
      <div className="metric-stack">
        {items.map(([label, value]) => (
          <div className="metric-row" key={label}>
            <span className="metric-label">{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

function SupportList({ title, items }) {
  return (
    <section className="support-card">
      <h3>{title}</h3>
      <ul className="plain-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export default App;
