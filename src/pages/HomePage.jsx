import { IndustryCard } from "../components/IndustryCard";
import { PageHeader } from "../components/PageHeader";
import { industries } from "../data/platform";
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
          <p className="section-kicker">Seller Review Flow</p>
          <h2>Start with an industry, then open the use case closest to the customer conversation.</h2>
        </div>
        <p className="panel-copy">
          Every calculator opens with seeded sample inputs and live outputs so a
          reviewer can understand the workflow the same way a seller would in a
          customer-facing session.
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
