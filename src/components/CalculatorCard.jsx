export function CalculatorCard({ calculator, onOpen }) {
  return (
    <article className="use-case-card">
      <span className="pill muted-pill">Use Case Calculator</span>
      <h3>{calculator.name}</h3>
      <p>{calculator.teaser}</p>
      <div className="card-footer">
        <span className="card-meta">Own page and formula module ready</span>
        <button type="button" onClick={onOpen}>
          Open Calculator
        </button>
      </div>
    </article>
  );
}
