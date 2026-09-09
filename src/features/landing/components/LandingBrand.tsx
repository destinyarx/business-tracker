import Link from 'next/link'

interface LandingBrandProps {
  compact?: boolean
  inverse?: boolean
}

export function LandingBrand({
  compact = false,
  inverse = false,
}: LandingBrandProps) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[#00BEAA] focus-visible:ring-offset-4"
      aria-label="NegosyoTracker home"
    >
      <span
        className={`${compact ? 'size-6 rounded-lg text-xs' : 'size-[30px] rounded-[10px] text-sm'} grid place-items-center bg-[linear-gradient(160deg,#A8D97C,#12CDBE_55%,#7FE0DA)] font-bold text-[#0C4B47]`}
        aria-hidden="true"
      >
        N
      </span>
      <span
        className={`${compact ? 'text-sm' : 'text-[17px]'} font-semibold tracking-[-0.02em] ${inverse ? 'text-white' : 'text-[#203233] dark:text-[#EAF3F1]'}`}
      >
        NegosyoTracker
      </span>
    </Link>
  )
}
