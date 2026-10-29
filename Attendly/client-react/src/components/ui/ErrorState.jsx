/**
 * ErrorState.jsx — Full-section error display with retry button
 * Uses .error-state from style.css
 */
import { IconInfo } from './Icons';

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="error-state">
      <IconInfo size={32} />
      <h3>Unable to load data</h3>
      <p>{message}</p>
      {onRetry && (
        <button className="btn-retry" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

