/**
 * LoadingState.jsx — Full-section loading placeholder
 * Uses .loading-state and .spinner from style.css
 */
import Spinner from './Spinner';

export default function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="loading-state">
      <Spinner size={32} borderWidth={3} />
      {message && <p>{message}</p>}
    </div>
  );
}

