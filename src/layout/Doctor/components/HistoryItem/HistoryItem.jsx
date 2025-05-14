import { useState } from "react";
import PropTypes from 'prop-types';
import { formatDate } from "@/utils/formatDate";
import './HistoryItem.scss';
import { formatCurrency } from "@/utils/formatCurrency";
import { useSelector } from "react-redux";
import moment from 'moment';
import { DISCHARGE_OPTIONS } from "@/constant/options";
import { message } from "antd";


const HistoryItem = ({ id, data, onCopyPrescription = null }) => {
    moment.locale('vi');
    const [selectedRadio, setSelectedRadio] = useState(null);
    let { user } = useSelector((state) => state.authen);

    const handleRadioChange = (e) => {
        const value = e.target.value;
        setSelectedRadio((prev) => (prev === value ? null : value));
    };

    const handleCopyPrescription = (prescriptionData) => {
        if (prescriptionData) {
            onCopyPrescription(prescriptionData);
        }
    };

    const zoomImage = (image) => {
        window.open(image, "_blank");
    }

    const handleRadioClick = (e) => {
        const value = e.target.value;
        if(value === selectedRadio){
            setSelectedRadio('null ' + id)
        }
    }

    return (
        <>
            <div className="history-item-content row" style={{alignItems: 'start'}}>
                <div className="col-2 mt-4 text-center border-left" style={{ verticalAlign: 'top' }}>
                    <p style={{ fontWeight: '600', color: '#00B5F1' }}>{formatDate(data.dischargeDate)}</p>
                </div>
                <div className="col-10 border-right">
                    <div className="row">
                        <div className="col-5">
                            <div style={{ display: 'flex' }}><span style={{ width: 150, fontWeight: 400 }}>Ngày nhập viện:</span><span style={{ fontWeight: 500 }}>{formatDate(data.admissionDate)}</span></div>
                            <div style={{ display: 'flex' }}><span style={{ width: 150, fontWeight: 400 }}>Lý do vào viện:</span><span style={{ fontWeight: 500 }}>{data.reason}</span></div>
                            <div style={{ display: 'flex' }}><span style={{ width: 150, fontWeight: 400 }}>Triệu chứng:</span><span style={{ fontWeight: 500 }}>{data.symptom}</span></div>
                            <div style={{ display: 'flex' }}><span style={{ width: 150, fontWeight: 400 }}>Loại KCB:</span><span style={{ fontWeight: 500 }}>{data.medicalTreatmentTier === 1 ? 'Nội trú' : 'Ngoại trú'}</span></div>
                            <div style={{ display: 'flex' }}><span style={{ width: 150, fontWeight: 400 }}>Bác sĩ điều trị:</span><span style={{ fontWeight: 500 }}>{
                                data?.examinationStaffData 
                                    ? data?.examinationStaffData?.staffUserData?.lastName + ' ' + data?.examinationStaffData?.staffUserData?.firstName
                                    : ''
                                }</span>
                            </div>
                        </div>
                        <div className="col-7">
                            <div style={{ display: 'flex' }}><span style={{ width: 180, fontWeight: 400 }}>Ngày xuất viện:</span><span style={{ fontWeight: 500 }}>{formatDate(data.dischargeDate)}</span></div>
                            <div style={{ display: 'flex' }}><span style={{ width: 180, fontWeight: 400 }}>Tên bệnh:</span><span style={{ fontWeight: 500 }}>{data.diseaseName}</span></div>
                            <div style={{ display: 'flex' }}>
                                <span style={{ width: 180, fontWeight: 400 }}>Bệnh đi kèm:</span>
                                {data?.comorbiditiesDetails && data?.comorbiditiesDetails.length > 0 ? (
                                    <div style={{ flex: 1 }}>
                                        {data.comorbiditiesDetails.map((item, index) => (
                                        <div key={index} style={{ fontWeight: 500, marginBottom: '4px' }}>
                                            {item.code + ' - ' + item.name}
                                        </div>
                                        ))}
                                    </div>
                                ) : (
                                    <span style={{ fontWeight: 500 }}>Không có</span>
                                )}
                            </div>
                            <div style={{ display: 'flex' }}><span style={{ width: 180, fontWeight: 400 }}>Kết quả điều trị:</span><span style={{ fontWeight: 500 }}>{data.treatmentResult}</span></div>
                            <div style={{ display: 'flex' }}><span style={{ width: 180, fontWeight: 400 }}>Tình trạng xuất viện:</span><span style={{ fontWeight: 500 }}>
                                {DISCHARGE_OPTIONS.find(option => option.value === data.dischargeStatus)?.label || ''}</span>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="radio-inputs row">
                            {data.examinationVitalSignData.length > 0 && (
                                <div className="col-6 col-lg-2 d-flex justify-content-center">
                                    <label className="radio">
                                        <input
                                            type="radio"
                                            name={`radio + ${id}`}
                                            value={`vitalsign + ${id}`}
                                            onChange={handleRadioChange}
                                            onClick={handleRadioClick}
                                            checked={selectedRadio === `vitalsign + ${id}`}
                                        />
                                        <span className="name">Sinh hiệu</span>
                                    </label>
                                </div>
                            )}
                            {data.examinationResultParaclincalData.length > 0 && (
                                <div className="col-6 col-lg-2 d-flex justify-content-center">
                                    <label className="radio">
                                        <input
                                            type="radio"
                                            name={`radio + ${id}`}
                                            value={`paraclinical + ${id}`}
                                            onChange={handleRadioChange}
                                            onClick={handleRadioClick}
                                            checked={selectedRadio === `paraclinical + ${id}`}
                                        />
                                        <span className="name">Cận lâm sàng</span>
                                    </label>
                                </div>
                            )}
                            {data.prescriptionExamData.length > 0 && (
                                <div className="col-6 col-lg-2 d-flex justify-content-center">
                                    <label className="radio">
                                        <input
                                            type="radio"
                                            name={`radio + ${id}`}
                                            value={`prescription + ${id}`}
                                            onChange={handleRadioChange}
                                            onClick={handleRadioClick}
                                            checked={selectedRadio === `prescription + ${id}`}
                                        />
                                        <span className="name">Đơn thuốc</span>
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className="radio-content" style={{paddingBottom: '0px'}}>
                            {selectedRadio === `vitalsign + ${id}` && (
                                <div className="mt-2">
                                    {data.examinationVitalSignData && data.examinationVitalSignData.length > 0 ? data.examinationVitalSignData.map((vital, index) => (
                                        <div className="mt-2" key={index}>
                                            {data.examinationVitalSignData.length > 1 && (
                                                <div className="ms-3" style={{color: '#00B3ED'}}>
                                                    <i className="fa-regular fa-clock me-2 align-middle text-center"></i> {moment(vital.updatedAt).format('HH:mm')} - Ngày {formatDate(vital.updatedAt)}
                                                </div>
                                            )}
                                            <div className="inpatient-vitals-detail__body flex flex-wrap mt-2 ms-3 mb-3">
                                                <div className="inpatient-vitals-detail__body__item" style={{width: '9%'}}>
                                                    <p className="gray-p">Chiều cao</p>
                                                    <p className="mt-1" style={{fontWeight: '500'}}>{vital.height} cm</p>
                                                </div>
                                                <div className="inpatient-vitals-detail__body__item" style={{width: '9%'}}>
                                                    <p className="gray-p">Cân nặng</p>
                                                    <p className="mt-1" style={{fontWeight: '500'}}>{vital.weight} kg</p>
                                                </div>
                                                <div className="inpatient-vitals-detail__body__item" style={{width: '9%'}}>
                                                    <p className="gray-p">Nhiệt độ</p>
                                                    <p className="mt-1" style={{fontWeight: '500'}}>{vital.temperature} °C</p>
                                                </div>
                                                <div className="inpatient-vitals-detail__body__item" style={{width: '12%'}}>
                                                    <p className="gray-p">Nhịp thở</p>
                                                    <p className="mt-1" style={{fontWeight: '500'}}>{vital.breathingRate} Lần/phút</p>
                                                </div>
                                                <div className="inpatient-vitals-detail__body__item" style={{width: '16%'}}> 
                                                    <p className="gray-p">Chỉ số đường huyết</p>
                                                    <p className="mt-1" style={{fontWeight: '500'}}>{vital.glycemicIndex} mg/dl</p>
                                                </div>
                                                <div className="inpatient-vitals-detail__body__item" style={{width: '13%'}}>
                                                    <p className="gray-p">Cân nặng con</p>
                                                    <p className="mt-1" style={{fontWeight: '500'}}>{vital.fetalWeight} gram</p>
                                                </div>
                                                <div className="inpatient-vitals-detail__body__item" style={{width: '16%'}}>
                                                    <p className="gray-p">Huyết áp</p>
                                                    <p className="mt-1" style={{fontWeight: '500'}}>{vital.hightBloodPressure}/{vital.lowBloodPressure} mmHg</p>
                                                </div>
                                                <div className="inpatient-vitals-detail__body__item" style={{width: '12%'}}>
                                                    <p className="gray-p">Mạch</p>
                                                    <p className="mt-1" style={{fontWeight: '500'}}>{vital.pulse} Lần/phút</p>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="mt-3" style={{ textAlign: 'start' }}>Không có thông tin sinh hiệu</div>
                                    )}

                                </div>
                            )}
                            {selectedRadio === `paraclinical + ${id}` && (
                                <>
                                    {data.examinationResultParaclincalData && data.examinationResultParaclincalData.length > 0 ? (
                                        <div className="mt-2">
                                            {data.examinationResultParaclincalData.length > 0 && data.examinationResultParaclincalData.map((parac, index) => (
                                                <div className="inpatient-vitals-detail__body flex mt-3" key={index}>
                                                    <div className="col-9">
                                                        <div className='flex mt-2' style={{justifyContent: 'space-between'}}>
                                                            <p style={{fontSize: '16px', color: '#00B3ED' , fontWeight: '500'}}>{parac.paracName}</p> 
                                                            
                                                        </div>  
                                                        <div className='flex mt-2'>
                                                            <div className='col-2 gray-p'>Kết quả:</div>
                                                            <div className='col-8' style={{fontWeight: '500'}}>{parac.result || 'Chưa có kết quả'}</div>
                                                        </div>  
                                                        <div className='flex mt-2'>
                                                            <div className='col-2 gray-p'>Mô tả:</div>
                                                            <div className='col-8' style={{fontWeight: '500'}}>{parac.description || ''}</div>
                                                        </div>  
                                                        <div className='flex mt-2'>
                                                            <div className='col-2 gray-p'>Phòng thực hiện:</div>
                                                            <div className='col-8' style={{fontWeight: '500'}}>{parac.roomParaclinicalData?.name || ''}</div>
                                                        </div>
                                                        <div className='flex mt-2'>
                                                            <div className='col-2 gray-p'>Bác sĩ thực hiện:</div>
                                                            <div className='col-8' style={{fontWeight: '500'}}>{
                                                                parac?.doctorParaclinicalData 
                                                                    ? parac?.doctorParaclinicalData?.staffUserData?.lastName + ' ' + parac?.doctorParaclinicalData?.staffUserData?.firstName
                                                                    : ""
                                                            }</div>
                                                        </div>
                                                        <div className='flex mt-2'>
                                                            <div className='col-2 gray-p'>Ngày thực hiện:</div>
                                                            <div className='col-8' style={{fontWeight: '500'}}>{formatDate(parac.updatedAt)}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-3" style={{ textAlign: 'center' }}>
                                                        {parac.image && (
                                                            <img
                                                                src={parac.image}
                                                                alt="Paraclinical"
                                                                className="img-fluid"
                                                                style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
                                                                onClick={() => zoomImage(parac.image)}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="mt-4" style={{ textAlign: 'start' }}>Không có thông tin cận lâm sàng</div>
                                    )}
                                </>
                            )}
                            {selectedRadio === `prescription + ${id}` && (
                                <div className="mt-2">
                                    {data.prescriptionExamData && data.prescriptionExamData.length > 0 && data.prescriptionExamData.map((presData, prescIndex) => (
                                        presData?.prescriptionDetails && presData?.prescriptionDetails.length > 0 ? (
                                            <div className="mt-4" key={prescIndex}>
                                                {data.medicalTreatmentTier === 1 && (
                                                    <div>
                                                        Từ Ngày {formatDate(presData?.createdAt)} - Ngày {formatDate(presData?.endDate)}
                                                    </div>
                                                )}
                                                <table className="mt-2" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                    <thead>
                                                        <tr>
                                                            <th>Tên thuốc</th>
                                                            <th>Số lượng</th>
                                                            <th>Đơn giá</th>    
                                                            <th>Liều dùng</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {presData?.prescriptionDetails.map((item, index) => (
                                                            <tr key={index}>
                                                                <td>{item.name}</td>
                                                                <td>{item.PrescriptionDetail.quantity}</td>
                                                                <td>{formatCurrency(item.price)}</td>
                                                                <td>{item.PrescriptionDetail.dosage}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                
                                                {onCopyPrescription && (user.role === 3 || user.role === 4) && (
                                                    <div className="mt-2 text-end">
                                                        <button 
                                                            className="copy-prescription-btn" 
                                                            onClick={() => handleCopyPrescription(presData)}
                                                        >
                                                            <i className="fa-regular fa-copy"></i> Copy đơn thuốc
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div key={prescIndex} className="mt-3" style={{ textAlign: 'start' }}>Không có thông tin đơn thuốc</div>
                                        )
                                    ))}
                                </div>
                            )}
                            {selectedRadio === `null + ${id}` && (
                                <div></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


HistoryItem.propTypes = {
    id: PropTypes.number.isRequired,
    data: PropTypes.object.isRequired,
    onCopyPrescription: PropTypes.func
};

export default HistoryItem;