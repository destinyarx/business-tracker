export function LandingShowcase() {
  return (
    <section
      id="showcase"
      className="relative scroll-mt-[72px] overflow-hidden bg-[linear-gradient(180deg,#F4F8F6_0%,#F2F5F4_100%)] px-5 py-[70px] transition-colors dark:bg-[#0B1615] sm:px-8 lg:px-11"
    >
      <div className="absolute inset-0 bg-[linear-gradient(#0C4B47_1px,transparent_1px),linear-gradient(90deg,#0C4B47_1px,transparent_1px)] bg-[size:68px_68px] opacity-[0.04]" />
      <div className="absolute left-1/2 top-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_210deg,#A8D97C,#12CDBE_38%,#7FE0DA_62%,#A8D97C)] opacity-25 blur-[120px] dark:opacity-20" />

      <div className="relative mx-auto max-w-[1160px]">
        <div className="mx-auto max-w-[720px] text-center">
          <h2 className="text-balance text-[clamp(2rem,4vw,2.125rem)] font-semibold tracking-[-0.035em] text-[#203233] dark:text-[#EAF3F1]">
            See it in action
          </h2>
          <p className="mt-2.5 text-base text-[#5A6B6B] dark:text-[#9FB3B0]">
            A quick tour of how your whole negosyo runs from one workspace.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-[980px] overflow-hidden rounded-[28px] bg-[linear-gradient(150deg,#A8D97C,#12CDBE_52%,#7FE0DA)] p-3 shadow-[0_34px_70px_-34px_rgba(12,75,71,0.55)]">
          {/* ponytail: served from /public via Vercel's edge CDN; move to a video host if bandwidth grows */}
          <video
            className="aspect-video w-full rounded-[20px] bg-[#F4F8F6]"
            controls
            playsInline
            preload="none"
            poster="/videos/negosyo-tracker-showcase-poster.jpg"
            aria-label="Negosyo Tracker product showcase video"
          >
            <source src="/videos/negosyo-tracker-showcase.mp4" type="video/mp4" />
            Your browser does not support embedded videos.
          </video>
        </div>
      </div>
    </section>
  )
}
