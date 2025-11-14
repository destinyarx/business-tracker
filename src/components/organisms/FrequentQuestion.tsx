// /components/FrequentQuestion.tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
export default function FrequentQuestion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "What is NegosyoTracker and how does it help my business?",
            answer: `NegosyoTracker is a simple all-in-one system built for small to medium business owners who can’t afford expensive software or subscriptions.
                It helps you manage your sales, customers, inventory, and expenses — all in one place. 
                The built-in NegosyoAI analyzes your data to show sales trends, best-selling products, and forecasts, helping you make smart, data-driven decisions.`,
        },
        {
            question: "Can multiple users or staff access the system?",
            answer: `Yes! You and your staff can use the system together. 
                Most core features like sales tracking, customer management, and inventory are free to use.
                Only advanced tools like NegosyoAI, PDF reports, and automatic email receipts are part of the premium features.`,
        },
        {
            question: "Can I access the system on mobile devices?",
            answer: `NegosyoTracker works perfectly on desktop and mobile browsers.
                After the main features are fully developed, a dedicated mobile app version will be released for easier access on the go.`,
        },
        {
            question: "Is my data secure?",
            answer: `Yes, your data is protected and private. NegosyoTracker uses Clerk for secure login and stores all data in the cloud.
                Only you can access your business information — you don’t need to worry about your data.`,
        },
        {
            question: "Can I manage my customers in the system?",
            answer: `Absolutely! You can store customer details, purchase history, and notes in one place.
                This helps you understand your customers better, recognize loyal buyers, and build stronger relationships.`,
        },
        {
            question: "How does inventory management work?",
            answer: `You can easily add, edit, and track your products in real time.
                NegosyoTracker helps you monitor product availability and avoid shortages or overstock so your business runs smoothly.`,
        },
        {
            question: "Can I record and monitor my expenses?",
            answer: `Yes! You can record and categorize all your business expenses.
                NegosyoTracker shows you your cash flow clearly so you can manage your spending wisely.`,
        },
    ];
  

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

    return (
        <div className="w-full max-w-full px-15">
            <h2 className="text-4xl font-bold text-teal-600 text-center mb-10">
                Frequently Asked Questions
            </h2>

            <div className="space-y-4">
            {faqs.map((faq, index) => (
                <div
                    key={index}
                    className="border border-slate-200 rounded-2xl shadow-sm bg-gray-50 hover:bg-white transition-all duration-300"
                >
                <button
                    onClick={() => toggleFAQ(index)}
                    className="flex justify-between items-center w-full text-left px-6 py-4 focus:outline-none"
                >
                    <span className="font-semibold text-slate-600 text-lg"> {faq.question}</span>

                    <ChevronDown
                        className={cn(
                            "h-7 w-7 text-teal-600 transform transition-transform duration-300",
                            openIndex === index ? "rotate-180" : "rotate-0"
                        )}
                    />
                </button>

                <div
                    className={cn(
                        "overflow-hidden transition-all duration-500 ease-in-out",
                        openIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    )}
                >
                    <div className="px-6 pb-4 indent-5 text-gray-500 text-justify leading-relaxed">
                        {faq.answer}
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>
    );
}
