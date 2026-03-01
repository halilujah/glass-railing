import { useStore } from '../../store/useStore';

export function ValidationMessages() {
  const errors = useStore(s => s.layout.validationErrors);

  if (errors.length === 0) return null;

  return (
    <div className="validation-messages">
      {errors.map((err, i) => (
        <div key={i} className={`validation-msg ${err.severity}`}>
          <span className="validation-icon">
            {err.severity === 'error' ? '✕' : '!'}
          </span>
          <span>{err.message}</span>
        </div>
      ))}
    </div>
  );
}
