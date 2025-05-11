import React from "react";
import { Breadcrumb } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LINK } from "@/constant/value";
import { formatCurrency } from "@/utils/formatCurrency";
import { PATHS } from "@/constant/path";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
// Tạo instance của classnames với bind styles
const DoctorDetailHeader = (props) => {
  let { data } = props;
  let navigate = useNavigate()
  return (
    <div className={'mb-12'} >
      <Breadcrumb className="mb-4 text-sm !text-secondaryText-tw font-bold hover:!bg-transparent" >
        <Breadcrumb.Item>
          <Link to={PATHS.HOME.HOMEPAGE} className="!text-secondaryText-tw no-underline hover:!bg-transparent">
            Trang chủ
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={PATHS.HOME.DOCTOR_LIST} className="!text-secondaryText-tw no-underline hover:!bg-transparent">
            Bác sĩ
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span className="text-primary-tw font-bold"> {data?.lastName} {data?.firstName}</span>
        </Breadcrumb.Item>
      </Breadcrumb>


      <div className="relative bg-white rounded-2xl">
        {/* Doctor Header Top */}
        <div className="flex flex-col sm:flex-row p-2">
          {/* Doctor Avatar */}
          <div className="w-full md:w-48 h-48 md:mr-10 rounded-lg overflow-hidden mb-4 md:mb-0">
            <img src={data?.avatar || LINK.AVATAR_NULL} alt="bác sĩ" className="w-full h-full object-contain md:object-cover" />
          </div>

          {/* Doctor Info */}
          <div className="w-full flex flex-col justify-around items-center md:items-start p-2">
            <h4 className="text-xl md:text-2xl font-bold mb-4">
              {data?.staffUserData?.position || "BS"}. {data?.lastName} {data?.firstName}
            </h4>

            <div>
              <div className="flex flex-wrap sm:items-start mb-1 leading-7">
                <label className="min-w-[125px] font-bold">Chuyên Khoa</label>
                <span>{data?.staffUserData?.staffDepartmentData?.name}</span>
              </div>

              <div className="flex flex-wrap sm:items-start mb-1 leading-7">
                <label className="min-w-[125px] font-bold">Chuyên Trị</label>
                <span>{data?.staffUserData?.staffSpecialtyData?.name}</span>
              </div>

              <div className="flex flex-wrap sm:items-start mb-1 leading-7">
                <label className="min-w-[125px] font-bold">Giá Khám</label>
                <span>{formatCurrency(data?.staffUserData?.price || 0)}</span>
              </div>

              <div className="flex flex-wrap sm:items-start mb-1 leading-7">
                <label className="min-w-[125px] font-bold">Lịch Khám</label>
                <span>Hẹn Khám</span>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Header Bottom */}
        <div className="bg-blue-50 p-2 w-full flex justify-between items-center rounded-b-2xl">
          <div className="flex gap-2.5 items-center mb-4 sm:mb-0">
            <div className="text-start sm:text-left text-secondaryText-tw ms-2">
              <div className="flex items-start gap-[6px]">
                <div className="sm:text-base text-sm"><b> <FontAwesomeIcon icon={faLocationDot} size="lg" bounce style={{ color: "#2c7cba", }} /> Bác sĩ chuyên khoa</b> <br /> Tư vấn online tại website</div></div>
            </div>
          </div>

          <button
            className="bg-gradient-primary flex items-center px-6 sm:px-9 py-2 rounded-full text-white font-bold whitespace-nowrap cursor-pointer"
            onClick={() => navigate(PATHS.HOME.BOOKING)}
          >
            Đặt lịch
          </button>
        </div>
      </div>

    </div>
  );
};

export default DoctorDetailHeader;
