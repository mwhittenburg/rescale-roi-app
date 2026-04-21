import { useEffect, useId, useMemo, useState } from "react";
import { FieldHelpTooltip } from "../components/FieldHelpTooltip";
import { PageHeader } from "../components/PageHeader";

const defaultSessionContext = {
  customerName: "",
  accountName: "",
  opportunityName: "",
  preparedBy: "",
  notes: "",
};

const workspaceHelp = {
  scenarioName: {
    what:
      "Represents the name of the version of assumptions you want to save for this calculator.",
    include:
      "A clear label such as Customer current state, Rescale benchmark, or Stretch case.",
    exclude:
      "Generic names that do not tell you which version of the story you are reopening later.",
    example: "Customer current state baseline.",
  },
  savedScenarios: {
    what:
      "Represents the saved versions of this calculator for the current browser and calculator only.",
    include:
      "Named views you want to compare, revisit, or reuse in follow-up meetings.",
    exclude:
      "Assumptions from other calculators or one-off drafts you do not want to keep.",
    example: "Customer baseline and Rescale benchmark.",
  },
  pdfMode: {
    what:
      "Controls whether the exported PDF is a customer-ready summary or an internal working version.",
    include:
      "Customer-ready when you want a cleaner external summary, and Internal working when you still want discovery prompts or notes visible.",
    exclude:
      "Using the customer-ready version before the assumptions are validated, or using the internal version when you plan to send it directly to the customer.",
    example: "Use Customer-ready for a recap email, Internal working for account-team review.",
  },
};

function buildWorkspaceStorageKey(calculatorId) {
  return `rescale:calculator-workspace:${calculatorId}`;
}

function readStoredWorkspace(calculatorId) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(
      buildWorkspaceStorageKey(calculatorId),
    );

    return rawValue ? JSON.parse(rawValue) : null;
  } catch {
    return null;
  }
}

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

