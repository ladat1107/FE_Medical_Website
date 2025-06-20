import React from "react";
import Marquee from "@/components/Marquee";
import Container from "@/components/Container";
import Banner from "./Banner";
import Specialty from "./Specialty";
import OurTeam from "./OurTeam";
import Collaboration from "./Collaboration";
import Department from "./Department";
import Download from "./Dowload";
import Media from "./Media";
import VideoComponent from "@/components/Video";
import Blog from "./Blog";
import AdvertisementSwiper from "@/components/Swiper/AdvertisementSwiper";

const HomePage = () => {
  return (
    <>
      <Marquee />

      <div className="w-full bg-no-repeat bg-center bg-cover"
        style={{
          backgroundImage: "url('https://cdn.medpro.vn/prod-partner/92b6d682-4b5a-4c94-ac54-97a077c0c6c5-homepage_banner.webp')",
          aspectRatio: "3.14"
        }}>
        <Container>
          <Banner />
        </Container>
      </div>

      <div className="my-3 md:my-10">
        <Container>
          <Collaboration />
        </Container>
      </div>

      <div className="mb-16">
        <Container>
          <AdvertisementSwiper />
        </Container>
      </div>

      <div className="bg-bgHomePage mb-16">
        <Container>
          <Department />
          <OurTeam />
        </Container>
      </div>

      <Container>
        <Specialty />
        <Download />
        <Media />
        <VideoComponent />
      </Container>

      <div className="bg-gradient-to-b from-white via-bgHomePage to-white py-6 mt-0 md:mt-10">
        <Container>
          <Blog />
        </Container>
      </div>
    </>
  );
};

export default HomePage;
