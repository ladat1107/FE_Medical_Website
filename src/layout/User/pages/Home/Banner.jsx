import React from "react";
import { Search as SearchIcon } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useMobile } from "@/hooks/useMobile";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearBooking, setCurrentContent } from "@/redux/bookingSlice";
import { PATHS } from "@/constant/path";
import { BOOKING_CONTENT, TAGS } from "@/constant/value";

const Banner = () => {
  const isMobile = useMobile();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const listService = [
    {
      title: "Đặt khám theo chuyên khoa",
      icon: "https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2Fe3b1924c-c9f6-4cc8-9e4c-fd457815b378-dat-kham-chuyen-khoa.png&w=128&q=75",
      handleClick: () => {
        dispatch(clearBooking())
        dispatch(setCurrentContent(BOOKING_CONTENT.SPECIALTY))
        navigate(PATHS.HOME.BOOKING)
      }
    },
    {
      title: "Đặt khám theo bác sĩ ",
      icon: "https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2F4681bfd1-db5b-4364-a52a-5b0355abf607-bs.png&w=128&q=75",
      handleClick: () => {
        dispatch(clearBooking())
        dispatch(setCurrentContent(BOOKING_CONTENT.DOCTOR))
        navigate(PATHS.HOME.BOOKING)
      }
    },
    {
      title: `<span>Số khám <br /> hiện tại </span>`,
      handleClick: () => {
        navigate(PATHS.HOME.NUMERICAL)
      },
      icon: "https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2Faf579b7d-d040-436e-992a-0bb9c6374785-dat-kham-tai-co-so.webp&w=128&q=75"
    },
    {
      title: `<span>Đơn khám <br /> bệnh </span>`,
      handleClick: () => {
        navigate(PATHS.HOME.APPOINTMENT_LIST)
      },
      icon: "https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2Fc874863c-34ce-469f-b209-895b45e4166a-tt.png&w=128&q=75"
    },
    {
      title: "Tin tức",
      handleClick: () => {
        navigate(`${PATHS.HOME.HANDBOOK_LIST}/${TAGS[2].value}`)
      },
      icon: "https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn-pkh.longvan.net%2Fprod-partner%2Ffa0b00be-d554-404a-bf9a-4a5f216ee978-chaam_saac_taaoa_i_nhaa.png&w=128&q=75"
    },
    {
      title: "Thông báo",
      handleClick: () => {
        navigate(PATHS.HOME.NOTIFICATION)
      },
      icon: "https://medpro.vn/_next/image?url=https%3A%2F%2Fprod-partner.s3-hcm-r1.longvan.net%2F9fdd77eb-9baa-4f3b-a108-d91e136a0bf9-tele.png&w=64&q=75"
    },
  ]
  const breakpoints = {
    0: { slidesPerView: 2, spaceBetween: 10, },
    550: { slidesPerView: 3, spaceBetween: 10, },
    840: { slidesPerView: 5, spaceBetween: 10, },
    1240: { slidesPerView: 6, spaceBetween: 20, },
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
        <div className="bg-white rounded-2xl shadow-card-doctor grid grid-cols-3 sm:grid-cols-4 gap-2 md:gap-4 p-3" >
          {listService.map((item, index) => (
            <div key={index} className="w-[110px] h-[110px] flex flex-col items-center justify-center cursor-pointer" onClick={item.handleClick}>
              <img className="h-[40px]" src={item.icon} alt="" />
              <p className="text-secondaryText-tw text-center text-sm mt-2" dangerouslySetInnerHTML={{ __html: item.title }}></p>
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
              <div className="group w-[150px] h-[150px] bg-white rounded-2xl p-3 flex flex-col items-center justify-center cursor-pointer" onClick={item.handleClick}>
                <img className="h-[50px] group-hover:scale-110 transition-all duration-300" src={item.icon} alt="" />
                <p className="text-secondaryText-tw text-center h-[30px] mt-3 group-hover:text-primary-tw" dangerouslySetInnerHTML={{ __html: item.title }}></p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>}
    </div>
  );
};

export default Banner;
