'use client'

import { ArrowRight, LoaderCircle, LockKeyhole } from 'lucide-react'

interface AuthSocialButtonsProps {
  disabled: boolean
  isGoogleLoading: boolean
  onGoogleClick: () => void
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="size-[18px]" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.2 13.6 17.6 9.5 24 9.5Z" />
      <path fill="#4285F4" d="M47 24.5c0-1.6-.2-3.2-.5-4.7H24v9.1h12.9c-.6 3-2.3 5.6-4.9 7.3l7.6 5.9c4.5-4.1 7.4-10.2 7.4-17.6Z" />
      <path fill="#FBBC05" d="M10.4 28.7a14.5 14.5 0 0 1 0-9.4l-7.8-6.1a24 24 0 0 0 0 21.6l7.8-6.1Z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.8 2.3-8.3 2.3-6.4 0-11.8-4.1-13.6-9.9l-7.8 6.1C6.5 42.6 14.6 48 24 48Z" />
    </svg>
  )
}

export function AuthSocialButtons({
  disabled,
  isGoogleLoading,
  onGoogleClick,
}: AuthSocialButtonsProps) {
  return (
    <>
      <div className="space-y-2.5">
        <button
          type="button"
          disabled={disabled || isGoogleLoading}
          onClick={onGoogleClick}
          className="flex h-12 w-full items-center gap-3 rounded-xl border border-[#DCE3E2] bg-white px-4 text-left text-sm font-medium text-[#16292B] shadow-sm transition hover:-translate-y-px hover:border-[#A9D9D3] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BEAA] disabled:pointer-events-none disabled:opacity-60 dark:border-[#2B4340] dark:bg-[#12201F] dark:text-[#EAF3F1]"
        >
          {isGoogleLoading ? (
            <LoaderCircle className="size-[18px] animate-spin text-[#007F78]" />
          ) : (
            <GoogleIcon />
          )}
          <span className="flex-1">Continue with Google</span>
          <ArrowRight className="size-4 text-[#C2CFCF]" />
        </button>

        <button
          type="button"
          disabled
          title="Apple sign-in is coming soon"
          className="flex h-12 w-full cursor-not-allowed items-center gap-3 rounded-xl border border-dashed border-[#DCE3E2] bg-[#FAFCFB] px-4 text-left text-sm font-medium text-[#93A5A5] dark:border-[#2B4340] dark:bg-[#12201F] dark:text-[#7C9490]"
        >
          <span className="text-base" aria-hidden="true">●</span>
          <span className="flex-1">Continue with Apple</span>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#E3E9E8] bg-[#F2F5F4] px-2 py-1 text-[9px] font-semibold uppercase tracking-wide dark:border-[#2B4340] dark:bg-[#1B2E2C]">
            <LockKeyhole className="size-2.5" /> Coming soon
          </span>
        </button>
      </div>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-[#E3E9E8] dark:bg-[#243936]" />
        <span className="text-[10px] tracking-[0.1em] text-[#93A5A5]">OR</span>
        <span className="h-px flex-1 bg-[#E3E9E8] dark:bg-[#243936]" />
      </div>
    </>
  )
}
