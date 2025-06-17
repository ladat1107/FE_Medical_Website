import { Skeleton } from "@mui/material";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";


const BannerSwiper = ({ loading }) => {
    const listAdvertisement1 = [
        "https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn-pkh.longvan.net%2Fprod-partner%2F42a394bd-0354-4c1c-b83b-f6cc331d3263-m3.png&w=1920&q=75",
        "https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn-pkh.longvan.net%2Fprod-partner%2F42a394bd-0354-4c1c-b83b-f6cc331d3263-m3.png&w=1920&q=75",
        "https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn-pkh.longvan.net%2Fprod-partner%2F42a394bd-0354-4c1c-b83b-f6cc331d3263-m3.png&w=1920&q=75",
        "https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn-pkh.longvan.net%2Fprod-partner%2F42a394bd-0354-4c1c-b83b-f6cc331d3263-m3.png&w=1920&q=75",
    ]
    if (loading) {
        return (
            <div className="w-full h-[330px] rounded-2xl mt-2 bg-primary-tw/10"></div>
        )
    }
    return (
        <Swiper
            pagination={{
                dynamicBullets: true,
                clickable: true,
            }}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            initialSlide={1}
            modules={[Autoplay, Pagination, Navigation]}
            className="w-full rounded-2xl"
        >
            {listAdvertisement1.map((item, index) => (
                <SwiperSlide key={index}>
                    <img src={item} alt="Advertisement"
                        className={`w-full h-[300px] object-cover rounded-2xl`} />
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

export default BannerSwiper;
