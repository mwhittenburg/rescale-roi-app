import { Breadcrumbs } from "./Breadcrumbs";

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  onNavigate,
  className = "",
  asideContent = null,
}) {
  return (
    <header className={`page-header ${className}`.trim()}>
      <div className="brand-lockup">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="hero-text">{description}</p>
      </div>
      <div className="page-header-side">
        {breadcrumbs?.length ? (
          <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />
        ) : null}
        {asideContent}
      </div>
    </header>
  );
}
