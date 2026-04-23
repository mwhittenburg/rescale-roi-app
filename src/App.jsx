import { useEffect, useMemo, useState } from "react";
import {
  BOTTLENECKS,
  BUSINESS_FUNCTIONS,
  COMPUTE_PROFILES,
  CONFIDENCE_LEVELS,
  ENVIRONMENTS,
  INITIAL_FORM,
  SCENARIO_TYPES,
  STEPS,
  URGENCY_LEVELS,
  WORKLOAD_CATEGORIES,
} from "./planner/defaults";
import { calculatePlanner, summaryText } from "./planner/calculations";

const STORAGE_KEY = "gcp-hpc-ai-workload-business-case-planner";

const workloadFieldHelp = {
  name: "Use the customer-friendly name of the workload so the summary can be reused in follow-up notes and account plans.",
  businessFunction: "Identify the business team that depends on this workload. It helps connect technical pain to an executive owner.",
  currentEnvironment: "Capture where the workload runs today. This frames migration complexity and where the current economics sit.",
  primaryBottleneck: "Choose the main thing blocking the workload today. This is the anchor for the business case.",
  computeProfile: "Describe the infrastructure shape the workload needs. This helps assess architecture fit rather than assuming generic compute.",
  urgency: "Use urgency to signal whether this is exploratory or attached to a real event such as a refresh, deadline, or executive priority.",
};

const currentStateHelp = {
  usersAffected: "Count the users or teams whose work is influenced by this workload. It helps frame business reach without assuming idle labor.",
  jobsPerMonth: "Estimate how many jobs or runs happen each month. This drives scale for queue, rerun, and throughput calculations.",
  campaignsPerYear: "Use campaigns or projects per year when the workload supports major design, discovery, or planning cycles.",
  averageRuntimeHours: "Average runtime per job is how long the workload runs once it starts. This helps estimate execution cost and architecture fit.",
  averageQueueDelayHours:
    "Average queue delay is how long work waits before it starts. Queue time does not mean scientists or engineers are unproductive. It creates decision latency, context switching, slower iteration, and delayed downstream decisions.",
  percentJobsAffected:
    "Estimate what share of jobs are meaningfully affected by queueing or capacity constraints. This helps avoid overstating the impact.",
  annualInfrastructureSpend: "Include current annual infrastructure spend if known. If not, leave it blank and the model will rely more on estimated workload execution cost.",
  annualSoftwareSpend: "Capture annual software or license spend when it materially shapes the economics of completed results.",
  utilizationPercent: "Current environment utilization helps identify whether the team is running hot, carrying excess headroom, or both.",
  refreshAmount: "If a hardware refresh is expected, enter the rough amount to test whether GCP could defer or avoid part of that investment.",
  refreshTimingMonths: "Use months until refresh to show whether this is a near-term event or a later planning input.",
};

const estimatedHelp = {
  costPerComputeHour: "Use a fully burdened estimate per core-hour or GPU-hour if available. This is directional, not a substitute for official cloud pricing.",
  annualSupportOverhead: "Add annual support, administration, or platform engineering effort required to keep the environment running.",
  facilitiesCost: "Include power, cooling, or facilities costs when the workload is tied to owned infrastructure.",
  delayedProjectDecisionCost: "Estimate the directional business value of reducing a materially delayed project or campaign decision. This is not assumed to be labor recovery.",
  rerunRatePercent: "Rerun rate measures the share of jobs repeated due to failures, environment issues, or reproducibility gaps.",
  workloadMovablePercent: "Estimate the realistic share of the workload that could move to GCP, considering data, licensing, security, and operating constraints.",
  laborBackedDecisionValue: "Optional override if the customer explicitly wants to use a labor-based assumption. Leave at zero to keep the default business-cycle framing.",
};

const assumptionsHelp = {
  refreshDeferredPercent: "Set the share of the planned refresh that could be deferred or avoided if the scenario proves out.",
  incrementalCapacityUnits: "Optional capacity unit estimate for burst or incremental demand that cannot be served well today.",
  capacityUnitCost: "Optional annual value per capacity unit if the team has a directional estimate of what extra capacity would cost.",
  visibilityValuePercent: "Use this to model how much of annual support overhead could improve through better cost attribution, visibility, and standardization.",
};

