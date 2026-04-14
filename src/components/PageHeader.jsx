import { Breadcrumbs } from "./Breadcrumbs";

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  onNavigate,
  className = "",
}) {
  return (
    <header className={`page-header ${className}`.trim()}>
      <div className="brand-lockup">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="hero-text">{description}</p>
      </div>
      <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />
    </header>
  );
}
