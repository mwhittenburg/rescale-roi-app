export function FieldHelpTooltip({ label, help }) {
  if (!help) {
    return null;
  }

  return (
    <span className="field-help">
      <button
        type="button"
        className="field-help-button"
        aria-label={`Help for ${label}`}
      >
        i
      </button>
      <span className="field-help-popover" role="tooltip">
        <span className="field-help-title">{label}</span>
        <span className="field-help-line">{help.what}</span>
        <span className="field-help-line">
          <strong>Include:</strong> {help.include}
        </span>
        <span className="field-help-line">
          <strong>Exclude:</strong> {help.exclude}
        </span>
        {help.example ? (
          <span className="field-help-line">
            <strong>Example:</strong> {help.example}
          </span>
        ) : null}
      </span>
    </span>
  );
}
