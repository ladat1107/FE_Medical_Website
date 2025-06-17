
import { useNavigate } from "react-router-dom";
import useQuery from "@/hooks/useQuery";
import userService from "@/services/userService";
import { formatDate } from "@/utils/formatDate";
import { HandbookSwiper } from "@/components/Swiper";
import { PATHS } from "@/constant/path";

const Blog = () => {
  const navigate = useNavigate();
  const { data: blogData } = useQuery(() => userService.getHandbook({ limit: 5 }));
  const listBlog = blogData?.DT || [];

  const renderBlogItem = (item, isMain = false) => (
    <div
      key={item.id}
      className={`bg-white rounded-xl shadow-sm p-2  cursor-pointer hover:shadow-md transition-shadow ${isMain ? "lg:col-span-2 h-[600px]" : "h-[280px]"
        }`}
      onClick={() => navigate(PATHS.HOME.HANDBOOK_DETAIL + "/" + item.id)}
    >
      <img
        className={`w-full ${isMain ? "h-56" : "h-40"} object-cover rounded-lg mb-4`}
        src={
          item?.image ||
          "https://medpro.vn/_next/image?url=https%3A%2F%2Fcms.medpro.com.vn%2Fuploads%2F1732788380111_39096d0123.png&w=1920&q=75"
        }
        alt="Ảnh bài viết"
      />
      <div className="px-2">
        <h4 className={`${isMain ? "text-xl" : ""} font-semibold mb-2 line-clamp-2`}>
          {item?.title || "Đặt lịch khám, đưa đón tiện lợi Medpro và Toàn Thắng"}
        </h4>
        <span className="text-xs text-secondaryText-tw block mb-2">
          {formatDate(item?.updatedAt || new Date())} -{" "}
          {item?.handbookStaffData?.position || ""}{" "}
          {item?.handbookStaffData?.staffUserData?.lastName +
            " " +
            item?.handbookStaffData?.staffUserData?.firstName}
        </span>
        {isMain && (
          <p className="text-gray-600 text-sm line-clamp-5 break-words">{item?.shortDescription || ""}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="mx-auto px-4 py-6">
      <h3 className="text-2xl md:text-3xl font-bold text-secondaryText-tw text-center mb-8">
        Tin tức y tế
      </h3>

      {/* Grid layout cho >= md */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">
        {listBlog[0] && renderBlogItem(listBlog[0], true)}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {listBlog.slice(1, 5).map((item) => renderBlogItem(item))}
        </div>
      </div>

      {/* Swiper layout cho < md */}
      <div className="md:hidden mb-10">
        <HandbookSwiper handbookList={listBlog} />
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => navigate(PATHS.HOME.HANDBOOK_LIST + "/3")}
          className="px-8 py-2 text-primary-tw font-semibold border border-primary-tw rounded-full hover:bg-primary-tw hover:text-white transition-colors"
        >
          Xem tất cả
        </button>
      </div>
    </div>
  );
};

export default Blog;
