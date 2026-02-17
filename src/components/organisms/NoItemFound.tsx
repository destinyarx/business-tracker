export default function NoItemFound({
  title = "No data were found",
  description = "Try adjusting your search or filters to see results.",
  className = "",
}) {
  return (
    <div className={`flex min-h-[60vh] w-full items-center justify-center p-6 ${className}`}>
    <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200/80 bg-emerald-100/50 dark:bg-slate-50 p-8 shadow-md">
      {/* Soft decorative blobs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-teal-100 dark:bg-teal-200/40 blur-2xl" />
      <div className="pointer-events-none absolute -right-28 -bottom-28 h-72 w-72 rounded-full bg-emerald-200/50 dark:bg-sky-200/40 blur-2xl" />

      <div className="relative flex flex-col items-center text-center">
        {/* Illustration */}
        <div className="mb-6">
          <Illustration className="h-36 w-36" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold tracking-tight text-slate-800">
          {title}
        </h2>

        {/* Description */}
        {description ? (
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
            {description}
          </p>
        ) : null}

        {/* Subtle divider */}
        <div className="mt-6 h-px w-24 bg-gradient-to-r from-transparent via-slate-300/70 dark:via-slate-300/70 to-transparent" />
      </div>
    </div>
  </div>

  );
}

function Illustration({ className = "" }) {
  // “Empty box + magnifier” illustration (teal-themed)
  return (
    <svg
      viewBox="0 0 220 220"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      {/* Shadow */}
      <ellipse cx="110" cy="182" rx="64" ry="12" fill="#E2E8F0" />

      {/* Box top */}
      <path d="M64 84 110 64 156 84 110 104 64 84Z" fill="#CCFBF1" />
      {/* Box left */}
      <path d="M64 84v56l46 20v-56L64 84Z" fill="#99F6E4" />
      {/* Box right */}
      <path d="M156 84v56l-46 20v-56l46-20Z" fill="#5EEAD4" />
      {/* Box edge */}
      <path
        d="M64 84 110 104 156 84"
        stroke="#0F766E"
        strokeOpacity="0.35"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Paper */}
      <rect x="86" y="86" width="48" height="62" rx="10" fill="#FFFFFF" />
      <rect x="94" y="102" width="32" height="6" rx="3" fill="#CBD5E1" />
      <rect x="94" y="116" width="26" height="6" rx="3" fill="#E2E8F0" />
      <rect x="94" y="130" width="30" height="6" rx="3" fill="#E2E8F0" />

      {/* Magnifier */}
      <circle cx="150" cy="130" r="22" fill="#FFFFFF" />
      <circle cx="150" cy="130" r="16" stroke="#0F766E" strokeWidth="4" />
      <path
        d="M164 144l18 18"
        stroke="#0F766E"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Accent dots */}
      <circle cx="54" cy="118" r="4" fill="#38BDF8" opacity="0.6" />
      <circle cx="176" cy="92" r="3" fill="#A5B4FC" opacity="0.6" />
      <circle cx="44" cy="86" r="2.5" fill="#22C55E" opacity="0.45" />
    </svg>
  );
}
