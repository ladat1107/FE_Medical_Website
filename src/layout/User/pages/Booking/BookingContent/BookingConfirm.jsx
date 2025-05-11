
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../Booking.scss";
import { faEnvelope, faIdCard, faLeftLong, faMarsAndVenus, faPeopleGroup, faMobileScreenButton, faHandHoldingMedical, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { faUser, faCalendarCheck, faEnvelopeOpen, faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { formatDate, formatDateDD_MM } from "@/utils/formatDate";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button, message } from "antd";
import { useState } from "react";
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
    console.log("profile", profile);
    const confirm = async () => {
        setIsLoading(true);
        try {
            let data = {
                doctor: doctor,
                schedule: schedule,
                profile: profile
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
    return (
        <>
            <div className="header">
                {!isConfirm && <FontAwesomeIcon className="icon-back" icon={faLeftLong} onClick={() => { props.back() }} />}
                Xác nhận thông tin
            </div>
            {isConfirm ? <div className="content">
                <div className="title-success">
                    <FontAwesomeIcon icon={faCircleCheck} className="icon" />
                    <span> Đặt lịch thành công. Vui lòng kiểm tra email để xác nhận lịch khám !</span>
                </div>
                <div className="mt-5 d-flex justify-content-center">
                    <button className="btn home" onClick={() => { navigate(PATHS.HOME.HOMEPAGE) }}>Trang chủ</button>
                    <button className="btn email" onClick={() => handleViewMail()}> <FontAwesomeIcon className="me-1" icon={faEnvelopeOpen} /> Xem email</button>
                </div>
            </div> :
                <div className="content">
                    {isLoading === true ? <div className="loading"><Loading /></div> :
                        <div>
                            <div className="info-container">
                                <div className="info-column">
                                    <div className="info-row">
                                        <FontAwesomeIcon icon={faUser} className="icon" />
                                        <span>Họ và tên</span>
                                        <strong>{profile?.lastName + " " + profile?.firstName}</strong>
                                    </div>
                                    <div className="info-row">
                                        <FontAwesomeIcon icon={faCalendarCheck} className="icon" />
                                        <span>Ngày sinh</span>
                                        <strong>{formatDate(profile?.dob)}</strong>
                                    </div>
                                    <div className="info-row">
                                        <FontAwesomeIcon icon={faMarsAndVenus} className="icon" />
                                        <span>Giới tính</span>
                                        <strong>{profile?.gender === 0 ? "Nam" : "Nữ"}</strong>
                                    </div>
                                    <div className="info-row">
                                        <FontAwesomeIcon icon={faHandHoldingMedical} className="icon" />
                                        <span>Mã số BHYT</span>
                                        <strong>Chưa cập nhật</strong>
                                    </div>
                                </div>
                                <div className="info-column">
                                    <div className="info-row">
                                        <FontAwesomeIcon icon={faEnvelope} className="icon" />
                                        <span>Email</span>
                                        <p><strong>{profile?.email}</strong></p>
                                    </div>
                                    <div className="info-row">
                                        <FontAwesomeIcon icon={faMobileScreenButton} className="icon" />
                                        <span>Điện thoại</span>
                                        <strong>{profile?.phoneNumber}</strong>
                                    </div>
                                    <div className="info-row">
                                        <FontAwesomeIcon icon={faIdCard} className="icon" />
                                        <span>CCCD</span>
                                        <strong>{profile?.cid}</strong>
                                    </div>
                                    <div className="info-row">
                                        <FontAwesomeIcon icon={faPeopleGroup} className="icon" />
                                        <span>Dân tộc</span>
                                        <strong>{profile?.obFolk?.label || "Không"}</strong>
                                    </div>
                                </div>
                            </div>
                            <div className="row-2">
                                <div className="info-row">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" />
                                    <span>Địa chỉ:</span>
                                    <strong>{profile?.address + ", " + (profile?.obWard?.label || '') + ", " + (profile?.obDistrict?.label || '') + ", " + (profile?.obProvince?.label || '')}</strong>
                                </div>
                            </div>
                            <div className="row-3 mt-5">
                                <div className="title">THÔNG TIN ĐẶT LỊCH</div>
                                <div className="inf-doctor">
                                    <div className="a">{doctor?.position || "Bác sĩ"}</div>
                                    <div>{doctor?.staffUserData.lastName + " " + doctor?.staffUserData?.firstName} </div>
                                </div>
                                <div className="inf-doctor">
                                    <div className="a">Chuyên khoa</div>
                                    <div>{doctor?.staffSpecialtyData?.name || "Đa khoa"} </div>
                                </div>
                                <div className="inf-doctor">
                                    <div className="a">Thời gian</div>
                                    <div>{schedule?.time.label + " ngày " + formatDateDD_MM(schedule?.date)} </div>
                                </div>
                                <div className="inf-doctor">
                                    <div className="a">Giá</div>
                                    <div>{formatCurrency(doctor?.price || 0)} </div>
                                </div>
                                <div className="inf-doctor">
                                    <div className="a">Triệu chứng</div>
                                    <p>{profile?.symptom || "Không mô tả triệu chứng"} </p>
                                </div>
                            </div>
                            <div className="note">
                                <p className="mb-2">
                                    Sau khi đặt lịch thành công, bạn sẽ nhận được email xác nhận. Vui lòng cung cấp email chính xác.
                                    Bạn có thể hủy lịch trước ngày hẹn, nhưng <strong>không thể hủy trong cùng ngày đến khám</strong>.
                                </p>
                                <p>
                                    Nếu không nhận được email xác nhận, hãy kiểm tra thư Spam hoặc liên hệ bộ phận hỗ trợ.
                                </p>
                            </div>
                            <div className="d-flex justify-content-end w-100 mt-3">
                                <Button type="primary" htmlType="submit" className="btn-confirm" onClick={() => confirm()}>
                                    Xác nhận
                                </Button>
                            </div>
                        </div>
                    }
                </div>}
        </>
    );
}
export default BookingConfirm;