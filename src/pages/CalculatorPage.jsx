import { SectionPanel } from "../components/SectionPanel";
import { PageHeader } from "../components/PageHeader";
import { calculatorSections } from "../data/platform";
import { buildHomePath, buildIndustryPath } from "../router";

export function CalculatorPage({ industry, calculator, onNavigate }) {
  return (
    <>
      <PageHeader
        eyebrow="Workflow Calculator"
        title={calculator.name}
        description={calculator.teaser}
        breadcrumbs={[
          { label: "Home", path: buildHomePath() },
          { label: industry.name, path: buildIndustryPath(industry.id) },
          { label: calculator.name },
        ]}
        onNavigate={onNavigate}
      />

      <section className="hero-layout">
        <article className="panel calculator-intro">
          <p className="section-kicker">Industry Context</p>
          <h2>{industry.name}</h2>
          <p className="panel-copy">{industry.summary}</p>
        </article>

        <aside className="panel workflow-sidebar">
          <p className="section-kicker">Calculator Status</p>
          <h2>Placeholder-ready</h2>
          <p className="panel-copy">
            This calculator page has its own route and content module. Formula
            logic can be added later without affecting the rest of the platform.
          </p>
          <button
            type="button"
            className="ghost-button"
            onClick={() => onNavigate(buildIndustryPath(industry.id))}
          >
            Back to {industry.name}
          </button>
        </aside>
      </section>

      <section className="content-grid">
        {calculatorSections.map((section) => (
          <SectionPanel
            key={section.key}
            title={section.title}
            body={calculator[section.key]}
          />
        ))}
      </section>
    </>
  );
}
