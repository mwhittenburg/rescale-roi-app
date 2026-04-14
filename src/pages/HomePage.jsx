import { IndustryCard } from "../components/IndustryCard";
import { PageHeader } from "../components/PageHeader";
import { industries } from "../data/platform";
import { buildHomePath, buildIndustryPath } from "../router";

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
          <p className="section-kicker">Shared Platform</p>
          <h2>One shell, many calculators, safe expansion over time.</h2>
        </div>
        <p className="panel-copy">
          Each calculator is modular, route-based, and ready for its own formula
          engine later. Updates stay additive instead of replacing the whole app.
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
          <p className="section-kicker">Publishing Model</p>
          <h2>Stable production, safe previews, independent calculators.</h2>
        </div>
        <p className="panel-copy">
          Keep `main` as the stable rep-ready version. Build new calculators on
          a branch, preview them in Vercel, then merge only when ready.
        </p>
      </section>
    </>
  );
}
