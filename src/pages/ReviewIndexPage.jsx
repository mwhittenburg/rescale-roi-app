import { PageHeader } from "../components/PageHeader";
import {
  buildCalculatorPath,
  buildHomePath,
  buildIndustryPath,
  buildItCalculatorPath,
  buildItPath,
  buildLobPath,
} from "../router";

export function ReviewIndexPage({ industries, itPath, onNavigate }) {
  return (
    <>
      <PageHeader
        eyebrow="Review Index"
        title="End-to-end reviewer navigation"
        description="Use this plain-text index to click through the buyer-path homepage, the Line of Business routes, the IT routes, and every calculator in the platform."
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
        <article className="panel review-index-card">
          <p className="section-kicker">Buyer Paths</p>
          <h2>Top-level navigation</h2>
          <div className="review-link-list">
            <button
              type="button"
              className="link-button review-link"
              onClick={() => onNavigate(buildHomePath())}
            >
              Buyer-path homepage: {buildHomePath()}
            </button>
            <button
              type="button"
              className="link-button review-link"
              onClick={() => onNavigate(buildLobPath())}
            >
              Line of Business landing page: {buildLobPath()}
            </button>
            <button
              type="button"
              className="link-button review-link"
              onClick={() => onNavigate(buildItPath())}
            >
              IT landing page: {buildItPath()}
            </button>
          </div>
        </article>
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

        <article key={itPath.id} className="panel review-index-card">
          <p className="section-kicker">IT Path</p>
          <h2>{itPath.title}</h2>
          <p className="panel-copy">{itPath.summary}</p>

          <div className="review-link-group">
            <button
              type="button"
              className="link-button review-link"
              onClick={() => onNavigate(buildItPath())}
            >
              IT page: {buildItPath()}
            </button>
          </div>

          <div className="review-link-list">
            {itPath.calculators.map((calculator) => {
              const path = buildItCalculatorPath(calculator.id);

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
      </section>
    </>
  );
}
