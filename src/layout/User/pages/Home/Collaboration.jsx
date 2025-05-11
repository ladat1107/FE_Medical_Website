


import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

const Collaboration = () => {

  const listColab = [
    {
      title: "bệnh viện nhi đồng", icon: "https://medpro.vn/_next/image?url=https%3A%2F%2Fbo-api.medpro.com.vn%3A5000%2Fstatic%2Fimages%2Fnhidong1%2Fapp%2Fimage%2Flogo_circle.png%3Ft%3D11111&w=64&q=75"

    },
    {
      title: "Đại học y dược", icon: "https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn-pkh.longvan.net%2Fprod-partner%2Fc09e66cd-2bbc-4e51-8df4-74417648343a-logo.png&w=64&q=75"
    },
    {
      title: "Bệnh viện da liễu", icon: "https://medpro.vn/_next/image?url=https%3A%2F%2Fbo-api.medpro.com.vn%3A5000%2Fstatic%2Fimages%2Fdalieuhcm%2Fapp%2Fimage%2Flogo_circle.png%3Ft%3D123&w=64&q=75",

    }
    , {
      title: "Chấn thương chỉnh hình", icon: "https://medpro.vn/_next/image?url=https%3A%2F%2Fbo-api.medpro.com.vn%3A5000%2Fstatic%2Fimages%2Fctchhcm%2Fweb%2Flogo.png%3F1657159777132%3Ft%3D123&w=64&q=75"
    },
    {
      title: "bệnh viện nhi đồng", icon: "https://medpro.vn/_next/image?url=https%3A%2F%2Fbo-api.medpro.com.vn%3A5000%2Fstatic%2Fimages%2Fnhidong1%2Fapp%2Fimage%2Flogo_circle.png%3Ft%3D11111&w=64&q=75"

    },
    {
      title: "Đại học y dược", icon: "https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn-pkh.longvan.net%2Fprod-partner%2Fc09e66cd-2bbc-4e51-8df4-74417648343a-logo.png&w=64&q=75"
    },
    {
      title: "Bệnh viện da liễu", icon: "https://medpro.vn/_next/image?url=https%3A%2F%2Fbo-api.medpro.com.vn%3A5000%2Fstatic%2Fimages%2Fdalieuhcm%2Fapp%2Fimage%2Flogo_circle.png%3Ft%3D123&w=64&q=75",

    }
    , {
      title: "Chấn thương chỉnh hình", icon: "https://medpro.vn/_next/image?url=https%3A%2F%2Fbo-api.medpro.com.vn%3A5000%2Fstatic%2Fimages%2Fctchhcm%2Fweb%2Flogo.png%3F1657159777132%3Ft%3D123&w=64&q=75"
    }
  ]
  const breakpoints = {
    0: { slidesPerView: 2 },
    320: { slidesPerView: 3 },
    768: { slidesPerView: 4 },
    1024: { slidesPerView: 6 },
    1700: { slidesPerView: 8 },
  }

  return (
    <div className="flex flex-col items-center justify-center" >
      <h3 className="text-3xl font-bold my-16 uppercase text-secondaryText-tw" >
        Được tin tưởng hợp tác và đồng hành
      </h3>
      <Swiper
        loop={true} // 👈 slide vô tận
        speed={1000}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={breakpoints}
        modules={[Autoplay]}
        className="w-full flex justify-center"
      >
        {listColab.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="flex flex-col items-center justify-center " >
              <img src={item.icon} alt="" />
              <p className="text-center text-sm font-bold text-secondaryText-tw" >{item.title}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>


    </div>
  )
}

export default Collaboration