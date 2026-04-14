export function SectionPanel({ title, body }) {
  return (
    <article className="content-panel">
      <header className="panel-header">
        <h2>{title}</h2>
      </header>
      <p>{body}</p>
    </article>
  );
}
