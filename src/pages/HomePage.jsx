import { buyerPaths } from "../data/platform";
import { buildItPath, buildLobPath, buildReviewPath } from "../router";

const pathBuilders = {
  lob: buildLobPath,
  it: buildItPath,
};

export function HomePage({ onNavigate }) {
  return (
    <>
      <section className="panel buyer-path-hero">
        <div className="buyer-path-copy">
          <p className="section-kicker">ROI Calculator Platform</p>
          <h1>Choose the buyer path that fits the conversation.</h1>
          <p className="hero-text">
            Start with the ROI story you need to build. Line of Business opens the
            existing industry and workflow calculators. IT opens a parallel path
            focused on infrastructure, operations, governance, and capacity
            economics.
          </p>
        </div>
      </section>

      <section className="buyer-path-grid">
        {buyerPaths.map((path) => (
          <article key={path.id} className="buyer-path-card">
            <span className="pill">{path.id === "it" ? "IT Path" : "Line Of Business"}</span>
            <h2>{path.name}</h2>
            <p>{path.summary}</p>
            <p className="card-meta">{path.audience}</p>
            <div className="card-footer">
              <button
                type="button"
                onClick={() => onNavigate(pathBuilders[path.id]())}
              >
                Open Path
              </button>
            </div>
          </article>
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
