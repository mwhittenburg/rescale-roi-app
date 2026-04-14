import { PageHeader } from "../components/PageHeader";
import {
  buildCalculatorPath,
  buildHomePath,
  buildIndustryPath,
} from "../router";

export function ReviewIndexPage({ industries, onNavigate }) {
  return (
    <>
      <PageHeader
        eyebrow="Review Index"
        title="End-to-end reviewer navigation"
        description="Use this plain-text index to click through every industry path and every calculator route in the platform."
        breadcrumbs={[
          { label: "Home", path: buildHomePath() },
          { label: "Review Index" },
        ]}
        onNavigate={onNavigate}
      />

      <section className="panel intro-panel">
        <div>
          <p className="section-kicker">Reviewer Start Here</p>
          <h2>Open any route directly and validate the seller flow end to end.</h2>
        </div>
        <p className="panel-copy">
          Every calculator below opens with seeded sample inputs and visible ROI
          outputs, so reviewers can inspect the experience without setup.
        </p>
      </section>

      <section className="review-index-grid">
        {industries.map((industry) => (
          <article key={industry.id} className="panel review-index-card">
            <p className="section-kicker">Industry</p>
            <h2>{industry.name}</h2>
            <p className="panel-copy">{industry.summary}</p>

            <div className="review-link-group">
              <button
                type="button"
                className="link-button review-link"
                onClick={() => onNavigate(buildIndustryPath(industry.id))}
              >
                Industry page: {buildIndustryPath(industry.id)}
              </button>
            </div>

            <div className="review-link-list">
              {industry.calculators.map((calculator) => {
                const path = buildCalculatorPath(industry.id, calculator.id);

                return (
                  <button
                    key={calculator.id}
                    type="button"
                    className="link-button review-link"
                    onClick={() => onNavigate(path)}
                  >
                    {calculator.name}: {path}
                  </button>
                );
              })}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
