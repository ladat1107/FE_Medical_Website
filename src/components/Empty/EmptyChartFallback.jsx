import { BarChart3 } from "lucide-react";

const EmptyChartFallback = ({ message = "Không có dữ liệu để hiển thị." }) => {
    return (
        <div className="flex flex-col items-center justify-center h-64 w-full">
            <div className="bg-[#00B5F1]/10 p-4 rounded-full mb-3 backdrop-blur-sm shadow-sm">
                <BarChart3 size={48} stroke="#00B5F1" strokeWidth={1.5} />
            </div>
            <p className="text-base font-medium text-[#00B5F1] mb-1">{message}</p>
        </div>
    );
};

export default EmptyChartFallback;
