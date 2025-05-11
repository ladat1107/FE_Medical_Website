import './Prescription.scss';
import Presdetail from '../Presdetail';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation } from '@/hooks/useMutation';
import { getAllMedicinesForExam, upsertPrescription } from '@/services/doctorService';
import PropTypes from 'prop-types';
import { message, notification, Spin } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/constant/path';
import EnhancedSelectBox from '@/components/EnhancedSelectBox/EnhancedSelectBox.jsx';

// Update the props to include copiedPrescriptionData and clearCopiedData
const Prescription = ({ 
    examinationId, 
    isEditMode, 
    prescriptionData, 
    refresh,
    copiedPrescriptionData,
    clearCopiedData
}) => {
    
    const [presDetails, setPresDetails] = useState([]);
    const [medicineOptions, setMedicineOptions] = useState([]);
    const [note, setNote] = useState('');
    const [prescriptionPrice, setPrescriptionPrice] = useState(0);
    const [nextId, setNextId] = useState(1);
    const [totalMoney, setTotalMoney] = useState(0);
    const [insuranceCoverage, setInsuranceCoverage] = useState(0);
    const [api, contextHolder] = notification.useNotification();

    const [medicineId, setMedicineId] = useState(0);
    let [loading, setLoading] = useState(false);

    let navigation = useNavigate();

    const handleMedicineChange = (value) => {
        setMedicineId(value);
    };
    
    useEffect(() => {
        if (medicineId) {
            handleAddPresdetail();
        }
    }, [medicineId]);
    

    //#region get medicine
    let {
        data: dataMedicines,
        loading: comorbiditiesLoading,
        error: comorbiditiesError,
        execute: fetchMedicines,
    } = useMutation(() => getAllMedicinesForExam());

    useEffect(() => {
        fetchMedicines();
        //fetchPrescription();
    }, []);

    useEffect(() => {
        if (dataMedicines && dataMedicines.DT) {
            const medicineOptions = dataMedicines.DT.map(item => ({
                value: item.id,
                label: item.name,
                price: item.price,
                unit: item.unit,
                batchNumber: item.batchNumber,
                inventory: item.inventory,
                exp: item.exp,
            }));
            setMedicineOptions(medicineOptions);
        }
    }, [dataMedicines]);
    //#endregion

    useEffect(() => {
      
        if (prescriptionData && prescriptionData.length > 0) {
            const prescription = prescriptionData[0]; // Lấy phần tử đầu tiên
        
            if (prescription.prescriptionDetails) {
                const details = prescription.prescriptionDetails.map((detail, index) => ({
                    id: index,  
                    medicineId: detail.id,
                    name: detail.name,
                    quantity: detail.PrescriptionDetail.quantity,
                    unit: detail.PrescriptionDetail.unit,
                    price: detail.PrescriptionDetail.price,
                    dosage: detail.PrescriptionDetail.dosage,
                    session: detail.PrescriptionDetail.session 
                        ? detail.PrescriptionDetail.session.split(',') 
                        : [],
                    dose: detail.PrescriptionDetail.dose
                }));
        
                setPresDetails(details);
                setNote(prescription.note || ""); // Đảm bảo `note` không bị undefined
                setPrescriptionPrice(prescription.totalMoney || 0);
                setNextId(details.length + 1);
                setTotalMoney((prescription.totalMoney || 0) - insuranceCoverage);
            }
        }
    }, []);

    // Add this useEffect to handle the copied prescription data
    useEffect(() => {
        if (copiedPrescriptionData && isEditMode) {
            try {
                // Check if there are prescription details to copy
                if (copiedPrescriptionData.prescriptionDetails && copiedPrescriptionData.prescriptionDetails.length > 0) {
                    const details = copiedPrescriptionData.prescriptionDetails.map((detail, index) => ({
                        id: nextId + index,
                        medicineId: detail.id,
                        name: detail.name,
                        quantity: detail.PrescriptionDetail.quantity,
                        unit: detail.PrescriptionDetail.unit,
                        price: detail.PrescriptionDetail.price,
                        dosage: detail.PrescriptionDetail.dosage,
                        session: detail.PrescriptionDetail.session 
                            ? detail.PrescriptionDetail.session.split(',') 
                            : [],
                        dose: detail.PrescriptionDetail.dose
                    }));
                    
                    setPresDetails(details);
                    setNote(copiedPrescriptionData.note || "");
                    setPrescriptionPrice(copiedPrescriptionData.totalMoney || 0);
                    setNextId(nextId + details.length);
                }
                // Clear the copied data to avoid duplicate applications
                if (clearCopiedData) clearCopiedData();
            } catch (error) {
                console.error("Error applying copied prescription:", error);
                message.error("Không thể áp dụng đơn thuốc đã sao chép");
            }
        }
    }, [copiedPrescriptionData]);

    const selectedMedicine = useMemo(() => {
        return medicineOptions.find(option => option.value === medicineId);
    }, [medicineId, medicineOptions]);
    
    const handleAddPresdetail = useCallback(() => {
        if (!selectedMedicine) return;
    
        setPresDetails(prevDetails => [
            ...prevDetails,
            {
                id: nextId,
                medicineId: medicineId,
                name: selectedMedicine.label || '',
                quantity: 1,
                unit: selectedMedicine.unit || '',
                price: selectedMedicine.price || 0,
                dosage: '',
                session: [],
                dose: null
            }
        ]);
        setNextId(prevId => prevId + 1);
    }, [nextId, selectedMedicine]);

    const handleDeletePresdetail = useCallback((id) => {
        setPresDetails(prevDetails => prevDetails.filter(detail => detail.id !== id));
    }, []);

    const handlePresdetailChange = useCallback((id, medicineId, quantity, unit, price, dosage, session, dose) => {
        setPresDetails(prevDetails =>
            prevDetails.map(detail =>
                detail.id === id ? { ...detail, medicineId, quantity, unit, price, dosage, session, dose } : detail
            )
        );
    }, []);

    useEffect(() => {
        const totalPrice = presDetails.reduce((sum, detail) => sum + detail.quantity * detail.price, 0);
        setPrescriptionPrice(totalPrice);
    }, [presDetails]);

    const handleSaveButton = async () => {
        for (const detail of presDetails) {
            if (!detail.medicineId || !detail.quantity || !detail.unit || !detail.price || !detail.session || !detail.dose) {
                message.warning('Vui lòng điền đầy đủ thông tin thuốc!', 'error');
                return;
            }
        }

        // Kiểm tra trùng medicineId
        const medicineIds = presDetails.map(detail => detail.medicineId);
        const uniqueMedicineIds = new Set(medicineIds);
        if (uniqueMedicineIds.size !== medicineIds.length) {
            message.warning('Không được phép có hai thuốc trùng nhau!', 'error');
            return;
        }

        const data = {
            examinationId: examinationId,
            note: note,
            totalMoney: prescriptionPrice,
            prescriptionDetails: presDetails.map(detail => ({
                medicineId: detail.medicineId,
                quantity: detail.quantity,
                unit: detail.unit,
                price: detail.price,
                dosage: detail.dosage,
                session: detail.session.join(','),
                dose: detail.dose
            }))
        };

        setLoading(true);
        try {
            const response = await upsertPrescription(data);
           
            if (response && response.EC === 0 && response.DT === true) {
                message.success('Lưu đơn thuốc thành công!');
                refresh();
            } else {
                message.error(response.EM || 'Lưu đơn thuốc thất bại!');
            }
        } catch (error) {
            console.error("Lỗi khi tạo đơn thuốc:", error.response || error.message);
            message.error('Lưu đơn thuốc thất bại.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const sortedPresDetails = useMemo(() => {
        return [...presDetails].sort((a, b) => b.id - a.id);
    }, [presDetails]);

    return (
        <>
            {contextHolder}
            <div className='prescription-container'>
                <div className="relative-loading">
                    {loading && (
                        <div className="loading-steps absolute-steps inset-steps-0 bg-black/20 flex items-center justify-center z-10">
                            <Spin size="large" />
                        </div>
                    )}
                    <div className={`${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                        <div className="pres-container">
                            <div className="row padding">
                                <div className='col-8 col-lg-9 button'>
                                    <div className='col-12 mt-1 col-lg-7'>
                                        {/* <SelectBox2
                                            className="select-box2"
                                            options={medicineOptions}
                                            value={medicineId !== 0 ? medicineId : undefined}
                                            placeholder="Nhập tên thuốc"
                                            disabled={!isEditMode}
                                            onChange={handleMedicineChange}
                                        /> */}
                                        <EnhancedSelectBox
                                            className="select-box2"
                                            options={medicineOptions}
                                            value={medicineId !== 0 ? medicineId : undefined}
                                            placeholder="Nhập tên thuốc"
                                            disabled={!isEditMode}
                                            onChange={handleMedicineChange}
                                        />
                                    </div>
                                    <button className={`save-button ${!isEditMode ? "disable-button" : ""}`}
                                        disabled={!isEditMode}
                                        onClick={handleSaveButton}>Lưu</button>
                                    <button className='print-button' onClick={() => navigation(PATHS.SYSTEM.PRECRIPTION_PDF + "/" + examinationId)}>
                                        <FontAwesomeIcon icon={faPrint} className='me-2' />
                                        Xuất </button>
                                </div>
                            </div>
                            
                                <>
                                    <div className="row padding gap">
                                        {sortedPresDetails.length > 0 ? (
                                            sortedPresDetails.map(detail => (
                                                <Presdetail
                                                    key={detail.id}
                                                    id={detail.id}
                                                    options={medicineOptions}
                                                    presdetailData={detail}
                                                    onDelete={() => handleDeletePresdetail(detail.id)}
                                                    onChange={handlePresdetailChange}
                                                    isEditMode={isEditMode}
                                                />
                                            ))
                                        ) : (
                                            <div className="empty-list-message">
                                                <p>Đơn thuốc trống</p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            
                            <hr className='mt-2' style={{
                                borderStyle: 'dashed',
                                borderWidth: '1px',
                                borderColor: '#007BFF',
                                opacity: '1'
                            }} />
                            <div className="row padding" style={{ alignItems: "self-start" }}>
                                <div className='col-2'>
                                    <p className='title'>Ghi chú:</p>
                                </div>
                                <div className='col-10'>
                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        type="text"
                                        className="input"
                                        readOnly={!isEditMode}
                                        style={{ minHeight: '100px' }}
                                        placeholder="Nhập ghi chú" />
                                </div>
                            </div>
                            <div className="row padding">
                                <div className='col-2'>
                                    <p className='title'>Chi phí thuốc:</p>
                                </div>
                                <div className='col-10'>
                                    <p className='payment'>{prescriptionPrice.toLocaleString()} VND</p>
                                </div>
                            </div>
                            {/* <div className="row padding">
                                <div className='col-2'>
                                    <p className='title'>Dịch vụ kỹ thuật:</p>
                                </div>
                                <div className='col-10'>
                                    <p className='payment'>{paraclinicalPrice.toLocaleString()} VND</p>
                                </div>
                            </div> */}
                            {/* <div className="row padding">
                                <div className='col-2'>
                                    <p className='title'>BHYT thanh toán:</p>
                                </div>
                                <div className='col-10'>
                                    <p className='payment'>{insuranceCoverage.toLocaleString()} VND</p>
                                </div>
                            </div>
                            <hr />
                            <div className="row padding">
                                <div className='col-2'>
                                    <p className='title'>Người bệnh trả:</p>
                                </div>
                                <div className='col-10'>
                                    <p className='payment'>{totalMoney.toLocaleString()} VND</p>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
Prescription.propTypes = {
    examinationId: PropTypes.number.isRequired,
    prescriptionData: PropTypes.array.isRequired,
    refresh: PropTypes.func.isRequired,
    isEditMode: PropTypes.bool,
    copiedPrescriptionData: PropTypes.object,
    clearCopiedData: PropTypes.func
};

export default Prescription;