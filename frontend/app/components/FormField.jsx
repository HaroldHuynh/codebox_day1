export default function FormField({ id, label, children }) {
  return (
    <div className="field-group">
      <label htmlFor={id}>{label}</label>
      {children}
    </div>
  );
}
