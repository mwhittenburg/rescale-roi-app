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

const FIELD_HELP_RULES = [
  {
    test: (field) => /\bcampaigns? per year\b/i.test(field.label),
    help: {
      what:
        "Represents the number of full campaigns typically completed in a year.",
      include:
        "End-to-end campaigns that produce a decision-ready result for the team.",
      exclude:
        "Individual compute jobs or sub-steps unless the workflow is explicitly defined that way.",
      example: "One docking campaign, not one docking run.",
    },
  },
  {
    test: (field) => /\b(studies?|projects?) per year\b/i.test(field.label),
    help: {
      what:
        "Represents the number of full studies or projects completed in a typical year.",
      include:
        "Decision-oriented studies that the team tracks as a meaningful unit of work.",
      exclude:
        "Single runs, minor reruns, or sub-analyses unless they are managed as separate studies.",
      example: "One molecular dynamics study, not one simulation inside it.",
    },
  },
  {
    test: (field) =>
      /\bscenarios? per (study|campaign)\b/i.test(field.label) ||
      /\bimprovement scenarios tested per quarter\b/i.test(field.label),
    help: {
      what:
        "Represents the number of meaningful alternatives evaluated within one cycle of work.",
      include:
        "Distinct options that could change a recommendation, design, or planning decision.",
      exclude:
        "Minor parameter sweeps that are not reviewed as separate decision paths.",
      example: "Different field development plans, not every tiny solver variation.",
    },
  },
  {
    test: (field) => /\biterations? per\b/i.test(field.label),
    help: {
      what:
        "Represents the number of design or simulation loops typically needed before the team is comfortable deciding.",
      include:
        "Meaningful iterations that require analysis, review, and updated engineering judgment.",
      exclude:
        "Trivial reruns caused only by setup errors or small file changes.",
      example: "Five thermal design iterations before locking the next concept.",
    },
  },
  {
    test: (field) =>
      /\bruns? or analyses per cycle\b/i.test(field.label) ||
      /\bsimulations? per (study|program)\b/i.test(field.label) ||
      /\bverification runs? per project\b/i.test(field.label) ||
      /\bstructural or crash simulations? per program\b/i.test(field.label),
    help: {
      what:
        "Represents the number of meaningful compute runs needed to finish one full unit of work.",
      include:
        "Runs that are reviewed as part of the technical decision, validation cycle, or recommendation.",
      exclude:
        "Failed setup attempts, duplicate reruns, or tiny debug jobs that do not change the decision.",
      example: "Twelve verification runs that support one project milestone.",
    },
  },
  {
    test: (field) =>
      /\bcompounds screened\b/i.test(field.label) ||
      /\bvariables or configurations evaluated per study\b/i.test(field.label),
    help: {
      what:
        "Represents the scale of options evaluated inside one campaign or study.",
      include:
        "Distinct compounds, configurations, or variables that are intentionally part of the decision process.",
      exclude:
        "Background library entries, duplicate records, or tiny parameter tweaks that are not reviewed separately.",
      example: "500,000 compounds in one screening campaign, not repeated scoring passes on the same set.",
    },
  },
  {
    test: (field) =>
      /\byield-learning cycles? per year\b/i.test(field.label) ||
      /\bpeak demand windows per year\b/i.test(field.label) ||
      /\bburst demand periods per year\b/i.test(field.label),
    help: {
      what:
        "Represents how often the team goes through a meaningful learning or demand cycle in a year.",
      include:
        "Cycles or windows that create a real workflow, capacity, or decision burden.",
      exclude:
        "Minor day-to-day fluctuations that do not change staffing, queueing, or infrastructure behavior.",
      example: "Quarterly peak windows or formal yield-learning loops, not every busy week.",
    },
  },
  {
    test: (field) => /\bcompute cost per\b/i.test(field.label),
    help: {
      what:
        "Represents the direct compute spend tied to one study, project, campaign, or iteration.",
      include:
        "Cloud or cluster usage, scheduler charges, and directly attributable compute consumption.",
      exclude:
        "Broader IT overhead, software subscriptions, or platform investment already modeled elsewhere.",
      example: "The run cost for one verification project, excluding annual CAD licenses.",
    },
  },
  {
    test: (field) =>
      /\bincremental compute cost\b/i.test(field.label) ||
      /\bcloud infrastructure cost per month\b/i.test(field.label),
    help: {
      what:
        "Represents the direct compute or infrastructure spend tied to serving this workload.",
      include:
        "Consumed compute, scheduler, cloud infrastructure, and other directly attributable usage charges.",
      exclude:
        "Broader platform subscriptions, support labor, or shared corporate IT costs already modeled elsewhere.",
      example: "Monthly cloud compute spend for this environment, not the entire IT budget.",
    },
  },
  {
    test: (field) =>
      /\b(hours per|hours affected|review hours)\b/i.test(field.label),
    help: {
      what:
        "Represents the labor time the technical team spends on this unit of work today.",
      include:
        "Hands-on setup, review, interpretation, and coordination time directly tied to the workflow.",
      exclude:
        "Fully unrelated program meetings or organization-wide overhead.",
      example: "Scientist review and setup hours for one screening campaign.",
    },
  },
  {
    test: (field) =>
      /\b(admin|support).*hours per month\b/i.test(field.label) ||
      /\bgovernance and reporting hours per month\b/i.test(field.label) ||
      /\benvironment maintenance hours per month\b/i.test(field.label),
    help: {
      what:
        "Represents the recurring labor time IT or platform teams spend to keep the environment working.",
      include:
        "Provisioning, troubleshooting, reporting, governance, maintenance, and hands-on support effort tied to this environment.",
      exclude:
        "One-time migration work, unrelated helpdesk activity, or broader enterprise overhead not tied to the modeled environment.",
      example: "Monthly platform team hours spent provisioning and fixing user environments.",
    },
  },
  {
    test: (field) => /\bqueue\b/i.test(field.label) && !/reduction/i.test(field.label),
    help: {
      what:
        "Represents the time work waits before it can begin or before the team can act on it.",
      include:
        "Backlog delay, scheduler wait time, and time spent waiting for shared resources to free up.",
      exclude:
        "The actual run time or review time once the work has already started.",
      example: "Two days waiting in queue before a simulation starts.",
    },
  },
  {
    test: (field) =>
      /\bruntime\b/i.test(field.label) && !/improvement/i.test(field.label),
    help: {
      what:
        "Represents the actual elapsed compute time once the run has started.",
      include:
        "Solver, processing, or execution time needed to complete the run itself.",
      exclude:
        "Queue delay, setup time, or downstream review time unless those are intentionally rolled into this field.",
      example: "Eight hours of simulation runtime after the job begins executing.",
    },
  },
  {
    test: (field) =>
      /\bcycle time\b/i.test(field.label) && !/improvement/i.test(field.label),
    help: {
      what:
        "Represents the end-to-end elapsed time for one cycle of work.",
      include:
        "The full time from kickoff to decision-ready output for that study or cycle.",
      exclude:
        "Longer program timelines that sit outside the specific workflow being modeled.",
      example: "The elapsed time for one process study from setup through review.",
    },
  },
  {
    test: (field) =>
      /\bturnaround time\b/i.test(field.label) && !/improvement/i.test(field.label),
    help: {
      what:
        "Represents how long it normally takes to get a usable result back once work is submitted.",
      include:
        "The practical elapsed time the team experiences before results can be reviewed.",
      exclude:
        "Separate queue delay if that is already captured in its own field.",
      example: "One and a half days to get a verification run back after it starts.",
    },
  },
  {
    test: (field) =>
      /\bscale-up delay\b/i.test(field.label) ||
      /\btime to interpretation\b/i.test(field.label) ||
      /\bdelay sensitivity\b/i.test(field.label) ||
      /\bdecision delay\b/i.test(field.label),
    help: {
      what:
        "Represents the business-relevant delay between finishing the technical work and being able to act on it.",
      include:
        "Elapsed time or exposure caused by waiting for interpretation, signoff, or a planning decision.",
      exclude:
        "Core compute runtime or broad program delay that is not directly tied to this workflow.",
      example: "The extra days before a field planning choice can be made after analysis is ready.",
    },
  },
  {
    test: (field) =>
      /\bprototype cost\b/i.test(field.label) ||
      /\bphysical prototype\b/i.test(field.label),
    help: {
      what:
        "Represents the direct cost of building and using a physical prototype for this workflow.",
      include:
        "Materials, fabrication, setup, and direct prototype-related testing when relevant.",
      exclude:
        "Broader program overhead unless you intentionally want to model it here.",
      example: "The cost to build and evaluate one physical design prototype.",
    },
  },
  {
    test: (field) =>
      /\bphysical (build|test|experiment|trial)\b/i.test(field.label) ||
      /\bvalidation test cost\b/i.test(field.label) ||
      /\bphysical test or prototype cost\b/i.test(field.label),
    help: {
      what:
        "Represents the direct cost of one physical experiment, validation event, or test article.",
      include:
        "Setup, execution, lab or test-stand time, and directly attributable materials.",
      exclude:
        "Unrelated engineering overhead or downstream commercialization costs.",
      example: "One validation crash test or one lab-scale process experiment.",
    },
  },
  {
    test: (field) =>
      /\bhardware refresh cost\b/i.test(field.label) ||
      /\bmaintenance and support contracts\b/i.test(field.label) ||
      /\bdata center or colo cost\b/i.test(field.label) ||
      /\bstorage, backup, and disaster recovery cost\b/i.test(field.label) ||
      /\bnetwork and egress cost\b/i.test(field.label),
    help: {
      what:
        "Represents a current-state infrastructure cost line that should be counted once in the TCO baseline.",
      include:
        "Only the annualized or current-period cost directly tied to the environment being modeled.",
      exclude:
        "Shared enterprise costs already allocated elsewhere or one-time transition costs captured in migration inputs.",
      example: "Annualized server refresh plus support contract cost for the technical computing estate.",
    },
  },
  {
    test: (field) =>
      /\b(current|future) annual (support and admin|tooling and platform support|security and compliance tooling) cost\b/i.test(
        field.label,
      ) || /\bfuture governance and utilization tooling cost\b/i.test(field.label),
    help: {
      what:
        "Represents the recurring annual operating cost of supporting the current or future model.",
      include:
        "Platform tooling, support contracts, governance software, and other recurring run-state costs tied to this operating model.",
      exclude:
        "One-time migration spend, labor already counted in admin-hours fields, or unrelated enterprise software.",
      example: "The yearly cost of the tooling stack needed to run the future governance model.",
    },
  },
  {
    test: (field) =>
      /\bmigration and (cutover|operating-model transition) cost\b/i.test(field.label) ||
      /\btransition cost\b/i.test(field.label) ||
      /\bparallel run or dual-operation cost\b/i.test(field.label),
    help: {
      what:
        "Represents one-time cost required to move from the current model to the future model.",
      include:
        "Migration labor, cutover planning, temporary dual running, training, and change-management effort tied to the transition.",
      exclude:
        "Recurring future-state operating costs or sunk costs already spent before the project.",
      example: "Cutover support plus a short parallel-run window during migration.",
    },
  },
  {
    test: (field) =>
      /\bcost of delayed\b/i.test(field.label) ||
      /\bdelayed decision cost\b/i.test(field.label),
    help: {
      what:
        "Represents the business exposure created when a decision waits on this workflow.",
      include:
        "Delay costs tied to missed throughput, slower planning, deferred output, or schedule slippage.",
      exclude:
        "Very broad company-wide opportunity cost that cannot be linked back to the decision.",
      example: "The cost of delaying a field planning decision by one study cycle.",
    },
  },
  {
    test: (field) =>
      /\bnonproductive time cost per year\b/i.test(field.label),
    help: {
      what:
        "Represents the annual cost of unplanned downtime, waiting, or lost productive operations tied to this workflow.",
      include:
        "Direct exposure from deferred production, unplanned idle time, or operational inefficiency the customer already tracks.",
      exclude:
        "Broad field economics that cannot be linked back to the modeled nonproductive time.",
      example: "Annual cost of avoidable drilling downtime caused by delayed optimization decisions.",
    },
  },
  {
    test: (field) =>
      /\baverage utilization\b/i.test(field.label) ||
      /\bpeak utilization\b/i.test(field.label),
    help: {
      what:
        "Represents how much of the available capacity is actually used during normal versus peak periods.",
      include:
        "The practical usage level the customer sees for the relevant environment or cluster.",
      exclude:
        "Short-lived spikes, planned outages, or theoretical maximums that do not reflect real operating behavior.",
      example: "Average at 46% across the year versus 92% during quarter-end peaks.",
    },
  },
  {
    test: (field) =>
      /\bcurrent capacity shortfall\b/i.test(field.label) ||
      /\bidle capacity cost per day\b/i.test(field.label) ||
      /\bannual fixed capacity cost built for peak demand\b/i.test(field.label),
    help: {
      what:
        "Represents the cost or gap created by sizing infrastructure poorly for real demand.",
      include:
        "Capacity that is missing during peaks or sits idle outside those peaks, plus the cost directly tied to that imbalance.",
      exclude:
        "General compute spend that would exist even if capacity were sized correctly.",
      example: "Extra fixed capacity carried year-round only to survive a few burst windows.",
    },
  },
  {
    test: (field) =>
      /\bshare of workloads staying on-prem or in hybrid\b/i.test(field.label),
    help: {
      what:
        "Represents the portion of workloads that remain outside full cloud migration in the future model.",
      include:
        "Only workloads the customer expects to retain on-prem or place in a hybrid footprint for technical, economic, or governance reasons.",
      exclude:
        "Short-term exceptions, temporary migration phases, or workloads that are expected to move fully once the target state is reached.",
      example: "35% retained because of data gravity, licensing, or performance constraints.",
    },
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

function inferFieldHelp(field) {
  if (field.helpTooltip) {
    return field.helpTooltip;
  }

  if (field.kind === "percent") {
    return null;
  }

  const matchedRule = FIELD_HELP_RULES.find((rule) => rule.test(field));
  return matchedRule ? matchedRule.help : null;
}

function normalizeField(sectionKey, field) {
  const confidenceKey = inferConfidenceTag(sectionKey, field);

  return {
    ...field,
    defaultValue: resolveDefaultValue(field),
    helperText: inferHelperText(sectionKey, field),
    helpTooltip: inferFieldHelp(field),
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
    currentAnnualCost: results.currentAnnualCost ?? 0,
    futureAnnualCost: results.futureAnnualCost ?? 0,
    annualCostDifference: results.annualCostDifference ?? 0,
    fixedCostAvoided: results.fixedCostAvoided ?? 0,
    idleCapacityCostReduced: results.idleCapacityCostReduced ?? 0,
    adminSupportHoursReduced: results.adminSupportHoursReduced ?? 0,
    migrationPaybackMonths: results.migrationPaybackMonths ?? 0,
    extraOutputs: results.extraOutputs ?? [],
    ...results,
  };
}

export function createInteractiveCalculator(industryId, config) {
  const sections = config.sections.map(normalizeSection);

  return {
    industryId,
    calculatorType: "interactive",
    valueModel: "roi",
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
