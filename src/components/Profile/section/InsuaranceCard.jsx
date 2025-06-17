"use client"

import { Button, Card, message } from "antd"
import { Calendar, User, MapPin, Clock, Shield, CreditCard } from "lucide-react"
import dayjs from "dayjs"
import { useState } from "react"
import InsuaranceModel from "@/layout/User/components/ConfirmModal/InsuaranceModel"
import userService from "@/services/userService"
import { EMIT } from "@/constant/value"

const InsuranceCard = ({
    id,
    avatar,
    fullName,
    gender,
    dob,
    insuranceCode,
    dateOfIssue,
    exp,
    benefitLevel,
    residentialCode,
    initialHealthcareRegistrationCode,
    continuousFiveYearPeriod,
    refresh
}) => {
    const [open, setOpen] = useState(false);
    // Format dates using dayjs
    const formattedDob = dob ? dayjs(dob).format("DD/MM/YYYY") : ""
    const formattedDateOfIssue = dateOfIssue ? dayjs(dateOfIssue).format("DD/MM/YYYY") : ""
    const formattedExp = exp ? dayjs(exp).format("DD/MM/YYYY") : ""
    const formattedFiveYearPeriod = continuousFiveYearPeriod ? dayjs(continuousFiveYearPeriod).format("DD/MM/YYYY") : ""

    const handleCheckInsuarance = async (values) => {
        let response = null;
        if (id) {
            response = await userService.updateInsuarance({ ...values, id: id });
        } else {
            response = await userService.createInsuarance(values);
        }
        if (response.EC === 0) {
            message.success("Cập nhật thành công");
            setOpen(false);
            refresh(EMIT.EVENT_PROFILE.insurance);
        } else {
            message.error(response.EM);
        }
    }
    return (
        <>
            <Card className="w-full max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden border-t-4 border-t-primary-tw">
                <div className="flex flex-col md:flex-row">
                    {/* Left side - Photo and logo */}
                    <div className="w-full md:w-1/4 p-4 flex flex-col items-center justify-between rounded-lg bg-gradient-to-b from-primary-tw/10 to-white">
                        <div className="flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-tw mb-2">
                                {avatar ? (
                                    <img src={avatar || "/placeholder.svg"} alt={fullName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <User size={40} className="text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="text-center mt-2">
                                <p className="font-bold text-lg text-primary-tw">{fullName}</p>
                                <p className="text-gray-600">{gender}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Insurance details */}
                    <div className="w-full md:w-3/4 p-4">
                        <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center">
                            <Shield className="mr-2" size={20} />
                            THẺ BẢO HIỂM Y TẾ
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex items-center">
                                <CreditCard size={16} className="text-primary-tw mr-2" />
                                <span className="text-gray-600 mr-2">Số thẻ:</span>
                                <span className="font-semibold">{insuranceCode}</span>
                            </div>

                            <div className="flex items-center">
                                <Calendar size={16} className="text-primary-tw mr-2" />
                                <span className="text-gray-600 mr-2">Ngày sinh:</span>
                                <span className="font-semibold">{formattedDob}</span>
                            </div>

                            <div className="flex items-center">
                                <Clock size={16} className="text-primary-tw mr-2" />
                                <span className="text-gray-600 mr-2">Ngày cấp:</span>
                                <span className="font-semibold">{formattedDateOfIssue}</span>
                            </div>

                            <div className="flex items-center">
                                <Clock size={16} className="text-primary-tw mr-2" />
                                <span className="text-gray-600 mr-2">Ngày hết hạn:</span>
                                <span className="font-semibold">{formattedExp}</span>
                            </div>

                            <div className="flex items-center">
                                <Shield size={16} className="text-primary-tw mr-2" />
                                <span className="text-gray-600 mr-2">Mức hưởng:</span>
                                <span className="font-semibold">{benefitLevel}</span>
                            </div>

                            <div className="flex items-center">
                                <MapPin size={16} className="text-primary-tw mr-2" />
                                <span className="text-gray-600 mr-2">Mã KCBBD:</span>
                                <span className="font-semibold">{residentialCode}</span>
                            </div>

                            <div className="flex items-center col-span-1 md:col-span-2">
                                <MapPin size={16} className="text-primary-tw mr-2" />
                                <span className="text-gray-600 mr-2">Mã đăng ký khám bệnh:</span>
                                <span className="font-semibold">{initialHealthcareRegistrationCode}</span>
                            </div>

                            <div className="flex items-center col-span-1 md:col-span-2">
                                <Clock size={16} className="text-primary-tw mr-2" />
                                <span className="text-gray-600 mr-2">Thời điểm đủ 5 năm liên tục:</span>
                                <span className="font-semibold">{formattedFiveYearPeriod}</span>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button type="primary" className="bg-primary-tw text-white" onClick={() => setOpen(true)}>
                                Cập nhật
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
            <InsuaranceModel open={open} setOpen={setOpen} handleCheckInsuarance={handleCheckInsuarance} insuaranceUpdate={
                {
                    insuranceCode,
                    dateOfIssue,
                    exp,
                    benefitLevel,
                    residentialCode,
                    initialHealthcareRegistrationCode,
                }
            } />
        </>
    )
}

export default InsuranceCard
