export function AppShell({ children }) {
  return (
    <div className="app-shell">
      <main className="app-card">
        <section className="review-banner">
          <div>
            <p className="section-kicker">Review Mode</p>
            <h2>Sample values are preloaded across the platform.</h2>
          </div>
          <p className="panel-copy">
            Reviewers can click from industry to use case and see live ROI outputs
            immediately without signing in or setting anything up first.
          </p>
        </section>
        {children}
      </main>
    </div>
  );
}
