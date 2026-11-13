import { useState } from 'react';
import './MobileBlock.css';

const SITE_NAME = 'Stock Radar';
const COPIED_MESSAGE_MS = 2000;

// Shown instead of the dashboard on phone-sized screens.
function MobileBlock() {
  const [copied, setCopied] = useState(false);
  const url = window.location.href;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), COPIED_MESSAGE_MS);
    } catch {
      // Clipboard API is unavailable (e.g. not HTTPS), let the user copy manually
      window.prompt('Copy this link:', url);
    }
  }

  return (
    <main className="mobile-block">
      <header className="mobile-block__logo">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="4" />
          <path d="M12 12l6-6" />
        </svg>
        {SITE_NAME}
      </header>

      <BullWithPhone />

      <h1 className="mobile-block__title">Mobile version is on its way</h1>
      <p className="mobile-block__text">
        Right now {SITE_NAME} works on desktop only. A phone-friendly version is in progress - until
        then, open the site on a computer to see the full dashboard.
      </p>

      <div className="mobile-block__actions">
        <button type="button" className="mobile-block__button" onClick={handleCopy}>
          {copied ? 'Link copied' : 'Copy link'}
        </button>
      </div>
    </main>
  );
}

// Curious bull holding a phone, with a question bubble above its head.
function BullWithPhone() {
  return (
    <svg
      className="mobile-block__bull"
      viewBox="0 0 240 230"
      role="img"
      aria-label="A curious bull holding a phone with a question mark above its head"
    >
      <g transform="translate(14 14)">
        {/* horns */}
        <path d="M62 58 C44 56 34 40 42 26 C48 42 58 46 70 48 Z" fill="#F2E6C9" />
        <path d="M138 58 C156 56 166 40 158 26 C152 42 142 46 130 48 Z" fill="#F2E6C9" />

        {/* ears */}
        <ellipse cx="52" cy="74" rx="15" ry="8" transform="rotate(-20 52 74)" fill="#A2643A" />
        <ellipse cx="148" cy="74" rx="15" ry="8" transform="rotate(20 148 74)" fill="#A2643A" />

        {/* body */}
        <ellipse cx="100" cy="166" rx="44" ry="34" fill="#B87442" />
        <ellipse cx="100" cy="172" rx="27" ry="21" fill="#C98A55" />

        {/* legs */}
        <rect x="70" y="188" width="16" height="20" rx="6" fill="#A2643A" />
        <rect x="114" y="188" width="16" height="20" rx="6" fill="#A2643A" />
        <rect x="70" y="202" width="16" height="7" rx="3" fill="#3A2A20" />
        <rect x="114" y="202" width="16" height="7" rx="3" fill="#3A2A20" />

        {/* head */}
        <rect x="58" y="44" width="84" height="86" rx="38" fill="#B87442" />
        <path d="M88 46 C90 34 98 34 100 42 C102 32 112 34 112 46 Z" fill="#8E5530" />

        {/* eyes */}
        <circle cx="84" cy="80" r="6.5" fill="#16120F" />
        <circle cx="86" cy="76" r="2" fill="#FFFFFF" />
        <circle cx="116" cy="80" r="6.5" fill="#16120F" />
        <circle cx="118" cy="76" r="2" fill="#FFFFFF" />

        {/* cheeks */}
        <ellipse cx="72" cy="96" rx="7" ry="4" fill="#E07A5F" opacity="0.45" />
        <ellipse cx="128" cy="96" rx="7" ry="4" fill="#E07A5F" opacity="0.45" />

        {/* muzzle */}
        <ellipse cx="100" cy="110" rx="32" ry="19" fill="#E8B68A" />
        <ellipse cx="90" cy="110" rx="3.5" ry="5" fill="#8E5530" />
        <ellipse cx="110" cy="110" rx="3.5" ry="5" fill="#8E5530" />
        <ellipse cx="100" cy="121" rx="4" ry="3" fill="#8E5530" />

        {/* nose ring */}
        <circle cx="100" cy="128" r="6" fill="none" stroke="#E3C036" strokeWidth="3" />

        {/* phone */}
        <rect
          x="84"
          y="134"
          width="32"
          height="50"
          rx="5"
          fill="#17181A"
          stroke="#EDEDED"
          strokeWidth="2"
        />
        <g className="mobile-block__dots" fill="#6E7076">
          <circle cx="93" cy="159" r="2" />
          <circle cx="100" cy="159" r="2" />
          <circle cx="107" cy="159" r="2" />
        </g>

        {/* arms */}
        <ellipse cx="74" cy="160" rx="9" ry="16" transform="rotate(35 74 160)" fill="#A2643A" />
        <ellipse cx="126" cy="160" rx="9" ry="16" transform="rotate(-35 126 160)" fill="#A2643A" />
      </g>

      {/* question bubble */}
      <circle cx="190" cy="34" r="20" fill="#26282C" />
      <text x="190" y="42" textAnchor="middle" fontSize="24" fontWeight="600" fill="#E3C036">
        ?
      </text>
      <circle cx="168" cy="60" r="5" fill="#26282C" />
      <circle cx="160" cy="70" r="3" fill="#26282C" />
    </svg>
  );
}

export default MobileBlock;
