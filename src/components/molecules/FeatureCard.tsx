interface CardProps {
    title: string
    icon: React.ReactNode
    description: string
    showComingSoon: boolean
  }
  
  export default function Card({ title, icon, description, showComingSoon }: CardProps) {
    return (
      <div className="flex-1 bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border-t-4 border-teal-500">
        <div className="flex flex-row items-center justify-center gap-2">
          <div className="flex items-center justify-center w-16 h-16 text-3xl rounded-full bg-teal-300 mb-4 text-teal-600">
            {icon}
          </div>
          <div className="flex flex-col justify-center items-center">
            <h3 className="text-[1.2rem] font-semibold text-slate-500 mb-2">{title}</h3>

            {showComingSoon && (
              <div className="bg-slate-600 text-gray-300 text-[0.6rem] font-semibold rounded-full px-2 py-1 -mt-2">
                Coming Soon 🔒
              </div>
            )}
          </div>
        </div>
        <p className="text-slate-500 leading-relaxed indent-4 text-justify font-light mx-5">
            {description}
        </p>
      </div>
    );
  }
  