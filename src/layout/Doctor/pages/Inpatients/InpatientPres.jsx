import React, { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/locale/vi';
import PrescriptionChangeModal from './InpatientModals/PrescriptionChangeModal';
import { message, Popconfirm } from 'antd';
import { deletePrescription } from '@/services/doctorService';

const InpatientPres = ({prescriptionData, examinationId, refresh, isEditMode}) => {
    const [showModal, setShowModal] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [localPresData, setLocalPresData] = useState([]);

    useEffect(() => {
        setLocalPresData(Array.isArray(prescriptionData) ? [...prescriptionData] : []);
    }, [prescriptionData]);
    
    const prescriptionExamData = localPresData;
    moment.locale('vi');
    
    // Hàm để hiển thị thứ trong tuần bằng tiếng Việt
    const getDayOfWeekVi = (date) => {
        const day = moment(date).day();
        const daysInVietnamese = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
        return daysInVietnamese[day];
    };

    // Hàm nhóm theo ngày
    const groupByDate = () => {
        const grouped = {};
        if (!prescriptionExamData || !prescriptionExamData.length) return grouped;

        prescriptionExamData.forEach(prescription => {
            let date = moment(prescription.createdAt).format('YYYY-MM-DD');
            if (!grouped[date]) grouped[date] = [];
            grouped[date].push(prescription);
        });

        Object.keys(grouped).forEach(date => {
            grouped[date].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        });

        return grouped;
    };

    // Hàm để tổ chức thuốc theo buổi (sáng, trưa, chiều, tối)
    const organizeMedicineBySession = (prescription) => {
        const sessions = {
            "1": [], // Sáng
            "2": [], // Trưa
            "3": [], // Chiều
            "4": []  // Tối
        };

        if (prescription.prescriptionDetails) {
            prescription.prescriptionDetails.forEach(medicine => {
                const sessionArr = medicine.PrescriptionDetail.session.split(',');
                
                sessionArr.forEach(session => {
                    if (sessions[session]) {
                        sessions[session].push({
                            id: medicine.id,
                            name: medicine.name,
                            dose: medicine.PrescriptionDetail.dose,
                            unit: medicine.PrescriptionDetail.unit,
                            quantity: medicine.PrescriptionDetail.quantity
                        });
                    }
                });
            });
        }

        return sessions;
    };

    // Hàm xử lý khi nhấn nút thay đổi đơn thuốc
    const handleChangePrescription = () => {
        setShowModal(true);
    };

    // Hàm xử lý khi lưu đơn thuốc mới
    const handleSaveNewPrescription = () => {
        refresh();
        setShowModal(false);
    };

    const groupedData = groupByDate();
    const sortedDates = Object.keys(groupedData).sort((a, b) => {
        return moment(b, 'YYYY-MM-DD').valueOf() - moment(a, 'YYYY-MM-DD').valueOf();
    });

    const handleDeletePrescription = async (id) => {
        setDeletingId(id);
        try {
            const response = await deletePrescription(id);
            if (response && response.EC === 0) {
                message.success('Xóa đơn thuốc thành công!');
                setLocalPresData(prevData => prevData.filter(item => item.id !== id));
            } else {
                message.error(response.EM || 'Xóa đơn thuốc thất bại!');
            }
        } catch (error) {
            console.error("Error deleting prescription:", error);
            message.error('Đã xảy ra lỗi khi xóa đơn thuốc!');
        } finally {
            setDeletingId(null);
        }
    }
    
    return (
        <div className="inpatient-vitals-content">
            {isEditMode && (
                <div className='d-flex justify-content-end align-items-center mb-3'>
                    <button 
                        className='restore-button' 
                        onClick={handleChangePrescription}
                        type="primary"
                    >
                        Thay đổi đơn thuốc
                    </button> 
                </div> 
            )} 
            {sortedDates.length === 0 ? (
                <div className="text-center p-4">Không có dữ liệu đơn thuốc</div>
            ) : (
                sortedDates.map(date => {
                    return groupedData[date].map(prescription => {
                        const medicineBySession = organizeMedicineBySession(prescription);
                        
                        return (
                            <div className="flex mb-4" key={prescription.id}>
                                <div className="inpatient-pres-date" style={{width: '15%'}}>
                                    <p style={{fontSize: '18px', fontWeight: '500'}}>
                                        {prescription.status === 2 ? moment(date).format('D [Tháng] M') : "Đơn mang về"}
                                    </p>
                                    <p className="gray-p">{
                                        prescription.status === 2 ? getDayOfWeekVi(date) : moment(date).format('Từ D [Tháng] M')
                                    }</p>
                                    {prescription.status !== 2 && isEditMode && <>
                                        <Popconfirm
                                            title="Xác nhận xóa"
                                            description="Bạn có chắc chắn muốn xóa xét nghiệm này?"
                                            onConfirm={() => handleDeletePrescription(prescription.id)}
                                            okText="Xóa"
                                            cancelText="Hủy"
                                        >
                                            <button 
                                                className="action-btn action-delete"
                                                disabled={deletingId === prescription.id}
                                            >
                                                {deletingId === prescription.id ? (
                                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                                ) : (
                                                    <i className="fa-solid fa-trash"></i>
                                                )}
                                            </button>
                                        </Popconfirm>
                                    </>}
                                </div>
                                <div className="d-flex flex" style={{width: '85%'}}>
                                    {/* Buổi sáng */}
                                    {medicineBySession["1"].length > 0 &&
                                        <div className="inpatient-pres-detail medicine-sess m-0 me-2">
                                            <p className="text-center" style={{fontWeight: '500'}}>Sáng</p>
                                            <div className="medicine-session morning"></div>
                                            <div>
                                                {medicineBySession["1"].map(med => (
                                                    <div key={med.id}>
                                                        <p className='mt-1' style={{fontWeight: '500'}}>{med.name}</p>
                                                        <p className="gray-p" style={{fontWeight: '500'}}>{med.dose}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    }
                                    
                                    {/* Buổi trưa */}
                                    {medicineBySession["2"].length > 0  && 
                                        <div className="inpatient-pres-detail medicine-sess m-0 me-2">
                                            <p className="text-center" style={{fontWeight: '500'}}>Trưa</p>
                                            <div className="medicine-session lunch"></div>
                                            <div>
                                                {medicineBySession["2"].map(med => (
                                                    <div key={med.id}>
                                                        <p className='mt-1' style={{fontWeight: '500'}}>{med.name}</p>
                                                        <p className="gray-p" style={{fontWeight: '500'}}>{med.dose}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    }
                                    
                                    {/* Buổi chiều */}
                                    {medicineBySession["3"].length > 0 &&
                                        <div className="inpatient-pres-detail medicine-sess m-0 me-2">
                                            <p className="text-center" style={{fontWeight: '500'}}>Chiều</p>
                                            <div className="medicine-session afternoon"></div>
                                            <div>
                                                {medicineBySession["3"].map(med => (
                                                    <div key={med.id}>
                                                        <p className='mt-1' style={{fontWeight: '500'}}>{med.name}</p>
                                                        <p className="gray-p" style={{fontWeight: '500'}}>{med.dose}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    }
                                    {/* Buổi tối */}
                                    {medicineBySession["4"].length > 0 &&
                                        <div className="inpatient-pres-detail medicine-sess m-0">
                                            <p className="text-center" style={{fontWeight: '500'}}>Tối</p>
                                            <div className="medicine-session night"></div>
                                            <div>
                                                {medicineBySession["4"].map(med => (
                                                    <div key={med.id}>
                                                        <p className='mt-1' style={{fontWeight: '500'}}>{med.name}</p>
                                                        <p className="gray-p" style={{fontWeight: '500'}}>{med.dose}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        );
                    });
                })
            )}

            {/* Modal Thay đổi đơn thuốc sử dụng component riêng */}
            <PrescriptionChangeModal
                visible={showModal}
                onCancel={() => setShowModal(false)}
                onSave={handleSaveNewPrescription}
                prescriptionData={prescriptionExamData}
                examinationId={examinationId}
            />
        </div>
    );
};

export default InpatientPres;