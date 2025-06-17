import DoctorCard from "@/components/DoctorCard";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import DoctorCardSkeleton from "@/layout/User/pages/DoctorList/Component/DoctorCardSkeleton";
const DoctorSwiper = ({ doctorList, loading }) => {
    const breakpoints = {
        0: { slidesPerView: 1.1 },
        550: { slidesPerView: 2, spaceBetween: 10, },
        840: { slidesPerView: 3, spaceBetween: 10, },
        1240: { slidesPerView: 4, spaceBetween: 20, },
        1700: { slidesPerView: 5, spaceBetween: 20, },
    }
    return (
        <Swiper
            loop={true} // 👈 slide vô tận
            speed={1000}
            autoplay={{
                delay: 3000,
                disableOnInteraction: false,
            }}
            breakpoints={breakpoints}
            modules={[Autoplay]}
            className="w-full justify-center py-2"
        >
            {
                loading ? Array.from({ length: 5 }).map((_, index) => (
                    <SwiperSlide key={index} className="flex justify-center">
                        <DoctorCardSkeleton />
                    </SwiperSlide>
                )) :
                    doctorList.map((item, index) => (
                        <SwiperSlide key={index} className="flex justify-center">
                            <DoctorCard doctor={item} />
                        </SwiperSlide>
                    ))
            }
        </Swiper>
    )
}

export default DoctorSwiper;