function App() {
  const [form, setForm] = useState(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return INITIAL_FORM;

    try {
      return { ...INITIAL_FORM, ...JSON.parse(saved) };
    } catch {
      return INITIAL_FORM;
    }
  });
  const [stepIndex, setStepIndex] = useState(0);
  const [copyState, setCopyState] = useState("Copy summary");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  const results = useMemo(() => calculatePlanner(form), [form]);
  const summary = useMemo(() => summaryText(form, results), [form, results]);

  function updateSection(section, key, value) {
    setForm((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: value,
      },
    }));
  }

  function resetPlanner() {
    setForm(INITIAL_FORM);
    setStepIndex(0);
    setCopyState("Copy summary");
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopyState("Copied");
      window.setTimeout(() => setCopyState("Copy summary"), 1600);
    } catch {
      setCopyState("Copy failed");
      window.setTimeout(() => setCopyState("Copy summary"), 1600);
    }
  }

  const activeStep = STEPS[stepIndex];

  return (
    <div className="planner-app">
      <header className="hero-shell">
        <div className="hero-copy">
          <span className="eyebrow">GCP HPC & AI Workload Business Case Planner</span>
          <h1>{activeStep.id === "landing" ? "Which workloads are worth moving, benchmarking, or holding?" : activeStep.title}</h1>
          <p className="hero-subtitle">
            Identify which compute-intensive workloads are worth evaluating on Google Cloud, what value levers matter, and what proof is needed before scaling.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => setStepIndex(1)}>
              Start with a workload
            </button>
            <button className="secondary-button" onClick={() => setStepIndex(4)}>
              Compare current state vs GCP scenario
            </button>
          </div>
        </div>
        <aside className="summary-panel">
          <div className="summary-topline">
            <span className="summary-label">Live recommendation</span>
            <strong>{results.recommendation.action}</strong>
          </div>
          <div className="summary-grid">
            <Metric label="Primary value driver" value={results.primaryValueDriver} />
            <Metric label="Annual value range" value={results.recommendation.annualValueRangeLabel} />
            <Metric label="Confidence" value={results.recommendation.confidence} />
            <Metric label="Constraints" value={results.constraints.join(", ")} />
          </div>
          <p className="summary-note">{results.recommendation.why}</p>
          <div className="summary-actions">
            <button className="tertiary-button" onClick={copySummary}>{copyState}</button>
            <button className="tertiary-button" onClick={() => window.print()}>Print view</button>
            <button className="ghost-button" onClick={resetPlanner}>Reset</button>
          </div>
        </aside>
      </header>

      <main className="workspace-shell">
        <nav className="stepper-card" aria-label="Planner steps">
          <div className="stepper-header">
            <span className="stepper-kicker">Start Here</span>
            <p>This tool frames a workload business case before deep pricing work begins.</p>
          </div>
          <div className="step-list">
            {STEPS.map((step, index) => (
              <button
                key={step.id}
                className={`step-pill ${index === stepIndex ? "active" : ""}`}
                onClick={() => setStepIndex(index)}
              >
                <span>{step.label}</span>
                <strong>{step.title}</strong>
              </button>
            ))}
          </div>
        </nav>

        <section className="page-card">
          {activeStep.id === "landing" && <LandingPage onJump={setStepIndex} />}
          {activeStep.id === "workload" && (
            <section className="page-section">
              <SectionHeader
                title="Workload profile"
                description="Start with a workload, identify who it matters to, and capture the constraint that brought the team here."
              />
              <div className="form-grid">
                <SelectField
                  label="Workload category"
                  value={form.workload.category}
                  options={WORKLOAD_CATEGORIES}
                  onChange={(value) => updateSection("workload", "category", value)}
                  help="Choose the closest workload type. Custom workload keeps the tool flexible when a named category does not fit."
                />
                <InputField
                  label="Workload name"
                  value={form.workload.name}
                  onChange={(value) => updateSection("workload", "name", value)}
                  help={workloadFieldHelp.name}
                />
                <SelectField
                  label="Business function"
                  value={form.workload.businessFunction}
                  options={BUSINESS_FUNCTIONS}
                  onChange={(value) => updateSection("workload", "businessFunction", value)}
                  help={workloadFieldHelp.businessFunction}
                />
                <SelectField
                  label="Current environment"
                  value={form.workload.currentEnvironment}
                  options={ENVIRONMENTS}
                  onChange={(value) => updateSection("workload", "currentEnvironment", value)}
                  help={workloadFieldHelp.currentEnvironment}
                />
                <SelectField
                  label="Primary bottleneck"
                  value={form.workload.primaryBottleneck}
                  options={BOTTLENECKS}
                  onChange={(value) => updateSection("workload", "primaryBottleneck", value)}
                  help={workloadFieldHelp.primaryBottleneck}
                />
                <SelectField
                  label="Compute profile"
                  value={form.workload.computeProfile}
                  options={COMPUTE_PROFILES}
                  onChange={(value) => updateSection("workload", "computeProfile", value)}
                  help={workloadFieldHelp.computeProfile}
                />
                <SelectField
                  label="Urgency"
                  value={form.workload.urgency}
                  options={URGENCY_LEVELS}
                  onChange={(value) => updateSection("workload", "urgency", value)}
                  help={workloadFieldHelp.urgency}
                />
              </div>
            </section>
          )}

          {activeStep.id === "current" && (
            <section className="page-section">
              <SectionHeader
                title="Current-state baseline"
                description="Capture the baseline in two tiers: known values first, then directional estimates where the team still needs validation."
              />
              <div className="split-panels">
                <div className="subsection-card">
                  <h3>Known</h3>
                  <div className="form-grid">
                    <NumberField label="Number of users or teams affected" value={form.currentState.usersAffected} onChange={(value) => updateSection("currentState", "usersAffected", value)} help={currentStateHelp.usersAffected} />
                    <NumberField label="Jobs per month" value={form.currentState.jobsPerMonth} onChange={(value) => updateSection("currentState", "jobsPerMonth", value)} help={currentStateHelp.jobsPerMonth} />
                    <NumberField label="Campaigns or projects per year" value={form.currentState.campaignsPerYear} onChange={(value) => updateSection("currentState", "campaignsPerYear", value)} help={currentStateHelp.campaignsPerYear} />
                    <NumberField label="Average runtime per job (hours)" value={form.currentState.averageRuntimeHours} onChange={(value) => updateSection("currentState", "averageRuntimeHours", value)} help={currentStateHelp.averageRuntimeHours} />
                    <NumberField label="Average queue delay before job starts (hours)" value={form.currentState.averageQueueDelayHours} onChange={(value) => updateSection("currentState", "averageQueueDelayHours", value)} help={currentStateHelp.averageQueueDelayHours} />
                    <PercentField label="Percent of jobs affected by queueing or constrained capacity" value={form.currentState.percentJobsAffected} onChange={(value) => updateSection("currentState", "percentJobsAffected", value)} help={currentStateHelp.percentJobsAffected} />
                    <CurrencyField label="Current annual infrastructure spend" value={form.currentState.annualInfrastructureSpend} onChange={(value) => updateSection("currentState", "annualInfrastructureSpend", value)} help={currentStateHelp.annualInfrastructureSpend} />
                    <CurrencyField label="Current annual software/license spend" value={form.currentState.annualSoftwareSpend} onChange={(value) => updateSection("currentState", "annualSoftwareSpend", value)} help={currentStateHelp.annualSoftwareSpend} />
                    <PercentField label="Current cluster or environment utilization" value={form.currentState.utilizationPercent} onChange={(value) => updateSection("currentState", "utilizationPercent", value)} help={currentStateHelp.utilizationPercent} />
                    <CurrencyField label="Upcoming hardware refresh amount" value={form.currentState.refreshAmount} onChange={(value) => updateSection("currentState", "refreshAmount", value)} help={currentStateHelp.refreshAmount} />
                    <NumberField label="Upcoming hardware refresh timing (months)" value={form.currentState.refreshTimingMonths} onChange={(value) => updateSection("currentState", "refreshTimingMonths", value)} help={currentStateHelp.refreshTimingMonths} />
                  </div>
                </div>
                <div className="subsection-card">
                  <h3>Estimated</h3>
                  <div className="form-grid">
                    <CurrencyField label="Fully burdened cost per core-hour or GPU-hour" value={form.estimates.costPerComputeHour} onChange={(value) => updateSection("estimates", "costPerComputeHour", value)} help={estimatedHelp.costPerComputeHour} />
                    <CurrencyField label="Annual support and admin overhead" value={form.estimates.annualSupportOverhead} onChange={(value) => updateSection("estimates", "annualSupportOverhead", value)} help={estimatedHelp.annualSupportOverhead} />
                    <CurrencyField label="Power, cooling, facilities estimate" value={form.estimates.facilitiesCost} onChange={(value) => updateSection("estimates", "facilitiesCost", value)} help={estimatedHelp.facilitiesCost} />
                    <CurrencyField label="Cost of delayed project decision" value={form.estimates.delayedProjectDecisionCost} onChange={(value) => updateSection("estimates", "delayedProjectDecisionCost", value)} help={estimatedHelp.delayedProjectDecisionCost} />
                    <PercentField label="Rerun rate" value={form.estimates.rerunRatePercent} onChange={(value) => updateSection("estimates", "rerunRatePercent", value)} help={estimatedHelp.rerunRatePercent} />
                    <PercentField label="Percent of workload that could reasonably move to GCP" value={form.estimates.workloadMovablePercent} onChange={(value) => updateSection("estimates", "workloadMovablePercent", value)} help={estimatedHelp.workloadMovablePercent} />
                  </div>
                  <details className="advanced-panel">
                    <summary>Advanced assumptions</summary>
                    <div className="form-grid">
                      <CurrencyField label="Optional labor-based decision value override" value={form.estimates.laborBackedDecisionValue} onChange={(value) => updateSection("estimates", "laborBackedDecisionValue", value)} help={estimatedHelp.laborBackedDecisionValue} />
                      <PercentField label="Percent of planned refresh deferred or avoided" value={form.assumptions.refreshDeferredPercent} onChange={(value) => updateSection("assumptions", "refreshDeferredPercent", value)} help={assumptionsHelp.refreshDeferredPercent} />
                      <NumberField label="Incremental capacity needed" value={form.assumptions.incrementalCapacityUnits} onChange={(value) => updateSection("assumptions", "incrementalCapacityUnits", value)} help={assumptionsHelp.incrementalCapacityUnits} />
                      <CurrencyField label="Estimated cost per capacity unit" value={form.assumptions.capacityUnitCost} onChange={(value) => updateSection("assumptions", "capacityUnitCost", value)} help={assumptionsHelp.capacityUnitCost} />
                      <PercentField label="Governance/visibility value percent" value={form.assumptions.visibilityValuePercent} onChange={(value) => updateSection("assumptions", "visibilityValuePercent", value)} help={assumptionsHelp.visibilityValuePercent} />
                    </div>
                  </details>
                </div>
              </div>
            </section>
          )}

          {activeStep.id === "constraints" && (
            <section className="page-section">
              <SectionHeader
                title="Business constraint diagnosis"
                description="The tool classifies the workload into one or more constraints so the sales motion is tied to the actual business issue."
              />
              <div className="constraint-grid">
                {[
                  ["Capacity-constrained", "High utilization, long queues, delayed projects, refresh pressure, or limited burst capacity."],
                  ["Architecture-constrained", "GPU or specialized infrastructure need, poor hardware match, long runtimes, or weak scaling efficiency."],
                  ["Governance-constrained", "Weak visibility, poor cost attribution, shadow IT, manual approvals, or inconsistent policy enforcement."],
                  ["Data/AI-constrained", "Outputs are hard to reuse, metadata is inconsistent, reproducibility is weak, or AI/ML readiness is limited."],
                  ["Economics unclear", "Current costs are murky, demand is uncertain, or benchmarking is still required."],
                ].map(([title, description]) => (
                  <article
                    key={title}
                    className={`constraint-card ${results.constraints.includes(title) ? "selected" : ""}`}
                  >
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <span>{results.constraints.includes(title) ? "Detected" : "Not primary"}</span>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeStep.id === "scenario" && (
            <section className="page-section">
              <SectionHeader
                title="GCP scenario builder"
                description="Model one GCP-oriented scenario and compare the directional improvement assumptions driving the business case."
              />
              <div className="scenario-grid">
                {SCENARIO_TYPES.map((option) => (
                  <button
                    key={option.id}
                    className={`scenario-card ${form.scenario.id === option.id ? "selected" : ""}`}
                    onClick={() => updateSection("scenario", "id", option.id)}
                  >
                    <strong>{option.name}</strong>
                    <span>{option.fit}</span>
                  </button>
                ))}
              </div>
              <div className="form-grid">
                <PercentField label="What percent of the workload could move to GCP?" value={form.scenario.workloadMovePercent} onChange={(value) => updateSection("scenario", "workloadMovePercent", value)} help="Model the share of this specific workload in the scenario, separate from the broader movable percentage in the baseline." />
                <PercentField label="Expected runtime improvement" value={form.scenario.runtimeImprovementPercent} onChange={(value) => updateSection("scenario", "runtimeImprovementPercent", value)} help="Use this when better infrastructure fit could shorten job execution time." />
                <PercentField label="Expected queue delay reduction" value={form.scenario.queueReductionPercent} onChange={(value) => updateSection("scenario", "queueReductionPercent", value)} help="Estimate how much decision latency from waiting could shrink in the GCP scenario." />
                <PercentField label="Expected rerun reduction" value={form.scenario.rerunReductionPercent} onChange={(value) => updateSection("scenario", "rerunReductionPercent", value)} help="Use this when better reproducibility, orchestration, or environment fit could reduce repeated jobs." />
                <PercentField label="Expected utilization improvement" value={form.scenario.utilizationImprovementPercent} onChange={(value) => updateSection("scenario", "utilizationImprovementPercent", value)} help="Capture how much better the workload could align to available infrastructure capacity." />
                <PercentField label="Expected governance or visibility improvement" value={form.scenario.governanceImprovementPercent} onChange={(value) => updateSection("scenario", "governanceImprovementPercent", value)} help="Use this for cost attribution, standardization, policy, and operational visibility improvements." />
                <SelectField label="Confidence level" value={form.scenario.confidence} options={CONFIDENCE_LEVELS} onChange={(value) => updateSection("scenario", "confidence", value)} help="Confidence controls whether the value case is shown more tightly or as a wider directional range." />
                <TextAreaField label="Scenario notes" value={form.scenario.notes} onChange={(value) => updateSection("scenario", "notes", value)} help="Capture caveats, licensing notes, or customer comments that will shape the next step." />
              </div>
            </section>
          )}

          {activeStep.id === "value" && (
            <section className="page-section">
              <SectionHeader
                title="Value model"
                description="These are directional value buckets, not official cloud price estimates. Where inputs are weak, the tool keeps the output directional."
              />
              <div className="value-grid">
                <ValueBucket
                  title="Capacity economics"
                  range={results.ranges.capacity}
                  details={[
                    "Avoided or deferred hardware refresh",
                    "Reduced stranded capacity risk",
                    "Value of burst capacity",
                    "Reduction in overprovisioning",
                  ]}
                />
                <ValueBucket
                  title="Decision latency reduction"
                  range={results.ranges.decisionLatency}
                  details={[
                    "Reduction in queue-driven delays",
                    "Faster campaign or project cycles",
                    "More iterations per month or quarter",
                    "Earlier downstream decisions",
                  ]}
                />
                <ValueBucket
                  title="Cost per completed result"
                  range={results.ranges.costPerResult}
                  details={[
                    "Current vs directional GCP cost per successful result",
                    "Impact of architecture fit",
                    "Impact of lower rerun rate",
                    "Impact of better utilization",
                  ]}
                />
                <ValueBucket
                  title="Governance and AI/data readiness"
                  range={results.ranges.governance}
                  details={[
                    "Better cost attribution",
                    "Improved workload visibility",
                    "Reduced manual operational burden",
                    "Better metadata capture and reuse",
                  ]}
                />
              </div>
              <div className="formula-card">
                <h3>Transparent formulas</h3>
                <div className="formula-list">
                  {results.formulas.map((item) => (
                    <div key={item.label} className="formula-row">
                      <div>
                        <strong>{item.label}</strong>
                        <code>{item.formula}</code>
                      </div>
                      <span>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeStep.id === "recommendation" && (
            <section className="page-section">
              <SectionHeader
                title="Recommendation engine"
                description="The recommendation reflects the current constraint, materiality of value, scenario confidence, and validation risk."
              />
              <div className="recommendation-banner">
                <div>
                  <span className="recommendation-tag">{results.recommendation.action}</span>
                  <h2>{results.recommendation.why}</h2>
                </div>
                <div className="recommendation-metrics">
                  <Metric label="Primary value driver" value={results.primaryValueDriver} />
                  <Metric label="Estimated annual value range" value={results.recommendation.annualValueRangeLabel} />
                  <Metric label="Confidence level" value={results.recommendation.confidence} />
                </div>
              </div>
              <div className="three-column">
                <InfoList title="Top assumptions" items={results.assumptions} />
                <InfoList title="Top risks" items={results.risks} />
                <InfoList title="Proof required" items={results.proofRequired} />
              </div>
              <div className="callout-card">
                <h3>Suggested next step</h3>
                <p>{results.recommendation.nextStep}</p>
              </div>
            </section>
          )}

          {activeStep.id === "summary" && (
            <section className="page-section print-surface">
              <SectionHeader
                title="Workload Business Case Summary"
                description="Use this output in an email, account plan, or customer follow-up. It is intentionally concise and business-oriented."
              />
              <div className="summary-output">
                <SummaryRow title="1. Workload evaluated" body={`${form.workload.name} (${form.workload.category})`} />
                <SummaryRow title="2. Current constraint" body={results.constraints.join(", ")} />
                <SummaryRow title="3. Business impact hypothesis" body={`The likely value is not simply lower infrastructure cost. The stronger case is ${results.primaryValueDriver.toLowerCase()} and testing whether GCP can improve the business outcome for this workload.`} />
                <SummaryRow title="4. GCP scenario considered" body={`${SCENARIO_TYPES.find((item) => item.id === form.scenario.id)?.name || form.scenario.id} with ${form.scenario.workloadMovePercent}% of workload modeled for GCP.`} />
                <SummaryRow title="5. Estimated annual value range" body={results.recommendation.annualValueRangeLabel} />
                <SummaryRow title="6. Recommendation" body={results.recommendation.action} />
                <SummaryRow title="7. Proof required" body={results.proofRequired.join(" ")} />
                <SummaryRow title="8. Suggested next step" body={results.recommendation.nextStep} />
                <div className="copy-box">
                  <textarea value={summary} readOnly />
                </div>
              </div>
            </section>
          )}

          {activeStep.id === "assumptions" && (
            <section className="page-section">
              <SectionHeader
                title="Assumptions & disclaimer"
                description="Keep assumptions visible so the team knows what was known, what was estimated, and what still needs validation."
              />
              <div className="assumption-stack">
                <div className="disclaimer-card">
                  <strong>Required disclaimer</strong>
                  <p>
                    This tool provides directional workload business-case estimates. It is not an official Google Cloud pricing calculator. Final infrastructure costs should be validated using the official Google Cloud Pricing Calculator, current customer pricing, benchmark results, workload-specific architecture review, and account-specific commercial terms.
                  </p>
                </div>
                <div className="three-column">
                  <InfoList
                    title="Known inputs"
                    items={[
                      `${form.currentState.jobsPerMonth} jobs per month`,
                      `${form.currentState.averageRuntimeHours} average runtime hours`,
                      `${form.currentState.averageQueueDelayHours} queue delay hours`,
                      `${form.currentState.percentJobsAffected}% of jobs affected by queueing`,
                    ]}
                  />
                  <InfoList
                    title="Estimated assumptions"
                    items={[
                      `$${Number(form.estimates.costPerComputeHour || 0).toLocaleString()} burdened compute cost`,
                      `${form.estimates.rerunRatePercent}% rerun rate`,
                      `${form.estimates.workloadMovablePercent}% workload movable`,
                      `${form.scenario.confidence} scenario confidence`,
                    ]}
                  />
                  <InfoList title="Items requiring validation" items={results.proofRequired} />
                </div>
              </div>
            </section>
          )}

          <footer className="page-footer">
            <button className="secondary-button" disabled={stepIndex === 0} onClick={() => setStepIndex((index) => Math.max(0, index - 1))}>
              Back
            </button>
            <button className="primary-button" disabled={stepIndex === STEPS.length - 1} onClick={() => setStepIndex((index) => Math.min(STEPS.length - 1, index + 1))}>
              Next
            </button>
          </footer>
        </section>
      </main>
    </div>
  );
}

function LandingPage({ onJump }) {
  return (
    <section className="page-section">
      <SectionHeader
        title="This is a workload decision calculator, not a cloud pricing calculator"
        description="Use it to identify where GCP could change the business outcome through capacity, speed, architecture fit, governance, avoided on-prem investment, or AI/data readiness."
      />
      <div className="value-card-grid">
        <ValueCard title="Capacity" body="Avoid or defer on-prem expansion and reduce stranded capacity risk." />
        <ValueCard title="Speed" body="Reduce decision latency caused by queueing, constrained capacity, or slow iteration cycles." />
        <ValueCard title="Architecture fit" body="Match workloads to better CPU, GPU, memory, storage, or network configurations." />
        <ValueCard title="Governance" body="Improve visibility, control, cost attribution, and workload standardization." />
      </div>
      <div className="callout-card">
        <h3>What the seller and customer should leave with</h3>
        <p>
          Which workloads are worth evaluating on GCP, what current constraint matters most, which assumptions drive the value case, what must be benchmarked or validated, and whether the next step should be Move, Benchmark, or Hold.
        </p>
        <div className="hero-actions">
          <button className="primary-button" onClick={() => onJump(1)}>Start with a workload</button>
          <button className="secondary-button" onClick={() => onJump(4)}>Compare current state vs GCP scenario</button>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ title, description }) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function FieldShell({ label, help, children }) {
  return (
    <label className="field-shell">
      <span className="field-label">{label}</span>
      {children}
      <span className="field-help">{help}</span>
    </label>
  );
}

function InputField({ label, value, onChange, help }) {
  return (
    <FieldShell label={label} help={help}>
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </FieldShell>
  );
}

function TextAreaField({ label, value, onChange, help }) {
  return (
    <FieldShell label={label} help={help}>
      <textarea rows="4" value={value} onChange={(event) => onChange(event.target.value)} />
    </FieldShell>
  );
}

function NumberField({ label, value, onChange, help }) {
  return (
    <FieldShell label={label} help={help}>
      <input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </FieldShell>
  );
}

function CurrencyField({ label, value, onChange, help }) {
  return (
    <FieldShell label={label} help={help}>
      <input type="number" min="0" value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </FieldShell>
  );
}

function PercentField({ label, value, onChange, help }) {
  return (
    <FieldShell label={label} help={help}>
      <div className="percent-input">
        <input type="number" min="0" max="100" value={value} onChange={(event) => onChange(Number(event.target.value))} />
        <span>%</span>
      </div>
    </FieldShell>
  );
}

function SelectField({ label, value, options, onChange, help }) {
  return (
    <FieldShell label={label} help={help}>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </FieldShell>
  );
}

function ValueCard({ title, body }) {
  return (
    <article className="value-card">
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  );
}

function ValueBucket({ title, range, details }) {
  const value = range.low <= 0 && range.high <= 0
    ? "Not quantified yet"
    : `$${Math.round(range.low).toLocaleString()} - $${Math.round(range.high).toLocaleString()}`;

  return (
    <article className="bucket-card">
      <div className="bucket-topline">
        <h3>{title}</h3>
        <strong>{value}</strong>
      </div>
      <ul>
        {details.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function InfoList({ title, items }) {
  return (
    <section className="list-card">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function SummaryRow({ title, body }) {
  return (
    <div className="summary-row">
      <strong>{title}</strong>
      <p>{body}</p>
    </div>
  );
}

export default App;
