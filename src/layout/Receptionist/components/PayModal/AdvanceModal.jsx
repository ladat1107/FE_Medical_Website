import { message } from 'antd';
import { PropTypes } from 'prop-types';
import { useEffect, useState } from 'react';
import { formatCurrency } from '@/utils/formatCurrency';
import { checkOutParaclinical, updateExamination, updateListPayParaclinicals } from '@/services/doctorService';
import './PayModal.scss';
import { PAYMENT_METHOD, STATUS_BE } from '@/constant/value';
import MoneyInput from '@/components/Input/MoneyInput';
import RoomSelectionModal from '@/layout/Doctor/components/RoomOptionModal/RoomSelectionModal';

const AdvanceModal = ({ isOpen, onClose, onPaySusscess, patientData }) => {

    const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHOD.CASH);
    const [isLoading, setIsLoading] = useState(false);
    const [amount, setAmount] = useState(
        patientData?.advanceMoneyExaminationData?.length 
            ?  patientData.advanceMoneyExaminationData.reduce((sum, item) => sum + item.amount, 0) 
            : ""
    );      
    const [selectedRoom, setSelectedRoom] = useState(patientData?.examinationRoomData || null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    const handleRoomSelect = async (room) => {
        setSelectedRoom(room);
        setIsModalVisible(false);
    };

    useEffect(() => {
        // Thêm logic ngăn cuộn trang khi modal mở
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup effect khi component unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handlePay = async () => {
        if(amount === "" || amount === 0) {
            message.error('Vui lòng nhập số tiền tạm ứng!');
            return;
        }

        if(+amount < 1000) {
            message.error('Số tiền tạm ứng tối thiểu là 1.000đ!');
            return;
        }

        setIsLoading(true);
        try {
            let paymentData = {
                id: patientData?.id,
                insuranceCoverage: patientData?.insuranceCoverage || null,
                insuranceCode: patientData?.insuranceCode || null,
                status: STATUS_BE.PAID,
                payment: paymentMethod,

                advanceId: patientData?.advanceMoneyExaminationData[0]?.id || null,
                advanceMoney: +amount,
            };

            if (paymentMethod === PAYMENT_METHOD.CASH) {
                const response = await updateExamination(paymentData);
                if (response.EC === 0 && response.DT.includes(1)) {
                    message.success('Cập nhật bệnh nhân thành công!');
                    onPaySusscess();
                    onClose();
                } else {
                    message.error('Cập nhật bệnh nhân thất bại!');
                }
            } else {
                // let response = await checkOutExamination(paymentData);
                // if (response.EC === 0) {
                //     window.location.href = response?.DT?.shortLink;
                // } else {
                //     message.error(response.EM);
                // }
                message.error('Để La Đạt làm!');
            }
        } catch (error) {
            console.log(error);
            message.error('Cập nhật bệnh nhân thất bại!');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAmountChange = (value) => {
        setAmount(value);
    };

    const SpecialText = (special) => {
        let specialClass = '';
        let specialText = '';

        switch (special) {
            case 'normal':
                specialClass = 'special';
                specialText = '';
                break;
            case 'old':
                specialClass = 'special-old';
                specialText = 'Người già';
                break;
            case 'children':
                specialClass = 'special-children';
                specialText = 'Trẻ em';
                break;
            case 'disabled':
                specialClass = 'special-disabled';
                specialText = 'Người tàn tật';
                break;
            case 'pregnant':
                specialClass = 'special-pregnant';
                specialText = 'P.nữ mang thai';
                break;
            default:
                specialClass = '';
        }

        return <p className={`special ${specialClass}`}>{specialText}</p>;
    };

    if (!isOpen) return null;

    return (
        <div className="payment-container">
            <div className="payment-content">
                <div className='payment-header'>
                    Thanh toán tạm ứng
                </div>

                <div className='row'>
                    <div className='col-12 d-flex flex-row'>
                        <div className='col-3'>
                            <p style={{ fontWeight: "400" }}>Bệnh nhân:</p>
                        </div>
                        <div className='col-4'>
                            <p>{patientData?.userExaminationData?.lastName + ' ' + patientData?.userExaminationData?.firstName}</p>
                        </div>
                        <div className='col-2 d-flex align-items-center'>
                            <p style={{ fontWeight: "400" }}>Ưu tiên:</p>
                        </div>
                        <div className='col-3'>
                            {SpecialText(patientData?.special)}
                        </div>
                    </div>
                    <div className='col-12 d-flex flex-row mt-3'>
                        <div className='col-3 d-flex align-items-center'>
                            <p style={{ fontWeight: "400" }}>CCCD/CMND:</p>
                        </div>
                        <div className='col-4'>
                            <p>{patientData?.userExaminationData?.cid}</p>
                        </div>
                        <div className='col-2 d-flex align-items-center'>
                            <p style={{ fontWeight: "400" }}>Tuyến KCB:</p>
                        </div>
                        <div className='col-3'>
                            <p>{patientData?.isWrongTreatment === 0 ? 'Đúng tuyến' : 'Sai tuyến'}</p>
                        </div>
                    </div>
                    <hr className='mt-4' />

                    <div className='col-12 d-flex align-items-center mt-2'>
                        <p style={{ fontWeight: "500", color: "#007BFF" }}>Phòng bệnh</p>
                    </div>
                    <div className='col-12 mt-2 mb-1 d-flex align-items-start'>
                        <div className='col-3 d-flex align-items-center'>
                            <p className='text-start' style={{ fontWeight: "500", width: '100%' }}>Phòng:</p>
                        </div>
                        <div className='col-4 d-flex align-items-center'>
                            <p className='text-start' style={{ fontWeight: "400", width: '100%' }}>{selectedRoom?.name || 'Chưa chọn phòng'}</p>
                        </div>
                        <div className='col-2'>
                            <p className='text-start' style={{
                                width: "100%",
                                wordWrap: "break-word",
                                overflowWrap: "break-word",
                                whiteSpace: "normal",
                                fontWeight: "500",
                            }}>Loại phòng: </p>
                        </div>
                        <div className='col-3 d-flex align-items-center'>
                            <p  className='text-start' 
                                style={{ fontWeight: "400", width: '100%' }}>
                                    {selectedRoom?.serviceData[0]?.id === 3 ? 'Phòng thường' : 
                                    selectedRoom?.serviceData[0]?.id === 4 ? 'Phòng VIP' : ''}
                            </p>
                        </div>
                    </div>
                    <div className='col-12 mt-2 mb-2 d-flex align-items-start'>
                        <div className='col-3 d-flex align-items-center'>
                            <p style={{ fontWeight: "500", width: '100%' }}>Giá phòng:</p>
                        </div>
                        <div className='col-4 d-flex align-items-center'>
                            <p>{selectedRoom?.serviceData[0]?.price ? formatCurrency(selectedRoom?.serviceData[0]?.price || 0) : null}</p>
                        </div>
                        <div className='col-5 d-flex align-items-center'>
                            {+patientData?.status >= STATUS_BE.PAID ? <></>
                                :
                                <button className='change-btn' onClick={showModal}>
                                    Sửa phòng
                                </button>
                            }
                        </div>
                    </div>
                    <hr className='mt-2'/>
                    <div className='col-12 d-flex flex-row mt-3 mb-2'>
                        <div className='col-3 d-flex align-items-center'>
                            <p style={{ fontWeight: "400" }}>Số BHYT:</p>
                        </div>
                        <div className='col-3'>
                            <input 
                                className='input-add-exam' 
                                style={{ width: "100%" }} maxLength={10}
                                type='text' value={patientData?.insuranceCode} 
                                readOnly
                                placeholder='Nhập số BHYT...' />
                        </div>
                        <div className='col-1' />

                        {patientData?.insuranceCoverage in [0, 1, 2, 3, 4] || patientData?.insuranceCode === null || patientData?.insuranceCode === '' ? (
                            <>
                                <div className='col-2 d-flex align-items-center'>
                                    <p style={{ fontWeight: "400" }}>Mức hưởng:</p>
                                </div>
                                <div className='col-2 d-flex align-items-center'>
                                    <p>
                                        {patientData?.insuranceCoverage === 0 ? '' : patientData?.insuranceCoverage}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className='col-5 d-flex align-items-center'>
                                <p style={{ fontWeight: "400", color: '#F44343' }}>BHYT không hợp lệ</p>
                            </div>
                        )}
                    </div>
                    <div className='col-12 flex item-center mt-2'>
                        <div className='col-3 d-flex align-items-center'>
                            <p style={{ fontWeight: "600" }}>Tạm ứng:</p>
                        </div>
                        <div className='col-3' style={{ color: "#008EFF", fontWeight: '600', border: "none" }}>
                            <MoneyInput value={amount} onChange={handleAmountChange}/>
                        </div>
                        <div className='col-1' />
                        <div className='col-5 d-flex'>
                            {+patientData?.status >= STATUS_BE.PAID ? <div>Đã thanh toán</div> :
                                <>
                                    <label className='me-5'>
                                        <input
                                            className='radio'
                                            type="radio"
                                            value={PAYMENT_METHOD.CASH}
                                            checked={paymentMethod === PAYMENT_METHOD.CASH}
                                            onChange={() => setPaymentMethod(PAYMENT_METHOD.CASH)}
                                        />
                                        Tiền mặt
                                    </label>
                                    <label className='ms-4' >
                                        <input
                                            className='radio'
                                            type="radio"
                                            value={PAYMENT_METHOD.MOMO}
                                            checked={paymentMethod === PAYMENT_METHOD.MOMO}
                                            onChange={() => setPaymentMethod(PAYMENT_METHOD.MOMO)}
                                        />
                                        Chuyển khoản
                                    </label>
                                </>}
                        </div>
                    </div>
                </div>
                <div className='payment-footer mt-4'>
                    <button className="close-user-btn" onClick={onClose}>Đóng</button>
                    {+patientData?.status >= STATUS_BE.PAID ? <></>
                        :
                        <button className='payment-btn' onClick={handlePay}>
                        {isLoading ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin me-2"></i>
                                    Đang xử lý...
                                </>
                            ) : 'Thanh toán'}
                        </button>
                    }
                </div>
            </div>
            {isModalVisible && (
                <RoomSelectionModal
                    isVisible={isModalVisible}
                    onClose={handleModalClose}
                    onRoomSelect={handleRoomSelect}
                    selected={selectedRoom}
                />
            )}
        </div>
    )
}

AdvanceModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onPaySusscess: PropTypes.func.isRequired,
    special: PropTypes.string,
    patientData: PropTypes.object,
}

export default AdvanceModal;