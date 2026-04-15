import { calculatorModules } from "./calculatorModules";
import { platformCatalog } from "./catalog";

export { platformCatalog };
export const buyerPaths = platformCatalog.buyerPaths;
export const recommendationOptions = platformCatalog.recommendationOptions;

function resolveUseCase(industry, useCaseConfig) {
  const calculator = calculatorModules[useCaseConfig.moduleKey];

  if (!calculator) {
    throw new Error(
      `Missing calculator module for "${useCaseConfig.moduleKey}" in industry "${industry.id}".`,
    );
  }

  if (calculator.id !== useCaseConfig.id) {
    throw new Error(
      `Calculator id mismatch for "${useCaseConfig.moduleKey}". Expected "${useCaseConfig.id}" but received "${calculator.id}".`,
    );
  }

  return {
    ...calculator,
    ...useCaseConfig,
  };
}

export const industries = platformCatalog.industries.map((industry) => ({
  ...industry,
  calculators: industry.useCases.map((useCase) => resolveUseCase(industry, useCase)),
}));

export const itPath = {
  ...platformCatalog.itPath,
  calculators: platformCatalog.itPath.useCases.map((useCase) =>
    resolveUseCase(platformCatalog.itPath, useCase),
  ),
};

export const industriesById = Object.fromEntries(
  industries.map((industry) => [industry.id, industry]),
);

export const itCalculatorsById = Object.fromEntries(
  itPath.calculators.map((calculator) => [calculator.id, calculator]),
);

export const useCasesByKey = Object.fromEntries(
  industries.flatMap((industry) =>
    industry.calculators.map((calculator) => [
      `${industry.id}/${calculator.id}`,
      calculator,
    ]),
  ),
);
