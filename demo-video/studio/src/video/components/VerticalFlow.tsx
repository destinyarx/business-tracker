import { ArrowRight } from 'lucide-react';

type VerticalFlowProps = {
  active: 0 | 1 | 2 | 3;
};

const steps = ['Order', 'Stock', 'Sale', 'Dashboard'] as const;

export const VerticalFlow = ({ active }: VerticalFlowProps) => (
  <div className="absolute bottom-[9%] left-1/2 w-[900px] -translate-x-1/2 rounded-[26px] border border-white/12 bg-white/[.07] px-8 py-7 text-white backdrop-blur-lg">
    <p className="mb-4 text-center font-mono text-[16px] font-semibold uppercase tracking-[.17em] text-[#7fe0da]">
      One connected flow
    </p>
    <div className="flex items-center justify-center gap-3">
      {steps.map((step, index) => (
        <div key={step} className="contents">
          <div
            className={`min-w-[162px] rounded-[17px] border px-5 py-4 text-center ${index === active ? 'border-[#5eebdd] bg-[#12cdbe]/20' : 'border-white/10 bg-white/[.04]'}`}
          >
            <span className="block font-mono text-[13px] text-white/45">
              0{index + 1}
            </span>
            <strong className="mt-1 block text-[20px]">{step}</strong>
          </div>
          {index < steps.length - 1 && (
            <ArrowRight className="size-5 shrink-0 text-white/30" />
          )}
        </div>
      ))}
    </div>
  </div>
);
