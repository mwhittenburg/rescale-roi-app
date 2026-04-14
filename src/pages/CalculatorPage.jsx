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

function FieldInput({ field, value, onChange }) {
  const isPercent = field.kind === "percent";
  const displayValue = isPercent ? Number(value) * 100 : value;
  const step = isPercent ? (field.step ?? 0.01) * 100 : field.step ?? 1;
  const min = isPercent ? (field.min ?? 0) * 100 : field.min;
  const max = isPercent ? (field.max ?? 999999) * 100 : field.max;

  return (
    <label className="field-card">
      <div className="field-label-row">
        <span className="field-label">{field.label}</span>
        <span className={`confidence-tag ${field.confidenceTag.key}`}>
          {field.confidenceTag.label}
        </span>
      </div>
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
      <span className="field-helper">{field.helperText}</span>
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
  const [values, setValues] = useState(() => calculator.defaultValues);
  const results = useMemo(() => calculator.calculate(values), [calculator, values]);

  function updateValue(field, nextValue) {
    const numericValue = Number.isNaN(nextValue) ? 0 : nextValue;
    const boundedValue = Math.min(
      field.max ?? Number.POSITIVE_INFINITY,
      Math.max(field.min ?? Number.NEGATIVE_INFINITY, numericValue),
    );

    setValues((current) => ({
      ...current,
      [field.key]: boundedValue,
    }));
  }

  function resetToDefaults() {
    setValues(calculator.defaultValues);
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
        eyebrow={`${industry.name} ROI Calculator`}
        title={calculator.name}
        description={calculator.businessOutcome}
        breadcrumbs={[
          { label: "Home", path: buildHomePath() },
          { label: industry.name, path: buildIndustryPath(industry.id) },
          { label: calculator.name },
        ]}
        onNavigate={onNavigate}
      />

      <section className="panel intro-panel calculator-intro-panel">
        <div>
          <p className="section-kicker">How To Use This Calculator</p>
          <h2>Start with the example values, then adjust the few inputs that matter most to your situation.</h2>
        </div>
        <p className="panel-copy">
          The page updates live as you edit the assumptions, so you can quickly
          test different scenarios and see how the estimated impact changes.
        </p>
      </section>

      <section className="guidance-grid calculator-guidance-grid">
        <article className="panel guidance-card">
          <p className="section-kicker">Best Fit When</p>
          <p className="panel-copy">{calculator.sellerGuidance.bestFitWhen}</p>
        </article>
        <article className="panel guidance-card">
          <p className="section-kicker">Ask These First</p>
          <ul className="guidance-list">
            {calculator.sellerGuidance.askTheseFirst.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="panel guidance-card">
          <p className="section-kicker">What This Estimates</p>
          <p className="panel-copy">{calculator.sellerGuidance.whatThisEstimates}</p>
        </article>
      </section>

      <section className="calculator-layout">
        <div className="calculator-main">
          {calculator.sections.map((section) => {
            const requiredFields = section.fields.filter((field) => !field.advanced);
            const advancedFields = section.fields.filter((field) => field.advanced);

            return (
              <section key={section.key} className="panel calc-section">
                <header className="panel-header">
                  <h2>{section.title}</h2>
                  {section.description ? (
                    <p className="section-copy">{section.description}</p>
                  ) : null}
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
              Sample values are already loaded so the page is reviewable on first
              open. Adjust the assumptions during the session to show how the
              value story changes with the customer conversation.
            </p>
            <div className="summary-actions">
              <button type="button" className="ghost-button" onClick={resetToDefaults}>
                Reset to defaults
              </button>
            </div>
          </div>

          <div className="metric-grid">
            {outputCards.map((metric) => (
              <MetricCard key={metric.label} label={metric.label} value={metric.value} />
            ))}
          </div>

          {results.extraOutputs.length > 0 ? (
            <div className="extra-output-grid">
              {results.extraOutputs.map((metric) => (
                <MetricCard
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                />
              ))}
            </div>
          ) : null}
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
          <p className="section-kicker">Calculator Status</p>
          <h2>This calculator is not available in the current review build.</h2>
          <p className="panel-copy">
            Return to the industry page to open one of the live calculators that
            are included in this review experience.
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
