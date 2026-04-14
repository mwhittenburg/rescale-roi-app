import { manufacturingLineSimulationDigitalTwin } from "../calculators/advanced-manufacturing-industrial/manufacturing-line-simulation-digital-twin";
import { processOptimization } from "../calculators/advanced-manufacturing-industrial/process-optimization";
import { productDesignSimulation } from "../calculators/advanced-manufacturing-industrial/product-design-simulation";
import { cfdAeroPerformance } from "../calculators/aerospace-defense/cfd-aero-performance";
import { multidisciplinaryDesignExploration } from "../calculators/aerospace-defense/multidisciplinary-design-exploration";
import { structuralFea } from "../calculators/aerospace-defense/structural-fea";
import { cfdAeroDesignExploration } from "../calculators/automotive-mobility/cfd-aero-design-exploration";
import { crashStructuralSimulation } from "../calculators/automotive-mobility/crash-structural-simulation";
import { evBatteryThermalPackOptimization } from "../calculators/automotive-mobility/ev-battery-thermal-pack-optimization";
import { cmcProcessModeling } from "../calculators/pharma-biopharma/cmc-process-modeling";
import { molecularDynamics } from "../calculators/pharma-biopharma/molecular-dynamics";
import { virtualScreeningDocking } from "../calculators/pharma-biopharma/virtual-screening-docking";
import { drillingProductionOptimization } from "../calculators/oil-gas/drilling-production-optimization";
import { reservoirSimulationFieldDevelopmentPlanning } from "../calculators/oil-gas/reservoir-simulation-field-development-planning";
import { seismicProcessingImaging } from "../calculators/oil-gas/seismic-processing-imaging";
import { designVerification } from "../calculators/semiconductor/design-verification";
import { edaBurstCompute } from "../calculators/semiconductor/eda-burst-compute";
import { yieldOptimization } from "../calculators/semiconductor/yield-optimization";

export const calculatorModules = {
  "pharma-biopharma/virtual-screening-docking": virtualScreeningDocking,
  "pharma-biopharma/molecular-dynamics": molecularDynamics,
  "pharma-biopharma/cmc-process-modeling": cmcProcessModeling,
  "semiconductor/design-verification": designVerification,
  "semiconductor/yield-optimization": yieldOptimization,
  "semiconductor/eda-burst-compute": edaBurstCompute,
  "advanced-manufacturing-industrial/manufacturing-line-simulation-digital-twin":
    manufacturingLineSimulationDigitalTwin,
  "advanced-manufacturing-industrial/process-optimization": processOptimization,
  "advanced-manufacturing-industrial/product-design-simulation":
    productDesignSimulation,
  "automotive-mobility/cfd-aero-design-exploration": cfdAeroDesignExploration,
  "automotive-mobility/crash-structural-simulation": crashStructuralSimulation,
  "automotive-mobility/ev-battery-thermal-pack-optimization":
    evBatteryThermalPackOptimization,
  "aerospace-defense/cfd-aero-performance": cfdAeroPerformance,
  "aerospace-defense/structural-fea": structuralFea,
  "aerospace-defense/multidisciplinary-design-exploration":
    multidisciplinaryDesignExploration,
  "oil-gas/reservoir-simulation-field-development-planning":
    reservoirSimulationFieldDevelopmentPlanning,
  "oil-gas/seismic-processing-imaging": seismicProcessingImaging,
  "oil-gas/drilling-production-optimization": drillingProductionOptimization,
};
