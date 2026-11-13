import { useState } from 'react';
import AboutDialog from './AboutDialog.jsx';
import FeedbackDialog from './FeedbackDialog.jsx';
import { GITHUB_URL, LINKEDIN_URL } from '../utils/links.js';
import './AppFooter.css';

export default function AppFooter() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <section className="app-footer__cta">
        <div>
          <h2 className="app-footer__title">Have an idea or spotted a bug?</h2>
          <p className="app-footer__text">
            Ideas, bugs, data that looks wrong - I read every message.
          </p>
        </div>
        <button
          type="button"
          className="app-footer__button"
          onClick={() => setIsFeedbackOpen(true)}
        >
          Send feedback
        </button>
      </section>

      <div className="app-footer__bottom">
        <p className="app-footer__copy">© {year} Stock Radar · Not financial advice</p>
        <nav className="app-footer__links" aria-label="Footer">
          <button type="button" className="app-footer__link" onClick={() => setIsAboutOpen(true)}>
            About
          </button>
          <a className="app-footer__link" href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="app-footer__link" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </nav>
      </div>

      <FeedbackDialog isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
      <AboutDialog isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </footer>
  );
}
