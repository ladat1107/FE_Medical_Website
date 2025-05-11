import React from "react";
import { LINK } from "@/constant/value";
import { formatDate } from "@/utils/formatDate";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/constant/path";
import { Calendar } from "lucide-react";

const HandbookCard = ({ data }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(PATHS.HOME.HANDBOOK_DETAIL + "/" + data.id)}
            className="bg-white cursor-pointer w-full h-[400px] border rounded-xl shadow-card-doctor
      hover:border-primary-tw hover:scale-105 transition-all duration-300"
        >
            {/* Image */}
            <div className="overflow-hidden h-1/2 rounded-tl-xl rounded-tr-xl mb-2">
                <img
                    src={data?.image || LINK.IMAGE_HANDBOOK}
                    alt="Ảnh bài viết"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between h-[calc(50%-0.75rem)] p-2">
                {/* Title */}
                <div className="flex items-center gap-2 text-[15px] text-[#858585]">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <p className="m-0">{data?.tags?.split(",")[0] || "Tin Y tế"}</p>
                </div>

                {/* Body Content */}
                <p className="mt-2 text-primary-tw font-bold text-base line-clamp-2 ">
                    {data?.title ||
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
                </p>

                {/* Name */}
                <div className="text-[12px] font-semibold text-[#ffa200] mt-1">
                    {data?.handbookStaffData?.position || "BS"}.{" "}
                    {data?.handbookStaffData?.staffUserData?.lastName +
                        " " +
                        data?.handbookStaffData?.staffUserData?.firstName}
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-[12px] font-semibold h-[30px] text-gray-700">
                    <Calendar size={16} />
                    <span> {formatDate(data?.updatedAt || new Date())}</span>
                </div>
            </div>
        </div>
    );
};

export default HandbookCard;
