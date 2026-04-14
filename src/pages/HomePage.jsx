import { CalculatorRecommendationHelper } from "../components/CalculatorRecommendationHelper";
import { IndustryCard } from "../components/IndustryCard";
import { PageHeader } from "../components/PageHeader";
import { industries, recommendationOptions } from "../data/platform";
import { buildHomePath, buildIndustryPath, buildReviewPath } from "../router";

export function HomePage({ onNavigate }) {
  return (
    <>
      <PageHeader
        eyebrow="ROI Calculator Platform"
        title="Find the right ROI calculator for your workflow"
        description="Choose an industry path or use the helper below to find the calculator that best matches your team, bottleneck, and decision needs."
        breadcrumbs={[{ label: "Home" }]}
        onNavigate={onNavigate}
      />

      <section className="panel intro-panel">
        <div>
          <p className="section-kicker">Start Here</p>
          <h2>Begin with the path that feels most natural for your conversation.</h2>
        </div>
        <p className="panel-copy">
          If you already know the industry, browse the vertical directly. If
          you are still narrowing the use case, use the helper to get a quick recommendation.
        </p>
      </section>

      <section className="entry-grid">
        <section className="panel choice-card">
          <div className="choice-copy">
            <p className="section-kicker">Browse By Industry</p>
            <h2>Choose the industry first, then open the workflow that best matches the conversation.</h2>
            <p className="panel-copy">
              This is the easiest path when the customer industry is already clear
              and you want to compare the calculators available in that vertical.
            </p>
          </div>
        </section>

        <CalculatorRecommendationHelper
          industries={industries}
          options={recommendationOptions}
          onNavigate={onNavigate}
        />
      </section>

      <section className="industry-grid">
        {industries.map((industry) => (
          <IndustryCard
            key={industry.id}
            industry={industry}
            onOpen={() => onNavigate(buildIndustryPath(industry.id))}
          />
        ))}
      </section>

      <section className="panel notes-panel">
        <div>
          <p className="section-kicker">Need A Plain Link Index?</p>
          <h2>Open a simple review page with direct links to every vertical and calculator.</h2>
        </div>
        <div className="notes-actions">
          <p className="panel-copy">
            Use this if you want a simple text-readable list of every route in the
            platform, including the industry landing pages and each calculator page.
          </p>
          <button type="button" className="ghost-button" onClick={() => onNavigate(buildReviewPath())}>
            Open Review Index
          </button>
        </div>
      </section>
    </>
  );
}
