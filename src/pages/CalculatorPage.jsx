import { useMemo, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { buildHomePath, buildIndustryPath } from "../router";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompactCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatPercent(value) {
  return `${Math.round(value)}%`;
}

function formatDays(value) {
  return `${value.toFixed(1)} days`;
}

function formatMonths(value) {
  if (!Number.isFinite(value) || value <= 0) {
    return "N/A";
  }

  return `${value.toFixed(1)} months`;
}

function formatHours(value) {
  return `${Math.round(value).toLocaleString()} hours`;
}

function formatCapacity(value, unit) {
  return `${value.toFixed(1)} ${unit}`;
}

function buildDefaultValues(sections) {
  return Object.fromEntries(
    sections.flatMap((section) =>
      section.fields.map((field) => [field.key, field.defaultValue]),
    ),
  );
}

function FieldInput({ field, value, onChange }) {
  const isPercent = field.kind === "percent";
  const displayValue = isPercent ? Number(value) * 100 : value;
  const step = isPercent ? (field.step ?? 0.01) * 100 : field.step ?? 1;
  const min = isPercent ? (field.min ?? 0) * 100 : field.min;
  const max = isPercent ? (field.max ?? 999999) * 100 : field.max;

  return (
    <label className="field-card">
      <span className="field-label">{field.label}</span>
      <div className="input-shell">
        {field.prefix ? <span className="input-prefix">{field.prefix}</span> : null}
        <input
          type="number"
          value={displayValue}
          min={min}
          max={max}
          step={step}
          onChange={(event) => {
            const nextValue = Number(event.target.value);
            onChange(field, isPercent ? nextValue / 100 : nextValue);
          }}
        />
        {field.kind === "percent" ? <span className="input-suffix">%</span> : null}
        {field.suffix && !field.kind ? (
          <span className="input-suffix">{field.suffix}</span>
        ) : null}
      </div>
    </label>
  );
}

function MetricCard({ label, value }) {
  return (
    <article className="metric-card">
      <span className="metric-label">{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function InteractiveCalculatorPage({ industry, calculator, onNavigate }) {
  const [values, setValues] = useState(() => buildDefaultValues(calculator.sections));
  const results = useMemo(() => calculator.calculate(values), [calculator, values]);

  function updateValue(field, nextValue) {
    const boundedValue = Number.isNaN(nextValue) ? 0 : nextValue;
    setValues((current) => ({
      ...current,
      [field.key]: boundedValue,
    }));
  }

  const outputCards = [
    {
      label: "Annual hours saved",
      value: formatHours(results.annualHoursSaved),
    },
    {
      label: "Cycle-time reduction",
      value: formatDays(results.cycleTimeReduction),
    },
    {
      label: "Capacity unlocked",
      value: formatCapacity(results.capacityUnlocked, results.capacityUnit),
    },
    {
      label: "Annual economic impact",
      value: formatCompactCurrency(results.annualEconomicImpact),
    },
    {
      label: "Payback period",
      value: formatMonths(results.paybackPeriodMonths),
    },
    {
      label: "ROI percent",
      value: formatPercent(results.roiPercent),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Biopharma ROI Calculator"
        title={calculator.name}
        description={calculator.businessOutcome}
        breadcrumbs={[
          { label: "Home", path: buildHomePath() },
          { label: industry.name, path: buildIndustryPath(industry.id) },
          { label: calculator.name },
        ]}
        onNavigate={onNavigate}
      />

      <section className="calculator-layout">
        <div className="calculator-main">
          {calculator.sections.map((section) => {
            const requiredFields = section.fields.filter((field) => !field.advanced);
            const advancedFields = section.fields.filter((field) => field.advanced);

            return (
              <section key={section.key} className="panel calc-section">
                <header className="panel-header">
                  <h2>{section.title}</h2>
                </header>

                <div className="field-grid">
                  {requiredFields.map((field) => (
                    <FieldInput
                      key={field.key}
                      field={field}
                      value={values[field.key]}
                      onChange={updateValue}
                    />
                  ))}
                </div>

                {advancedFields.length > 0 ? (
                  <details className="advanced-block">
                    <summary>{calculator.advancedSectionLabel}</summary>
                    <div className="field-grid advanced-grid">
                      {advancedFields.map((field) => (
                        <FieldInput
                          key={field.key}
                          field={field}
                          value={values[field.key]}
                          onChange={updateValue}
                        />
                      ))}
                    </div>
                  </details>
                ) : null}
              </section>
            );
          })}

          <section className="panel calc-section impact-panel">
            <header className="panel-header">
              <h2>Estimated business impact</h2>
            </header>
            <p className="panel-copy">
              These estimates update as you adjust the inputs and assumptions in
              the calculator.
            </p>
            <div className="impact-highlight">
              <div>
                <span className="metric-label">Estimated annual economic impact</span>
                <strong>{formatCurrency(results.annualEconomicImpact)}</strong>
              </div>
              <div>
                <span className="metric-label">Estimated payback period</span>
                <strong>{formatMonths(results.paybackPeriodMonths)}</strong>
              </div>
            </div>
          </section>
        </div>

        <aside className="panel summary-panel">
          <div className="summary-top">
            <p className="section-kicker">Live Summary</p>
            <h2>Estimated business impact</h2>
            <p className="panel-copy">
              Use this summary during customer working sessions to show how the
              value story changes as you refine assumptions together.
            </p>
          </div>

          <div className="metric-grid">
            {outputCards.map((metric) => (
              <MetricCard key={metric.label} label={metric.label} value={metric.value} />
            ))}
          </div>
        </aside>
      </section>
    </>
  );
}

function ContentCalculatorPage({ industry, calculator, onNavigate }) {
  return (
    <>
      <PageHeader
        eyebrow="Workflow Calculator"
        title={calculator.name}
        description={calculator.teaser}
        breadcrumbs={[
          { label: "Home", path: buildHomePath() },
          { label: industry.name, path: buildIndustryPath(industry.id) },
          { label: calculator.name },
        ]}
        onNavigate={onNavigate}
      />

      <section className="hero-layout">
        <article className="panel calculator-intro">
          <p className="section-kicker">Industry Context</p>
          <h2>{industry.name}</h2>
          <p className="panel-copy">{industry.summary}</p>
        </article>

        <aside className="panel workflow-sidebar">
          <p className="section-kicker">Next Step</p>
          <h2>Calculator buildout is coming next.</h2>
          <p className="panel-copy">
            This use case is still in platform setup mode while the Biopharma
            calculators are being converted into live ROI models first.
          </p>
          <button
            type="button"
            className="ghost-button"
            onClick={() => onNavigate(buildIndustryPath(industry.id))}
          >
            Back to {industry.name}
          </button>
        </aside>
      </section>
    </>
  );
}

export function CalculatorPage({ industry, calculator, onNavigate }) {
  if (calculator.calculatorType === "interactive") {
    return (
      <InteractiveCalculatorPage
        industry={industry}
        calculator={calculator}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <ContentCalculatorPage
      industry={industry}
      calculator={calculator}
      onNavigate={onNavigate}
    />
  );
}
