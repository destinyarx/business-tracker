'use client'

export type AppToastVariant = 'success' | 'error' | 'loading' | 'info'

type AppToastProps = {
  title: string
  description?: string
  variant: AppToastVariant
}

const dotStyles: Record<AppToastVariant, string> = {
  success: 'bg-[#12cdbe]',
  error: 'bg-[#dc2626]',
  loading: 'animate-pulse bg-[#ffb018]',
  info: 'bg-[#7fe0da]',
}

export function AppToast({ title, description, variant }: AppToastProps) {
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className="flex w-[min(340px,calc(100vw-2rem))] items-start gap-3 rounded-[15px] bg-[#16292b] px-[17px] py-3.5 text-white shadow-[0_22px_44px_-22px_rgba(11,32,33,0.7)]"
    >
      <span
        aria-hidden="true"
        className={`mt-1 size-[9px] shrink-0 rounded-full ${dotStyles[variant]}`}
      />
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold leading-[1.35] text-white">
          {title}
        </p>
        {description ? (
          <p className="mt-[3px] text-[11.5px] leading-[1.45] text-[#a2b4b3] [text-wrap:pretty]">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  )
}
