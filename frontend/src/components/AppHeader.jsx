import { IconBrandLinkedin } from '@tabler/icons-react';
import './AppHeader.css';
import { useState } from 'react';
import AboutDialog from './AboutDialog.jsx';
import VisitCounter from './VisitCounter.jsx';
import { LINKEDIN_URL } from '../utils/links.js';

// Formats an ISO time as "Oct 30, 2026 · 10:14" in the visitor's time zone.
function formatUpdatedAt(iso) {
  const date = new Date(iso);
  const day = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return `${day} · ${time}`;
}

// Animated radar: the beam rotates and the target lights up when the beam passes it.
function RadarIcon() {
  return (
    <svg
      className="radar-icon"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="5.5" opacity="0.4" />
      <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22" opacity="0.4" />

      <g className="radar-icon__sweep">
        <path
          d="M12 12L14.59 2.34A10 10 0 0 1 19.07 4.93Z"
          fill="currentColor"
          stroke="none"
          opacity="0.18"
        />
        <path d="M12 12L19.07 4.93" />
      </g>

      <circle
        className="radar-icon__blip"
        cx="16"
        cy="16"
        r="1.5"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function AppHeader({ updatedAt }) {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <RadarIcon />
        <span className="app-header__title">Stock Radar</span>
      </div>

      <nav className="app-header__nav">
        {updatedAt && <p className="app-header__updated">Updated {formatUpdatedAt(updatedAt)}</p>}
        <VisitCounter />
        <button type="button" className="app-header__link" onClick={() => setIsAboutOpen(true)}>
          About
        </button>

        <a
          className="app-header__icon-link"
          href={LINKEDIN_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn profile"
        >
          <IconBrandLinkedin size={26} stroke={1.5} />
        </a>
      </nav>
      <AboutDialog isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </header>
  );
}

export default AppHeader;
