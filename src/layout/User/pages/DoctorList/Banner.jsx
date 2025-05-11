import React from "react";
import Container from "@/components/Container";

const Banner = () => {
  return (
    <div className="bg-cover bg-center h-full w-full flex items-center py-10" style={{ backgroundImage: "url('https://medpro.vn/_next/static/media/BannerDefaul.4f7c4739.png')" }}>
      <Container>
        <div className="flex items-center justify-between w-full lg:gap-12 gap-5">
          <div className="md:w-3/5 w-full bg-white rounded-3xl shadow-md p-10 ">
            <h3 className="text-2xl text-primary-tw font-bold">TƯ VẤN KHÁM BỆNH QUA VIDEO</h3>
            <p className="text-lg font-semibold text-gray-800">Chăm sóc sức khoẻ từ xa kết nối với Bác sĩ qua cuộc gọi Video và Nhắn Tin mọi lúc mọi nơi</p>
            <hr className="my-3 border-primary-tw border-2" />
            <p className="font-semibold text-secondaryText-tw">Liên hệ <i className="text-lg cursor-pointer hover:text-orange-500">chuyên gia</i> để được tư vấn thêm <i className="text-primary-tw font-bold text-xl">19002138</i></p>
          </div>
          <div className=" flex flex-1 justify-end transform animate-slideInRight">
            <img
              src="https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2F5249549a-4d7c-4be8-95a7-ed7569d6bc59-tu-van-kham-benh-qua-video.webp&w=1920&q=75"
              alt=""
              className="w-full "
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Banner;