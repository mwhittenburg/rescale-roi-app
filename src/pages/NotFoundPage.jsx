import { PageHeader } from "../components/PageHeader";
import { buildHomePath } from "../router";

export function NotFoundPage({ onNavigate }) {
  return (
    <>
      <PageHeader
        eyebrow="Route Not Found"
        title="We couldn't find that calculator page."
        description="The route does not match a known industry or use case. Head back to the platform home and pick a path from there."
        breadcrumbs={[{ label: "Home", path: buildHomePath() }, { label: "Not Found" }]}
        onNavigate={onNavigate}
      />

      <section className="panel intro-panel">
        <div>
          <p className="section-kicker">Next Step</p>
          <h2>Return to the platform home.</h2>
        </div>
        <button type="button" onClick={() => onNavigate(buildHomePath())}>
          Go Home
        </button>
      </section>
    </>
  );
}
