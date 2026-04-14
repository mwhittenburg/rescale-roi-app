const STANDARD_SECTION_DESCRIPTIONS = {
  currentState: "Start with the current baseline your customer recognizes today.",
  improvements:
    "Use benchmark assumptions first, then refine them together during the working session.",
  financial:
    "Keep the value story grounded with simple cost and business-value assumptions.",
};

const STANDARD_CONFIDENCE_TAGS = {
  "customer-provided": "Customer-provided",
  benchmark: "Benchmark",
  estimated: "Estimated",
};

const SHARED_DEFAULT_RULES = [
  {
    test: (field) => /hourly cost/i.test(field.label),
    value: 150,
  },
  {
    test: (field) => /annual platform investment/i.test(field.label),
    value: 150000,
  },
];

function lowerCaseLabel(label) {
  return label.charAt(0).toLowerCase() + label.slice(1);
}

function inferConfidenceTag(sectionKey, field) {
  if (field.confidenceTag) {
    return field.confidenceTag;
  }

  if (sectionKey === "currentState") {
    return "customer-provided";
  }

  if (sectionKey === "improvements") {
    return "benchmark";
  }

  return "estimated";
}

function inferHelperText(sectionKey, field) {
  if (field.helperText) {
    return field.helperText;
  }

  const label = lowerCaseLabel(field.label);

  if (sectionKey === "currentState") {
    if (field.prefix === "$") {
      return `Use the current cost tied to ${label}.`;
    }

    if (field.suffix === "days") {
      return `Use the current average number of days for ${label}.`;
    }

    if (field.suffix === "hours") {
      return `Use the current team time tied to ${label}.`;
    }

    return `Use a representative current baseline for ${label}.`;
  }

  if (sectionKey === "improvements") {
    if (field.kind === "percent") {
      return `Start with a benchmark improvement percentage for ${label}.`;
    }

    return `Use a benchmark assumption for ${label}.`;
  }

  if (/hourly cost/i.test(field.label)) {
    return "Use a fully loaded labor rate for the team involved.";
  }

  if (/annual platform investment/i.test(field.label)) {
    return "Include the annual platform or subscription cost being evaluated.";
  }

  if (field.prefix === "$") {
    return `Use the annual cost or value exposure tied to ${label}.`;
  }

  return `Use a reasonable financial assumption for ${label}.`;
}

function resolveDefaultValue(field) {
  if (field.sharedDefault === false) {
    return field.defaultValue;
  }

  const sharedRule = SHARED_DEFAULT_RULES.find((rule) => rule.test(field));
  return sharedRule ? sharedRule.value : field.defaultValue;
}

function normalizeField(sectionKey, field) {
  const confidenceKey = inferConfidenceTag(sectionKey, field);

  return {
    ...field,
    defaultValue: resolveDefaultValue(field),
    helperText: inferHelperText(sectionKey, field),
    confidenceTag: {
      key: confidenceKey,
      label: STANDARD_CONFIDENCE_TAGS[confidenceKey] ?? confidenceKey,
    },
  };
}

function normalizeSection(section) {
  return {
    ...section,
    description:
      section.description ?? STANDARD_SECTION_DESCRIPTIONS[section.key] ?? "",
    fields: section.fields.map((field) => normalizeField(section.key, field)),
  };
}

function buildDefaultValues(sections) {
  return Object.fromEntries(
    sections.flatMap((section) =>
      section.fields.map((field) => [field.key, field.defaultValue]),
    ),
  );
}

export function createCalculator(industryId, config) {
  return {
    industryId,
    calculatorType: "content",
    ...config,
  };
}

export function normalizeCalculatorResults(results) {
  return {
    annualHoursSaved: results.annualHoursSaved ?? 0,
    cycleTimeReduction: results.cycleTimeReduction ?? 0,
    capacityUnlocked: results.capacityUnlocked ?? 0,
    capacityUnit: results.capacityUnit ?? "units per year",
    annualEconomicImpact: results.annualEconomicImpact ?? 0,
    paybackPeriodMonths: results.paybackPeriodMonths ?? 0,
    roiPercent: results.roiPercent ?? 0,
    extraOutputs: results.extraOutputs ?? [],
    ...results,
  };
}

export function createInteractiveCalculator(industryId, config) {
  const sections = config.sections.map(normalizeSection);

  return {
    industryId,
    calculatorType: "interactive",
    advancedSectionLabel: "Advanced inputs",
    ...config,
    sections,
    defaultValues: buildDefaultValues(sections),
    calculate(values) {
      return normalizeCalculatorResults(config.calculate(values));
    },
  };
}

export function clampPercent(value) {
  return Math.max(0, Math.min(value, 0.95));
}

export function safeDivide(value, divisor) {
  if (!divisor) {
    return 0;
  }

  return value / divisor;
}
