import React from "react";
const Banner = () => {
  return (
    <div className="w-full h-full max-w-[1980px] flex items-center 
    bg-[url('https://medpro.vn/_next/static/media/BannerDefaul.4f7c4739.png')] bg-contain bg-center py-10">

      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 p-4">
        <div className="w-full md:w-3/5 lg:min-w-[750px] bg-white rounded-3xl shadow-[4px_8px_20px_0_hsla(199,9%,64%,.3)] p-6 md:p-10">
          <h3 className="text-2xl md:text-4xl text-[#00b5f1] font-bold">TƯ VẤN KHÁM BỆNH QUA VIDEO</h3>
          <p className="text-base md:text-xl font-semibold text-[#003553] mt-4 leading-relaxed">
            Chăm sóc sức khoẻ từ xa kết nối với Bác sĩ qua cuộc gọi Video và Nhắn Tin mọi lúc mọi nơi
          </p>
          <span className="block w-full h-px bg-[#00b5f1] my-5"></span>
          <p className="text-base md:text-xl font-semibold text-[#003553] leading-relaxed">
            Liên hệ{" "}
            <i className="text-lg md:text-xl font-extrabold text-orange-500 cursor-pointer transition-all duration-300 hover:text-orange-600">
              Chuyên gia
            </i>{" "}
            để được tư vấn thêm{" "}
            <i className="text-lg md:text-xl font-extrabold text-orange-500 cursor-pointer transition-all duration-300 hover:text-orange-600">
              19002138
            </i>
          </p>
        </div>
        <div className="flex-1 animate-slideInRight">
          <img
            src="https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2F5249549a-4d7c-4be8-95a7-ed7569d6bc59-tu-van-kham-benh-qua-video.webp&w=1920&q=75"
            alt="Tư vấn khám bệnh qua video"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
