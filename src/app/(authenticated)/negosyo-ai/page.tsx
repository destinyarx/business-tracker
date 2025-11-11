import Link from "next/link";

export default function ComingSoonPage() {
    return (
      <div className="w-full max-w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-gray-50 to-teal-100 text-gray-800 -mt-10">
        <div className="text-center p-8 rounded-2xl shadow-lg bg-white/80 backdrop-blur-md border border-gray-200 max-w-lg">
            <div className="flex justify-center mb-6">
                {/* Business icon */}
                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-teal-600 text-white shadow-md">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="w-10 h-10"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 14l2-2m0 0l2-2m-2 2v6m8 4H5a2 2 0 01-2-2V5a2 2 0 012-2h8l6 6v13a2 2 0 01-2 2z"
                    />
                </svg>
                </div>
            </div>
    
            <h1 className="text-2xl font-bold text-teal-800 mb-3">
                This Feature is Coming Soon 🚀
            </h1>
    
            <p className="text-gray-600 mb-6">
                We're working hard to bring this feature to you.  
                Stay tuned — it's designed to help you manage your business smarter
                and track success effortlessly.
            </p>
    
            <Link href="/dashboard">
                <button
                    type="button"
                    className="px-6 py-3 rounded-lg font-semibold bg-teal-600 text-white hover:bg-teal-300 transition-colors shadow-md"
                >
                    Back to Dashboard
                </button>
            </Link>
    
            <div className="mt-8 text-sm text-teal-600 italic font-light">
                <div className="px-3 py-1 rounded-md bg-mustard-200/50 text-mustard-700 font-medium">
                    #NegosyoTracker <br/>
                    #SmallBusinessOwner <br/>
                </div>
            </div>
        </div>
      </div>
    );
}
  