interface CardProps {
    title: string;
    icon: React.ReactNode;
    description: string;
  }
  
  export default function Card({ title, icon, description }: CardProps) {
    return (
      <div className="flex-1 bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border-t-4 border-teal-500">
        <div className="flex flex-row items-center justify-center gap-2">
          <div className="flex items-center justify-center w-16 h-16 text-3xl rounded-full bg-teal-100 mb-4 text-teal-600">
            {icon}
          </div>
          <h3 className="text-[1.2rem] font-semibold text-slate-500 mb-2">{title}</h3>
        </div>
        <p className="text-slate-500 leading-relaxed text-justify font-light mx-5">
            {description}
        </p>
      </div>
    );
  }
  