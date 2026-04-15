import { CalculatorRecommendationHelper } from "../components/CalculatorRecommendationHelper";
import { IndustryCard } from "../components/IndustryCard";
import { PageHeader } from "../components/PageHeader";
import { industries, recommendationOptions } from "../data/platform";
import {
  buildHomePath,
  buildIndustryPath,
  buildReviewPath,
} from "../router";

export function LobHomePage({ onNavigate }) {
  return (
    <>
      <PageHeader
        className="home-page-header"
        eyebrow="Build ROI For Line Of Business"
        title="Find the right ROI calculator for your workflow"
        description="Choose an industry path or use the helper below to find the calculator that best matches your team, bottleneck, and decision needs."
        breadcrumbs={[
          { label: "Home", path: buildHomePath() },
          { label: "Build ROI for Line of Business" },
        ]}
        onNavigate={onNavigate}
        asideContent={
          <CalculatorRecommendationHelper
            className="hero-helper-card"
            industries={industries}
            options={recommendationOptions}
            onNavigate={onNavigate}
          />
        }
      />

      <section className="panel browse-section">
        <div>
          <p className="section-kicker">Browse By Industry</p>
          <h2>Choose the industry first, then open the workflow that best matches the conversation.</h2>
        </div>
        <p className="panel-copy">
          Use this path when the customer industry is already clear and you want to compare the calculators available in that vertical.
        </p>
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
          <h2>Open a simple review page with direct links to every path and calculator.</h2>
        </div>
        <div className="notes-actions">
          <p className="panel-copy">
            Use this if you want a text-readable list of the buyer-path homepage,
            the Line of Business industries, the IT landing page, and every
            calculator route in the platform.
          </p>
          <button
            type="button"
            className="ghost-button"
            onClick={() => onNavigate(buildReviewPath())}
          >
            Open Review Index
          </button>
        </div>
      </section>
    </>
  );
}
