export function IndustryCard({ industry, onOpen }) {
  return (
    <article className="industry-card">
      <span className="pill">Industry Path</span>
      <h3>{industry.name}</h3>
      <p>{industry.summary}</p>
      <div className="card-footer">
        <span className="card-meta">{industry.calculators.length} calculators</span>
        <button type="button" onClick={onOpen}>
          Open Path
        </button>
      </div>
    </article>
  );
}
