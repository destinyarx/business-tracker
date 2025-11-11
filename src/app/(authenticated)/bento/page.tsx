'use client'

export default function Index() {
    return (
      <div className="w-full max-w-full h-[88vh] bg-gray-50 p-4">
        <div className="grid grid-cols-6 grid-rows-5 gap-4 h-full border border-red p-4">
          {/* Header */}
          <div className="col-span-6 bg-white shadow-md flex items-center justify-center rounded-md">
            <span className="text-gray-700 font-semibold">1 - Header</span>
          </div>
  
          {/* Left Sidebar */}
          <div className="row-span-3 row-start-2 bg-white shadow-md flex items-center justify-center rounded-md">
            <span className="text-gray-700 font-semibold">2 - Sidebar Left</span>
          </div>
  
          {/* Right Sidebar */}
          <div className="row-span-3 col-start-6 row-start-2 bg-white shadow-md flex items-center justify-center rounded-md">
            <span className="text-gray-700 font-semibold">3 - Sidebar Right</span>
          </div>
  
          {/* Main Content */}
          <div className="col-span-4 row-span-3 col-start-2 row-start-2 bg-white shadow-md flex items-center justify-center rounded-md">
            <span className="text-gray-700 font-semibold">4 - Main Content</span>
          </div>
  
          {/* Footer */}
          <div className="col-span-6 row-start-5 bg-white shadow-md flex items-center justify-center rounded-md">
            <span className="text-gray-700 font-semibold">5 - Footer</span>
          </div>
        </div>
      </div>
    );
}
  