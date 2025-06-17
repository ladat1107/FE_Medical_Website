
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/pagination';

const listAdvertisement = [
    "https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2F4edacddd-7280-41e0-b6c9-3eb7d438c107-banner_cashback_1180x310_desktop.jpg&w=1200&q=100",
    "https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2Fce76da74-5584-451b-b417-c3b68ce49cfa-viettel_money_banner_fb_1180x310_copy2_copy.png&w=1200&q=100",
    "https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2Fa32bf783-c67b-41d8-87fd-e50f621e5ce2-promote-medpro-de.jpg&w=1200&q=100",
    "https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2Fda64c9ee-fdd6-4a13-bc52-fe74255fc079-promote-vaccine-d.jpg&w=1200&q=100"
]
const AdvertisementSwiper = () => {
    return (
        <Swiper
            loop={true} // 👈 slide vô tận
            speed={1000}
            autoplay={{
                delay: 3000,
                disableOnInteraction: false,
            }}
            slidesPerView={1}
            pagination={{
                clickable: true,
            }}
            modules={[Autoplay, Pagination]}
            className="w-full flex justify-center"
        >
            {listAdvertisement.map((item, index) => (
                <SwiperSlide key={index} className="w-full py-10">
                    <img src={item} alt="Ảnh quảng cáo" className="w-full h-full object-cover rounded-lg" />
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

export default AdvertisementSwiper;
