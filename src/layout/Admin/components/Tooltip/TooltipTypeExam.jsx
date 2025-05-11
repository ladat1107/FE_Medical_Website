import React from "react";

const TooltipTypeExam = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const { name, detail, color, value } = payload[0].payload;
        return (
            <div className="bg-white border border-gray-300 p-2 rounded-md" >
                <p className={`text-base font-bold`} style={{ color: color }}>{name}</p>
                {detail[0] > 0 && <p className="text-sm">{"Nhập viện"}: {detail[0]} ca</p>}
                {detail[1] > 0 && <p className="text-sm">{"Khám bệnh"}: {detail[1]} ca</p>}
                {detail[2] > 0 && <p className="text-sm">{"Cấp cứu"}: {detail[2]} ca</p>}
                <p className="text-sm font-bold">{"Tổng"}: {value} ca</p>
            </div>
        );
    }

    return null;
};

export default TooltipTypeExam;
