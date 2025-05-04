import { UtensilsCrossed } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white shadow-lg border border-gray-200 animate-pulse">
        <UtensilsCrossed className="text-rose-500 animate-bounce w-8 h-8" />
        <span className="text-rose-500 font-semibold text-lg">Yummy is loading...</span>
      </div>
    </div>
  );
};

export default Loading;
