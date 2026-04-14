import { cmcProcessModeling } from "./cmc-process-modeling";
import { molecularDynamics } from "./molecular-dynamics";
import { virtualScreeningDocking } from "./virtual-screening-docking";

export const pharmaBiopharmaCalculators = [
  virtualScreeningDocking,
  molecularDynamics,
  cmcProcessModeling,
];
