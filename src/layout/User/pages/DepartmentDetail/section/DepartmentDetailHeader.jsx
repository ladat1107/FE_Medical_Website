
//import "../DepartmentDetail.scss";
import { MapPin, Phone, Calendar } from "lucide-react"
import { Breadcrumb, Rate, Skeleton } from "antd";
import { Link } from "react-router-dom";
import { PATHS } from "@/constant/path";
import GoogleMap from "./MapComponent";
import ParseHtml from "@/components/ParseHtml";
import BannerSwiper from "./BannerSwiper";

const DepartmentDetailHeader = (props) => {
    let { departmentDetail, departmentLoading } = props;
    const breadcrumbItems = [
        { title: <Link className="!text-secondaryText-tw no-underline hover:!bg-transparent" to={PATHS.HOME.HOMEPAGE}>Trang chủ</Link>, },
        { title: <Link className="!text-secondaryText-tw no-underline hover:!bg-transparent" to={PATHS.HOME.DEPARTMENT_LIST} >Khoa</Link>, },
        { title: (<div className="text-primary-tw ">Khoa {departmentDetail.name}</div>) },
    ];
    return (
        <>
            <Breadcrumb items={breadcrumbItems} className="font-bold" />

            <div className="flex flex-col md:flex-row gap-6 w-full mt-4 ">
                {/* Left Column */}
                <div className="w-full md:w-1/3 lg:w-1/4">
                    <div className="bg-white rounded-2xl p-2 shadow-md flex flex-col">
                        {departmentLoading ? (
                            <Skeleton.Avatar shape="circle" active style={{ width: "150px", height: "150px", margin: "5px auto" }} />
                        ) : (
                            <div className="flex flex-col items-center w-full ">
                                <img
                                    src={departmentDetail?.image || ""}
                                    alt="Department"
                                    className="w-[150px] md:w-[70%] rounded-full mb-4"
                                />
                                <div>
                                    <span className="text-[#FADB14] font-bold">(4) </span>
                                    <Rate disabled allowHalf defaultValue={4} />
                                </div>
                            </div>
                        )}

                        {departmentLoading ? (
                            <Skeleton active paragraph={{ rows: 4 }} />
                        ) : (
                            <div className="px-3 mt-3">
                                <div className="flex items-start mb-2">
                                    <MapPin className="text-[#f0bd46] mr-2 mt-1 flex-shrink-0" />
                                    <span className="text-gray-700 ">
                                        Cơ sở 215 Hồng Bàng, Phường 11, Quận 5, TP.HCM - {departmentDetail?.address}
                                    </span>
                                </div>
                                <div className="flex items-center ">
                                    <Phone className="text-[#f0bd46] mr-2 flex-shrink-0" />
                                    <span className="text-gray-700">0353366459</span>
                                </div>
                                <button className="w-full text-center text-white bg-primary-tw rounded-full py-2 text-base font-bold cursor-pointer mt-2">
                                    Đặt khám ngay
                                </button>
                            </div>
                        )}
                    </div>

                    {!departmentLoading && (
                        <div className="hidden md:flex mt-5 flex-col items-center">
                            <img
                                src={
                                    departmentDetail?.deanDepartmentData?.staffUserData?.avatar ||
                                    "https://medpro.vn/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbn.da13f84b.png&w=1920&q=75"
                                }
                                alt="Department Head"
                                className="rounded-2xl mb-2 w-full"
                            />
                            <div>
                                <span className="text-gray-600 font-bold">Trưởng khoa</span>
                                <span className="text-orange-500 font-semibold">
                                    {" "}
                                    - {departmentDetail?.deanDepartmentData?.position}.{" "}
                                    {departmentDetail?.deanDepartmentData?.staffUserData?.lastName +
                                        " " +
                                        departmentDetail?.deanDepartmentData?.staffUserData?.firstName}
                                </span>
                            </div>
                        </div>
                    )}

                    {!departmentLoading && (
                        <div className="w-full h-[400px] mt-5 rounded-3xl shadow-md overflow-hidden">
                            <GoogleMap />
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col items-center">
                    <div className="w-full rounded-2xl p-0">
                        <BannerSwiper loading={departmentLoading} />
                    </div>

                    <div className="w-full bg-white shadow-md p-4 rounded-2xl mt-3">
                        {departmentLoading ? (
                            <Skeleton active style={{ width: "100%", height: "300px" }} className="my-3" />
                        ) : (
                            <>
                                <h1 className="text-2xl font-bold text-secondaryText-tw mb-2 uppercase">{departmentDetail?.name}</h1>
                                <div className="text-sm text-orange-500 mb-2 flex items-center">
                                    <Calendar size={18} className="mr-2" />
                                    <span >Trưởng khoa</span>
                                    <span className="font-semibold">
                                        {" "}
                                        - {departmentDetail?.deanDepartmentData?.position}.{" "}
                                        {departmentDetail?.deanDepartmentData?.staffUserData?.lastName +
                                            " " +
                                            departmentDetail?.deanDepartmentData?.staffUserData?.firstName}
                                    </span>
                                </div>
                                <div className="flex items-start gap-2 ">
                                    {/* Gạch đứng màu cam */}
                                    <div className="w-[2px] h-full bg-orange-500 rounded-sm" />

                                    {/* Nội dung đoạn text */}
                                    <div className="text-base font-medium text-gray-600 text-justify">
                                        {departmentDetail?.shortDescription}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="w-full bg-white shadow-md p-4 rounded-2xl mt-4 mb-12 max-h-[750px] overflow-y-auto">
                        {departmentLoading ? (
                            <Skeleton active style={{ width: "100%", height: "300px" }} className="my-3" />
                        ) : (
                            <ParseHtml htmlString={departmentDetail?.htmlDescription || ""} />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default DepartmentDetailHeader;