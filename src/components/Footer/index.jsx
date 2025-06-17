import { useMobile } from "@/hooks/useMobile"
import { MapPin, Globe, Mail, Phone, Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import FooterSectionCollapse from "./FooterSectionCollapse";
import { PATHS } from "@/constant/path";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const isMobile = useMobile();
  const navigate = useNavigate();
  return (
    <footer className={`"bg-gray-50 pt-12 ${isMobile ? 'pb-[60px]' : ''} border-t border-gray-200 shadow-sm`}>
      {/* Main Footer Content */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Logo and Contact */}
          <div className="w-full lg:w-1/4">
            <div className="mb-6 cursor-pointer" onClick={() => { navigate(PATHS.HOME.HOMEPAGE); window.scrollTo(0, 0) }}>
              <img
                src="https://res.cloudinary.com/utejobhub/image/upload/v1733740053/KHOA_500_x_200_px_dp7on2.png"
                alt="Hoa Sen Logo"
                className="h-16 object-contain"
              />
            </div>

            <div className="space-y-3 text-gray-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-primary-tw mt-1 flex-shrink-0" />
                <p className="text-sm">236/29/18 Điện Biên Phủ - Phường 17 - Quận Bình Thạnh - TPHCM</p>
              </div>

              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary-tw flex-shrink-0" />
                <a href="https://hoasen.vn" className="text-sm hover:text-primary-tw transition-colors">
                  https://hoasen.vn
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary-tw flex-shrink-0" />
                <a href="mailto:cskh@hoasen.vn" className="text-sm hover:text-primary-tw transition-colors">
                  cskh@hoasen.vn
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary-tw flex-shrink-0" />
                <a href="tel:(028)7107098" className="text-sm hover:text-primary-tw transition-colors">
                  (028) 710 78098
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3 text-gray-800">Kết nối với chúng tôi</h4>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-cyan-500 flex items-center justify-center text-white hover:bg-cyan-600 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-cyan-500 flex items-center justify-center text-white hover:bg-cyan-600 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-cyan-500 flex items-center justify-center text-white hover:bg-cyan-600 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href={PATHS.SYSTEM.GET_NUMBER}
                  className="w-9 h-9 rounded-full bg-cyan-500 flex items-center justify-center text-white hover:bg-cyan-600 transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Links */}
          <div className="w-full lg:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0 sm:gap-8 ">
              {/* Services Section */}
              <FooterSectionCollapse
                title="Dịch vụ Y tế"
                items={[
                  "Đặt khám tại cơ sở",
                  "Đặt khám theo bác sĩ",
                  "Tư vấn khám bệnh qua video",
                  "Đặt lịch xét nghiệm",
                  "Gói khám sức khỏe",
                  "Đặt lịch tiêm chủng",
                  "Y tế tại nhà",
                  "Thanh toán Viện phí",
                ]}
              />

              {/* Medical Facilities Section */}
              <FooterSectionCollapse
                title="Cơ sở y tế"
                items={[
                  "Bệnh viện công",
                  "Bệnh viện tư",
                  "Phòng khám",
                  "Phòng mạch",
                  "Xét nghiệm",
                  "Y tế tại nhà",
                  "Tiêm chủng",
                ]}
              />

              {/* Guides Section */}
              <FooterSectionCollapse
                title="Hướng dẫn"
                items={["Cài đặt ứng dụng", "Đặt lịch khám", "Tư vấn khám bệnh qua video", "Quy trình hoàn phí", "Câu hỏi thường gặp", "Quy trình đi khám",]}
              />

              {/* Cooperation Section */}
              <FooterSectionCollapse
                title="Liên hệ hợp tác"
                items={["Tham gia Hoa Sen", "Khám sức khỏe doanh nghiệp", "Quảng cáo", "Tuyển Dụng",]}
              />

              {/* News Section */}
              <FooterSectionCollapse
                title="Tin tức"
                items={["Tin tức", "Tin dịch vụ", "Tin Y Tế", "Y Học thường thức",]}
              />

              {/* About Section */}
              <FooterSectionCollapse
                title="Về Hoa Sen"
                items={["Về Hoa Sen", "Giới thiệu", "Điều khoản dịch vụ", "Chính sách bảo mật", "Quy định sử dụng",]}
              />
            </div>
          </div>
        </div>

        {/* App Download Section */}
        <div className="mt-6 border-t border-gray-200 pt-3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center justify-between md:justify-start">
              <div className="flex flex-col items-center w-1/2">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Logo_Tr%C6%B0%E1%BB%9Dng_%C4%90%E1%BA%A1i_H%E1%BB%8Dc_S%C6%B0_Ph%E1%BA%A1m_K%E1%BB%B9_Thu%E1%BA%ADt_TP_H%E1%BB%93_Ch%C3%AD_Minh.png"
                  alt="Trường đại học Sư phạm Kỹ thuật TP.HCM"
                  className="h-12"
                />
                <span className="text-xs text-center text-secondaryText-tw font-bold mt-1">Trường Đại học Sư phạm Kỹ thuật TP.HCM</span>
              </div>

              <div className="flex flex-col items-center w-1/2">
                <img
                  src="https://fit.hcmute.edu.vn/Resources/Images/SubDomain/fit/FIT-DoanHoi.png"
                  alt="Khoa Công nghệ thông tin"
                  className="h-12"
                />
                <span className="text-xs text-center text-secondaryText-tw font-bold mt-1">Khoa Công nghệ thông tin</span>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end">
              <div className="flex gap-3">
                <a href="#" className="flex items-center gap-2"                >
                  <img
                    className="w-[120px] h-[40px] rounded-md"
                    src="https://medpro.vn/_next/image?url=https%3A%2F%2Fbo-api.medpro.com.vn%2Fstatic%2Fimages%2Fmedpro%2Fweb%2Ficon_google_play.svg%3Ft%3D1111111&w=1200&q=75" alt="Google Play" />
                </a>
                <a href="#" className="flex items-center gap-2"                >
                  <img
                    className="w-[120px] h-[40px] rounded-md"
                    src="https://medpro.vn/_next/image?url=https%3A%2F%2Fbo-api.medpro.com.vn%2Fstatic%2Fimages%2Fmedpro%2Fweb%2Ficon_ios.svg%3Ft%3D11111111&w=1200&q=75" alt="App Store" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className={`bg-gradient-primary text-white py-2 border-t border-gray-200 `}>
        <div className="flex justify-center items-center ">
          <p className="text-sm font-bold text-center">© 2025 - Khóa luận tốt nghiệp <br /> La Tiến Đạt & Trần Minh Dương</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
