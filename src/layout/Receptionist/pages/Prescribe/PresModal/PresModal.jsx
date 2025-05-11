import { PropTypes } from 'prop-types'; import { useEffect, useState } from 'react';
import '../../../components/PayModal/PayModal.scss';
import { formatCurrency } from '@/utils/formatCurrency';
import { getThirdDigitFromLeft } from '@/utils/numberSeries';
import { message } from 'antd';
import { checkOutPrescription, updatePrescription } from '@/services/doctorService';
import { PAYMENT_METHOD, STATUS_BE } from '@/constant/value';
import { medicineCovered } from '@/utils/coveredPrice';

const PresModal = ({ isOpen, onClose, onSusscess, presId, patientData }) => {
    const [special, setSpecial] = useState('normal');
    const [insurance, setInsurance] = useState('');
    const [insuranceCoverage, setInsuranceCoverage] = useState(null);
    let [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHOD.CASH);
    const [isLoading, setIsLoading] = useState(false);

    const [data, setData] = useState({
        infouser: { firstName: '', lastName: '', cid: '' },
        infoPres: { note: '', totalMoney: '', prescriptionDetails: [] }
    });
    
    // State to track the actual amount to be paid
    const [amountToPay, setAmountToPay] = useState(0);

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

    useEffect(() => {
        if (!isOpen || !patientData || !presId) return;

        resetForm();

        let newSpecial = 'normal';
        let newData = {};


        newSpecial = patientData?.special || 'normal';
        newData = {
            infouser: {
                firstName: patientData?.userExaminationData?.firstName,
                lastName: patientData?.userExaminationData?.lastName,
                cid: patientData?.userExaminationData?.cid,
            },
            infoPres: {
                note: patientData?.prescriptionExamData[0]?.note,
                totalMoney: patientData?.prescriptionExamData[0]?.totalMoney,
                prescriptionDetails: patientData?.prescriptionExamData[0]?.prescriptionDetails,
            },
            price: patientData?.prescriptionExamData[0].totalMoney,
            isWrongTreatment: patientData?.isWrongTreatment || 0,
            medicalTreatmentTier: patientData?.medicalTreatmentTier || 2,
            // paracName: patientData?.paraclinicalData?.name,
        };

        setInsurance(patientData?.insuranceCode || '');
        setInsuranceCoverage(patientData?.insuranceCoverage || null);
        setSpecial(newSpecial);
        setData(newData);
        
        // Calculate the correct amount to pay
        calculateAmountToPay(newData.infoPres.prescriptionDetails, patientData?.insuranceCoverage || null);

    }, [isOpen, patientData]);
    
    // Function to calculate the correct amount to pay
    const calculateAmountToPay = (prescriptionDetails, insuranceCoverageValue) => {
        if (!prescriptionDetails || prescriptionDetails.length === 0) {
            setAmountToPay(0);
            return;
        }
        
        let totalAmount = 0;
        let totalInsuranceCovered = 0;
        
        prescriptionDetails.forEach(item => {
            const itemTotal = item.PrescriptionDetail.quantity * item.price;
            totalAmount += itemTotal;
            
            // Only apply insurance coverage if the item is covered (isCovered is not 0 and not null)
            if (item.isCovered === 0 || item.isCovered === null || Number(item.insuranceCovered) > 0) {
                totalInsuranceCovered += medicineCovered(itemTotal, +insuranceCoverageValue, Number(item.insuranceCovered), data.isWrongTreatment, data.medicalTreatmentTier);
            }
        });
        
        setAmountToPay(totalAmount - totalInsuranceCovered);
    };

    const handlePay = async () => {
        setIsLoading(true);
        try {
            const presDetail = data.infoPres.prescriptionDetails.map((item) => {
                let insuranceCoveredValue = (item.isCovered === 0 || item.isCovered === null || Number(item.insuranceCovered) > 0)
                    ? medicineCovered(item.PrescriptionDetail.quantity * item?.price, +insuranceCoverage, Number(item.insuranceCovered), data.isWrongTreatment, data.medicalTreatmentTier)
                    : 0;
            
                return {
                    medicineId: item.PrescriptionDetail.medicineId,
                    prescriptionId: item.PrescriptionDetail.prescriptionId,
                    insuranceCovered: insuranceCoveredValue 
                };
            });
            
            let presData = {
                id: presId,
                status: 2,
                exam: {
                    examId: patientData.id,
                },
                insuranceCovered: calculateTotalBHYTCovered(),
                coveredPrice: amountToPay,
                presDetail: presDetail
            };

            if (paymentMethod === PAYMENT_METHOD.CASH) {
                const responseExam = await updatePrescription({ ...presData, payment: paymentMethod });
                if (responseExam.EC === 0 && responseExam.DT.includes(1)) {
                    message.success('Cập nhật đơn thuốc thành công!');
                    onSusscess();
                    onClose();
                } else {
                    message.error('Cập nhật đơn thuốc thất bại!');
                }
            } else {
                const response = await checkOutPrescription(presData);
                if (response.EC === 0) {
                    window.location.href = response?.DT?.shortLink;
                } else {
                    message.error(response.EM);
                }
            }

        } catch (error) {
            console.log(error);
            message.error('Cập nhật đơn thuốc thất bại!');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setSpecial('normal');
        setInsurance('');
        setInsuranceCoverage(null);
        setAmountToPay(0);
    };

    const SpecialText = ({ special }) => {
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
                specialClass = 'special';
        }

        return <p className={`special ${specialClass}`}>{specialText}</p>;
    };

    // Calculate total BHYT covered amount for display
    const calculateTotalBHYTCovered = () => {
        if (!data.infoPres.prescriptionDetails || data.infoPres.prescriptionDetails.length === 0) {
            return 0;
        }
        
        let totalInsuranceCovered = 0;
        
        data.infoPres.prescriptionDetails.forEach(item => {
            const itemTotal = item.PrescriptionDetail.quantity * item.price;
            
            // Only apply insurance coverage if the item is covered (isCovered is not 0 and not null)
            if (item.isCovered === 0 || item.isCovered === null || Number(item.insuranceCovered) > 0) {
                totalInsuranceCovered += medicineCovered(itemTotal, +insuranceCoverage, Number(item.insuranceCovered), data.isWrongTreatment, data.medicalTreatmentTier);
            }
        });
        
        return totalInsuranceCovered;
    };

    if (!isOpen) return null;

    return (
        <div className="payment-container">
            <div className="payment-content">
                <div className='payment-header'>
                    Thông tin đơn thuốc
                </div>

                <div className='row'>
                    <div className='col-12 d-flex flex-row'>
                        <div className='col-3'>
                            <p style={{ fontWeight: "400" }}>Bệnh nhân:</p>
                        </div>
                        <div className='col-3'>
                            <p>{data.infouser.lastName + ' ' + data.infouser.firstName}</p>
                        </div>
                        <div className='col-1' />
                        <div className='col-2 d-flex align-items-center'>
                            <p style={{ fontWeight: "400" }}>Ưu tiên:</p>
                        </div>
                        <div className='col-3'>
                            {SpecialText({ special })}
                        </div>
                    </div>
                    <div className='col-12 d-flex flex-row mt-3'>
                        <div className='col-3 d-flex align-items-center'>
                            <p style={{ fontWeight: "400" }}>CCCD/CMND:</p>
                        </div>
                        <div className='col-3'>
                            <p>{data.infouser.cid}</p>
                        </div>
                        <div className='col-1' />
                        <div className='col-2 d-flex align-items-center'>
                            <p style={{ fontWeight: "400" }}>Tuyến khám:</p>
                        </div>
                        <div className='col-3'>
                            {data.isWrongTreatment === 1 ? (
                                <p style={{ color: '#F44343' }}>Khám sai tuyến</p>
                            ) : (
                                <p style={{ color: '#008EFF' }}>Khám đúng tuyến</p>
                            )}
                        </div>
                    </div>
                    <hr className='mt-4' style={{
                        borderStyle: 'dashed',
                        borderWidth: '1px',
                        borderColor: '#007BFF',
                        opacity: '1'
                    }} />
                    <div className='col-12 d-flex flex-row mt-1'>
                        <div className='col-3 d-flex align-items-center'>
                            <p style={{ fontWeight: "600" }}>Đơn thuốc:</p>
                        </div>
                    </div>
                    <div className='col-12 d-flex flex-column'>
                        {data.infoPres.prescriptionDetails.map((item, index) => (
                            <div className='col-12 d-flex flex-column mt-2 pres-item' key={index}>
                                <div className='col-12 d-flex align-items-center'>
                                    <p style={{ fontWeight: "500", color: "#007BFF" }}>{item.name}</p>
                                </div>
                                <div className='col-12 mt-1 d-flex align-items-start'>
                                    <div className='col-7'>
                                        <p className='text-start' style={{
                                            width: "100%",
                                            wordWrap: "break-word", // Cho phép từ dài được xuống dòng
                                            overflowWrap: "break-word", // Tương tự wordWrap, hỗ trợ trình duyệt cũ
                                            whiteSpace: "normal" // Cho phép văn bản xuống dòng
                                        }}>Liều dùng: {item.PrescriptionDetail.dosage}</p>
                                    </div>
                                    <div className='col-1' />
                                    <div className='col-2 d-flex align-items-center'>
                                        <p style={{ fontWeight: "400" }}>Số lượng: {item.PrescriptionDetail.quantity}</p>
                                    </div>
                                </div>
                                <div className='col-12 mb-1 d-flex align-items-start'>
                                    <div className='col-4 d-flex align-items-center'>
                                        <p>Đơn giá: {formatCurrency(item?.price)}</p>
                                    </div>
                                    <div className='col-4 d-flex align-items-center'>
                                        <p>Tổng giá: {formatCurrency(item.PrescriptionDetail.quantity * item?.price)}</p>
                                    </div>
                                    <div className='col-4 d-flex align-items-center'>
                                        <p>BHYT chi trả: {item.isCovered === 0 || item.isCovered === null || Number(item.insuranceCovered) > 0
                                                                ? formatCurrency(medicineCovered(item.PrescriptionDetail.quantity * item?.price, +insuranceCoverage, Number(item.insuranceCovered)), data.isWrongTreatment, data.medicalTreatmentTier) 
                                                                : formatCurrency(0)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='col-12 d-flex flex-row mt-4'>
                        <div className='col-3 d-flex align-items-center'>
                            <p style={{ fontWeight: "400" }}>Ghi chú:</p>
                        </div>
                        <div className='col-9'>
                            <p style={{
                                width: "100%",
                                wordWrap: "break-word", // Cho phép từ dài được xuống dòng
                                overflowWrap: "break-word", // Tương tự wordWrap, hỗ trợ trình duyệt cũ
                                whiteSpace: "normal" // Cho phép văn bản xuống dòng
                            }}>{data?.infoPres?.note || "Không có"}</p>
                        </div>
                    </div>
                    <div className='col-12 d-flex flex-row mt-3 mb-2'>
                        <div className='col-3 d-flex align-items-center'>
                            <p style={{ fontWeight: "400" }}>Số BHYT:</p>
                        </div>
                        <div className='col-3'>
                            <input 
                                className='input-add-exam' 
                                style={{ width: "93%" }} maxLength={10}
                                type='text' value={insurance}
                                readOnly
                                placeholder='Nhập số BHYT...' />
                        </div>
                        <div className='col-1' />
                        {insuranceCoverage in [0, 1, 2, 3, 4] || insurance === null || insurance === '' ? (
                            <>
                                <div className='col-2 d-flex align-items-center'>
                                    <p style={{ fontWeight: "400" }}>Mức hưởng:</p>
                                </div>
                                <div className='col-2 d-flex align-items-center'>
                                    <p>
                                        {insuranceCoverage === 0 ? '' : insuranceCoverage}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className='col-5 d-flex align-items-center'>
                                <p style={{ fontWeight: "400", color: '#F44343' }}>BHYT không hợp lệ</p>
                            </div>
                        )}
                    </div>
                    <div className='col-12 d-flex flex-row mt-3'>
                        <div className='col-3 d-flex align-items-center'>
                            <p style={{ fontWeight: "400" }}>Giá thuốc:</p>
                        </div>
                        <div className='col-3'>
                            <p>{formatCurrency(data.price)}</p>
                        </div>
                        <div className='col-1' />
                        <div className='col-2 d-flex align-items-center'>
                            <p style={{ fontWeight: "400" }}>BHYT chi trả:</p>
                        </div>
                        <div className='col-2 d-flex align-items-center'>
                            <p>{formatCurrency(calculateTotalBHYTCovered())}</p>
                        </div>
                    </div>
                    <div className='col-12 d-flex flex-row mt-3'>
                    <div className='col-3 d-flex align-items-center'>
                            <p style={{ fontWeight: "600" }}>Phải trả:</p>
                        </div>
                        <div className='col-3' style={{ color: "#008EFF", fontWeight: '600' }}>
                            <p>{formatCurrency(amountToPay)}</p>
                        </div>
                        <div className='col-1' />
                        <div className='col-5 d-flex'>
                            {+patientData?.status === STATUS_BE.PAID ? <div>Đã thanh toán</div> :
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
                <div className='payment-footer mt-3'>
                    <button className="close-user-btn" onClick={onClose} disabled={isLoading}>Đóng</button>
                    {patientData?.prescriptionExamData[0]?.status === 1 &&
                        <button 
                            className='payment-btn' 
                            onClick={handlePay} 
                            disabled={isLoading}
                        >

                            {isLoading ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin me-2"></i>
                                    Đang xử lý...
                                </>
                            ) : 'Xác nhận'}
                        </button>
                    }
                </div>
            </div>
        </div>
    )
}

PresModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSusscess: PropTypes.func.isRequired,
    special: PropTypes.string,
    presId: PropTypes.number,
    patientData: PropTypes.object
}

export default PresModal;