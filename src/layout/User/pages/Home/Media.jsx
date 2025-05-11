import React from "react";

const Media = () => {
  const mediaLogos = [
    {
      src: "https://medpro.vn/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fthanh-nien-logo.e8e27f62.png&w=1920&q=75",
      alt: "Thanh niên logo"
    },
    {
      src: "https://medpro.vn/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ftuoi-tre-logo.96edf351.png&w=1920&q=75",
      alt: "Tuổi trẻ logo"
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/vi/d/d7/Logo-NhanDan.png",
      alt: "Báo nhân dân logo"
    },
    {
      src: "https://medpro.vn/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fnguoi-lao-dong-logo.2ebb5615.png&w=1920&q=75",
      alt: "Người lao động logo"
    },
    {
      src: "https://medpro.vn/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhtv.e0154343.png&w=1920&q=75",
      alt: "HTV logo"
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/6/69/BTV_logo_%28B%C3%ACnh_Thu%E1%BA%ADn%29.png",
      alt: "BTV logo"
    },
    {
      src: "https://medpro.vn/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fvtv1-logo.60a3a5d8.png&w=1920&q=75",
      alt: "VTV1 logo"
    },
    {
      src: "https://medpro.vn/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fthvl-logo.c30c70cd.png&w=1920&q=75",
      alt: "THVL logo"
    }
  ];

  return (
    <div className="py-16 px-4 container mx-auto">
      <h3 className="text-2xl md:text-3xl font-bold text-secondaryText-tw text-center mb-10 uppercase">
        Truyền thông nói gì về chúng tôi
      </h3>
      <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
        {mediaLogos.map((logo, index) => (
          <div key={index} className="w-24 sm:w-28 md:w-32 lg:w-40 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity">
            <img
              src={logo.src}
              alt={logo.alt}
              className="max-w-full h-auto object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Media;
