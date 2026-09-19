import Image from 'next/image'
import Link from 'next/link'
import appIcon from '@/app/icon.png'

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
      <Image
        src={appIcon}
        alt=""
        aria-hidden="true"
        className={compact ? 'size-6 shrink-0' : 'size-[30px] shrink-0'}
      />
      <span
        className={`${compact ? 'text-sm' : 'text-[17px]'} font-semibold tracking-[-0.02em] ${inverse ? 'text-white' : 'text-[#203233] dark:text-[#EAF3F1]'}`}
      >
        NegosyoTracker
      </span>
    </Link>
  )
}
