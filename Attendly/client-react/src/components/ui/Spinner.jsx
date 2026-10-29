/**
 * Spinner.jsx — Loading spinner component
 * Uses the same .spinner CSS class from your existing style.css
 */
export default function Spinner({ size = 20, borderWidth = 2 }) {
  return (
    <span
      className="spinner"
      aria-hidden="true"
      style={{ width: size, height: size, borderWidth }}
    />
  );
}

