import { ChevronDown } from 'lucide-react'

const questions = [
  {
    question: 'What is NegosyoTracker and how does it help my business?',
    answer: 'NegosyoTracker is a simple all-in-one system built for small to medium business owners. It keeps sales, customers, inventory and expenses in one place, while NegosyoAI turns those records into trends and forecasts.',
  },
  { question: 'Can I access the system on mobile devices?', answer: 'NegosyoTracker works on desktop and tablet. A dedicated mobile app is planned for easier access on the go.' },
  { question: 'Is my data secure?', answer: 'Clerk protects your sign-in, and your business records remain private to your account.' },
  { question: 'Can I manage my customers in the system?', answer: 'Yes. Keep customer details, purchase history and notes together in one record.' },
  { question: 'How does inventory management work?', answer: 'Add products and current stock, then track availability as completed orders reduce inventory.' },
  { question: 'Can I record and monitor my expenses?', answer: 'Yes. Record expenses by category and compare them with your sales and cash flow reports.' },
]

export function LandingFaq() {
  return (
    <section id="faq" className="scroll-mt-[72px] bg-[#F2F5F4] px-5 py-[70px] transition-colors dark:bg-[#0B1615] sm:px-8 lg:px-11">
      <div className="mx-auto max-w-[900px]">
        <h2 className="mb-8 text-[34px] font-semibold tracking-[-0.03em] text-[#16292B] dark:text-[#EAF3F1]">Frequent questions</h2>
        <div className="space-y-2.5">
          {questions.map((question, index) => (
            <details key={question.question} open={index === 0} className="group rounded-xl border border-[#EDF1F0] bg-white open:shadow-sm dark:border-[#243936] dark:bg-[#12201F]">
              <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 text-[13px] font-semibold text-[#16292B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BEAA] dark:text-[#EAF3F1]">
                <span className="flex-1">{question.question}</span>
                <span className="grid size-6 place-items-center rounded-full bg-[#E4F7F4] text-[#007F78]"><ChevronDown className="size-3.5 transition-transform group-open:rotate-180" /></span>
              </summary>
              <p className="max-w-[72ch] px-5 pb-5 text-[13px] leading-6 text-[#5F7273] dark:text-[#9FB3B0]">{question.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
