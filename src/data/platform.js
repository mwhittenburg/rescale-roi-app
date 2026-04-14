import { advancedManufacturingIndustrialCalculators } from "../calculators/advanced-manufacturing-industrial";
import { aerospaceDefenseCalculators } from "../calculators/aerospace-defense";
import { automotiveMobilityCalculators } from "../calculators/automotive-mobility";
import { calculatorSections } from "../calculators/shared";
import { pharmaBiopharmaCalculators } from "../calculators/pharma-biopharma";
import { semiconductorCalculators } from "../calculators/semiconductor";

export { calculatorSections };

export const industries = [
  {
    id: "pharma-biopharma",
    name: "Pharma / Biopharma",
    summary:
      "ROI paths for computational drug discovery, simulation-led R&D, and development acceleration.",
    calculators: pharmaBiopharmaCalculators,
  },
  {
    id: "semiconductor",
    name: "Semiconductor",
    summary:
      "ROI paths for chip design, verification throughput, yield learning, and EDA burst capacity.",
    calculators: semiconductorCalculators,
  },
  {
    id: "advanced-manufacturing-industrial",
    name: "Advanced Manufacturing / Industrial",
    summary:
      "ROI paths for digital twins, line optimization, and product design simulation in industrial environments.",
    calculators: advancedManufacturingIndustrialCalculators,
  },
  {
    id: "automotive-mobility",
    name: "Automotive & Mobility",
    summary:
      "ROI paths for vehicle simulation, crash analysis, and battery or aero optimization workflows.",
    calculators: automotiveMobilityCalculators,
  },
  {
    id: "aerospace-defense",
    name: "Aerospace & Defense",
    summary:
      "ROI paths for CFD, FEA, and multidisciplinary design exploration across complex programs.",
    calculators: aerospaceDefenseCalculators,
  },
];

export const industriesById = Object.fromEntries(
  industries.map((industry) => [industry.id, industry]),
);

export const useCasesByKey = Object.fromEntries(
  industries.flatMap((industry) =>
    industry.calculators.map((calculator) => [
      `${industry.id}/${calculator.id}`,
      calculator,
    ]),
  ),
);
