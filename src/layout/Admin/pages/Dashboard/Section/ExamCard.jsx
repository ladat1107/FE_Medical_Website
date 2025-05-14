import { STATUS_BE } from "@/constant/value";
import IconCircle from "@/layout/Admin/components/IconCircle/IconCircle";
import { getStatisticalAppoinment } from "@/services/adminService";
import { faCalendarCheck, faClock } from "@fortawesome/free-regular-svg-icons";
import { faCircleH, faHeartCircleCheck, faHourglassHalf, faSyringe, faThumbsUp, faTruckMedical, faUserDoctor, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";


const ExamCard = ({ inPatient, outPatient }) => {
    const { total, success, processing, pending, cancel } = outPatient;
    const { import: importInPatient, export: exportInPatient, emergency, examming } = inPatient;
    return (
        <div className="bg-bgAdmin grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl  p-3 shadow-table-admin">
                <div className="flex items-center justify-between text-lg">
                    <div className="font-bold text-primary-tw px-2 py-1">Khoa khám bệnh</div>
                    <div><span className="text-2xl font-bold">{new Intl.NumberFormat('vi-VN').format(total)}</span> <span> đơn khám</span></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                    <div className="flex flex-col justify-center items-center gap-2">
                        <IconCircle
                            icon={faCalendarCheck}
                            color={"#1AB8F9"}
                            background={"#D7FFFD"}
                            size={"60px"} />

                        <div className="text-center">{new Intl.NumberFormat('vi-VN').format(success)} Hoàn thành</div>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-2">
                        <IconCircle
                            icon={faSyringe}
                            color={"#5ECF37"}
                            background={"#D1F3C5"}
                            size={"60px"} />

                        <div className="text-center">{new Intl.NumberFormat('vi-VN').format(processing)} Đang xử lý</div>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-2">
                        <IconCircle
                            icon={faClock}
                            color={"#E4C80D"}
                            background={"#FFFBD7"}
                            size={"60px"} />
                        <div className="text-center">{new Intl.NumberFormat('vi-VN').format(pending)} Đang đợi</div>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-2">
                        <IconCircle
                            icon={faXmark}
                            color={"#F92637"}
                            background={"#F9DDDF"}
                            size={"60px"} />

                        <div className="text-center">{new Intl.NumberFormat('vi-VN').format(cancel)} Đã hủy</div>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-table-admin ">
                <div className="flex items-center justify-between text-lg">
                    <div className="font-bold text-primary-tw px-2 py-1">Nội trú</div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                    <div className="flex flex-col justify-center items-center gap-2">
                        <IconCircle
                            icon={faCircleH}
                            color={"#1AB8F9"}
                            background={"#D7FFFD"}
                            size={"60px"} />
                        <div className="text-center">{new Intl.NumberFormat('vi-VN').format(importInPatient)} Nhập viện</div>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-2">
                        <IconCircle
                            icon={faTruckMedical}
                            color={"#F92637"}
                            background={"#F9DDDF"}
                            size={"60px"} />

                        <div className="text-center">{new Intl.NumberFormat('vi-VN').format(emergency)} Cấp cứu</div>
                    </div>

                    <div className="flex flex-col justify-center items-center gap-2">
                        <IconCircle
                            icon={faUserDoctor}
                            color={"#E4C80D"}
                            background={"#FFFBD7"}
                            size={"60px"} />

                        <div className="text-center">{new Intl.NumberFormat('vi-VN').format(examming)} Đang khám</div>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-2">
                        <IconCircle
                            icon={faHeartCircleCheck}
                            color={"#5ECF37"}
                            background={"#D1F3C5"}
                            size={"60px"} />
                        <div className="text-center">{new Intl.NumberFormat('vi-VN').format(exportInPatient)} Xuất viện</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ExamCard;