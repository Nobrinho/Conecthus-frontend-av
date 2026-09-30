/*
 * Ilustrações do protótipo redesenhadas em SVG simples. As cores vêm dos tokens
 * (`var(--accent)`, `var(--chrome)`...), então acompanham o tema. São
 * decorativas: `aria-hidden` e sem texto.
 */

type IllustrationProps = { className?: string };

/** Home: pessoas trocando uma ideia (lâmpada). */
export function IdeaIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 360 280" aria-hidden className={className} fill="none">
      <circle cx="120" cy="150" r="90" fill="var(--chrome)" />
      <g stroke="var(--fg)" strokeWidth="3" strokeLinecap="round">
        <path d="M226 26v18M268 48l-12 12M184 48l12 12M290 92h-16M162 92h16" />
      </g>
      <circle cx="226" cy="92" r="32" fill="var(--accent)" stroke="var(--fg)" strokeWidth="3" />
      <path d="M212 96c4 6 24 6 28 0" stroke="var(--fg)" strokeWidth="3" strokeLinecap="round" />
      <rect
        x="212"
        y="122"
        width="28"
        height="18"
        rx="4"
        fill="var(--accent)"
        stroke="var(--fg)"
        strokeWidth="3"
      />
      {/* Pessoa 1 */}
      <circle cx="128" cy="138" r="18" fill="var(--surface)" stroke="var(--fg)" strokeWidth="3" />
      <path d="M110 132c6-16 30-16 36 0" fill="var(--accent)" stroke="var(--fg)" strokeWidth="3" />
      <path
        d="M92 262c0-44 16-86 36-86s36 42 36 86z"
        fill="var(--accent)"
        stroke="var(--fg)"
        strokeWidth="3"
      />
      <rect
        x="112"
        y="196"
        width="34"
        height="40"
        rx="6"
        fill="var(--surface)"
        stroke="var(--fg)"
        strokeWidth="3"
      />
      {/* Pessoa 2 */}
      <circle cx="262" cy="170" r="17" fill="var(--surface)" stroke="var(--fg)" strokeWidth="3" />
      <path d="M246 164c4-14 28-16 34-2" fill="var(--accent)" stroke="var(--fg)" strokeWidth="3" />
      <path
        d="M226 262c0-40 14-72 36-72s36 32 36 72z"
        fill="var(--chrome)"
        stroke="var(--fg)"
        strokeWidth="3"
      />
      <path d="M262 190v44" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round" />
      <path d="M232 214c-8-12-8-30-2-40" stroke="var(--fg)" strokeWidth="3" strokeLinecap="round" />
      <path d="M40 262h300" stroke="var(--fg)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Busca sem resultado: lupa com interrogação. */
export function SearchEmptyIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 160 160" aria-hidden className={className} fill="none">
      <circle cx="66" cy="62" r="46" fill="var(--surface)" stroke="var(--fg)" strokeWidth="3" />
      <circle cx="66" cy="62" r="36" stroke="var(--fg)" strokeWidth="2" strokeDasharray="4 8" />
      <path
        d="M56 50a11 11 0 1 1 15 10c-3 2-5 4-5 8v3"
        stroke="var(--accent)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <circle cx="66" cy="84" r="5" fill="var(--accent)" />
      <path d="M99 95l10 10" stroke="var(--fg)" strokeWidth="6" strokeLinecap="round" />
      <rect
        x="104"
        y="100"
        width="26"
        height="52"
        rx="13"
        transform="rotate(-45 117 126)"
        fill="var(--brand)"
        stroke="var(--fg)"
        strokeWidth="3"
      />
    </svg>
  );
}

/** Recuperação de senha: cadeado aberto com setas de renovação. */
export function LockResetIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 280" aria-hidden className={className} fill="none">
      <path
        d="M40 180c-10-80 40-130 110-120 60 8 120 20 130 90 10 76-60 110-130 104-70-6-104-24-110-74z"
        fill="var(--surface)"
        fillOpacity="0.08"
      />
      <rect x="14" y="30" width="116" height="38" rx="19" fill="var(--accent)" />
      <path d="M72 68l14 20 6-20" fill="var(--accent)" />
      <g fill="var(--chrome-fg)">
        <circle cx="46" cy="49" r="5" />
        <circle cx="72" cy="49" r="5" />
        <circle cx="98" cy="49" r="5" />
      </g>
      <path
        d="M110 150v-40a40 40 0 0 1 80 0"
        stroke="var(--chrome-fg)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <rect
        x="92"
        y="150"
        width="120"
        height="100"
        rx="10"
        stroke="var(--chrome-fg)"
        strokeWidth="8"
      />
      <path d="M152 186v28" stroke="var(--accent)" strokeWidth="8" strokeLinecap="round" />
      <path
        d="M236 212a32 32 0 0 1-56 20M188 250a32 32 0 0 1 56-20"
        stroke="var(--accent)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M244 212l2 22-20-4M180 252l-4-20 20 2"
        stroke="var(--chrome-fg)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
