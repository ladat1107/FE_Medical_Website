import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIdCard, faLeftLong, faMarsAndVenus, faPeopleGroup, faMobileScreenButton, faHandHoldingMedical, faMapMarkerAlt, faHouse } from "@fortawesome/free-solid-svg-icons";
import { faUser, faCalendarCheck, faEnvelopeOpen } from "@fortawesome/free-regular-svg-icons";
import { formatDate, formatDateDD_MM } from "@/utils/formatDate";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button, message } from "antd";
import { useEffect, useState } from "react";
import userService from "@/services/userService";
import Loading from "@/components/Loading/Loading";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/constant/path";

const BookingConfirm = (props) => {
    let navigate = useNavigate();
    let [isConfirm, setIsConfirm] = useState(false);
    let profile = props?.profile;
    let doctor = props?.doctor;
    let schedule = props?.schedule;
    let [isLoading, setIsLoading] = useState(false);

    const [secondsLeft, setSecondsLeft] = useState(300);

    useEffect(() => {
        if (isLoading) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [isLoading])

    const confirm = async () => {
        setIsLoading(true);
        try {
            let data = {
                doctor: doctor,
                schedule: schedule,
                profile: {
                    ...profile,
                    price: doctor?.price || 0,
                },
            }
            let respone = await userService.confirmBooking(data);
            if (respone.EC === 0) {
                setIsConfirm(true)
            } else {
                message.error(respone.EM)
            }
        } catch (e) { console.log(e) }
        finally { setIsLoading(false) }
    }

    const handleViewMail = () => {
        window.location.href = "https://mail.google.com/mail/u/0/#inbox"
    }

    useEffect(() => {
        if (secondsLeft === 0) return;

        const timer = setInterval(() => {
            setSecondsLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer); // Clear interval on unmount
    }, [secondsLeft]);

    // Format mm:ss
    const formatTime = (secs) => {
        const minutes = Math.floor(secs / 60);
        const seconds = secs % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const isDanger = secondsLeft <= 60;
    const textColor = isDanger ? "#FF0000" : "#FFA500";

    return (
        <>
            <div className="relative bg-gradient-primary text-white text-center text-lg font-bold py-2 px-4 rounded-t-lg mb-2">
                {!isConfirm && <FontAwesomeIcon className="absolute top-[15px] left-[25px] cursor-pointer" icon={faLeftLong} onClick={() => { props.back() }} />}
                Xác nhận thông tin
            </div>
            {isConfirm ?
                <div className="p-5 min-h-[300px]">
                    <div className="flex flex-col items-center mt-8" style={{ color: "#FFA500" }}>
                        <i className="fa-regular fa-envelope text-6xl"></i>
                        <span className="text-lg font-semibold my-4">Vui lòng kiểm tra email và xác nhận để hoàn tất đặt lịch khám!</span>
                        <div className="text-md font-medium mt-2" style={{ color: 'black' }}>
                            Thời gian còn lại: <span className="font-bold" style={{ color: textColor }}>{formatTime(secondsLeft)}</span>
                        </div>
                    </div>
                    <div className="mt-5 flex justify-center">
                        <div
                            className="py-1 px-4 rounded-lg mx-2 bg-white border-2 border-primary-tw text-primary-tw hover:bg-primary-tw cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => { navigate(PATHS.HOME.HOMEPAGE) }}>
                            <FontAwesomeIcon className="mr-1" icon={faHouse} /> Trang chủ
                        </div>
                        <button
                            className="py-1 px-4 rounded-lg mx-2 bg-primary-tw text-white hover:scale-105 transition-transform"
                            onClick={() => handleViewMail()}>
                            <FontAwesomeIcon className="mr-1" icon={faEnvelopeOpen} /> Xem email
                        </button>
                    </div>
                </div>
                :
                <div className="p-5 min-h-[300px]">
                    {isLoading === true ?
                        <div className="loading"><Loading /></div>
                        :
                        <div>
                            <div className="flex flex-wrap">
                                <div className="w-full md:w-1/2">
                                    <div className="flex items-center mb-2">
                                        <FontAwesomeIcon icon={faUser} className="text-primary-tw min-w-[40px]" />
                                        <span className="flex-none w-[100px] font-normal text-gray-600">Họ và tên</span>
                                        <strong className="text-secondaryText-tw font-medium py-1 px-2">{profile?.lastName + " " + profile?.firstName}</strong>
                                    </div>
                                    <div className="flex items-center mb-2">
                                        <FontAwesomeIcon icon={faCalendarCheck} className="text-primary-tw min-w-[40px]" />
                                        <span className="flex-none w-[100px] font-normal text-gray-600">Ngày sinh</span>
                                        <strong className="text-secondaryText-tw font-medium py-1 px-2">{formatDate(profile?.dob)}</strong>
                                    </div>
                                    <div className="flex items-center mb-2">
                                        <FontAwesomeIcon icon={faMarsAndVenus} className="text-primary-tw min-w-[40px]" />
                                        <span className="flex-none w-[100px] font-normal text-gray-600">Giới tính</span>
                                        <strong className="text-secondaryText-tw font-medium py-1 px-2">{profile?.gender === 0 ? "Nam" : "Nữ"}</strong>
                                    </div>
                                    <div className="flex items-center mb-2">
                                        <FontAwesomeIcon icon={faHandHoldingMedical} className="text-primary-tw min-w-[40px]" />
                                        <span className="flex-none w-[100px] font-normal text-gray-600">Mã số BHYT</span>
                                        <strong className="text-secondaryText-tw font-medium py-1 px-2">Cập nhật khi gặp tiếp nhận</strong>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2">
                                    <div className="flex items-center mb-2">
                                        <FontAwesomeIcon icon={faUser} className="text-primary-tw min-w-[40px]" />
                                        <span className="flex-none w-[100px] font-normal text-gray-600">Email</span>
                                        <p><strong className="text-secondaryText-tw font-medium py-1 px-2">{profile?.email}</strong></p>
                                    </div>
                                    <div className="flex items-center mb-2">
                                        <FontAwesomeIcon icon={faMobileScreenButton} className="text-primary-tw min-w-[40px]" />
                                        <span className="flex-none w-[100px] font-normal text-gray-600">Điện thoại</span>
                                        <strong className="text-secondaryText-tw font-medium py-1 px-2">{profile?.phoneNumber}</strong>
                                    </div>
                                    <div className="flex items-center mb-2">
                                        <FontAwesomeIcon icon={faIdCard} className="text-primary-tw min-w-[40px]" />
                                        <span className="flex-none w-[100px] font-normal text-gray-600">CCCD</span>
                                        <strong className="text-secondaryText-tw font-medium py-1 px-2">{profile?.cid}</strong>
                                    </div>
                                    <div className="flex items-center mb-2">
                                        <FontAwesomeIcon icon={faPeopleGroup} className="text-primary-tw min-w-[40px]" />
                                        <span className="flex-none w-[100px] font-normal text-gray-600">Dân tộc</span>
                                        <strong className="text-secondaryText-tw font-medium py-1 px-2">{profile?.obFolk?.label || "Không"}</strong>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center mb-2">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary-tw min-w-[40px]" />
                                    <span className="flex-none w-[100px] font-normal text-gray-600">Địa chỉ:</span>
                                    <strong className="text-secondaryText-tw font-medium py-1 px-2">{profile?.address + ", " + (profile?.obWard?.label || '') + ", " + (profile?.obDistrict?.label || '') + ", " + (profile?.obProvince?.label || '')}</strong>
                                </div>
                            </div>
                            <div className="mt-5">
                                <div className="text-secondaryText-tw font-bold text-lg mb-5 pl-2">THÔNG TIN ĐẶT LỊCH</div>
                                <div className="flex mb-2">
                                    <div className="w-[150px] pl-2 font-normal">{doctor?.position || "Bác sĩ"}</div>
                                    <div>{doctor?.staffUserData.lastName + " " + doctor?.staffUserData?.firstName} </div>
                                </div>
                                <div className="flex mb-2">
                                    <div className="w-[150px] pl-2 font-normal">Chuyên khoa</div>
                                    <div>{doctor?.staffSpecialtyData?.name || "Đa khoa"} </div>
                                </div>
                                <div className="flex mb-2">
                                    <div className="w-[150px] pl-2 font-normal">Thời gian</div>
                                    <div>{schedule?.time.label + " ngày " + formatDateDD_MM(schedule?.date)} </div>
                                </div>
                                <div className="flex mb-2">
                                    <div className="w-[150px] pl-2 font-normal">Giá</div>
                                    <div>{formatCurrency(doctor?.price || 0)}</div>
                                </div>
                                <div className="flex mb-2">
                                    <div className="w-[150px] pl-2 font-normal">Triệu chứng</div>
                                    <p>{profile?.symptom || "Không mô tả triệu chứng"} </p>
                                </div>
                            </div>
                            <div className="mt-5 bg-red-50 border-l-4 border-red-400 p-3 rounded">
                                <p className="mb-2 text-red-600 text-sm">
                                    Sau khi đặt lịch thành công, bạn sẽ nhận được email xác nhận. Vui lòng cung cấp email chính xác.
                                    Bạn có thể hủy lịch trước ngày hẹn, nhưng <strong>không thể hủy trong cùng ngày đến khám</strong>.
                                </p>
                                <p className="text-red-600 text-sm">
                                    Nếu không nhận được email xác nhận, hãy kiểm tra thư Spam hoặc liên hệ bộ phận hỗ trợ.
                                </p>
                            </div>
                            <div className="flex justify-end w-full mt-3">
                                <Button
                                    type="primary"
                                    className="bg-primary-tw text-white hover:bg-primary-tw-light transition-colors"
                                    onClick={() => confirm()}>
                                    Xác nhận
                                </Button>
                            </div>
                        </div>
                    }
                </div>
            }
        </>
    );
}
export default BookingConfirm;