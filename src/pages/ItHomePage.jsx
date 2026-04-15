import { CalculatorCard } from "../components/CalculatorCard";
import { PageHeader } from "../components/PageHeader";
import { buildHomePath, buildItCalculatorPath } from "../router";

export function ItHomePage({ itPath, onNavigate }) {
  return (
    <>
      <PageHeader
        eyebrow="Build ROI For IT"
        title="Choose the IT ROI story that fits the conversation."
        description={itPath.summary}
        breadcrumbs={[
          { label: "Home", path: buildHomePath() },
          { label: "Build ROI for IT" },
        ]}
        onNavigate={onNavigate}
      />

      <section className="panel intro-panel">
        <div>
          <p className="section-kicker">IT Use Case Library</p>
          <h2>Choose the calculator that best matches the infrastructure, operations, or governance conversation.</h2>
        </div>
        <p className="panel-copy">
          Every calculator opens with sample inputs and a live ROI summary, so you
          can move directly into the IT buyer story without going through the
          industry workflow path first.
        </p>
      </section>

      <section className="guidance-grid">
        <article className="panel guidance-card">
          <p className="section-kicker">Best For These Conversations</p>
          <p className="panel-copy">{itPath.bestForConversations}</p>
        </article>
        <article className="panel guidance-card">
          <p className="section-kicker">Typical Buyer</p>
          <p className="panel-copy">{itPath.typicalBuyer}</p>
        </article>
        <article className="panel guidance-card">
          <p className="section-kicker">Common Bottleneck</p>
          <p className="panel-copy">{itPath.commonBottleneck}</p>
        </article>
      </section>

      <section className="use-case-grid">
        {itPath.calculators.map((calculator) => (
          <CalculatorCard
            key={calculator.id}
            calculator={calculator}
            onOpen={() => onNavigate(buildItCalculatorPath(calculator.id))}
          />
        ))}
      </section>
    </>
  );
}
