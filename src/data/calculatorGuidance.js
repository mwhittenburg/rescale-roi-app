export const calculatorGuidanceById = {
  "virtual-screening-docking": {
    typicalBuyerTags: ["Scientist / engineer", "R&D leader", "Informatics"],
    askTheseFirst: [
      "How many screening campaigns run in a typical year?",
      "How long does one campaign take from setup to hit review today?",
      "How much of that cycle time is queue-related delay versus active review and interpretation?",
      "How many scientist hours go into setup and review for each campaign?",
      "What happens when a promising campaign waits too long for a decision?",
    ],
    howToRead: {
      topDrivers:
        "Campaign volume, queue-related cycle delay, and scientist review effort usually drive the result most.",
      biggestAssumptions:
        "The output is sensitive to the queue-delay reduction assumption, and recovered scientist time is intentionally modeled as only a partial effect rather than 1:1 idle time.",
      validateNext:
        "Confirm annual campaign count, current end-to-end turnaround, and how much delay is really caused by backlog or resource contention.",
    },
  },
  "molecular-dynamics": {
    typicalBuyerTags: ["Scientist / engineer", "R&D leader", "IT / infrastructure"],
    askTheseFirst: [
      "How many molecular dynamics studies are run each year?",
      "How much queue delay do scientists experience before jobs start or complete?",
      "How many review or interpretation hours are tied to each study?",
      "Does demand spike around specific programs or milestone windows?",
      "What work gets delayed when simulation throughput falls behind?",
    ],
    howToRead: {
      topDrivers:
        "Study volume, queue delay, and the number of simulation hours waiting for review typically drive the model.",
      biggestAssumptions:
        "The biggest assumptions are throughput improvement and how much scientist productivity actually converts into more completed studies.",
      validateNext:
        "Validate study count, queue baseline, and whether burst demand is episodic or constant.",
    },
  },
  "cmc-process-modeling": {
    typicalBuyerTags: ["Scientist / engineer", "Manufacturing leader", "R&D leader"],
    askTheseFirst: [
      "How many development or scale-up studies are run each year?",
      "How many physical experiments are typically required before moving forward?",
      "What does one physical experiment or rework loop cost today?",
      "How long does one study cycle take from setup to decision?",
      "Which downstream milestones slip when process decisions arrive late?",
    ],
    howToRead: {
      topDrivers:
        "Physical experiment cost, study cycle time, and the number of development loops avoided drive most of the value.",
      biggestAssumptions:
        "The model depends heavily on how many physical iterations can realistically be replaced or reduced.",
      validateNext:
        "Validate experiment cost, current study cadence, and which process decisions are actually slowed today.",
    },
  },
  "design-verification": {
    typicalBuyerTags: ["Scientist / engineer", "R&D leader", "IT / infrastructure"],
    askTheseFirst: [
      "How many verification projects run in a typical year?",
      "What is the current turnaround from submission to usable result?",
      "How much of that delay is queue time versus actual runtime?",
      "How many engineers are blocked when verification results arrive late?",
      "What milestone risk shows up when verification backlogs build?",
    ],
    howToRead: {
      topDrivers:
        "Verification run volume, queue delay, and milestone pressure usually determine the size of the modeled impact.",
      biggestAssumptions:
        "The biggest assumptions are how much turnaround can improve and how much schedule value a faster verification cycle creates.",
      validateNext:
        "Confirm run count, queue baseline, and what schedule slip is worth in the actual program context.",
    },
  },
  "yield-optimization": {
    typicalBuyerTags: ["Scientist / engineer", "Manufacturing leader", "R&D leader"],
    askTheseFirst: [
      "How many yield-improvement cycles are run each quarter or year?",
      "How long does one learning loop take today?",
      "How many engineering hours go into each optimization cycle?",
      "What is the cost of waiting for the next iteration before acting?",
      "Where does the team feel the delay most: throughput, scrap, or release timing?",
    ],
    howToRead: {
      topDrivers:
        "Cycle count, time to learn, and the cost of waiting for another optimization loop usually matter most.",
      biggestAssumptions:
        "The result depends on how much engineering time and cycle-time reduction can actually be unlocked.",
      validateNext:
        "Validate learning-cycle volume, current delay per cycle, and where the team feels the cost of waiting most directly.",
    },
  },
  "eda-burst-compute": {
    typicalBuyerTags: ["IT / infrastructure", "Platform / governance team", "R&D leader"],
    askTheseFirst: [
      "How often do peak verification or tape-out windows occur?",
      "What peak capacity is carried mainly to cover those windows?",
      "How much backlog builds when those peaks hit?",
      "What does the fixed capacity for those peak windows cost annually?",
      "Would the current plan require buying more infrastructure for the next peak?",
    ],
    howToRead: {
      topDrivers:
        "Peak windows, backlog cleared during those windows, and the cost of idle fixed capacity drive the story.",
      biggestAssumptions:
        "The key assumptions are how often peaks occur and how much capacity would otherwise need to be overbuilt.",
      validateNext:
        "Validate peak-frequency, queue pain during peaks, and whether the current plan assumes fixed capacity expansion.",
    },
  },
  "manufacturing-line-simulation-digital-twin": {
    typicalBuyerTags: ["Manufacturing leader", "Scientist / engineer", "Operations"],
    askTheseFirst: [
      "How many simulation studies or plant scenarios are run each year?",
      "How long does it take to get from model setup to decision-ready output today?",
      "Where do teams wait most: compute, data prep, or review?",
      "What plant or line decisions are delayed when simulation takes too long?",
      "How many operations or engineering hours go into each scenario?",
    ],
    howToRead: {
      topDrivers:
        "Scenario volume, decision delay, and the time operations teams wait for line insight usually drive the estimate.",
      biggestAssumptions:
        "The output depends on how much scenario throughput improves and how much delay reduction changes real decisions.",
      validateNext:
        "Validate study volume, current elapsed time, and which plant or line decisions are blocked by analysis today.",
    },
  },
  "process-optimization": {
    typicalBuyerTags: ["Manufacturing leader", "Scientist / engineer", "Operations"],
    askTheseFirst: [
      "How many optimization studies or loops are run each year?",
      "What does one physical trial or experiment cost today?",
      "How long does one process-improvement cycle take end to end?",
      "How many engineering or operations hours go into each loop?",
      "Is value felt more in throughput, quality, or energy cost today?",
    ],
    howToRead: {
      topDrivers:
        "Physical trial cost, optimization-study volume, and the time between process decisions drive most of the result.",
      biggestAssumptions:
        "The biggest assumptions are how many physical experiments can be avoided and how much process tuning speeds up.",
      validateNext:
        "Validate trial cost, current optimization loop count, and whether value comes more from throughput, quality, or energy reduction.",
    },
  },
  "product-design-simulation": {
    typicalBuyerTags: ["Scientist / engineer", "R&D leader", "Product engineering"],
    askTheseFirst: [
      "How many design programs or major concept cycles run each year?",
      "How many simulation or prototype iterations are needed before a decision?",
      "What does one physical prototype or validation loop cost?",
      "How long does one design cycle take today?",
      "What slips when concept decisions arrive later than planned?",
    ],
    howToRead: {
      topDrivers:
        "Iteration count, prototype cost, and the speed of narrowing concepts are the main value drivers.",
      biggestAssumptions:
        "The output depends on how much prototype work can be reduced and whether concept decisions really accelerate.",
      validateNext:
        "Validate current iteration count, prototype spend, and how late concept decisions affect the program today.",
    },
  },
  "cfd-aero-design-exploration": {
    typicalBuyerTags: ["Scientist / engineer", "R&D leader", "Aero engineering"],
    askTheseFirst: [
      "How many aerodynamic studies or design loops run each year?",
      "How much queue or turnaround delay slows those studies today?",
      "What does one wind-tunnel test or physical validation loop cost?",
      "How many engineering hours go into each study or review cycle?",
      "Which design decisions are waiting on the results today?",
    ],
    howToRead: {
      topDrivers:
        "Simulation iteration volume, physical test cost, and queue delay typically drive the model.",
      biggestAssumptions:
        "The result is sensitive to how much earlier teams can rule in or rule out concepts before physical testing.",
      validateNext:
        "Validate iteration count, current wait time, and the actual spend tied to wind-tunnel or prototype loops.",
    },
  },
  "crash-structural-simulation": {
    typicalBuyerTags: ["Scientist / engineer", "R&D leader", "Vehicle engineering"],
    askTheseFirst: [
      "How many crash or structural validation cycles run in a year?",
      "What does one physical crash or validation test cost today?",
      "How often does late structural learning trigger redesign work?",
      "How long does one structural study cycle take before the team can act?",
      "How many more scenarios would the team run if turnaround improved?",
    ],
    howToRead: {
      topDrivers:
        "Physical validation cost, redesign-loop frequency, and how many structural scenarios can be tested up front drive the result.",
      biggestAssumptions:
        "The largest assumptions are fewer physical tests and lower late-stage design churn.",
      validateNext:
        "Validate current validation cost, late redesign frequency, and whether the team would actually run more structural scenarios.",
    },
  },
  "ev-battery-thermal-pack-optimization": {
    typicalBuyerTags: ["Scientist / engineer", "R&D leader", "Battery engineering"],
    askTheseFirst: [
      "How many thermal or pack-optimization studies run each year?",
      "How many design iterations are needed before the team is comfortable?",
      "What does one test loop or physical build-and-test cycle cost?",
      "How long does it take to move from one thermal iteration to the next?",
      "Where does late thermal learning create program churn today?",
    ],
    howToRead: {
      topDrivers:
        "Thermal design iterations, build-and-test cost, and the time required to converge on a pack design drive the estimate.",
      biggestAssumptions:
        "The result depends on how much physical testing can be reduced and how much iteration speed improves.",
      validateNext:
        "Validate the current number of thermal loops, the real cost of test cycles, and where cooling redesign shows up today.",
    },
  },
  "cfd-aero-performance": {
    typicalBuyerTags: ["Scientist / engineer", "R&D leader", "Aero engineering"],
    askTheseFirst: [
      "How many aero-performance studies are run in a typical year?",
      "What is the current turnaround from submission to usable result?",
      "How much queue delay do teams experience today?",
      "How many downstream design decisions wait on those results?",
      "What is the cost of delaying those decisions by another cycle?",
    ],
    howToRead: {
      topDrivers:
        "Aero study volume, turnaround speed, and the value of earlier design tradeoffs usually drive the result.",
      biggestAssumptions:
        "The model depends on how much faster the team can get decision-ready results and how often those results change the path forward.",
      validateNext:
        "Validate annual study count, current turnaround baseline, and which downstream decisions are actually waiting on the analysis.",
    },
  },
  "structural-fea": {
    typicalBuyerTags: ["Scientist / engineer", "R&D leader", "Structures engineering"],
    askTheseFirst: [
      "How many structural studies or major analysis loops run each year?",
      "What does one validation test or physical confirmation loop cost?",
      "How long does a structural decision cycle take today?",
      "How often do issues surface late enough to trigger redesign work?",
      "How many engineers are waiting when structural analysis falls behind?",
    ],
    howToRead: {
      topDrivers:
        "Structural study volume, validation-test cost, and the number of redesign loops avoided drive most of the impact.",
      biggestAssumptions:
        "The biggest assumptions are fewer physical validation events and more confidence before hardware testing.",
      validateNext:
        "Validate current test cost, study cadence, and how often structural issues surface late enough to cause program churn.",
    },
  },
  "multidisciplinary-design-exploration": {
    typicalBuyerTags: ["R&D leader", "Scientist / engineer", "Program leadership"],
    askTheseFirst: [
      "How many trade studies or design-space explorations run each year?",
      "How long does one cross-functional decision cycle take today?",
      "Where do multidisciplinary bottlenecks slow the team most?",
      "How many more scenarios would the team evaluate with faster turnaround?",
      "What program decisions get delayed when those studies stack up?",
    ],
    howToRead: {
      topDrivers:
        "Trade-study volume, delay in design decisions, and the number of variables explored per cycle usually drive the estimate.",
      biggestAssumptions:
        "The output depends on whether the team would truly evaluate more tradeoffs and make earlier cross-functional decisions.",
      validateNext:
        "Validate current trade-study count, decision bottlenecks, and where late multidisciplinary surprises are most expensive.",
    },
  },
  "reservoir-simulation-field-development-planning": {
    typicalBuyerTags: ["Scientist / engineer", "R&D leader", "Asset leadership"],
    askTheseFirst: [
      "How many reservoir or field-planning studies run each year?",
      "How many scenarios are evaluated per study today?",
      "How long does it take to get from simulation setup to planning decision?",
      "Where does compute or queue delay slow field-development planning most?",
      "What decisions or project value are exposed when planning is delayed?",
    ],
    howToRead: {
      topDrivers:
        "Scenario volume, planning delay, and the cost of waiting on field-development decisions are the main drivers.",
      biggestAssumptions:
        "The result depends on how much cycle time can be shortened and whether faster planning changes development decisions materially.",
      validateNext:
        "Validate annual study volume, planning delay baseline, and which field-development decisions are most exposed today.",
    },
  },
  "seismic-processing-imaging": {
    typicalBuyerTags: ["Scientist / engineer", "R&D leader", "Exploration leadership"],
    askTheseFirst: [
      "How many seismic projects are processed in a typical year?",
      "What is the current turnaround from data intake to interpretable output?",
      "How much backlog or queue delay builds during busy periods?",
      "How many geoscience hours are tied up waiting for processed results?",
      "What decisions or milestones slip when interpretation starts late?",
    ],
    howToRead: {
      topDrivers:
        "Project volume, processing turnaround, and the business value of earlier interpretation drive most of the estimate.",
      biggestAssumptions:
        "The biggest assumptions are turnaround improvement and the cost of interpretation decisions waiting on compute.",
      validateNext:
        "Validate annual project count, current backlog behavior, and where interpretation delay becomes commercially meaningful.",
    },
  },
  "drilling-production-optimization": {
    typicalBuyerTags: ["Operations", "Scientist / engineer", "R&D leader"],
    askTheseFirst: [
      "How many drilling or production optimization studies run each year?",
      "How long does it take to move from study request to decision-ready output today?",
      "How many engineering hours are spent per study or recommendation cycle?",
      "Where do operational decisions wait on analysis today?",
      "What is the cost of delaying those operating changes by another cycle?",
    ],
    howToRead: {
      topDrivers:
        "Optimization-study volume, delay in operating decisions, and engineering effort per study usually drive the output.",
      biggestAssumptions:
        "The result depends on how much decision speed can improve and whether more scenarios actually change drilling or production choices.",
      validateNext:
        "Validate annual optimization volume, current decision delay, and the real cost of waiting on operations changes.",
    },
  },
  "infrastructure-tco": {
    typicalBuyerTags: ["IT / infrastructure", "Platform / governance team", "Architecture"],
    askTheseFirst: [
      "What does the current environment cost annually across hardware, support, data center, and licenses?",
      "When is the next hardware refresh or major capacity purchase due?",
      "How much of the workload is expected to move to cloud, stay on-prem, or land in a hybrid model?",
      "What is the current productive utilization of the installed environment?",
      "Which fixed costs would truly go away under the future model?",
      "What migration or cutover cost needs to be included for a credible first pass?",
    ],
    howToRead: {
      topDrivers:
        "Hardware refresh, workload placement, productive utilization, and future cloud or hybrid spend drive the comparison most.",
      biggestAssumptions:
        "The output is sensitive to workload placement, commitment discounts, productive utilization, and the amount of fixed cost that can truly be avoided.",
      validateNext:
        "Validate current annual cost, installed capacity utilization, future cloud pricing assumptions, and the share of workloads expected to stay on-prem.",
    },
  },
  "peak-capacity-tco": {
    typicalBuyerTags: ["IT / infrastructure", "Platform / governance team", "Operations"],
    askTheseFirst: [
      "What is the gap between average utilization and peak utilization today?",
      "How often do burst windows happen and how long do they last?",
      "How much fixed capacity exists mainly to cover those peaks?",
      "What is the annual cost of idle capacity outside burst windows?",
      "What would elastic overflow or hybrid burst capacity cost per peak hour or period?",
    ],
    howToRead: {
      topDrivers:
        "Peak-built capacity cost, the peak-to-average utilization profile, burst duration, and elastic overflow pricing are the biggest drivers in the model.",
      biggestAssumptions:
        "The largest assumptions are how often burst windows happen, how long they last, and how much of today’s fixed capacity exists only for the peak.",
      validateNext:
        "Validate average versus peak utilization, annual burst frequency, burst duration, and the real baseline cost needed outside those peaks.",
    },
  },
  "it-operations-tco": {
    typicalBuyerTags: ["IT / infrastructure", "Platform / governance team", "IT operations"],
    askTheseFirst: [
      "How many provisioning requests and troubleshooting incidents happen each month today?",
      "How much labor goes into environment management, governance, backup, and patching today?",
      "What tooling or process cost is already in place to support the current model?",
      "What future-state tooling or automation cost needs to be included?",
      "What transition effort is needed to move to the target operating model?",
    ],
    howToRead: {
      topDrivers:
        "Provisioning labor, troubleshooting effort, environment management burden, and governance overhead drive the result most.",
      biggestAssumptions:
        "The model depends on how much manual effort can realistically be removed by category and what future-state tooling will cost.",
      validateNext:
        "Validate monthly request volume, current category hours, and the transition cost required to reach the future operating model.",
    },
  },
};
