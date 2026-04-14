import { CalculatorCard } from "../components/CalculatorCard";
import { PageHeader } from "../components/PageHeader";
import { buildCalculatorPath, buildHomePath } from "../router";

export function IndustryPage({ industry, onNavigate }) {
  return (
    <>
      <PageHeader
        eyebrow="Industry Path"
        title={industry.name}
        description={industry.summary}
        breadcrumbs={[
          { label: "Home", path: buildHomePath() },
          { label: industry.name },
        ]}
        onNavigate={onNavigate}
      />

      <section className="panel intro-panel">
        <div>
          <p className="section-kicker">Use Case Library</p>
          <h2>Choose the workflow that best matches the customer motion.</h2>
        </div>
        <p className="panel-copy">
          Every calculator in this path opens with sample inputs and a live ROI
          summary so reviewers can assess the seller flow end to end.
        </p>
      </section>

      <section className="use-case-grid">
        {industry.calculators.map((calculator) => (
          <CalculatorCard
            key={calculator.id}
            calculator={calculator}
            onOpen={() => onNavigate(buildCalculatorPath(industry.id, calculator.id))}
          />
        ))}
      </section>
    </>
  );
}
