export const platformCatalog = {
  industries: [
    {
      id: "pharma-biopharma",
      name: "Pharma / Biopharma",
      summary:
        "ROI paths for computational drug discovery, simulation-led R&D, and development acceleration.",
      useCases: [
        {
          id: "virtual-screening-docking",
          moduleKey: "pharma-biopharma/virtual-screening-docking",
        },
        {
          id: "molecular-dynamics",
          moduleKey: "pharma-biopharma/molecular-dynamics",
        },
        {
          id: "cmc-process-modeling",
          moduleKey: "pharma-biopharma/cmc-process-modeling",
        },
      ],
    },
    {
      id: "semiconductor",
      name: "Semiconductor",
      summary:
        "ROI paths for chip design, verification throughput, yield learning, and EDA burst capacity.",
      useCases: [
        {
          id: "design-verification",
          moduleKey: "semiconductor/design-verification",
        },
        {
          id: "yield-optimization",
          moduleKey: "semiconductor/yield-optimization",
        },
        {
          id: "eda-burst-compute",
          moduleKey: "semiconductor/eda-burst-compute",
        },
      ],
    },
    {
      id: "advanced-manufacturing-industrial",
      name: "Advanced Manufacturing / Industrial",
      summary:
        "ROI paths for digital twins, line optimization, and product design simulation in industrial environments.",
      useCases: [
        {
          id: "manufacturing-line-simulation-digital-twin",
          moduleKey:
            "advanced-manufacturing-industrial/manufacturing-line-simulation-digital-twin",
        },
        {
          id: "process-optimization",
          moduleKey: "advanced-manufacturing-industrial/process-optimization",
        },
        {
          id: "product-design-simulation",
          moduleKey: "advanced-manufacturing-industrial/product-design-simulation",
        },
      ],
    },
    {
      id: "automotive-mobility",
      name: "Automotive & Mobility",
      summary:
        "ROI paths for vehicle simulation, crash analysis, and battery or aero optimization workflows.",
      useCases: [
        {
          id: "cfd-aero-design-exploration",
          moduleKey: "automotive-mobility/cfd-aero-design-exploration",
        },
        {
          id: "crash-structural-simulation",
          moduleKey: "automotive-mobility/crash-structural-simulation",
        },
        {
          id: "ev-battery-thermal-pack-optimization",
          moduleKey: "automotive-mobility/ev-battery-thermal-pack-optimization",
        },
      ],
    },
    {
      id: "aerospace-defense",
      name: "Aerospace & Defense",
      summary:
        "ROI paths for CFD, FEA, and multidisciplinary design exploration across complex programs.",
      useCases: [
        {
          id: "cfd-aero-performance",
          moduleKey: "aerospace-defense/cfd-aero-performance",
        },
        {
          id: "structural-fea",
          moduleKey: "aerospace-defense/structural-fea",
        },
        {
          id: "multidisciplinary-design-exploration",
          moduleKey: "aerospace-defense/multidisciplinary-design-exploration",
        },
      ],
    },
  ],
};
