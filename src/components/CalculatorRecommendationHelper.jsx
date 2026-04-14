import { useMemo, useState } from "react";
import { buildCalculatorPath, buildIndustryPath } from "../router";

function scoreCalculator(calculator, answers) {
  const selector = calculator.selector ?? {};
  let score = 0;

  if (
    answers.bottleneck &&
    selector.bottlenecks?.includes(answers.bottleneck)
  ) {
    score += 3;
  }

  if (answers.teamType && selector.teamTypes?.includes(answers.teamType)) {
    score += 2;
  }

  if (
    answers.slowedDecision &&
    selector.slowedDecisions?.includes(answers.slowedDecision)
  ) {
    score += 2;
  }

  return score;
}

export function CalculatorRecommendationHelper({
  industries,
  options,
  onNavigate,
}) {
  const [answers, setAnswers] = useState({
    bottleneck: "",
    teamType: "",
    slowedDecision: "",
  });

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
        score: scoreCalculator(calculator, answers),
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

  return (
    <section className="panel choice-card">
      <div className="choice-copy">
        <p className="section-kicker">Help Me Choose A Calculator</p>
        <h2>Start with the bottleneck, team, and decision that is being slowed down.</h2>
        <p className="panel-copy">
          This lightweight guide points a seller to the 1 to 2 calculators most
          likely to fit the conversation.
        </p>
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

        <label className="selector-field">
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
          recommendations.map(({ calculator }) => (
            <article key={calculator.id} className="recommendation-card">
              <p className="section-kicker">{calculator.industryName}</p>
              <h3>{calculator.name}</h3>
              <p className="panel-copy">{calculator.teaser}</p>
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
          <p className="panel-copy">
            Pick one or more answers above to see recommended calculators.
          </p>
        )}
      </div>
    </section>
  );
}
