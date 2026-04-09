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
  const [showEditor, setShowEditor] = useState(false);
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
      <section className="topbar">
        <div className="topbar-brand">
          <div className="hero-badge">{branding.logoText}</div>
          <div>
            <p className="eyebrow">Presentation Mode</p>
            <strong>{branding.companyName} business case</strong>
          </div>
        </div>
        <div className="topbar-actions no-print">
          <button className="ghost" onClick={() => setShowEditor((current) => !current)}>
            {showEditor ? "Hide editor" : "Edit assumptions"}
          </button>
          <button onClick={printPdf}>Print / PDF</button>
        </div>
      </section>

      <header className="hero hero-presentation">
        <div className="hero-copy">
          <p className="eyebrow">Rescale Business Case Builder</p>
          <h1>Build a business case that feels boardroom-ready.</h1>
          <p className="hero-text">
            Use the model to frame investment, quantify value, and present a
            clear recommendation for {branding.companyName} without exposing the
            spreadsheet underneath.
          </p>

          <div className="hero-actions no-print">
            <button onClick={saveCurrentView}>Save scenario</button>
            <button onClick={exportCsv}>Export inputs</button>
            <button className="ghost" onClick={exportJson}>
              Export JSON
            </button>
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

        <section className="hero-stage">
          <div className="stage-header">
            <div>
              <span className="metric-label">Recommendation Snapshot</span>
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

          <div className="stage-kpis">
            <SummaryCard
              label="Year 1 ROI"
              value={formatPercent(activeMetrics.yearOneRoi)}
              note={formatMonths(activeMetrics.paybackPeriod)}
            />
            <SummaryCard
              label="Net Annual Benefit"
              value={formatCompactCurrency(activeMetrics.netAnnualBenefit)}
              note={`${formatCompactCurrency(activeMetrics.totalBenefits)} total value`}
            />
            <SummaryCard
              label="3-Year NPV"
              value={formatCompactCurrency(activeMetrics.threeYearNpv)}
              note="10% discount rate"
            />
          </div>

          <div className="stage-quote">
            <span className="metric-label">Executive Takeaway</span>
            <p>
              Recommend the {scenarioLabels[activeScenario].toLowerCase()} case:
              {` `}
              {branding.companyName} can unlock{" "}
              {formatCompactCurrency(activeMetrics.totalBenefits)} in annual
              value while paying back the investment in{" "}
              {formatMonths(activeMetrics.paybackPeriod)}.
            </p>
          </div>

          <div className="stage-meta">
            <div>
              <span className="meta-label">Prepared</span>
              <strong>{branding.preparedDate}</strong>
            </div>
            <div>
              <span className="meta-label">Prepared by</span>
              <strong>{branding.preparedBy}</strong>
            </div>
            <div>
              <span className="meta-label">TTM status</span>
              <strong>{activeMetrics.values.includeTtm ? "Included" : "Excluded"}</strong>
            </div>
          </div>
        </section>
      </header>

      <main className="layout layout-presentation">
        <section className="panel panel-results-main">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Business Case</p>
              <h2>Decision-ready view</h2>
            </div>
            <p className="panel-text">
              Lead with the recommendation first. Edit assumptions only when needed.
            </p>
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
              label="Admin Hours Recovered"
              value={`${Math.round(activeMetrics.adminHoursRecovered).toLocaleString()} hrs`}
              note={`${Math.round(activeMetrics.queueHoursRecovered).toLocaleString()} queue hrs`}
            />
            <SummaryCard
              label="Programs Accelerated"
              value={String(activeMetrics.values.productsAccelerated)}
              note={`${activeMetrics.values.prototypesEliminated} prototypes avoided`}
            />
          </section>

          <section className="results-grid results-grid-featured">
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

            <section className="support-card scenario-comparison-card">
              <div className="panel-mini-header">
                <h3>Scenario comparison</h3>
                <p>Quick scan across conservative, base, and optimistic views.</p>
              </div>
              <div className="comparison-grid comparison-grid-tall">
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

          <section className="results-grid">
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

            <SupportList title="Value drivers" items={supportingContent.valueDrivers} />
          </section>
        </section>

        <section className="panel panel-support-rail">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Support</p>
              <h2>Supporting details</h2>
            </div>
            <p className="panel-text">
              Saved views, timeline, and source notes live here.
            </p>
          </div>

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
        </section>
      </main>

      {showEditor ? (
        <section className="panel panel-editor">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Editor</p>
              <h2>Adjust assumptions and branding</h2>
            </div>
            <p className="panel-text">
              Use this section to revise the story, then switch back to the presentation view.
            </p>
          </div>

          <section className="input-group">
            <div className="panel-mini-header">
              <h3>Branding</h3>
              <p>Controls what appears in the presentation layer.</p>
            </div>
            <div className="input-grid input-grid-branding">
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
            </div>
          </section>

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
      ) : null}

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
