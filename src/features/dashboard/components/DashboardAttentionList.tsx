import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { DashboardAttention } from '../dashboard.types'
import {
  getAttentionColor,
  getDashboardRoute,
} from '../dashboard.utils'

type DashboardAttentionListProps = {
  attention: DashboardAttention[]
}

export function DashboardAttentionList({
  attention,
}: DashboardAttentionListProps) {
  return (
    <section className="overflow-hidden rounded-[20px] border border-[#e3e9e8] bg-white dark:border-[#243936] dark:bg-[#12201f]" aria-labelledby="attention-heading">
      <header className="border-b border-[#edf1f0] px-[18px] py-3.5 dark:border-[#243936]">
        <h2 id="attention-heading" className="text-[14.5px] font-semibold text-[#16292b] dark:text-[#eaf3f1]">Needs your attention</h2>
        <p className="mt-0.5 text-[11.5px] text-[#93a5a5]">
          {attention.length
            ? `${attention.length} ${attention.length === 1 ? 'thing' : 'things'} to look at today`
            : 'Nothing urgent needs your attention.'}
        </p>
      </header>
      {attention.length ? (
        <div className="py-1.5">
          {attention.map((fact) => (
            <Link
              key={`${fact.kind}-${fact.entityId ?? 'group'}`}
              href={getDashboardRoute(fact.targetModule)}
              className="group flex items-start gap-[11px] border-b border-[#f0f3f2] px-[18px] py-3 outline-none transition-colors last:border-b-0 hover:bg-[#f7fbfa] focus-visible:bg-[#f3fbf8] dark:border-[#1c312f] dark:hover:bg-[#172927] dark:focus-visible:bg-[#172927]"
            >
              <span className="mt-[5px] size-2 shrink-0 rounded-full" style={{ backgroundColor: getAttentionColor(fact.kind) }} />
              <span className="min-w-0 flex-1">
                <span className="block text-[12.5px] font-medium leading-[1.4] text-[#16292b] dark:text-[#eaf3f1]">{fact.title}</span>
                <span className="mt-1 block truncate text-[11px] text-[#93a5a5]" title={fact.detail}>{fact.detail}</span>
              </span>
              <ChevronRight className="mt-0.5 size-[15px] shrink-0 text-[#93a5a5] transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid min-h-40 place-items-center px-6 text-center text-xs text-[#93a5a5]">Your current stock and order queue look healthy.</div>
      )}
    </section>
  )
}
