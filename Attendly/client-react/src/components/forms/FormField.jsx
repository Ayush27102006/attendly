/**
 * FormField.jsx — Label + Input + Error message wrapper
 * ======================================================
 * PE-2 Requirement 4: React Form Handling — Reusable FormField
 *
 * Wraps a label, the Input component, and an error message
 * into one reusable block. This removes repetition — every
 * form field in the app uses this same pattern.
 *
 * Viva question: "Why create a FormField component?"
 * → DRY principle (Don't Repeat Yourself). Without it, every
 *   field would repeat the same label/input/error structure.
 *   Changes to the design only need to happen in one place.
 */

import Input from './Input';

export default function FormField({
  id,
  label,
  error,
  // All other props are passed directly to Input
  ...inputProps
}) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <Input
        id={id}
        hasError={!!error}
        ariaDescribedBy={errorId}
        {...inputProps}
      />
      {error && (
        <span
          id={errorId}
          className="field-error"
          role="alert"
          style={{
            display: 'block',
            color: 'var(--danger-text)',
            fontSize: '0.8125rem',
            marginTop: '4px',
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

