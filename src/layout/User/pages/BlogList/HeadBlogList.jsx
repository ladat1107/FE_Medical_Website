import React from "react";
import { useNavigate } from "react-router-dom";
import { LINK, TAGS } from "@/constant/value";
import { PATHS } from "@/constant/path";
import { formatDate } from "@/utils/formatDate";
import HandbookCardHorizontal from "@/components/HandbookItem/HandbookCard/HandbookCardHorizontal";
import { CalendarPlus2 } from "lucide-react";
import { useMobile } from "@/hooks/useMobile";

const HeadBlogList = ({ list = [], id }) => {
  const navigate = useNavigate();
  const isMobile = useMobile();
  return (
    <div className="w-full py-10">
      {/* Navigation Tabs */}
      <ul className="flex flex-wrap gap-4 mb-4 px-2 md:px-4 lg:w-[700px] items-center justify-start md:justify-between text-sm md:text-base font-medium">
        <li className="text-secondaryText-tw font-bold text-lg md:text-xl">CẨM NANG Y TẾ</li>
        {[2, 4, 5].map((key) => (
          <li
            key={key}
            onClick={() => navigate(`${PATHS.HOME.HANDBOOK_LIST}/${TAGS[key].value}`)}
            className={`cursor-pointer text-gray-500 hover:text-primary-tw transition-all ${id === key ? "text-primary-tw font-semibold" : ""
              }`}
          >
            {TAGS[key].label}
          </li>
        ))}
      </ul>

      {/* Blog List Body */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column */}
        <div className="w-full lg:w-[60%]">
          {/* Main Banner Blog */}
          <div className="mb-6">
            <div className="rounded-xl overflow-hidden">
              <img
                src={list[0]?.image || LINK.IMAGE_HANDBOOK}
                alt="Ảnh bài viết"
                className="w-full object-cover"
              />
            </div>
            <h4 className="mt-6 text-2xl md:text-3xl font-bold">
              {list[0]?.title || "Bài viết mới nhất"}
            </h4>
            <div className="border-l-[5px] border-yellow-500 bg-yellow-50 py-2 px-4 rounded-tr-lg rounded-br-lg my-2">
              <p className="text-gray-800 mt-2 line-clamp-3 text-base leading-relaxed">
                {list[0]?.shortDescription || ""}
              </p>
            </div>
            <span className="flex items-center gap-2 text-gray-700 font-semibold mt-2">
              <CalendarPlus2 size={16} />
              {formatDate(list[0]?.updatedAt || new Date())} -{" "}
              {list[0]?.handbookStaffData?.position}{" "}
              {list[0]?.handbookStaffData?.staffUserData?.lastName}{" "}
              {list[0]?.handbookStaffData?.staffUserData?.firstName}
            </span>
            <div
              onClick={() =>
                navigate(PATHS.HOME.HANDBOOK_DETAIL + "/" + list[0]?.id)
              }
              className="text-primary-tw text-lg font-semibold cursor-pointer mt-2"
            >
              Xem tiếp →
            </div>
          </div>

          {/* Sub Blogs */}
          <div className={`${isMobile ? "hidden" : "flex flex-col sm:flex-row"} gap-4`}>
            {list.slice(1, 3).map((item, idx) => (
              <div
                key={idx}
                className="group w-full sm:w-1/2 p-3 border-1 border-transparent hover:border-primary-tw rounded-lg transition-all"
              >
                <img
                  src={item?.image || LINK.IMAGE_HANDBOOK}
                  alt="Ảnh bài viết"
                  className="w-full h-[200px] lg:h-[150px] object-cover rounded-lg"
                />
                <div className="mt-2">
                  <h4 className="text-base md:text-lg font-semibold mt-2 text-secondaryText-tw group-hover:text-primary-tw transition-all">
                    {item?.title || "Đặt lịch khám, đưa đón tiện lợi Medpro và Toàn Thắng"}
                  </h4>
                  <p className="text-sm text-gray-700 font-medium mt-1 h-[90px] overflow-hidden">
                    {item?.shortDescription}...
                  </p>
                  <div
                    onClick={() =>
                      navigate(PATHS.HOME.HANDBOOK_DETAIL + "/" + item.id)
                    }
                    className="text-sky-400 text-sm font-semibold cursor-pointer mt-2"
                  >
                    Xem tiếp →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className={`${isMobile ? "hidden" : "block"} w-full lg:w-[40%] `}>
          <div className="overflow-y-auto overflow-x-hidden scrollbar-none h-[1000px] px-3">
            {list.map((item, idx) => (
              <HandbookCardHorizontal key={idx} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadBlogList;
