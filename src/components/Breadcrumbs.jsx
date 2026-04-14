export function Breadcrumbs({ items, onNavigate }) {
  return (
    <nav className="breadcrumb-list" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={item.label} className="breadcrumb-item">
          {item.path ? (
            <button type="button" className="link-button" onClick={() => onNavigate(item.path)}>
              {item.label}
            </button>
          ) : (
            <span>{item.label}</span>
          )}
          {index < items.length - 1 ? <span className="breadcrumb-sep">/</span> : null}
        </span>
      ))}
    </nav>
  );
}
