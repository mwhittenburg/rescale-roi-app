function useCase(id, moduleKey, config) {
  return {
    id,
    moduleKey,
    status: "fully implemented",
    ...config,
  };
}

export const platformCatalog = {
  buyerPaths: [
    {
      id: "lob",
      name: "Build ROI for Line of Business",
      summary:
        "Use industry-specific workflow calculators for science, engineering, manufacturing, and operations conversations.",
      audience:
        "Best when the buyer conversation is about workflow speed, design iteration, throughput, or physical testing reduction.",
    },
    {
      id: "it",
      name: "Build ROI for IT",
      summary:
        "Use IT-focused calculators for capacity economics, operations efficiency, governance, and platform standardization.",
      audience:
        "Best when the buyer conversation is about infrastructure, support effort, operating model, or governed compute delivery.",
    },
  ],
  recommendationOptions: {
    bottlenecks: [
      { value: "throughput", label: "Need more throughput" },
      { value: "queue-time", label: "Long queue time" },
      { value: "physical-testing", label: "Too much physical testing" },
      { value: "design-iteration", label: "Slow design iteration" },
      { value: "burst-demand", label: "Peak or burst demand" },
      { value: "delayed-decisions", label: "Delayed decisions" },
    ],
    teamTypes: [
      { value: "r-and-d", label: "R&D or science team" },
      { value: "engineering", label: "Engineering or CAE team" },
      { value: "manufacturing-operations", label: "Manufacturing or operations" },
      { value: "hpc-it", label: "HPC or technical computing" },
      { value: "subsurface", label: "Subsurface or geoscience" },
    ],
    slowedDecisions: [
      { value: "prioritization", label: "Which candidates or concepts to prioritize" },
      { value: "validation", label: "Whether the design is ready for validation" },
      { value: "scale-up", label: "How to scale up or tune a process" },
      { value: "operations", label: "How to improve operations or production" },
      { value: "field-planning", label: "How to plan development or drilling" },
      { value: "capacity", label: "How to handle peak compute demand" },
    ],
  },
  industries: [
    {
      id: "pharma-biopharma",
      name: "Pharma / Biopharma",
      summary:
        "ROI paths for computational drug discovery, simulation-led R&D, and development acceleration.",
      bestForConversations:
        "Drug discovery throughput, molecular insight, and development programs slowed by physical iteration.",
      typicalBuyer:
        "Computational chemistry, modeling and simulation, informatics, or CMC technical leaders.",
      commonBottleneck:
        "Queue time and manual review effort are slowing candidate progression and development decisions.",
      useCases: [
        useCase("virtual-screening-docking", "pharma-biopharma/virtual-screening-docking", {
          selector: {
            bottlenecks: ["throughput", "queue-time"],
            teamTypes: ["r-and-d"],
            slowedDecisions: ["prioritization"],
          },
          sellerGuidance: {
            bestFitWhen:
              "The team wants to run more screening campaigns and reduce delay between target setup and hit review.",
            askTheseFirst: [
              "How many campaigns run in a typical year?",
              "Where does turnaround slow down today: compute queue, scientist review, or both?",
              "What happens when a promising campaign waits too long?",
            ],
            whatThisEstimates:
              "The model estimates labor savings, compute efficiency, and value from shortening campaign cycle time.",
          },
        }),
        useCase("molecular-dynamics", "pharma-biopharma/molecular-dynamics", {
          selector: {
            bottlenecks: ["throughput", "queue-time", "burst-demand"],
            teamTypes: ["r-and-d", "hpc-it"],
            slowedDecisions: ["prioritization"],
          },
          sellerGuidance: {
            bestFitWhen:
              "The team is waiting on simulation turnaround and wants more studies completed without growing fixed infrastructure.",
            askTheseFirst: [
              "How many studies are being run each year?",
              "How often do jobs sit in queue before scientists can review results?",
              "Does demand spike around specific programs or milestones?",
            ],
            whatThisEstimates:
              "The model estimates scientist time savings, added study capacity, and economic value from faster simulation throughput.",
          },
        }),
        useCase("cmc-process-modeling", "pharma-biopharma/cmc-process-modeling", {
          selector: {
            bottlenecks: ["physical-testing", "delayed-decisions"],
            teamTypes: ["r-and-d", "manufacturing-operations"],
            slowedDecisions: ["scale-up"],
          },
          sellerGuidance: {
            bestFitWhen:
              "The customer is using too many physical studies to make development or scale-up decisions.",
            askTheseFirst: [
              "How many development studies are needed before the team is comfortable moving forward?",
              "How expensive are the physical experiments or rework loops?",
              "Where do delayed process decisions create downstream risk?",
            ],
            whatThisEstimates:
              "The model estimates reduced physical iteration, faster study cycles, and the value of more confident development decisions.",
          },
        }),
      ],
    },
    {
      id: "semiconductor",
      name: "Semiconductor",
      summary:
        "ROI paths for chip design, verification throughput, yield learning, and EDA burst capacity.",
      bestForConversations:
        "Tape-out readiness, verification backlog, yield iteration speed, and peak EDA demand planning.",
      typicalBuyer:
        "Verification leads, CAD or EDA infrastructure teams, and silicon engineering managers.",
      commonBottleneck:
        "Project peaks create queue delays that slow verification cycles, learning loops, and release readiness.",
      useCases: [
        useCase("design-verification", "semiconductor/design-verification", {
          selector: {
            bottlenecks: ["queue-time", "burst-demand"],
            teamTypes: ["engineering", "hpc-it"],
            slowedDecisions: ["validation", "capacity"],
          },
          sellerGuidance: {
            bestFitWhen:
              "Verification runs are stacking up and the team is worried about schedule pressure before tape-out milestones.",
            askTheseFirst: [
              "How many verification runs are typical per project?",
              "What is the average wait time before a run starts?",
              "When demand spikes, what work gets delayed?",
            ],
            whatThisEstimates:
              "The model estimates hours saved, reduced turnaround, and schedule value from faster verification throughput.",
          },
        }),
        useCase("yield-optimization", "semiconductor/yield-optimization", {
          selector: {
            bottlenecks: ["throughput", "delayed-decisions"],
            teamTypes: ["engineering"],
            slowedDecisions: ["operations"],
          },
          sellerGuidance: {
            bestFitWhen:
              "The customer wants faster learning cycles and more chances to tune yield before costs escalate.",
            askTheseFirst: [
              "How many yield-learning cycles happen in a year?",
              "How long does each cycle take from analysis to action?",
              "What is the business cost of waiting one more cycle for insight?",
            ],
            whatThisEstimates:
              "The model estimates engineering efficiency, cycle-time reduction, and value from accelerating process insight.",
          },
        }),
        useCase("eda-burst-compute", "semiconductor/eda-burst-compute", {
          selector: {
            bottlenecks: ["burst-demand", "queue-time"],
            teamTypes: ["hpc-it", "engineering"],
            slowedDecisions: ["capacity"],
          },
          sellerGuidance: {
            bestFitWhen:
              "The organization sees short peak windows where compute demand outruns installed capacity.",
            askTheseFirst: [
              "How often do peak demand windows happen?",
              "How much work sits waiting during those periods?",
              "What is the cost of overbuilding fixed capacity versus missing a milestone?",
            ],
            whatThisEstimates:
              "The model estimates capacity relief, queue-time reduction, and the economic value of clearing peak EDA demand.",
          },
        }),
      ],
    },
    {
      id: "advanced-manufacturing-industrial",
      name: "Advanced Manufacturing / Industrial",
      summary:
        "ROI paths for digital twins, line optimization, and product design simulation in industrial environments.",
      bestForConversations:
        "Factory planning, process tuning, and engineering teams trying to replace slow physical iteration with simulation.",
      typicalBuyer:
        "Manufacturing engineering, digital twin leaders, process engineering, and simulation managers.",
      commonBottleneck:
        "Teams are waiting on physical trials and slow study cycles before making line or product decisions.",
      useCases: [
        useCase(
          "manufacturing-line-simulation-digital-twin",
          "advanced-manufacturing-industrial/manufacturing-line-simulation-digital-twin",
          {
            selector: {
              bottlenecks: ["throughput", "delayed-decisions"],
              teamTypes: ["manufacturing-operations", "engineering"],
              slowedDecisions: ["operations"],
            },
            sellerGuidance: {
              bestFitWhen:
                "The conversation is about evaluating more line scenarios before changing the factory floor.",
              askTheseFirst: [
                "How many line studies are run in a quarter or year?",
                "How long does it take to get one scenario reviewed?",
                "What is the cost of delay when a line change is waiting on analysis?",
              ],
              whatThisEstimates:
                "The model estimates time saved, scenario capacity unlocked, and value from faster operational decision speed.",
            },
          },
        ),
        useCase("process-optimization", "advanced-manufacturing-industrial/process-optimization", {
          selector: {
            bottlenecks: ["physical-testing", "throughput"],
            teamTypes: ["manufacturing-operations", "engineering"],
            slowedDecisions: ["scale-up", "operations"],
          },
          sellerGuidance: {
            bestFitWhen:
              "The customer is running expensive process experiments and wants more virtual optimization before touching production.",
            askTheseFirst: [
              "How many optimization studies happen per year?",
              "What does a physical trial or experiment cost today?",
              "Is the main value throughput, scrap reduction, or energy efficiency?",
            ],
            whatThisEstimates:
              "The model estimates fewer physical trials, faster optimization cycles, and economic value from improved process performance.",
          },
        }),
        useCase(
          "product-design-simulation",
          "advanced-manufacturing-industrial/product-design-simulation",
          {
            selector: {
              bottlenecks: ["design-iteration", "physical-testing"],
              teamTypes: ["engineering"],
              slowedDecisions: ["prioritization", "validation"],
            },
            sellerGuidance: {
              bestFitWhen:
                "Engineering wants to compare more concepts with fewer prototype loops before locking a design.",
              askTheseFirst: [
                "How many iterations or studies are typical per program?",
                "How costly is each physical prototype or redesign cycle?",
                "What happens when concept decisions arrive late?",
              ],
              whatThisEstimates:
                "The model estimates prototype reduction, engineering time savings, and value from accelerating concept evaluation.",
            },
          },
        ),
      ],
    },
    {
      id: "automotive-mobility",
      name: "Automotive & Mobility",
      summary:
        "ROI paths for vehicle simulation, crash analysis, and battery or aero optimization workflows.",
      bestForConversations:
        "Vehicle program speed, prototype reduction, and simulation throughput across aero, crash, and battery teams.",
      typicalBuyer:
        "CAE leaders, vehicle engineering managers, and battery or thermal engineering teams.",
      commonBottleneck:
        "Program teams are waiting on simulation turnaround or physical testing before making design decisions.",
      useCases: [
        useCase("cfd-aero-design-exploration", "automotive-mobility/cfd-aero-design-exploration", {
          selector: {
            bottlenecks: ["design-iteration", "physical-testing", "queue-time"],
            teamTypes: ["engineering"],
            slowedDecisions: ["prioritization", "validation"],
          },
          sellerGuidance: {
            bestFitWhen:
              "The team wants to compare more aero or thermal concepts before committing to physical testing.",
            askTheseFirst: [
              "How many simulation iterations happen per program?",
              "How much delay is caused by queue time versus engineering review?",
              "How expensive are wind tunnel or prototype test loops?",
            ],
            whatThisEstimates:
              "The model estimates simulation-cycle acceleration, prototype test reduction, and value from faster concept exploration.",
          },
        }),
        useCase("crash-structural-simulation", "automotive-mobility/crash-structural-simulation", {
          selector: {
            bottlenecks: ["physical-testing", "design-iteration"],
            teamTypes: ["engineering"],
            slowedDecisions: ["validation"],
          },
          sellerGuidance: {
            bestFitWhen:
              "The conversation is about testing more structural scenarios before expensive physical validation.",
            askTheseFirst: [
              "How many crash or structural simulations happen per program?",
              "How expensive is each physical test or validation event?",
              "What kind of redesign loops show up late today?",
            ],
            whatThisEstimates:
              "The model estimates reduced test dependence, faster structural insight, and value from fewer late-stage design loops.",
          },
        }),
        useCase(
          "ev-battery-thermal-pack-optimization",
          "automotive-mobility/ev-battery-thermal-pack-optimization",
          {
            selector: {
              bottlenecks: ["design-iteration", "physical-testing"],
              teamTypes: ["engineering"],
              slowedDecisions: ["validation", "prioritization"],
            },
            sellerGuidance: {
              bestFitWhen:
                "Battery teams want faster thermal design iterations without waiting on costly builds and tests.",
              askTheseFirst: [
                "How many design iterations happen per battery study?",
                "How expensive are physical builds or thermal tests?",
                "Where do cooling redesigns slow the program down?",
              ],
              whatThisEstimates:
                "The model estimates faster iteration cycles, reduced testing burden, and economic value from better thermal decision speed.",
            },
          },
        ),
      ],
    },
    {
      id: "aerospace-defense",
      name: "Aerospace & Defense",
      summary:
        "ROI paths for CFD, FEA, and multidisciplinary design exploration across complex programs.",
      bestForConversations:
        "Trade-study speed, validation readiness, and program schedule confidence across complex engineering programs.",
      typicalBuyer:
        "Analysis leads, program engineering, chief engineers, and technical computing teams supporting major programs.",
      commonBottleneck:
        "Program teams need more trade studies and faster simulation turnaround before committing to validation decisions.",
      useCases: [
        useCase("cfd-aero-performance", "aerospace-defense/cfd-aero-performance", {
          selector: {
            bottlenecks: ["design-iteration", "queue-time"],
            teamTypes: ["engineering"],
            slowedDecisions: ["prioritization", "validation"],
          },
          sellerGuidance: {
            bestFitWhen:
              "The team wants more aerodynamic performance scenarios evaluated before a major program decision.",
            askTheseFirst: [
              "How many aero studies run in a typical year?",
              "Where does delay show up: queue time, turnaround time, or engineering review?",
              "What decision is waiting on those results?",
            ],
            whatThisEstimates:
              "The model estimates engineering time savings, faster trade studies, and value from improved program decision velocity.",
          },
        }),
        useCase("structural-fea", "aerospace-defense/structural-fea", {
          selector: {
            bottlenecks: ["physical-testing", "design-iteration"],
            teamTypes: ["engineering"],
            slowedDecisions: ["validation"],
          },
          sellerGuidance: {
            bestFitWhen:
              "The customer needs more structural insight before costly validation, prototype, or redesign steps.",
            askTheseFirst: [
              "How many structural studies are run per program?",
              "What does a physical validation event cost?",
              "What late-stage redesign risk is hardest to absorb today?",
            ],
            whatThisEstimates:
              "The model estimates reduced validation rework, faster structural learning, and value from stronger readiness before physical testing.",
          },
        }),
        useCase(
          "multidisciplinary-design-exploration",
          "aerospace-defense/multidisciplinary-design-exploration",
          {
            selector: {
              bottlenecks: ["delayed-decisions", "design-iteration"],
              teamTypes: ["engineering", "hpc-it"],
              slowedDecisions: ["prioritization", "validation"],
            },
            sellerGuidance: {
              bestFitWhen:
                "The conversation is about exploring more design tradeoffs earlier across multiple variables and teams.",
              askTheseFirst: [
                "How many trade studies are being run today?",
                "How costly is one delayed program decision?",
                "What happens when multidisciplinary changes surface late?",
              ],
              whatThisEstimates:
                "The model estimates faster trade-study cycles, improved schedule confidence, and value from reducing late design churn.",
            },
          },
        ),
      ],
    },
    {
      id: "oil-gas",
      name: "Oil & Gas",
      summary:
        "ROI paths for subsurface decision speed, seismic turnaround, field planning, and drilling or production optimization.",
      bestForConversations:
        "Field planning, interpretation speed, and operational optimization decisions that depend on timely compute-heavy analysis.",
      typicalBuyer:
        "Subsurface managers, geoscience leads, reservoir engineers, and technical computing teams.",
      commonBottleneck:
        "Slow processing or scenario evaluation is delaying field-development, interpretation, and production decisions.",
      useCases: [
        useCase(
          "reservoir-simulation-field-development-planning",
          "oil-gas/reservoir-simulation-field-development-planning",
          {
            selector: {
              bottlenecks: ["delayed-decisions", "queue-time"],
              teamTypes: ["subsurface"],
              slowedDecisions: ["field-planning"],
            },
            sellerGuidance: {
              bestFitWhen:
                "Field planning depends on evaluating more reservoir scenarios without waiting through long compute cycles.",
              askTheseFirst: [
                "How many reservoir studies and scenarios run in a year?",
                "What is the cost of waiting on a planning decision?",
                "How often does the team want to test more cases than capacity allows?",
              ],
              whatThisEstimates:
                "The model estimates scenario-cycle acceleration, labor efficiency, and value from faster field development decisions.",
            },
          },
        ),
        useCase("seismic-processing-imaging", "oil-gas/seismic-processing-imaging", {
          selector: {
            bottlenecks: ["queue-time", "burst-demand", "delayed-decisions"],
            teamTypes: ["subsurface", "hpc-it"],
            slowedDecisions: ["field-planning"],
          },
          sellerGuidance: {
            bestFitWhen:
              "The team is waiting too long for seismic processing before interpretation and subsurface decisions can move forward.",
            askTheseFirst: [
              "How many seismic projects are processed each year?",
              "Is backlog constant or does demand come in bursts?",
              "What decision is blocked while interpretation waits on processing?",
            ],
            whatThisEstimates:
              "The model estimates faster turnaround, specialist productivity, and value from earlier interpretation decisions.",
          },
        }),
        useCase("drilling-production-optimization", "oil-gas/drilling-production-optimization", {
          selector: {
            bottlenecks: ["throughput", "delayed-decisions"],
            teamTypes: ["subsurface", "manufacturing-operations"],
            slowedDecisions: ["operations", "field-planning"],
          },
          sellerGuidance: {
            bestFitWhen:
              "The customer wants more optimization scenarios evaluated before drilling or production choices are locked in.",
            askTheseFirst: [
              "How many optimization studies happen in a typical year?",
              "What operational decisions are waiting on analysis today?",
              "How costly is one delayed drilling or production decision?",
            ],
            whatThisEstimates:
              "The model estimates engineering time savings, faster optimization cycles, and value from reducing slow operational decision loops.",
          },
        }),
      ],
    },
  ],
  itPath: {
    id: "it",
    name: "IT",
    title: "Build ROI for IT",
    summary:
      "ROI paths for burst capacity economics, IT operations efficiency, and governed compute delivery.",
    bestForConversations:
      "Capacity overflow, support burden, governance consistency, and operating-model ROI for technical computing teams.",
    typicalBuyer:
      "HPC or infrastructure leaders, platform engineering, IT operations, and governance or architecture stakeholders.",
    commonBottleneck:
      "Peak demand, manual support effort, and fragmented compute processes are creating avoidable cost and delay.",
    useCases: [
      useCase("burst-capacity-overflow", "it/burst-capacity-overflow", {
        sellerGuidance: {
          bestFitWhen:
            "The IT story is about peak workload demand, queue pressure, and the cost of adding fixed capacity that sits idle later.",
          askTheseFirst: [
            "How often do peak demand windows overwhelm current infrastructure?",
            "What work is delayed when capacity runs short?",
            "How much fixed capacity is being considered just to cover those peaks?",
          ],
          whatThisEstimates:
            "The model estimates hours saved, queue-time reduction, overflow capacity value, and the economics of avoiding overbuilt infrastructure.",
        },
      }),
      useCase("it-operations-efficiency", "it/it-operations-efficiency", {
        sellerGuidance: {
          bestFitWhen:
            "The customer spends too much technical time on provisioning, troubleshooting, and keeping environments moving for users.",
          askTheseFirst: [
            "How many requests and support incidents hit the team in a normal month?",
            "Where is the most manual effort today: provisioning, troubleshooting, or environment maintenance?",
            "How long do users wait before they can actually start working?",
          ],
          whatThisEstimates:
            "The model estimates labor savings, faster request turnaround, and the value of freeing the IT team to support more work with less manual effort.",
        },
      }),
      useCase("governance-standardization", "it/governance-standardization", {
        sellerGuidance: {
          bestFitWhen:
            "The customer is trying to replace fragmented compute practices with a more governed and standardized operating model.",
          askTheseFirst: [
            "How many teams are still using inconsistent or unmanaged workflows?",
            "How much time is spent on reporting, exception handling, or governance rework today?",
            "What project or decision delays show up when governance is reactive instead of built in?",
          ],
          whatThisEstimates:
            "The model estimates governance labor savings, reduced delay from fragmented workflows, and the value of standardizing how teams consume compute services.",
        },
      }),
    ],
  },
};
