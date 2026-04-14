export function AppShell({ children }) {
  return (
    <div className="app-shell">
      <main className="app-card">
        <section className="review-banner">
          <div>
            <p className="section-kicker">Getting Started</p>
            <h2>Example values are already loaded so you can explore the calculators right away.</h2>
          </div>
          <p className="panel-copy">
            Start from an industry or use the calculator helper, then adjust the
            inputs to match your situation and see the estimated impact update live.
          </p>
        </section>
        {children}
      </main>
    </div>
  );
}
