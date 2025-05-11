import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarMinus } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "@/utils/formatDate";
import ParseHtml from "@/components/ParseHtml";
import BlogDetailSkeleton from "./BlogDetailSkeleton";
const MAX_HEIGHT = 400;
const BlogDetailHeader = ({ blogDetail, isLoading }) => {
    const [showFull, setShowFull] = useState(false);
    const [showToggle, setShowToggle] = useState(false);
    const contentRef = useRef(null);
    useEffect(() => {
        if (contentRef.current) {
            const height = contentRef.current.scrollHeight;
            setShowToggle(height > MAX_HEIGHT);
        }
    }, [blogDetail]);
    useEffect(() => {
        if (!showFull) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }, [showFull]);
    if (isLoading) {
        return <BlogDetailSkeleton />;
    }
    return (
        <div className="w-full">
            {/* Banner đầu trang */}
            <div className="py-4">
                <img
                    src="https://cdn.medpro.vn/prod-partner/a9257277-bd0a-4183-8ed2-462ce5b6a619-baby-dino_1180x250_desktop.webp?w=1200&q=75"
                    alt="Header"
                    className="w-full rounded-xl object-cover"
                />
            </div>

            {/* Nội dung và ảnh bên phải */}
            <div className="mt-10 flex flex-col md:flex-row gap-6 items-start relative">
                {/* Nội dung */}
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-secondaryText-tw mb-3">
                        {blogDetail?.title || ""}
                    </h1>

                    <div className="text-[1.1em] text-gray-500 mb-3 flex items-center flex-wrap gap-2">
                        <FontAwesomeIcon icon={faCalendarMinus} className="mr-2" />
                        <span className="text-gray-600">
                            {formatDate(blogDetail?.updatedAt) || ""}
                        </span>
                        <span className="text-orange-500 font-semibold ">
                            - {blogDetail?.handbookStaffData?.position || ""}.{" "}
                            {blogDetail?.handbookStaffData?.staffUserData?.lastName || ""} {blogDetail?.handbookStaffData?.staffUserData?.firstName || ""}
                        </span>
                    </div>

                    <div className="text-base font-medium border-l-4 border-cyan-500 pl-4 mb-4 text-gray-600 bg-cyan-50 rounded-tr-lg rounded-br-lg p-2">
                        {blogDetail?.shortDescription || ""}
                    </div>

                    {/* Nội dung có thể ẩn/bớt */}
                    <div className={`relative transition-all duration-300 ease-in-out overflow-hidden ${showFull ? "max-h-full" : `max-h-[400px]`}`}>
                        <div ref={contentRef}>
                            <ParseHtml htmlString={blogDetail?.htmlDescription || ""} />
                        </div>
                        {!showFull && showToggle && (
                            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>
                        )}
                    </div>

                    {/* Nút Xem thêm / Ẩn bớt */}
                    {showToggle && (<div className="text-center mt-4">
                        <button
                            onClick={() => setShowFull((prev) => !prev)}
                            className="text-primary-tw hover:scale-105 transition-all duration-300 font-medium">
                            {showFull ? "Ẩn bớt ▲" : "Xem thêm ▼"}
                        </button>
                    </div>
                    )}
                </div>

                {/* Ảnh bên phải - chỉ hiển thị khi màn hình >= md */}
                <div className="hidden md:block w-[230px] sticky top-10 self-start">
                    <img
                        src="https://medpro.vn/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbn.da13f84b.png&w=1920&q=75"
                        alt="Decor"
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    );
};

export default BlogDetailHeader;
