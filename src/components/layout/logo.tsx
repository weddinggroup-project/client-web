import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 rounded-md text-sm font-semibold tracking-tight text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
      aria-label="Ganipedia home"
    >
      <svg viewBox="0 0 40 40" className="size-9" aria-hidden="true">
        <defs>
          <linearGradient id="ganipedia-logo" x1="4" y1="3" x2="36" y2="37">
            <stop stopColor="#22d3ee" />
            <stop offset=".48" stopColor="#3b82f6" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="12" fill="url(#ganipedia-logo)" />
        <path
          d="M27.8 13.8a10 10 0 1 0 .2 12.1v-6.2h-8.4v4.1h4.1a5.7 5.7 0 1 1 .7-6.7l3.4-3.3Z"
          fill="white"
        />
        <circle cx="29.7" cy="10.3" r="2.4" fill="#a5f3fc" />
      </svg>
      <span className="text-base tracking-[-0.025em]">
        gani<span className="text-blue-300">pedia</span>
      </span>
    </Link>
  );
}
