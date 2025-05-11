import { useMobile } from "@/hooks/useMobile"
import { MapPin, Globe, Mail, Phone, Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import FooterSectionCollapse from "./FooterSectionCollapse";

const Footer = () => {
  const isMobile = useMobile();

  return (
    <footer className={`"bg-gray-50 pt-12 ${isMobile ? 'pb-[60px]' : ''} border-t border-gray-200 shadow-sm`}>
      {/* Main Footer Content */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Logo and Contact */}
          <div className="w-full lg:w-1/4">
            <div className="mb-6">
              <img
                src="https://res.cloudinary.com/utejobhub/image/upload/v1733740053/KHOA_500_x_200_px_dp7on2.png"
                alt="Medpro Logo"
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
                <a href="https://medpro.vn" className="text-sm hover:text-primary-tw transition-colors">
                  https://medpro.vn
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary-tw flex-shrink-0" />
                <a href="mailto:cskh@medpro.vn" className="text-sm hover:text-primary-tw transition-colors">
                  cskh@medpro.vn
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
                  href="#"
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
                items={["Tham gia Medpro", "Khám sức khỏe doanh nghiệp", "Quảng cáo", "Tuyển Dụng",]}
              />

              {/* News Section */}
              <FooterSectionCollapse
                title="Tin tức"
                items={["Tin tức", "Tin dịch vụ", "Tin Y Tế", "Y Học thường thức",]}
              />

              {/* About Section */}
              <FooterSectionCollapse
                title="Về Medpro"
                items={["Về Medpro", "Giới thiệu", "Điều khoản dịch vụ", "Chính sách bảo mật", "Quy định sử dụng",]}
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
                  src="https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/474488971_1333705871378720_7009368911692003946_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEtR1x4DIhbOd556vaPgBC1GHoxsd9Y3sAYejGx31jewBcpLTkmfgIqx0l-S8YZeVvq8zjWgV7_F3UfuTuttqeM&_nc_ohc=cXr7KBPRNu0Q7kNvwFwgVlD&_nc_oc=Adm_TwUH9B4hfWmx3wy8JxukFcYOvV-D14sC1SGFqfXP-PwelJBSXi_-YCVkW4CuC-I&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=ckOuJlRA1eMRWe1lR7k3-Q&oh=00_AfHTqD2y9hYimCgaThU8-qAhhUPUzqWMUfvlxWZzI-NNXQ&oe=680EE3CE"
                  alt="Đã đăng ký Bộ Công Thương"
                  className="h-12"
                />
                <span className="text-xs text-center text-secondaryText-tw font-bold mt-1">Trường Đại học Sư phạm Kỹ thuật TP.HCM</span>
              </div>

              <div className="flex flex-col items-center w-1/2">
                <img
                  src="https://fit.hcmute.edu.vn/Resources/Images/SubDomain/fit/FIT-DoanHoi.png"
                  alt="Đã thông báo Bộ Công Thương"
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