function formatDirectionalCurrency(value) {
  const absValue = formatCompactCurrency(Math.abs(value));

  if (value > 0) {
    return `${absValue} better`;
  }

  if (value < 0) {
    return `${absValue} worse`;
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

function buildRecommendedNextSteps({
  calculator,
  isTcoModel,
  pdfMode,
  savedScenarioCount,
}) {
  return [
    {
      title: "Validate baseline",
      body:
        calculator.sellerGuidance.howToRead?.validateNext ??
        (isTcoModel
          ? "Confirm the current-state cost lines and workload split with the infrastructure owner."
          : "Confirm the current workflow volume, delay baseline, and labor effort with the workflow owner."),
    },
    {
      title: "Compare scenarios",
      body:
        savedScenarioCount >= 2
          ? "Compare the customer baseline against a benchmark or stretch scenario before sharing the result."
          : "Save at least two named scenarios so you can compare the customer baseline against a benchmark or stretch case.",
    },
    {
      title: "Share next",
      body:
        pdfMode === "customer"
          ? "Use the customer-ready PDF once the baseline is confirmed and any benchmark assumptions have been pressure-tested."
          : "Use the internal PDF while discovery notes, confidence tags, or follow-up validation items still need review.",
    },
  ];
}

const ROI_MODE_OPTIONS = [
  {
    id: "guided",
    step: "Step 1",
    label: "Guided Estimate",
    description: "Fast first-pass estimate with the fewest inputs.",
  },
  {
    id: "finance",
    step: "Step 2",
    label: "Finance Review",
    description: "Inspect assumptions, formulas, and scenario bands.",
  },
  {
    id: "executive",
    step: "Step 3",
    label: "Executive Output",
    description: "Turn the result into a concise business case.",
  },
];

const ROI_VALUE_CASES = [
  {
    id: "engineering-throughput",
    label: "Engineering throughput",
    description: "Faster cycles, more studies, and more work completed with the same team.",
  },
  {
    id: "it-cost-utilization",
    label: "IT cost and utilization",
    description: "Better compute efficiency, delivered capacity, and workload placement.",
  },
  {
    id: "software-delivery-support",
    label: "Software delivery and support",
    description: "Less setup friction, fewer failed runs, and lower support drag.",
  },
  {
    id: "data-reuse-repeatability",
    label: "Data reuse and repeatability",
    description: "Fewer reruns, less rework, and more standardized execution.",
  },
  {
    id: "ai-physics-runtime",
    label: "AI physics / reduced runtime",
    description: "Directional gains from shorter runtimes and more scenarios evaluated.",
  },
];

const ROI_SCENARIO_OPTIONS = [
  { id: "low", label: "Low", multiplier: 0.7 },
  { id: "expected", label: "Expected", multiplier: 1 },
  { id: "high", label: "High", multiplier: 1.2 },
];

const EXECUTIVE_VIEW_OPTIONS = [
  { id: "seller", label: "Seller Summary" },
  { id: "finance", label: "Finance Appendix" },
  { id: "executive", label: "Executive Summary" },
];

const CONFIDENCE_SCORE_BY_KEY = {
  "customer-provided": 0.9,
  benchmark: 0.65,
  estimated: 0.45,
};

function formatConfidence(score) {
  if (score >= 0.78) {
    return "High";
  }

  if (score >= 0.58) {
    return "Moderate";
  }

  return "Low";
}

function confidenceClassName(score) {
  if (score >= 0.78) {
    return "high";
  }

  if (score >= 0.58) {
    return "moderate";
  }

  return "low";
}

function getFieldByKeyMap(calculator) {
  return Object.fromEntries(
    calculator.sections.flatMap((section) =>
      section.fields.map((field) => [field.key, field]),
    ),
  );
}

function getFieldLabelScore(field, valueCaseId) {
  const label = field.label.toLowerCase();
  const key = field.key.toLowerCase();
  const haystack = `${label} ${key}`;

  const scoreSets = {
    "engineering-throughput": [
      [/per year|campaigns|studies|programs|projects|trade studies/, 4],
      [/turnaround|cycle time|queue|delay|runtime/, 4],
      [/engineer|hours/, 3],
      [/hourly cost|platform investment/, 2],
    ],
    "it-cost-utilization": [
      [/compute cost|utilization|core|capacity|infrastructure/, 4],
      [/admin|support|environment/, 3],
      [/hourly cost|platform investment/, 2],
    ],
    "software-delivery-support": [
      [/queue|delay|runtime|environment|support|setup/, 4],
      [/engineer|hours/, 3],
      [/platform investment|hourly cost/, 2],
    ],
    "data-reuse-repeatability": [
      [/prototype|physical|test|validation|experiment/, 4],
      [/redesign|rework|rerun|repeat/, 4],
      [/compute cost|engineer/, 2],
    ],
    "ai-physics-runtime": [
      [/runtime|turnaround|queue|delay|simulation|compute/, 4],
      [/scenarios|iterations|runs/, 3],
      [/platform investment|hourly cost/, 2],
    ],
  };

  const rules = scoreSets[valueCaseId] ?? [];
  const score = rules.reduce(
    (total, [pattern, weight]) => total + (pattern.test(haystack) ? weight : 0),
    0,
  );

  if (field.advanced) {
    return score - 1;
  }

  if (field.confidenceTag?.key === "customer-provided") {
    return score + 1;
  }

  return score;
}

function pickGuidedFields(calculator, valueCaseId) {
  const allFields = calculator.sections.flatMap((section) =>
    section.fields.map((field) => ({
      ...field,
      sectionKey: section.key,
      sectionTitle: section.title,
    })),
  );

  const ranked = [...allFields]
    .map((field) => ({
      field,
      score: getFieldLabelScore(field, valueCaseId),
    }))
    .sort((left, right) => right.score - left.score);

  const chosen = [];
  const chosenKeys = new Set();

  for (const entry of ranked) {
    if (chosen.length >= 7) {
      break;
    }

    if (entry.score <= 0) {
      continue;
    }

    if (!chosenKeys.has(entry.field.key)) {
      chosen.push(entry.field);
      chosenKeys.add(entry.field.key);
    }
  }

  for (const field of allFields) {
    if (chosen.length >= 7) {
      break;
    }

    if (!field.advanced && !chosenKeys.has(field.key)) {
      chosen.push(field);
      chosenKeys.add(field.key);
    }
  }

  return chosen.slice(0, 7);
}

function averageConfidenceScore(fields) {
  if (fields.length === 0) {
    return 0.55;
  }

  return (
    fields.reduce(
      (total, field) =>
        total + (CONFIDENCE_SCORE_BY_KEY[field.confidenceTag?.key] ?? 0.5),
      0,
    ) / fields.length
  );
}

function findFirstField(fields, pattern) {
  return fields.find((field) => pattern.test(field.label) || pattern.test(field.key));
}

function annualMultiplierForField(field, values, baseVolumeField, nestedVolumeField) {
  if (!field || !baseVolumeField) {
    return 0;
  }

  const label = field.label.toLowerCase();
  const baseVolume = Number(values[baseVolumeField.key] ?? 0);
  const nestedVolume = nestedVolumeField
    ? Number(values[nestedVolumeField.key] ?? 1)
    : 1;

  if (/per iteration|per run|per simulation|per scenario|per configuration/.test(label)) {
    return baseVolume * nestedVolume;
  }

  return baseVolume;
}

function buildRoiValueCategories(calculator, values, results) {
  const allFields = calculator.sections.flatMap((section) => section.fields);
  const fieldMap = getFieldByKeyMap(calculator);
  const baseVolumeField = allFields.find((field) => /per year/.test(field.label));
  const nestedVolumeField = allFields.find(
    (field) =>
      /(iterations|runs|simulations|scenarios|configurations) per/.test(field.label) &&
      !/hours|cost|days/.test(field.label),
  );
  const categories = [];

  const engineerRateField = findFirstField(allFields, /engineer hourly|hourly cost/);
  if (results.annualHoursSaved > 0 && engineerRateField) {
    const inputs = [engineerRateField];
    const value = results.annualHoursSaved * Number(values[engineerRateField.key] ?? 0);
    categories.push({
      id: "engineering-time",
      title: "Engineering time recovered",
      shortLabel: "Engineering time",
      value,
      formula: "Annual hours saved × burdened labor rate",
      sourceFields: inputs,
      confidenceScore: averageConfidenceScore(inputs),
    });
  }

  const scientistTouchFactorField = fieldMap.scientistTouchFactor;
  const laborRecoveryFactorField = fieldMap.laborRecoveryFactor;
  if (
    results.recoveredLaborValue > 0 &&
    engineerRateField &&
    scientistTouchFactorField &&
    laborRecoveryFactorField
  ) {
    const inputs = [engineerRateField, scientistTouchFactorField, laborRecoveryFactorField];
    categories.push({
      id: "queue-friction",
      title: "Recovered scientist time",
      shortLabel: "Recovered scientist time",
      value: results.recoveredLaborValue,
      formula:
        "Queue days reduced × 8 hours × scientist touch factor × labor recovery factor × burdened labor rate",
      sourceFields: inputs,
      confidenceScore: averageConfidenceScore(inputs),
    });
  }

  const computeCostField = findFirstField(allFields, /compute cost/);
  const computeReductionField = findFirstField(allFields, /compute.*reduction|compute efficiency/);
  if (computeCostField && computeReductionField && baseVolumeField) {
    const annualUnits = annualMultiplierForField(
      computeCostField,
      values,
      baseVolumeField,
      nestedVolumeField,
    );
    const value =
      annualUnits *
      Number(values[computeCostField.key] ?? 0) *
      Number(values[computeReductionField.key] ?? 0);
    categories.push({
      id: "compute-cost",
      title: "Compute cost avoided",
      shortLabel: "Compute cost",
      value,
      formula: `${baseVolumeField.label} × ${computeCostField.label} × ${computeReductionField.label}`,
      sourceFields: [baseVolumeField, computeCostField, computeReductionField].filter(Boolean),
      confidenceScore: averageConfidenceScore(
        [baseVolumeField, computeCostField, computeReductionField].filter(Boolean),
      ),
    });
  }

  const physicalCostFields = allFields.filter((field) =>
    /(physical|prototype|wind tunnel|validation test|experiment|trial)/i.test(
      field.label,
    ),
  );
  const physicalReductionField = findFirstField(
    allFields,
    /physical test reduction|prototype reduction|wind tunnel reduction|test reduction/,
  );
  for (const field of physicalCostFields) {
    if (!physicalReductionField || !baseVolumeField) {
      continue;
    }

    const annualUnits = annualMultiplierForField(
      field,
      values,
      baseVolumeField,
      nestedVolumeField,
    );
    const value =
      annualUnits *
      Number(values[field.key] ?? 0) *
      Number(values[physicalReductionField.key] ?? 0);
    categories.push({
      id: `physical-${field.key}`,
      title: "Rerun / physical testing avoided",
      shortLabel: "Physical testing",
      value,
      formula: `${baseVolumeField.label} × ${field.label} × ${physicalReductionField.label}`,
      sourceFields: [baseVolumeField, field, physicalReductionField].filter(Boolean),
      confidenceScore: averageConfidenceScore(
        [baseVolumeField, field, physicalReductionField].filter(Boolean),
      ),
    });
  }

  const reworkCostFields = allFields.filter((field) =>
    /(redesign|rework|late-stage change|cooling redesign)/i.test(field.label),
  );
  for (const field of reworkCostFields) {
    const root = field.key.replace(/Cost$/, "").replace(/Sensitivity/, "");
    const reductionField =
      fieldMap[`${root}ReductionPct`] ??
      allFields.find(
        (candidate) =>
          candidate.kind === "percent" &&
          new RegExp(root.replace(/[A-Z]/g, "")).test(
            candidate.key.replace(/[A-Z]/g, ""),
          ),
      );

    if (!reductionField || !baseVolumeField) {
      continue;
    }

    const annualUnits = annualMultiplierForField(
      field,
      values,
      baseVolumeField,
      nestedVolumeField,
    );
    const value =
      annualUnits *
      Number(values[field.key] ?? 0) *
      Number(values[reductionField.key] ?? 0);
    categories.push({
      id: `rework-${field.key}`,
      title: "Rerun / rework cost avoided",
      shortLabel: "Rerun / rework",
      value,
      formula: `${baseVolumeField.label} × ${field.label} × ${reductionField.label}`,
      sourceFields: [baseVolumeField, field, reductionField].filter(Boolean),
      confidenceScore: averageConfidenceScore(
        [baseVolumeField, field, reductionField].filter(Boolean),
      ),
    });
  }

  const valuePerDayField = findFirstField(allFields, /value per.*day|cost of delayed/);
  const delayReductionField = findFirstField(
    allFields,
    /queue reduction|delay reduction|turnaround improvement/,
  );
  if (
    valuePerDayField &&
    delayReductionField &&
    baseVolumeField &&
    results.cycleTimeReduction > 0
  ) {
    const annualUnits = annualMultiplierForField(
      valuePerDayField,
      values,
      baseVolumeField,
      nestedVolumeField,
    );
    const value =
      /cost of delayed/i.test(valuePerDayField.label)
        ? annualUnits *
          Number(values[valuePerDayField.key] ?? 0) *
          Number(values[delayReductionField.key] ?? 0)
        : annualUnits *
          results.cycleTimeReduction *
          Number(values[valuePerDayField.key] ?? 0);
    categories.push({
      id: "queue-delay",
      title: "Queue delay and cycle-time value",
      shortLabel: "Queue / cycle",
      value,
      formula: /cost of delayed/i.test(valuePerDayField.label)
        ? `${baseVolumeField.label} × ${valuePerDayField.label} × ${delayReductionField.label}`
        : `${baseVolumeField.label} × cycle-time reduction × ${valuePerDayField.label}`,
      sourceFields: [baseVolumeField, valuePerDayField, delayReductionField].filter(Boolean),
      confidenceScore: averageConfidenceScore(
        [baseVolumeField, valuePerDayField, delayReductionField].filter(Boolean),
      ),
    });
  }

  const categoryTotal = categories.reduce((total, category) => total + category.value, 0);
  const remainder = Number(results.annualEconomicImpact ?? 0) - categoryTotal;

  if (remainder > 1000) {
    categories.push({
      id: "other",
      title: "Other modeled impact",
      shortLabel: "Other impact",
      value: remainder,
      formula: "Remaining modeled value not broken out separately",
      sourceFields: [],
      confidenceScore: 0.5,
    });
  }

  return categories
    .filter((category, index, list) => {
      if (category.value <= 0) {
        return false;
      }

      if (category.id.startsWith("physical-")) {
        return (
          index === list.findIndex((entry) => entry.shortLabel === category.shortLabel)
        );
      }

      return true;
    })
    .sort((left, right) => right.value - left.value);
}

function applyRoiScenario(results, multiplier, realizationFactor) {
  const valueMultiplier = multiplier * realizationFactor;
  const annualEconomicImpact = (results.annualEconomicImpact ?? 0) * valueMultiplier;
  const annualHoursSaved = (results.annualHoursSaved ?? 0) * valueMultiplier;
  const cycleTimeReduction = (results.cycleTimeReduction ?? 0) * multiplier;
  const capacityUnlocked = (results.capacityUnlocked ?? 0) * multiplier;
  const queueDaysReduced = (results.queueDaysReduced ?? 0) * multiplier;
  const recoveredScientistHours =
    (results.recoveredScientistHours ?? 0) * valueMultiplier;
  const recoveredLaborValue = (results.recoveredLaborValue ?? 0) * valueMultiplier;
  const throughputPotentialCampaigns =
    (results.throughputPotentialCampaigns ?? 0) * multiplier;
  const annualInvestment = results.annualInvestment ?? 0;
  const paybackPeriodMonths =
    annualEconomicImpact > 0 && annualInvestment > 0
      ? (annualInvestment / annualEconomicImpact) * 12
      : 0;
  const roiPercent =
    annualInvestment > 0
      ? ((annualEconomicImpact - annualInvestment) / annualInvestment) * 100
      : 0;

  return {
    ...results,
    annualEconomicImpact,
    annualHoursSaved,
    cycleTimeReduction,
    queueDaysReduced,
    recoveredScientistHours,
    recoveredLaborValue,
    throughputPotentialCampaigns,
    capacityUnlocked,
    paybackPeriodMonths,
    roiPercent,
  };
}

function describeImprovementMechanism(valueCaseId) {
  const content = {
    "engineering-throughput":
      "Queueing, turnaround delay, and environment friction are reduced so the same team can complete more decision-ready work.",
    "it-cost-utilization":
      "Better workload placement, delivered compute efficiency, and less stranded capacity improve throughput per dollar.",
    "software-delivery-support":
      "Standardized execution reduces setup effort, failed runs, and support drag around every project or job.",
    "data-reuse-repeatability":
      "More repeatable workflows reduce avoidable reruns, physical loops, and rework late in the cycle.",
    "ai-physics-runtime":
      "Shorter runtimes and faster iteration increase scenario throughput while keeping any hard-savings claims directional.",
  };

  return content[valueCaseId] ?? content["engineering-throughput"];
}

function buildWhatWouldNeedToBeTrue(valueCaseId, calculator, topCategory) {
  const baseItems = {
    "engineering-throughput": [
      "Queue delay or turnaround friction is materially slowing the team today.",
      "The team would use faster cycles to complete more meaningful work, not just finish sooner.",
      "The loaded labor rate is directionally representative of the team doing the work.",
    ],
    "it-cost-utilization": [
      "Delivered compute efficiency is meaningfully below target today.",
      "Workloads can be placed on the target environment without creating new bottlenecks.",
      "Modeled utilization and platform assumptions reflect how the environment actually operates.",
    ],
    "software-delivery-support": [
      "Environment or workflow setup is creating real support drag today.",
      "Standardized execution would materially reduce failed runs or manual intervention.",
      "Support effort can be repurposed rather than simply displaced on paper.",
    ],
    "data-reuse-repeatability": [
      "The current process is creating avoidable reruns, rework, or physical loops.",
      "Teams will actually adopt the standardized workflow and reuse the resulting assets.",
      "The modeled reduction in rework is reasonable for the current workflow maturity.",
    ],
    "ai-physics-runtime": [
      "Runtime reduction would translate into faster decisions or more scenarios evaluated.",
      "The modeled gains are benchmark-based and should stay directional until evidence is validated.",
      "The workload mix is appropriate for the target acceleration approach.",
    ],
  };

  const items = [...(baseItems[valueCaseId] ?? baseItems["engineering-throughput"])];

  if (topCategory) {
    items.unshift(`${topCategory.title} is a real and observable driver in the current workflow.`);
  }

  if (calculator.sellerGuidance?.howToRead?.validateNext) {
    items.push(calculator.sellerGuidance.howToRead.validateNext);
  }

  return items.slice(0, 4);
}

function buildProgressSignal(mode) {
  if (mode === "guided") {
    return "Start with a directional estimate in under 3 minutes.";
  }

  if (mode === "finance") {
    return "Inspect formulas, assumptions, and scenario bands before socializing the model.";
  }

  return "Use the result as a concise business case for leadership review.";
}

function SummarySignal({ label, value, tone = "default" }) {
  return (
    <article className={`summary-signal summary-signal-${tone}`}>
      <span className="metric-label">{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function GuidedFieldInput({ field, value, onChange }) {
  const inputId = useId();
  const isPercent = field.kind === "percent";
  const displayValue = isPercent ? Number(value) * 100 : Number(value);
  const min = isPercent ? (field.min ?? 0) * 100 : field.min ?? 0;
  const derivedMax = isPercent
    ? (field.max ?? 0.95) * 100
    : Number.isFinite(field.max)
      ? field.max
      : Math.max((field.defaultValue ?? 1) * 2.5, (field.defaultValue ?? 1) + 10);
  const step = isPercent ? (field.step ?? 0.01) * 100 : field.step ?? 1;

  return (
    <div className="field-card guided-field-card">
      <div className="field-label-row">
        <label className="field-label-group" htmlFor={inputId}>
          <span className="field-label">{field.label}</span>
          <FieldHelpTooltip label={field.label} help={field.helpTooltip} />
        </label>
        <span className={`confidence-tag ${field.confidenceTag.key}`}>
          {field.confidenceTag.label}
        </span>
      </div>
      <div className="guided-slider-shell">
        <input
          id={inputId}
          type="range"
          min={min}
          max={derivedMax}
          step={step}
          value={displayValue}
          onChange={(event) => {
            const nextValue = Number(event.target.value);
            onChange(field, isPercent ? nextValue / 100 : nextValue);
          }}
        />
        <div className="guided-slider-value">
          <strong>{formatFieldValue(field, value)}</strong>
        </div>
      </div>
      <div className="guided-slider-meta">
        <span>{formatFieldValue(field, isPercent ? min / 100 : min)}</span>
        <span>{formatFieldValue(field, isPercent ? derivedMax / 100 : derivedMax)}</span>
      </div>
      <span className="field-helper">{field.helperText}</span>
    </div>
  );
}

function AssumptionTable({ sections, values }) {
  return (
    <div className="assumption-table">
      {sections.flatMap((section) =>
        section.fields.map((field) => (
          <div key={field.key} className="assumption-row">
            <div>
              <strong>{field.label}</strong>
              <p className="panel-copy">{section.title}</p>
            </div>
            <div className="assumption-row-meta">
              <span className={`confidence-tag ${field.confidenceTag.key}`}>
                {field.confidenceTag.label}
              </span>
              <strong>{formatFieldValue(field, values[field.key])}</strong>
            </div>
          </div>
        )),
      )}
    </div>
  );
}

function InteractiveCalculatorPage({
  contextName,
  breadcrumbs,
  calculator,
  onNavigate,
}) {
  const [values, setValues] = useState(() => calculator.defaultValues);
  const [sessionContext, setSessionContext] = useState(defaultSessionContext);
  const [scenarioName, setScenarioName] = useState("");
  const [selectedScenarioName, setSelectedScenarioName] = useState("");
  const [savedScenarios, setSavedScenarios] = useState([]);
  const [pdfMode, setPdfMode] = useState("customer");
  const [activeMode, setActiveMode] = useState("guided");
  const [valueCase, setValueCase] = useState("engineering-throughput");
  const [activeScenario, setActiveScenario] = useState("expected");
  const [realizationFactor, setRealizationFactor] = useState(0.65);
  const [executiveView, setExecutiveView] = useState("executive");
  const results = useMemo(() => calculator.calculate(values), [calculator, values]);

  useEffect(() => {
    const storedWorkspace = readStoredWorkspace(calculator.id);

    setValues(calculator.defaultValues);
    setSessionContext({
      ...defaultSessionContext,
      ...(storedWorkspace?.sessionContext ?? {}),
    });
    setScenarioName(storedWorkspace?.scenarioName ?? "");
    setSelectedScenarioName(storedWorkspace?.selectedScenarioName ?? "");
    setSavedScenarios(storedWorkspace?.savedScenarios ?? []);
    setPdfMode(storedWorkspace?.pdfMode === "internal" ? "internal" : "customer");
    setActiveMode(storedWorkspace?.activeMode ?? "guided");
    setValueCase(storedWorkspace?.valueCase ?? "engineering-throughput");
    setActiveScenario(storedWorkspace?.activeScenario ?? "expected");
    setRealizationFactor(
      storedWorkspace?.realizationFactor
        ? Number(storedWorkspace.realizationFactor)
        : 0.65,
    );
    setExecutiveView(storedWorkspace?.executiveView ?? "executive");
  }, [calculator.id]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      buildWorkspaceStorageKey(calculator.id),
      JSON.stringify({
        sessionContext,
        scenarioName,
        selectedScenarioName,
        savedScenarios,
        pdfMode,
        activeMode,
        valueCase,
        activeScenario,
        realizationFactor,
        executiveView,
      }),
    );
  }, [
    activeMode,
    activeScenario,
    calculator.id,
    executiveView,
    pdfMode,
    realizationFactor,
    savedScenarios,
    scenarioName,
    selectedScenarioName,
    sessionContext,
    valueCase,
  ]);

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

  function updateSessionContext(key, nextValue) {
    setSessionContext((current) => ({
      ...current,
      [key]: nextValue,
    }));
  }

  function saveScenario() {
    const trimmedName =
      scenarioName.trim() || `${calculator.name} scenario ${savedScenarios.length + 1}`;
    const nextScenario = {
      name: trimmedName,
      values,
      savedAt: new Date().toISOString(),
    };

    setSavedScenarios((current) => {
      const withoutMatch = current.filter((scenario) => scenario.name !== trimmedName);
      return [nextScenario, ...withoutMatch].slice(0, 8);
    });
    setScenarioName(trimmedName);
    setSelectedScenarioName(trimmedName);
  }

  function loadSelectedScenario() {
    const selectedScenario = savedScenarios.find(
      (scenario) => scenario.name === selectedScenarioName,
    );

    if (selectedScenario) {
      setValues(selectedScenario.values);
      setScenarioName(selectedScenario.name);
    }
  }

  function deleteSelectedScenario() {
    if (!selectedScenarioName) {
      return;
    }

    setSavedScenarios((current) =>
      current.filter((scenario) => scenario.name !== selectedScenarioName),
    );
    setSelectedScenarioName("");
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
  const recommendedNextSteps = buildRecommendedNextSteps({
    calculator,
    isTcoModel,
    pdfMode,
    savedScenarioCount: savedScenarios.length,
  });
  const preparedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
  const printSections = calculator.sections.map((section) => ({
    title: section.title,
    fields: section.fields.filter((field) => !field.advanced).slice(0, 3),
  }));
  const guidedFields = useMemo(
    () => (isTcoModel ? [] : pickGuidedFields(calculator, valueCase)),
    [calculator, isTcoModel, valueCase],
  );
  const scenarioMultiplier =
    ROI_SCENARIO_OPTIONS.find((scenario) => scenario.id === activeScenario)
      ?.multiplier ?? 1;
  const roiCategories = useMemo(
    () => (isTcoModel ? [] : buildRoiValueCategories(calculator, values, results)),
    [calculator, isTcoModel, results, values],
  );
  const displayCategories = roiCategories.map((category) => ({
    ...category,
    displayValue: category.value * scenarioMultiplier * realizationFactor,
    confidenceLabel: formatConfidence(category.confidenceScore),
  }));
  const adjustedResults = isTcoModel
    ? results
    : applyRoiScenario(
        { ...results, annualInvestment: Number(values.platformInvestment ?? 0) },
        scenarioMultiplier,
        realizationFactor,
      );
  const strongestDriver = displayCategories[0];
  const overallConfidenceScore = isTcoModel
    ? 0.65
    : averageConfidenceScore(
        roiCategories.flatMap((category) => category.sourceFields),
      );
  const whatWouldNeedToBeTrue = buildWhatWouldNeedToBeTrue(
    valueCase,
    calculator,
    strongestDriver,
  );
  const executiveStory = {
    baseline:
      calculator.sellerGuidance.askTheseFirst[0] ??
      "Current workflow friction is consuming time and budget today.",
    mechanism: describeImprovementMechanism(valueCase),
    outcome:
      strongestDriver
        ? `${strongestDriver.title} is the biggest modeled value driver in the expected case.`
        : "The model points to a directional improvement opportunity if the current-state assumptions hold.",
  };
  const scenarioBandCards = ROI_SCENARIO_OPTIONS.map((scenario) => {
    const scenarioResults = applyRoiScenario(
      { ...results, annualInvestment: Number(values.platformInvestment ?? 0) },
      scenario.multiplier,
      realizationFactor,
    );

    return {
      id: scenario.id,
      label: scenario.label,
      annualEconomicImpact: scenarioResults.annualEconomicImpact,
      paybackPeriodMonths: scenarioResults.paybackPeriodMonths,
      roiPercent: scenarioResults.roiPercent,
    };
  });

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
          label: "Transition or migration cost",
          value: formatCompactCurrency(results.transitionCost),
        },
        {
          label: "3-year cumulative difference",
          value: formatDirectionalCurrency(results.threeYearCumulativeDifference),
        },
        {
          label: "Migration payback period",
          value: formatMonths(results.migrationPaybackMonths),
        },
      ]
    : calculator.id === "virtual-screening-docking"
      ? [
          {
            label: "Cycle-time improvement (primary)",
            value: formatDays(adjustedResults.cycleTimeReduction),
          },
          {
            label: "Queue-related days reduced per year",
            value: formatDays(adjustedResults.queueDaysReduced),
          },
          {
            label: "Recovered scientist time (modeled, partial)",
            value: formatHours(adjustedResults.recoveredScientistHours),
          },
          {
            label: "Iteration / throughput capacity (directional)",
            value: formatCapacity(
              adjustedResults.throughputPotentialCampaigns,
              "campaigns per year",
            ),
          },
          {
            label: "Annual economic impact",
            value: formatCompactCurrency(adjustedResults.annualEconomicImpact),
          },
          {
            label: "Payback period",
            value: formatMonths(adjustedResults.paybackPeriodMonths),
          },
        ]
    : [
        {
          label: "Annual hours saved",
          value: formatHours(adjustedResults.annualHoursSaved),
        },
        {
          label: "Cycle-time reduction",
          value: formatDays(adjustedResults.cycleTimeReduction),
        },
        {
          label: "Capacity unlocked",
          value: formatCapacity(adjustedResults.capacityUnlocked, adjustedResults.capacityUnit),
        },
        {
          label: "Annual economic impact",
          value: formatCompactCurrency(adjustedResults.annualEconomicImpact),
        },
        {
          label: "Payback period",
          value: formatMonths(adjustedResults.paybackPeriodMonths),
        },
        {
          label: "ROI percent",
          value: formatPercent(adjustedResults.roiPercent),
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
        {isTcoModel ? (
          <>
            <section className="panel intro-panel calculator-intro-panel">
              <div>
                <p className="section-kicker">How To Use This Calculator</p>
                <h2>
                  Start with the example costs, then adjust the current-state, future-state, and migration inputs that matter most.
                </h2>
              </div>
              <p className="panel-copy">
                The page updates live as you edit the cost assumptions, so you can compare the current operating model against the future-state model in real time.
              </p>
            </section>

            <section className="panel working-session-panel">
              <div className="selector-header">
                <div className="choice-copy">
                  <p className="section-kicker">Working Session</p>
                  <h2>Capture the account context and save the scenarios you want to keep.</h2>
                  <p className="panel-copy">
                    Keep the calculator grounded in the actual customer conversation,
                    then save named scenarios for follow-up and sharing.
                  </p>
                </div>
              </div>

              <div className="working-session-grid">
                <label className="selector-field">
                  <span className="field-label">Customer</span>
                  <input
                    className="session-input"
                    type="text"
                    value={sessionContext.customerName}
                    onChange={(event) =>
                      updateSessionContext("customerName", event.target.value)
                    }
                    placeholder="Owens Corning"
                  />
                </label>

                <label className="selector-field">
                  <span className="field-label">Account or program</span>
                  <input
                    className="session-input"
                    type="text"
                    value={sessionContext.accountName}
                    onChange={(event) =>
                      updateSessionContext("accountName", event.target.value)
                    }
                    placeholder="Aero design modernization"
                  />
                </label>

                <label className="selector-field">
                  <span className="field-label">Prepared by</span>
                  <input
                    className="session-input"
                    type="text"
                    value={sessionContext.preparedBy}
                    onChange={(event) =>
                      updateSessionContext("preparedBy", event.target.value)
                    }
                    placeholder="Seller or account team"
                  />
                </label>

                <label className="selector-field selector-field-wide">
                  <span className="field-label">Opportunity or working notes</span>
                  <textarea
                    className="session-input session-textarea"
                    value={sessionContext.notes}
                    onChange={(event) =>
                      updateSessionContext("notes", event.target.value)
                    }
                    placeholder="Capture the program context, source of inputs, or follow-up items."
                    rows={3}
                  />
                </label>
              </div>

              <div className="scenario-toolbar">
                <label className="selector-field">
                  <span className="field-label-group">
                    <span className="field-label">Scenario name</span>
                    <FieldHelpTooltip
                      label="Scenario name"
                      help={workspaceHelp.scenarioName}
                    />
                  </span>
                  <input
                    className="session-input"
                    type="text"
                    value={scenarioName}
                    onChange={(event) => setScenarioName(event.target.value)}
                    placeholder="Customer current-state baseline"
                  />
                </label>

                <label className="selector-field">
                  <span className="field-label-group">
                    <span className="field-label">Saved scenarios</span>
                    <FieldHelpTooltip
                      label="Saved scenarios"
                      help={workspaceHelp.savedScenarios}
                    />
                  </span>
                  <select
                    value={selectedScenarioName}
                    onChange={(event) => {
                      setSelectedScenarioName(event.target.value);
                      setScenarioName(event.target.value);
                    }}
                  >
                    <option value="">Choose one</option>
                    {savedScenarios.map((scenario) => (
                      <option key={scenario.name} value={scenario.name}>
                        {scenario.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="selector-field">
                  <span className="field-label-group">
                    <span className="field-label">PDF mode</span>
                    <FieldHelpTooltip label="PDF mode" help={workspaceHelp.pdfMode} />
                  </span>
                  <select
                    value={pdfMode}
                    onChange={(event) => setPdfMode(event.target.value)}
                  >
                    <option value="customer">Customer-ready</option>
                    <option value="internal">Internal working version</option>
                  </select>
                </label>
              </div>

              <div className="recommendation-actions">
                <button type="button" className="ghost-button" onClick={saveScenario}>
                  Save scenario
                </button>
                <button
                  type="button"
                  className="ghost-button"
                  onClick={loadSelectedScenario}
                  disabled={!selectedScenarioName}
                >
                  Load selected
                </button>
                <button
                  type="button"
                  className="ghost-button"
                  onClick={deleteSelectedScenario}
                  disabled={!selectedScenarioName}
                >
                  Delete selected
                </button>
              </div>
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
                          <summary>
                            {section.advancedSectionLabel ?? calculator.advancedSectionLabel}
                          </summary>
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
                    <h2>Estimated cost comparison</h2>
                  </header>
                  <p className="panel-copy">
                    These estimates update as you adjust the current-state, future-state, and transition assumptions in the calculator.
                  </p>
                  <div className="impact-highlight">
                    <div>
                      <span className="metric-label">Estimated annual cost difference</span>
                      <strong>{formatAnnualCostDelta(results.annualCostDifference)}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Estimated 3-year cumulative difference</span>
                      <strong>{formatDirectionalCurrency(results.threeYearCumulativeDifference)}</strong>
                    </div>
                  </div>
                </section>
              </div>

              <aside className="panel summary-panel">
                <div className="summary-top">
                  <p className="section-kicker">Live Summary</p>
                  <h2>Estimated TCO comparison</h2>
                  <p className="panel-copy">
                    Sample values are already loaded so the page is reviewable on first open. Adjust the assumptions during the session to show how the total cost picture changes.
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

                <div className="how-to-read-block">
                  <div className="how-to-read-header">
                    <p className="section-kicker">Recommended Next Step</p>
                    <p className="panel-copy">
                      Use this to move from the estimate to a follow-up action.
                    </p>
                  </div>
                  <div className="guidance-detail-grid">
                    {recommendedNextSteps.map((step) => (
                      <GuidanceDetail
                        key={step.title}
                        title={step.title}
                        body={step.body}
                      />
                    ))}
                  </div>
                </div>
              </aside>
            </section>
          </>
        ) : (
          <>
            <section className="panel start-here-panel">
              <div className="selector-header">
                <div className="choice-copy">
                  <p className="section-kicker">Start Here</p>
                  <h2>Pick the value story, then work through the estimate in the order below.</h2>
                  <p className="panel-copy">
                    Start with the narrowest value case that fits the conversation. Guided Estimate gets you to a first answer fast, then Finance Review and Executive Output help you pressure-test and package it.
                  </p>
                </div>
              </div>
              <div className="value-case-grid">
                {ROI_VALUE_CASES.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`value-case-card ${valueCase === option.id ? "active" : ""}`}
                    onClick={() => setValueCase(option.id)}
                  >
                    <span className="metric-label">{option.label}</span>
                    <strong>{option.description}</strong>
                  </button>
                ))}
              </div>
              <div className="mode-switch-inline">
                <div className="mode-switch-header">
                  <div>
                    <p className="section-kicker">Workflow</p>
                    <h2>{ROI_MODE_OPTIONS.find((option) => option.id === activeMode)?.label}</h2>
                  </div>
                  <p className="panel-copy">{buildProgressSignal(activeMode)}</p>
                </div>
                <div className="mode-switch-grid compact-mode-grid">
                  {ROI_MODE_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={`mode-chip ${activeMode === option.id ? "active" : ""}`}
                      onClick={() => setActiveMode(option.id)}
                    >
                      <span>{option.step}</span>
                      <strong>{option.label}</strong>
                      <small>{option.description}</small>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <details className="advanced-block optional-context-panel">
              <summary>Optional session context, saved scenarios, and export settings</summary>
              <section className="panel working-session-panel nested-panel">
                <p className="panel-copy optional-context-copy">
                  Skip this for now if you just want a first estimate. Use it when you want to save working assumptions, add account context, or choose the PDF format.
                </p>
                <div className="working-session-grid">
                  <label className="selector-field">
                    <span className="field-label">Customer</span>
                    <input
                      className="session-input"
                      type="text"
                      value={sessionContext.customerName}
                      onChange={(event) =>
                        updateSessionContext("customerName", event.target.value)
                      }
                      placeholder="Owens Corning"
                    />
                  </label>

                  <label className="selector-field">
                    <span className="field-label">Account or program</span>
                    <input
                      className="session-input"
                      type="text"
                      value={sessionContext.accountName}
                      onChange={(event) =>
                        updateSessionContext("accountName", event.target.value)
                      }
                      placeholder="Aero design modernization"
                    />
                  </label>

                  <label className="selector-field">
                    <span className="field-label">Prepared by</span>
                    <input
                      className="session-input"
                      type="text"
                      value={sessionContext.preparedBy}
                      onChange={(event) =>
                        updateSessionContext("preparedBy", event.target.value)
                      }
                      placeholder="Seller or account team"
                    />
                  </label>

                  <label className="selector-field selector-field-wide">
                    <span className="field-label">Opportunity or working notes</span>
                    <textarea
                      className="session-input session-textarea"
                      value={sessionContext.notes}
                      onChange={(event) =>
                        updateSessionContext("notes", event.target.value)
                      }
                      placeholder="Capture the program context, source of inputs, or follow-up items."
                      rows={3}
                    />
                  </label>
                </div>

                <div className="scenario-toolbar">
                  <label className="selector-field">
                    <span className="field-label-group">
                      <span className="field-label">Scenario name</span>
                      <FieldHelpTooltip
                        label="Scenario name"
                        help={workspaceHelp.scenarioName}
                      />
                    </span>
                    <input
                      className="session-input"
                      type="text"
                      value={scenarioName}
                      onChange={(event) => setScenarioName(event.target.value)}
                      placeholder="Customer current-state baseline"
                    />
                  </label>

                  <label className="selector-field">
                    <span className="field-label-group">
                      <span className="field-label">Saved scenarios</span>
                      <FieldHelpTooltip
                        label="Saved scenarios"
                        help={workspaceHelp.savedScenarios}
                      />
                    </span>
                    <select
                      value={selectedScenarioName}
                      onChange={(event) => {
                        setSelectedScenarioName(event.target.value);
                        setScenarioName(event.target.value);
                      }}
                    >
                      <option value="">Choose one</option>
                      {savedScenarios.map((scenario) => (
                        <option key={scenario.name} value={scenario.name}>
                          {scenario.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="selector-field">
                    <span className="field-label-group">
                      <span className="field-label">PDF mode</span>
                      <FieldHelpTooltip label="PDF mode" help={workspaceHelp.pdfMode} />
                    </span>
                    <select
                      value={pdfMode}
                      onChange={(event) => setPdfMode(event.target.value)}
                    >
                      <option value="customer">Customer-ready</option>
                      <option value="internal">Internal working version</option>
                    </select>
                  </label>
                </div>

                <div className="recommendation-actions">
                  <button type="button" className="ghost-button" onClick={saveScenario}>
                    Save scenario
                  </button>
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={loadSelectedScenario}
                    disabled={!selectedScenarioName}
                  >
                    Load selected
                  </button>
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={deleteSelectedScenario}
                    disabled={!selectedScenarioName}
                  >
                    Delete selected
                  </button>
                </div>
              </section>
            </details>

            <section className="calculator-layout">
              <div className="calculator-main">
                {activeMode === "guided" ? (
                  <>
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
                          Keep the first pass lightweight. Deeper assumptions stay editable in Finance Review.
                        </p>
                      </article>
                    </section>

                    <section className="panel calc-section">
                      <header className="panel-header">
                        <h2>Guided Estimate</h2>
                        <p className="section-copy">
                          These are the few inputs most likely to move the result for this value case.
                        </p>
                      </header>
                      <div className="field-grid guided-field-grid">
                        {guidedFields.map((field) => (
                          <GuidedFieldInput
                            key={field.key}
                            field={field}
                            value={values[field.key]}
                            onChange={updateValue}
                          />
                        ))}
                      </div>
                      <details className="advanced-block">
                        <summary>More inputs and manual overrides</summary>
                        <div className="guided-section-stack">
                          {calculator.sections.map((section) => (
                            <section key={section.key} className="panel nested-panel">
                              <header className="panel-header">
                                <h2>{section.title}</h2>
                                {section.description ? (
                                  <p className="section-copy">{section.description}</p>
                                ) : null}
                              </header>
                              <div className="field-grid">
                                {section.fields.map((field) => (
                                  <FieldInput
                                    key={field.key}
                                    field={field}
                                    value={values[field.key]}
                                    onChange={updateValue}
                                  />
                                ))}
                              </div>
                            </section>
                          ))}
                        </div>
                      </details>
                    </section>
                  </>
                ) : null}

                {activeMode === "finance" ? (
                  <>
                    <section className="panel calc-section">
                      <header className="panel-header">
                        <h2>Finance Review</h2>
                        <p className="section-copy">
                          Inspect the assumptions, realization factor, and low / expected / high scenario bands behind the estimate.
                        </p>
                      </header>
                      <div className="finance-controls-grid">
                        <div className="field-card">
                          <div className="field-label-row">
                            <span className="field-label-group">
                              <span className="field-label">Scenario band</span>
                            </span>
                          </div>
                          <div className="segmented-control">
                            {ROI_SCENARIO_OPTIONS.map((scenario) => (
                              <button
                                key={scenario.id}
                                type="button"
                                className={activeScenario === scenario.id ? "active" : ""}
                                onClick={() => setActiveScenario(scenario.id)}
                              >
                                {scenario.label}
                              </button>
                            ))}
                          </div>
                          <span className="field-helper">
                            Expected is the default view. Low and High are directional bands, not hard commitments.
                          </span>
                        </div>
                        <div className="field-card">
                          <div className="field-label-row">
                            <span className="field-label-group">
                              <span className="field-label">Realization factor</span>
                              <FieldHelpTooltip
                                label="Realization factor"
                                help={{
                                  what: "Represents the share of modeled value you expect to capture in practice.",
                                  include: "Adoption friction, process lag, and the fact that not every modeled gain is fully realized.",
                                  exclude: "Trying to force false precision into a directional estimate.",
                                  example: "A conservative 65% realization factor means only part of the modeled upside is assumed to show up in the first pass.",
                                }}
                              />
                            </span>
                            <span className="confidence-tag estimated">Directional assumption</span>
                          </div>
                          <div className="guided-slider-shell">
                            <input
                              type="range"
                              min="30"
                              max="100"
                              step="5"
                              value={Math.round(realizationFactor * 100)}
                              onChange={(event) =>
                                setRealizationFactor(Number(event.target.value) / 100)
                              }
                            />
                            <div className="guided-slider-value">
                              <strong>{Math.round(realizationFactor * 100)}%</strong>
                            </div>
                          </div>
                          <div className="guided-slider-meta">
                            <span>30%</span>
                            <span>100%</span>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className="panel calc-section">
                      <header className="panel-header">
                        <h2>Value categories and formulas</h2>
                        <p className="section-copy">
                          Each category shows the formula, source mix, and confidence level used in the model.
                        </p>
                      </header>
                      <div className="guidance-detail-grid">
                        {displayCategories.map((category) => (
                          <article key={category.id} className="guidance-detail-card">
                            <p className="guidance-detail-title">{category.title}</p>
                            <strong>{formatCompactCurrency(category.displayValue)}</strong>
                            <p className="panel-copy">{category.formula}</p>
                            <p className="panel-copy">
                              Confidence:{" "}
                              <span className={`inline-confidence ${confidenceClassName(category.confidenceScore)}`}>
                                {category.confidenceLabel}
                              </span>
                            </p>
                            <p className="panel-copy">
                              Sources:{" "}
                              {category.sourceFields.length > 0
                                ? category.sourceFields
                                    .map(
                                      (field) =>
                                        `${field.label} (${field.confidenceTag.label})`,
                                    )
                                    .join(", ")
                                : "Directional model output"}
                            </p>
                          </article>
                        ))}
                      </div>
                    </section>

                    <section className="panel calc-section">
                      <header className="panel-header">
                        <h2>Scenario bands</h2>
                        <p className="section-copy">
                          Low / Expected / High views keep the model transparent without pretending to be more precise than the inputs support.
                        </p>
                      </header>
                      <div className="metric-grid">
                        {scenarioBandCards.map((scenario) => (
                          <MetricCard
                            key={scenario.id}
                            label={`${scenario.label} annual value`}
                            value={formatCompactCurrency(
                              scenario.annualEconomicImpact * realizationFactor,
                            )}
                          />
                        ))}
                      </div>
                    </section>

                    <section className="panel calc-section">
                      <header className="panel-header">
                        <h2>Assumption table</h2>
                        <p className="section-copy">
                          Customer-provided inputs are separated from benchmark and directional assumptions.
                        </p>
                      </header>
                      <AssumptionTable sections={calculator.sections} values={values} />
                    </section>

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
                            <details className="advanced-block" open>
                              <summary>
                                {section.advancedSectionLabel ?? calculator.advancedSectionLabel}
                              </summary>
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
                  </>
                ) : null}

                {activeMode === "executive" ? (
                  <>
                    <section className="panel calc-section">
                      <header className="panel-header">
                        <h2>Executive Output</h2>
                        <p className="section-copy">
                          Presentation-ready framing of the current state, modeled improvement, and what would need to be true.
                        </p>
                      </header>
                      <div className="segmented-control">
                        {EXECUTIVE_VIEW_OPTIONS.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            className={executiveView === option.id ? "active" : ""}
                            onClick={() => setExecutiveView(option.id)}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </section>

                    <section className="panel calc-section">
                      <header className="panel-header">
                        <h2>Story of the result</h2>
                      </header>
                      <div className="guidance-detail-grid">
                        <GuidanceDetail title="Baseline" body={executiveStory.baseline} />
                        <GuidanceDetail
                          title="Improvement mechanism"
                          body={executiveStory.mechanism}
                        />
                        <GuidanceDetail title="Business outcome" body={executiveStory.outcome} />
                      </div>
                    </section>

                    <section className="panel calc-section impact-panel">
                      <header className="panel-header">
                        <h2>
                          {executiveView === "seller"
                            ? "Seller Summary"
                            : executiveView === "finance"
                              ? "Finance Appendix"
                              : "Executive Summary"}
                        </h2>
                        <p className="section-copy">
                          {executiveView === "seller"
                            ? "Use this to summarize the result quickly in an internal follow-up or account review."
                            : executiveView === "finance"
                              ? "Use this to explain the assumptions, confidence, and scenario structure behind the estimate."
                              : "Use this to communicate the modeled business case in simple language."}
                        </p>
                      </header>
                      <div className="metric-grid">
                        {outputCards.slice(0, 4).map((metric) => (
                          <MetricCard key={metric.label} label={metric.label} value={metric.value} />
                        ))}
                      </div>
                    </section>

                    {executiveView === "seller" ? (
                      <section className="panel calc-section">
                        <header className="panel-header">
                          <h2>Recommended next step</h2>
                        </header>
                        <div className="guidance-detail-grid">
                          {recommendedNextSteps.map((step) => (
                            <GuidanceDetail
                              key={step.title}
                              title={step.title}
                              body={step.body}
                            />
                          ))}
                        </div>
                      </section>
                    ) : null}

                    {executiveView === "finance" ? (
                      <section className="panel calc-section">
                        <header className="panel-header">
                          <h2>Finance appendix</h2>
                        </header>
                        <AssumptionTable sections={calculator.sections} values={values} />
                      </section>
                    ) : null}

                    {executiveView === "executive" ? (
                      <section className="panel calc-section">
                        <header className="panel-header">
                          <h2>What would need to be true</h2>
                          <p className="section-copy">
                            These are the major assumptions driving the modeled result.
                          </p>
                        </header>
                        <ul className="guidance-list">
                          {whatWouldNeedToBeTrue.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </section>
                    ) : null}
                  </>
                ) : null}

              </div>

              <aside className="panel summary-panel">
                <div className="summary-top">
                  <div className="summary-toolbar">
                    <div className="summary-toolbar-copy">
                      <p className="section-kicker">Persistent Results Summary</p>
                      <h2>Decision summary</h2>
                    </div>
                    <div className="segmented-control compact-segmented-control">
                      {ROI_SCENARIO_OPTIONS.map((scenario) => (
                        <button
                          key={scenario.id}
                          type="button"
                          className={activeScenario === scenario.id ? "active" : ""}
                          onClick={() => setActiveScenario(scenario.id)}
                        >
                          {scenario.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="panel-copy">
                    This panel keeps the current answer in view while you adjust assumptions. Start with the expected case, then pressure-test the band if needed.
                  </p>
                </div>

                <div className="summary-signal-grid">
                  <SummarySignal
                    label="Annual value estimate"
                    value={formatCompactCurrency(adjustedResults.annualEconomicImpact)}
                    tone="accent"
                  />
                  <SummarySignal
                    label="Payback period"
                    value={formatMonths(adjustedResults.paybackPeriodMonths)}
                  />
                  <SummarySignal
                    label="Strongest value driver"
                    value={strongestDriver?.shortLabel ?? "To be validated"}
                  />
                  <SummarySignal
                    label="Confidence level"
                    value={formatConfidence(overallConfidenceScore)}
                    tone={confidenceClassName(overallConfidenceScore)}
                  />
                </div>

                <div className="estimate-bridge summary-bridge-card">
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

                <div className="guidance-detail-card summary-driver-list">
                  <p className="guidance-detail-title">Top drivers in this view</p>
                  {displayCategories.slice(0, 3).map((category, index) => (
                    <div key={category.id} className="summary-driver-row">
                      <span>{index + 1}. {category.title}</span>
                      <strong>{formatCompactCurrency(category.displayValue)}</strong>
                    </div>
                  ))}
                  <p className="panel-copy">
                    Mode lens: {activeMode === "guided"
                      ? "Use this to get to a fast first answer."
                      : activeMode === "finance"
                        ? "Use this to inspect the assumptions and scenario bands."
                        : "Use this to package the result into a business case."}
                  </p>
                </div>

                {howToRead ? (
                  <div className="how-to-read-block">
                    <div className="how-to-read-header">
                      <p className="section-kicker">How To Read This</p>
                      <p className="panel-copy">
                        Directional output designed for working conversations, not false precision.
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

                <div className="summary-footer-actions">
                  <button type="button" className="ghost-button" onClick={exportPdf}>
                    Export PDF
                  </button>
                  <button type="button" className="ghost-button" onClick={resetToDefaults}>
                    Reset to defaults
                  </button>
                </div>
              </aside>
            </section>
          </>
        )}
      </div>

      <section className="print-report">
        <header className="print-report-header">
          <div>
            <p className="section-kicker">
              {pdfMode === "customer"
                ? isTcoModel
                  ? "TCO Summary"
                  : "ROI Summary"
                : isTcoModel
                  ? "Internal TCO Working Summary"
                  : "Internal ROI Working Summary"}
            </p>
            <h1>{calculator.name}</h1>
            <p className="print-report-subtitle">{calculator.businessOutcome}</p>
          </div>
          <div className="print-meta-grid">
            <div>
              <span className="metric-label">Prepared</span>
              <strong>{preparedDate}</strong>
            </div>
            <div>
              <span className="metric-label">Prepared for</span>
              <strong>{sessionContext.customerName || "Not specified"}</strong>
            </div>
            <div>
              <span className="metric-label">Context</span>
              <strong>{contextName}</strong>
            </div>
            <div>
              <span className="metric-label">Account / program</span>
              <strong>
                {sessionContext.accountName || sessionContext.opportunityName || "Not specified"}
              </strong>
            </div>
            <div>
              <span className="metric-label">Prepared by</span>
              <strong>{sessionContext.preparedBy || "Not specified"}</strong>
            </div>
            <div>
              <span className="metric-label">PDF mode</span>
              <strong>{pdfMode === "customer" ? "Customer-ready" : "Internal working"}</strong>
            </div>
          </div>
        </header>

        {pdfMode === "internal" ? (
          <PrintSection title="Start Here">
            <ul className="guidance-list">
              {calculator.sellerGuidance.askTheseFirst.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </PrintSection>
        ) : null}

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

        <PrintSection title="Recommended Next Step">
          <div className="guidance-detail-grid">
            {recommendedNextSteps.map((step) => (
              <GuidanceDetail key={step.title} title={step.title} body={step.body} />
            ))}
          </div>
        </PrintSection>

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

        {pdfMode === "internal" && sessionContext.notes ? (
          <PrintSection title="Working Notes">
            <p className="print-copy">{sessionContext.notes}</p>
          </PrintSection>
        ) : null}

        <p className="print-footnote">
          {pdfMode === "customer"
            ? "This summary is directional and assumption-based and should be used as a working estimate."
            : "This summary is directional and assumption-based. Validate customer-provided inputs and benchmark assumptions before external distribution."}
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
