/**
 * Input.jsx — Reusable controlled input component
 * =================================================
 * PE-2 Requirement 4: React Form Handling — Reusable Input
 *
 * "Controlled input" means React controls the input value via state.
 * The input's value always reflects a React state variable.
 * When the user types, the onChange handler updates the state,
 * which causes React to re-render with the new value.
 *
 * Viva question: "What is a controlled component?"
 * → A form element whose value is controlled by React state.
 *   The React state is the "single source of truth" for the input value.
 *   Every keystroke calls onChange → updates state → React re-renders.
 *
 * Contrast: Uncontrolled input uses a ref to read the DOM value
 * directly instead of keeping it in React state.
 */

export default function Input({
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  inputMode,
  min,
  max,
  step,
  disabled = false,
  hasError = false,
  ariaDescribedBy,
  ...rest
}) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      inputMode={inputMode}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      aria-invalid={hasError ? 'true' : undefined}
      aria-describedby={ariaDescribedBy}
      // Apply an error border class when there's a validation error
      className={hasError ? 'input-error' : ''}
      {...rest}
    />
  );
}

