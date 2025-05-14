import React from "react";
import { Search as SearchIcon } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useMobile } from "@/hooks/useMobile";

const Banner = () => {
  const isMobile = useMobile();
  const listService = [
    { title: "Đặt khám theo bác sĩ ", icon: "https://medpro.vn/_next/image?url=https%3A%2F%2Fprod-partner.s3-hcm-r1.longvan.net%2F488715df-05ff-42ef-bf6b-27d91d132158-bacsi.png&w=64&q=75" },
    { title: "Tư vấn khám qua video", icon: "https://medpro.vn/_next/image?url=https%3A%2F%2Fprod-partner.s3-hcm-r1.longvan.net%2F9fdd77eb-9baa-4f3b-a108-d91e136a0bf9-tele.png&w=64&q=75" },
    { title: "Đặt lịch xét nghiệm", icon: "https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2Fc193937f-8c0f-479e-be31-5610db6f7df1-dat-lich-xet-nghiem.png&w=64&q=75" },
    { title: "Gói khám sức khỏe", icon: "https://medpro.vn/_next/image?url=https%3A%2F%2Fprod-partner.s3-hcm-r1.longvan.net%2Fb4181f19-f965-40b8-a4c5-2996cb960104-goi_kham.png&w=64&q=75" },
    { title: "Đặt khám theo bác sĩ ", icon: "https://medpro.vn/_next/image?url=https%3A%2F%2Fprod-partner.s3-hcm-r1.longvan.net%2F488715df-05ff-42ef-bf6b-27d91d132158-bacsi.png&w=64&q=75" },
    { title: "Tư vấn khám qua video", icon: "https://medpro.vn/_next/image?url=https%3A%2F%2Fprod-partner.s3-hcm-r1.longvan.net%2F9fdd77eb-9baa-4f3b-a108-d91e136a0bf9-tele.png&w=64&q=75" },
  ]
  const breakpoints = {
    0: { slidesPerView: 2, spaceBetween: 10, },
    550: { slidesPerView: 3, spaceBetween: 10, },
    840: { slidesPerView: 5, spaceBetween: 10, },
    1240: { slidesPerView: 6, spaceBetween: 20, },
    1700: { slidesPerView: 8, spaceBetween: 20, },
  }
  return (
    <div className="flex flex-col items-center py-8 md:py-12">
      <div className="w-full md:w-4/5 lg:w-3/4 xl:w-2/3 text-center px-4 mb-8 md:mb-16">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondaryText-tw mb-2 md:mb-4">
          Kết nối Người Dân với Cơ sở & Dịch vụ Y tế hàng đầu
        </h2>

        <div className="relative w-full my-1 md:my-5">
          <input
            type="text"
            placeholder="Tìm kiếm"
            name="text"
            className="w-full py-3 pl-12 pr-4 rounded-full outline-none border border-gray-200 focus:border-primary-tw transition-all duration-200 opacity-80"
          />
          <SearchIcon className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" size={20} />
        </div>

        <h4 className="hidden md:block text-2xl font-bold text-secondaryText-tw mt-4">
          Đặt khám nhanh - Lấy số thứ tự trực tuyến - Tư vấn sức khỏe từ xa
        </h4>
      </div>
      {isMobile ?
        <div className="bg-white rounded-2xl shadow-card-doctor grid grid-cols-3 sm:grid-cols-4 gap-4 p-3">
          {listService.map((item, index) => (
            <div key={index} className="w-[110px] h-[110px] flex flex-col items-center justify-center">
              <img src={item.icon} alt="" />
              <p className="text-secondaryText-tw text-center text-sm">{item.title}</p>
            </div>
          ))}
        </div>
        :
        <Swiper
          speed={1000}
          breakpoints={breakpoints}
          className="w-full flex justify-center"
        >
          {listService.map((item, index) => (
            <SwiperSlide key={index} >
              <div className="w-[150px] h-[150px] bg-white rounded-2xl p-3 flex flex-col items-center justify-center">
                <img src={item.icon} alt="" />
                <p className="text-secondaryText-tw text-center">{item.title}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>}
    </div>
  );
};

export default Banner;
