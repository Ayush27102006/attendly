/**
 * Topbar.jsx — Page top navigation bar
 * ======================================
 * Shows the page title, current date, and mobile menu button.
 * Receives title/subtitle as props from each page.
 */

import { IconMenu } from '../ui/Icons';
import { formatDateLong } from '../../utils/helpers';

export default function Topbar({ title, subtitle, onMenuOpen }) {
  return (
    <header className="topbar" role="banner">
      <div className="topbar-left">
        <div className="page-title">{title}</div>
        {subtitle && <div className="page-subtitle">{subtitle}</div>}
      </div>
      <div className="topbar-right">
        <div className="topbar-date" aria-live="polite">
          {formatDateLong()}
        </div>
        <button
          className="btn-menu"
          onClick={onMenuOpen}
          aria-label="Open navigation menu"
          aria-expanded="false"
        >
          <IconMenu />
        </button>
      </div>
    </header>
  );
}

