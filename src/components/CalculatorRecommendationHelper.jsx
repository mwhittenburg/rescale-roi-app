import { useMemo, useState } from "react";
import { buildCalculatorPath, buildIndustryPath } from "../router";

const defaultAnswers = {
  bottleneck: "",
  teamType: "",
  slowedDecision: "",
};

function getOptionLabel(options, groupKey, value) {
  return options[groupKey].find((option) => option.value === value)?.label ?? value;
}

function scoreCalculator(calculator, answers, options) {
  const selector = calculator.selector ?? {};
  let score = 0;
  const reasons = [];

  if (
    answers.bottleneck &&
    selector.bottlenecks?.includes(answers.bottleneck)
  ) {
    score += 3;
    reasons.push(`Matches the bottleneck: ${getOptionLabel(options, "bottlenecks", answers.bottleneck)}.`);
  }

  if (answers.teamType && selector.teamTypes?.includes(answers.teamType)) {
    score += 2;
    reasons.push(`Fits the team: ${getOptionLabel(options, "teamTypes", answers.teamType)}.`);
  }

  if (
    answers.slowedDecision &&
    selector.slowedDecisions?.includes(answers.slowedDecision)
  ) {
    score += 2;
    reasons.push(
      `Aligns to the slowed decision: ${getOptionLabel(
        options,
        "slowedDecisions",
        answers.slowedDecision,
      )}.`,
    );
  }

  return { score, reasons };
}

export function CalculatorRecommendationHelper({
  industries,
  options,
  onNavigate,
  className = "",
}) {
  const [answers, setAnswers] = useState(defaultAnswers);

  const allCalculators = useMemo(
    () =>
      industries.flatMap((industry) =>
        industry.calculators.map((calculator) => ({
          ...calculator,
          industryName: industry.name,
          industryId: industry.id,
        })),
      ),
    [industries],
  );

  const recommendations = useMemo(() => {
    const ranked = allCalculators
      .map((calculator) => ({
        calculator,
        ...scoreCalculator(calculator, answers, options),
      }))
      .filter((entry) => entry.score > 0)
      .sort(
        (left, right) =>
          right.score - left.score ||
          left.calculator.name.localeCompare(right.calculator.name),
      )
      .slice(0, 2);

    return ranked;
  }, [allCalculators, answers]);

  function updateAnswer(key, value) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  function resetAnswers() {
    setAnswers(defaultAnswers);
  }

  const isAtDefaultState =
    answers.bottleneck === "" &&
    answers.teamType === "" &&
    answers.slowedDecision === "";

  return (
    <section className={`panel choice-card ${className}`.trim()}>
      <div className="selector-header">
        <div className="choice-copy">
          <p className="section-kicker">Help Me Choose A Calculator</p>
          <h2>Choose based on the bottleneck, team, and decision being slowed down.</h2>
          <p className="panel-copy">
            Answer three quick questions to see the best-fit calculators.
          </p>
        </div>
        <button
          type="button"
          className="ghost-button compact-ghost-button"
          onClick={resetAnswers}
          disabled={isAtDefaultState}
        >
          Reset
        </button>
      </div>

      <div className="selector-grid">
        <label className="selector-field">
          <span className="field-label">What is the biggest bottleneck?</span>
          <select
            value={answers.bottleneck}
            onChange={(event) => updateAnswer("bottleneck", event.target.value)}
          >
            <option value="">Choose one</option>
            {options.bottlenecks.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="selector-field">
          <span className="field-label">Which team or workflow is involved?</span>
          <select
            value={answers.teamType}
            onChange={(event) => updateAnswer("teamType", event.target.value)}
          >
            <option value="">Choose one</option>
            {options.teamTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="selector-field selector-field-wide">
          <span className="field-label">What decision is being slowed down?</span>
          <select
            value={answers.slowedDecision}
            onChange={(event) => updateAnswer("slowedDecision", event.target.value)}
          >
            <option value="">Choose one</option>
            {options.slowedDecisions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="recommendation-list">
        {recommendations.length > 0 ? (
          recommendations.map(({ calculator, reasons }, index) => (
            <article key={calculator.id} className="recommendation-card">
              <p className="section-kicker">
                {index === 0 ? "Best match" : "Also consider"}
              </p>
              <h3>{calculator.name}</h3>
              <p className="panel-copy">{calculator.teaser}</p>
              <p className="recommendation-meta">{calculator.industryName}</p>
              <div className="recommendation-reason-list">
                {reasons.map((reason) => (
                  <p key={reason} className="panel-copy">
                    {reason}
                  </p>
                ))}
              </div>
              <div className="recommendation-actions">
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => onNavigate(buildCalculatorPath(calculator.industryId, calculator.id))}
                >
                  Open calculator
                </button>
                <button
                  type="button"
                  className="link-button"
                  onClick={() => onNavigate(buildIndustryPath(calculator.industryId))}
                >
                  View industry path
                </button>
              </div>
            </article>
          ))
        ) : (
          <p className="panel-copy compact-helper-copy">
            Pick one or more answers above to see recommended calculators.
          </p>
        )}
      </div>
    </section>
  );
}
