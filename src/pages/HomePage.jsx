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
        title="Pick your industry / use case"
        description="A shared app shell for vertical-specific ROI calculators. Start with an industry path, then open a workflow-specific calculator on its own route."
        breadcrumbs={[{ label: "Home" }]}
        onNavigate={onNavigate}
      />

      <section className="panel intro-panel">
        <div>
          <p className="section-kicker">Seller Entry Paths</p>
          <h2>Start by browsing an industry or use the helper to choose the most relevant calculator.</h2>
        </div>
        <p className="panel-copy">
          The goal is to help a seller get to the right conversation quickly,
          ask sharper questions, and open a calculator that already feels credible.
        </p>
      </section>

      <section className="entry-grid">
        <section className="panel choice-card">
          <div className="choice-copy">
            <p className="section-kicker">Browse By Industry</p>
            <h2>Choose the customer vertical first, then narrow to the best workflow.</h2>
            <p className="panel-copy">
              Use this path when the industry is already clear and you want to
              compare the calculators available in that vertical.
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
          <p className="section-kicker">How To Review</p>
          <h2>Follow the full path from home page to industry to calculator.</h2>
        </div>
        <div className="notes-actions">
          <p className="panel-copy">
            Reviewers should click into each vertical, open each calculator, and
            adjust the sample values to judge input quality, output credibility,
            and how usable the workflow feels during a real call.
          </p>
          <button type="button" className="ghost-button" onClick={() => onNavigate(buildReviewPath())}>
            Open Review Index
          </button>
        </div>
      </section>
    </>
  );
}
