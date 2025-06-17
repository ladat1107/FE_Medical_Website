import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import HandbookCard from "../HandbookItem/HandbookCard/HandbookCard";

const HandbookSwiper = ({ handbookList }) => {
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
            modules={[Autoplay]}
            breakpoints={breakpoints}
            className="w-full flex justify-center my-3 gap-2"
        >
            {handbookList.map((item, index) => (
                <SwiperSlide key={index} className="px-2">
                    <HandbookCard data={item} />
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

export default HandbookSwiper;
