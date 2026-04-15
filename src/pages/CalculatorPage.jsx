import { useId, useMemo, useState } from "react";
import { FieldHelpTooltip } from "../components/FieldHelpTooltip";
import { PageHeader } from "../components/PageHeader";

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

function formatAnnualCostDelta(value) {
  const absValue = formatCompactCurrency(Math.abs(value));

  if (value > 0) {
    return `${absValue} lower`;
  }

  if (value < 0) {
    return `${absValue} higher`;
  }

  return "$0";
}

function formatCapacity(value, unit) {
  return `${value.toFixed(1)} ${unit}`;
}

function withDirectionalNote(text) {
  return `${text.replace(/\.$/, "")}. Directional and assumption-based.`;
}

function formatFieldValue(field, value) {
  if (field.kind === "percent") {
    return `${Math.round(Number(value) * 100)}%`;
  }

  if (field.prefix === "$") {
    return formatCurrency(Number(value));
  }

  if (field.suffix) {
    return `${Number(value).toLocaleString()} ${field.suffix}`;
  }

  return Number(value).toLocaleString();
}

function FieldInput({ field, value, onChange }) {
  const inputId = useId();
  const isPercent = field.kind === "percent";
  const displayValue = isPercent ? Number(value) * 100 : value;
  const step = isPercent ? (field.step ?? 0.01) * 100 : field.step ?? 1;
  const min = isPercent ? (field.min ?? 0) * 100 : field.min;
  const max = isPercent ? (field.max ?? 999999) * 100 : field.max;

  return (
    <div className="field-card">
      <div className="field-label-row">
        <label className="field-label-group" htmlFor={inputId}>
          <span className="field-label">{field.label}</span>
          <FieldHelpTooltip label={field.label} help={field.helpTooltip} />
        </label>
        <span className={`confidence-tag ${field.confidenceTag.key}`}>
          {field.confidenceTag.label}
        </span>
      </div>
      <div className="input-shell">
        {field.prefix ? <span className="input-prefix">{field.prefix}</span> : null}
        <input
          id={inputId}
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
    </div>
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

function GuidanceDetail({ title, body }) {
  return (
    <article className="guidance-detail-card">
      <p className="guidance-detail-title">{title}</p>
      <p className="panel-copy">{body}</p>
    </article>
  );
}

function PrintSection({ title, children }) {
  return (
    <section className="print-section">
      <p className="guidance-detail-title">{title}</p>
      {children}
    </section>
  );
}

function InteractiveCalculatorPage({
  contextName,
  breadcrumbs,
  calculator,
  onNavigate,
}) {
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

  function exportPdf() {
    const previousTitle = document.title;
    document.title = `${calculator.name} Summary`;
    window.print();
    window.setTimeout(() => {
      document.title = previousTitle;
    }, 0);
  }

  const isTcoModel = calculator.valueModel === "tco";
  const typicalBuyerTags = calculator.typicalBuyerTags ?? [];
  const howToRead = calculator.sellerGuidance.howToRead;
  const preparedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
  const printSections = calculator.sections.map((section) => ({
    title: section.title,
    fields: section.fields.filter((field) => !field.advanced).slice(0, 3),
  }));

  const outputCards = isTcoModel
    ? [
        {
          label: "Annual current-state cost",
          value: formatCompactCurrency(results.currentAnnualCost),
        },
        {
          label: "Annual future-state cost",
          value: formatCompactCurrency(results.futureAnnualCost),
        },
        {
          label: "Annual cost difference",
          value: formatAnnualCostDelta(results.annualCostDifference),
        },
        {
          label: "Fixed cost avoided",
          value: formatCompactCurrency(results.fixedCostAvoided),
        },
        {
          label: "Idle capacity cost reduced",
          value: formatCompactCurrency(results.idleCapacityCostReduced),
        },
        {
          label: "Migration payback period",
          value: formatMonths(results.migrationPaybackMonths),
        },
      ]
    : [
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
      <div className="screen-only">
        <PageHeader
          eyebrow={`${contextName} ${isTcoModel ? "TCO" : "ROI"} Calculator`}
          title={calculator.name}
          description={calculator.businessOutcome}
          breadcrumbs={breadcrumbs}
          onNavigate={onNavigate}
        />

        <section className="panel intro-panel calculator-intro-panel">
          <div>
            <p className="section-kicker">How To Use This Calculator</p>
            <h2>
              {isTcoModel
                ? "Start with the example costs, then adjust the current-state, future-state, and migration inputs that matter most."
                : "Start with the example values, then adjust the few inputs that matter most to your situation."}
            </h2>
          </div>
          <p className="panel-copy">
            {isTcoModel
              ? "The page updates live as you edit the cost assumptions, so you can compare the current operating model against the future-state model in real time."
              : "The page updates live as you edit the assumptions, so you can quickly test different scenarios and see how the estimated impact changes."}
          </p>
        </section>

        <section className="guidance-grid calculator-guidance-grid">
          <article className="panel guidance-card guidance-card-primary">
            <p className="section-kicker">Start Here</p>
            <ul className="guidance-list">
              {calculator.sellerGuidance.askTheseFirst.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="panel guidance-card">
            <p className="section-kicker">Best Fit When</p>
            <p className="panel-copy">{calculator.sellerGuidance.bestFitWhen}</p>
          </article>
          <article className="panel guidance-card">
            <p className="section-kicker">Typical Buyer</p>
            <div className="buyer-tag-list">
              {typicalBuyerTags.map((tag) => (
                <span key={tag} className="buyer-tag">
                  {tag}
                </span>
              ))}
            </div>
            <p className="confidence-copy">
              Inputs are tagged as <strong>customer-provided</strong>,{" "}
              <strong>benchmark</strong>, or <strong>estimated</strong> so the
              team can see what should be validated before sharing the result.
            </p>
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
                <h2>{isTcoModel ? "Estimated cost comparison" : "Estimated business impact"}</h2>
              </header>
              <p className="panel-copy">
                {isTcoModel
                  ? "These estimates update as you adjust the current-state, future-state, and transition assumptions in the calculator."
                  : "These estimates update as you adjust the inputs and assumptions in the calculator."}
              </p>
              <div className="impact-highlight">
                <div>
                  <span className="metric-label">
                    {isTcoModel
                      ? "Estimated annual future-state cost"
                      : "Estimated annual economic impact"}
                  </span>
                  <strong>
                    {isTcoModel
                      ? formatCurrency(results.futureAnnualCost)
                      : formatCurrency(results.annualEconomicImpact)}
                  </strong>
                </div>
                <div>
                  <span className="metric-label">
                    {isTcoModel
                      ? "Estimated migration payback period"
                      : "Estimated payback period"}
                  </span>
                  <strong>
                    {isTcoModel
                      ? formatMonths(results.migrationPaybackMonths)
                      : formatMonths(results.paybackPeriodMonths)}
                  </strong>
                </div>
              </div>
            </section>
          </div>

          <aside className="panel summary-panel">
            <div className="summary-top">
              <p className="section-kicker">Live Summary</p>
              <h2>{isTcoModel ? "Estimated TCO comparison" : "Estimated business impact"}</h2>
              <p className="panel-copy">
                {isTcoModel
                  ? "Sample values are already loaded so the page is reviewable on first open. Adjust the assumptions during the session to show how the total cost picture changes."
                  : "Sample values are already loaded so the page is reviewable on first open. Adjust the assumptions during the session to show how the value story changes with the customer conversation."}
              </p>
              <div className="summary-actions">
                <button type="button" className="ghost-button" onClick={exportPdf}>
                  Export PDF
                </button>
                <button type="button" className="ghost-button" onClick={resetToDefaults}>
                  Reset to defaults
                </button>
              </div>
            </div>

            <div className="estimate-bridge">
              <p className="section-kicker">What This Estimates</p>
              <p className="panel-copy">
                {withDirectionalNote(calculator.sellerGuidance.whatThisEstimates)}
              </p>
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

            {howToRead ? (
              <div className="how-to-read-block">
                <div className="how-to-read-header">
                  <p className="section-kicker">How To Read This</p>
                  <p className="panel-copy">
                    Directional output for live customer conversations.
                  </p>
                </div>
                <div className="guidance-detail-grid">
                  <GuidanceDetail title="Top drivers" body={howToRead.topDrivers} />
                  <GuidanceDetail
                    title="Biggest assumptions"
                    body={howToRead.biggestAssumptions}
                  />
                  <GuidanceDetail title="Validate next" body={howToRead.validateNext} />
                </div>
              </div>
            ) : null}
          </aside>
        </section>
      </div>

      <section className="print-report">
        <header className="print-report-header">
          <div>
            <p className="section-kicker">{isTcoModel ? "TCO Summary" : "ROI Summary"}</p>
            <h1>{calculator.name}</h1>
            <p className="print-report-subtitle">{calculator.businessOutcome}</p>
          </div>
          <div className="print-meta-grid">
            <div>
              <span className="metric-label">Prepared</span>
              <strong>{preparedDate}</strong>
            </div>
            <div>
              <span className="metric-label">Context</span>
              <strong>{contextName}</strong>
            </div>
          </div>
        </header>

        <PrintSection title="What This Estimates">
          <p className="print-copy">
            {withDirectionalNote(calculator.sellerGuidance.whatThisEstimates)}
          </p>
        </PrintSection>

        <PrintSection title="Executive Summary">
          <div className="print-metric-grid">
            {outputCards.map((metric) => (
              <MetricCard key={metric.label} label={metric.label} value={metric.value} />
            ))}
            {results.extraOutputs.map((metric) => (
              <MetricCard key={metric.label} label={metric.label} value={metric.value} />
            ))}
          </div>
        </PrintSection>

        {howToRead ? (
          <PrintSection title="How To Read This">
            <div className="guidance-detail-grid">
              <GuidanceDetail title="Top drivers" body={howToRead.topDrivers} />
              <GuidanceDetail
                title="Biggest assumptions"
                body={howToRead.biggestAssumptions}
              />
              <GuidanceDetail title="Validate next" body={howToRead.validateNext} />
            </div>
          </PrintSection>
        ) : null}

        <PrintSection title="Assumption Snapshot">
          <div className="print-assumption-grid">
            {printSections.map((section) => (
              <article key={section.title} className="print-assumption-card">
                <p className="guidance-detail-title">{section.title}</p>
                <dl className="print-definition-list">
                  {section.fields.map((field) => (
                    <div key={field.key} className="print-definition-row">
                      <dt>{field.label}</dt>
                      <dd>{formatFieldValue(field, values[field.key])}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </PrintSection>

        <p className="print-footnote">
          This summary is directional and assumption-based. Validate customer-provided
          inputs and benchmark assumptions before external distribution.
        </p>
      </section>
    </>
  );
}

function ContentCalculatorPage({
  contextName,
  breadcrumbs,
  calculator,
  onNavigate,
}) {
  return (
    <>
      <PageHeader
        eyebrow={`${contextName} Calculator`}
        title={calculator.name}
        description={calculator.teaser}
        breadcrumbs={breadcrumbs}
        onNavigate={onNavigate}
      />

      <section className="hero-layout">
        <article className="panel calculator-intro">
          <p className="section-kicker">Path Context</p>
          <h2>{contextName}</h2>
          <p className="panel-copy">
            Return to the path landing page to open one of the live calculators
            included in this build.
          </p>
        </article>

        <aside className="panel workflow-sidebar">
          <p className="section-kicker">Calculator Status</p>
          <h2>This calculator is not available in the current review build.</h2>
          <p className="panel-copy">
            Return to the path landing page to open one of the live calculators
            that are included in this review experience.
          </p>
          {breadcrumbs.length > 1 ? (
            <button
              type="button"
              className="ghost-button"
              onClick={() => onNavigate(breadcrumbs[breadcrumbs.length - 2].path)}
            >
              Back to {breadcrumbs[breadcrumbs.length - 2].label}
            </button>
          ) : null}
        </aside>
      </section>
    </>
  );
}

export function CalculatorPage({
  contextName,
  breadcrumbs,
  calculator,
  onNavigate,
}) {
  if (calculator.calculatorType === "interactive") {
    return (
      <InteractiveCalculatorPage
        contextName={contextName}
        breadcrumbs={breadcrumbs}
        calculator={calculator}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <ContentCalculatorPage
      contextName={contextName}
      breadcrumbs={breadcrumbs}
      calculator={calculator}
      onNavigate={onNavigate}
    />
  );
}
