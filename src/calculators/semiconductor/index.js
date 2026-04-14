import { designVerification } from "./design-verification";
import { edaBurstCompute } from "./eda-burst-compute";
import { yieldOptimization } from "./yield-optimization";

export const semiconductorCalculators = [
  designVerification,
  yieldOptimization,
  edaBurstCompute,
];
